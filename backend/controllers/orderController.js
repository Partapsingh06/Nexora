const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery shipping address with contact information',
      });
    }

    // 1. Server-side verification of products, stock, and live database prices
    let calculatedItemsPrice = 0;
    let calculatedOriginalTotal = 0;
    const verifiedOrderItems = [];
    const productsToUpdate = [];

    for (const item of orderItems) {
      const rawId = item.product?._id || item.product || item._id;
      const productId = typeof rawId === 'object' && rawId !== null ? rawId.toString() : rawId;

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product identifier for "${item.name || 'item'}"`,
        });
      }

      const product = await Product.findById(productId);

      if (!product || product.isActive === false) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name || 'Selected item'}" is unavailable or discontinued`,
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} items remaining.`,
        });
      }

      // Enforce live database price (Price Security)
      const price = Number(product.price);
      const originalPrice = Number(product.originalPrice || price);

      calculatedItemsPrice += price * qty;
      calculatedOriginalTotal += originalPrice * qty;

      productsToUpdate.push({ product, qty });

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || 'https://via.placeholder.com/150',
        price: price,
        quantity: qty,
      });
    }

    // Atomic / sequential deduction of stock
    for (const { product, qty } of productsToUpdate) {
      product.stock = Math.max(0, product.stock - qty);
      await product.save();
    }

    const calculatedDiscount = Math.max(0, calculatedOriginalTotal - calculatedItemsPrice);
    const calculatedDelivery = calculatedItemsPrice > 0 && calculatedItemsPrice < 500 ? 40 : 0;
    const finalTotalPrice = calculatedItemsPrice + calculatedDelivery;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const customOrderId = `ORD-${dateStr}-${randomSuffix}`;

    const initialStatus = paymentMethod === 'COD' ? 'Pending' : 'Pending';

    // 2. Create Order in MongoDB
    const order = new Order({
      orderId: customOrderId,
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state?.trim() || 'Karnataka',
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country?.trim() || 'India',
      },
      paymentMethod: paymentMethod === 'Razorpay' ? 'Razorpay' : 'COD',
      itemsPrice: calculatedItemsPrice,
      discountPrice: calculatedDiscount,
      deliveryCharge: calculatedDelivery,
      totalPrice: finalTotalPrice,
      isPaid: false,
      paymentStatus: 'pending',
      orderStatus: initialStatus,
      stockRestored: false,
      timeline: [
        {
          status: initialStatus,
          timestamp: new Date(),
          message: `Order created via ${paymentMethod === 'Razorpay' ? 'Online Payment' : 'Cash on Delivery'}`,
          updatedBy: req.user._id,
        },
      ],
    });

    const createdOrder = await order.save();

    // 3. Clear user's active cart in MongoDB
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = { user: req.user._id };

    if (status && status !== 'all') {
      if (status === 'active') {
        query.orderStatus = { $in: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'] };
      } else if (status === 'delivered') {
        query.orderStatus = 'Delivered';
      } else if (status === 'cancelled') {
        query.orderStatus = { $in: ['Cancelled', 'Return Requested', 'Returned', 'Refunded'] };
      } else {
        query.orderStatus = status;
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: searchRegex },
        { 'orderItems.name': searchRegex },
      ];
    }

    const orders = await Order.find(query)
      .populate('orderItems.product', 'name slug images brand')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID or orderId
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(idParam)
      ? { $or: [{ _id: idParam }, { orderId: idParam }] }
      : { orderId: idParam };

    const order = await Order.findOne(query)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name slug images brand')
      .populate('timeline.updatedBy', 'name role');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify ownership or admin role
    const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
    const isOwner = orderUserId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this order',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer or Admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const idParam = req.params.id;

    const query = mongoose.Types.ObjectId.isValid(idParam) ? { _id: idParam } : { orderId: idParam };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    // Customer can only cancel before shipment
    if (!isAdmin && ['Shipped', 'Out for Delivery', 'Delivered', 'Returned', 'Refunded'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus.toLowerCase()}`,
      });
    }

    // Restore stock exactly once
    if (!order.stockRestored) {
      for (const item of order.orderItems) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
      order.stockRestored = true;
    }

    order.orderStatus = 'Cancelled';
    order.cancellation = {
      reason: reason.trim(),
      cancelledAt: new Date(),
      cancelledBy: isAdmin ? 'admin' : 'customer',
    };

    // If order was already paid, trigger refund status
    if (order.isPaid || order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    order.timeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      message: `Order cancelled by ${isAdmin ? 'Administrator' : 'Customer'}. Reason: "${reason.trim()}"`,
      updatedBy: req.user._id,
    });

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and inventory restored',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request return for delivered order (Customer)
// @route   POST /api/orders/:id/return
// @access  Private
const requestReturn = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const idParam = req.params.id;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid reason for return',
      });
    }

    const query = mongoose.Types.ObjectId.isValid(idParam) ? { _id: idParam } : { orderId: idParam };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request return for this order',
      });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Return can only be requested for delivered orders',
      });
    }

    if (order.returnDetails && ['Requested', 'Approved', 'Picked Up', 'Refunded', 'Completed'].includes(order.returnDetails.status)) {
      return res.status(400).json({
        success: false,
        message: `Return request already ${order.returnDetails.status.toLowerCase()}`,
      });
    }

    order.orderStatus = 'Return Requested';
    order.returnDetails = {
      reason: reason.trim(),
      status: 'Requested',
      requestedAt: new Date(),
      refundAmount: order.totalPrice,
    };

    order.timeline.push({
      status: 'Return Requested',
      timestamp: new Date(),
      message: `Return requested by customer. Reason: "${reason.trim()}"`,
      updatedBy: req.user._id,
    });

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Return request submitted successfully',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with search, filters & pagination (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const {
      search,
      orderStatus,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    if (orderStatus && orderStatus !== 'all') {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: searchRegex },
        { 'shippingAddress.name': searchRegex },
        { 'shippingAddress.phone': searchRegex },
        { 'shippingAddress.city': searchRegex },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name slug images brand')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Summary counts for admin tabs
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    const countsMap = {};
    statusCounts.forEach((s) => {
      countsMap[s._id] = s.count;
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      page: pageNum,
      orders,
      statusCounts: countsMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status in fulfillment pipeline (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note = '' } = req.body;
    const validStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const idParam = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(idParam) ? { _id: idParam } : { orderId: idParam };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
      // If COD payment, mark paid upon physical delivery
      if (order.paymentMethod === 'COD' && !order.isPaid) {
        order.isPaid = true;
        order.paymentStatus = 'paid';
        order.paidAt = new Date();
      }
    }

    // If Admin cancels the order, restore stock once
    if (orderStatus === 'Cancelled') {
      if (!order.stockRestored) {
        for (const item of order.orderItems) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: item.quantity },
            });
          }
        }
        order.stockRestored = true;
      }
      order.cancellation = {
        reason: note.trim() || 'Cancelled by administrator',
        cancelledAt: new Date(),
        cancelledBy: 'admin',
      };
      if (order.isPaid || order.paymentStatus === 'paid') {
        order.paymentStatus = 'refunded';
      }
    }

    const statusMessage = note.trim()
      ? `Status updated from ${oldStatus} to ${orderStatus}. Note: ${note.trim()}`
      : `Status updated to ${orderStatus}`;

    order.timeline.push({
      status: orderStatus,
      timestamp: new Date(),
      message: statusMessage,
      updatedBy: req.user._id,
    });

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderId || order._id} status updated to ${orderStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process return request (Admin only)
// @route   PUT /api/orders/:id/return-status
// @access  Private/Admin
const processReturn = async (req, res, next) => {
  try {
    const { returnStatus, adminNote = '', refundAmount } = req.body;
    const validReturnStatuses = ['Approved', 'Rejected', 'Picked Up', 'Refunded', 'Completed'];

    if (!validReturnStatuses.includes(returnStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid return status. Allowed: ${validReturnStatuses.join(', ')}`,
      });
    }

    const idParam = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(idParam) ? { _id: idParam } : { orderId: idParam };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.returnDetails.status = returnStatus;
    if (adminNote) order.returnDetails.adminNote = adminNote.trim();
    if (refundAmount !== undefined) order.returnDetails.refundAmount = Number(refundAmount);

    let timelineMessage = `Return status changed to ${returnStatus}`;
    if (adminNote) timelineMessage += `. Admin Note: "${adminNote.trim()}"`;

    if (returnStatus === 'Rejected') {
      order.orderStatus = 'Delivered'; // Revert back to delivered
    } else if (returnStatus === 'Approved') {
      order.orderStatus = 'Return Requested';
    } else if (returnStatus === 'Picked Up') {
      order.orderStatus = 'Return Requested';
    } else if (returnStatus === 'Refunded' || returnStatus === 'Completed') {
      order.orderStatus = returnStatus === 'Refunded' ? 'Refunded' : 'Returned';
      order.paymentStatus = 'refunded';
      order.returnDetails.resolvedAt = new Date();

      // Restore stock if returned and not restored yet
      if (!order.stockRestored) {
        for (const item of order.orderItems) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: item.quantity },
            });
          }
        }
        order.stockRestored = true;
      }
    }

    order.timeline.push({
      status: `Return: ${returnStatus}`,
      timestamp: new Date(),
      message: timelineMessage,
      updatedBy: req.user._id,
    });

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Return request marked as ${returnStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  processReturn,
};
