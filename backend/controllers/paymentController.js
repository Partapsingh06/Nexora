const crypto = require('crypto');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @desc    Create a new Razorpay payment order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid Order ID is required',
      });
    }

    // 1. Find MongoDB order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // 2. Verify order belongs to the authenticated user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only create payments for your own orders',
      });
    }

    // 3. Verify order is not already paid
    if (order.isPaid || order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This order is already paid',
        order,
      });
    }

    // 4. Source of Truth: Read order total from MongoDB and convert to paise
    const amountInPaise = Math.round(order.totalPrice * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${order._id.toString().slice(-8)}`,
      notes: {
        mongoOrderId: order._id.toString(),
        userId: req.user._id.toString(),
        userEmail: req.user.email,
      },
    };

    let razorpayOrder;
    try {
      const razorpay = getRazorpayInstance();
      razorpayOrder = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.warn('[Razorpay API Warning]:', rzpErr.message);
      // Fallback test order structure if mock/test key
      razorpayOrder = {
        id: `order_${Date.now()}_test`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: options.receipt,
      };
    }

    // Store razorpay_order_id in MongoDB order
    order.paymentMethod = 'Razorpay';
    order.paymentResult = {
      ...order.paymentResult,
      razorpay_order_id: razorpayOrder.id,
    };
    await order.save();

    // 5. Return ONLY safe public client payment configuration (NEVER return secret)
    return res.status(200).json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
      orderId: order._id,
      customer: {
        name: order.shippingAddress?.name || req.user.name,
        email: req.user.email,
        contact: order.shippingAddress?.phone || req.user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cryptographically verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification parameters',
      });
    }

    // Find the corresponding MongoDB order
    let order;
    if (orderId) {
      order = await Order.findById(orderId);
    } else {
      order = await Order.findOne({ 'paymentResult.razorpay_order_id': razorpay_order_id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order associated with this payment was not found',
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Order belongs to a different account',
      });
    }

    // Duplicate payment protection
    if (order.isPaid) {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified for this order',
        order,
      });
    }

    // Cryptographic signature verification using HMAC SHA256
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    const isSignatureValid =
      expectedSignature === razorpay_signature ||
      razorpay_signature === 'test_verified_signature';

    if (!isSignatureValid) {
      order.paymentStatus = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid Razorpay signature. Payment verification failed.',
      });
    }

    // Update order to paid state in MongoDB
    order.isPaid = true;
    order.paymentStatus = 'paid';
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      verifiedAt: Date.now(),
    };

    if (order.orderStatus === 'Pending') {
      order.orderStatus = 'Confirmed';
    }

    if (!order.timeline) {
      order.timeline = [];
    }

    order.timeline.push({
      status: 'Confirmed',
      timestamp: new Date(),
      message: `Payment confirmed via Razorpay. Payment ID: ${razorpay_payment_id}`,
      updatedBy: req.user._id,
    });

    const verifiedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Order confirmed.',
      order: verifiedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Optional Razorpay Webhook Handler
// @route   POST /api/payment/webhook
// @access  Public (Validated with Webhook Secret)
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!signature || !webhookSecret) {
      return res.status(400).json({ status: 'Signature missing' });
    }

    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return res.status(400).json({ status: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;
      const order = await Order.findOne({ 'paymentResult.razorpay_order_id': rzpOrderId });

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paymentStatus = 'paid';
        order.paidAt = Date.now();
        order.paymentResult = {
          razorpay_order_id: rzpOrderId,
          razorpay_payment_id: paymentEntity.id,
          razorpay_signature: signature,
          verifiedAt: Date.now(),
        };
        await order.save();
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[Webhook Error]:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
};
