const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const paymentResultSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    verifiedAt: { type: Date },
  },
  { _id: false }
);

const timelineEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    message: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const cancellationSchema = new mongoose.Schema(
  {
    reason: { type: String, default: '' },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ['customer', 'admin', 'system'], default: 'customer' },
  },
  { _id: false }
);

const returnDetailsSchema = new mongoose.Schema(
  {
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['None', 'Requested', 'Approved', 'Rejected', 'Picked Up', 'Refunded', 'Completed'],
      default: 'None',
    },
    requestedAt: { type: Date },
    resolvedAt: { type: Date },
    adminNote: { type: String, default: '' },
    refundAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'Razorpay'],
      default: 'COD',
    },
    paymentResult: {
      type: paymentResultSchema,
      default: () => ({}),
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      default: 0.0,
    },
    deliveryCharge: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Return Requested',
        'Returned',
        'Refunded',
      ],
      default: 'Pending',
    },
    deliveredAt: {
      type: Date,
    },
    stockRestored: {
      type: Boolean,
      default: false,
    },
    timeline: [timelineEventSchema],
    cancellation: {
      type: cancellationSchema,
      default: () => ({}),
    },
    returnDetails: {
      type: returnDetailsSchema,
      default: () => ({ status: 'None' }),
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate a readable orderId if not provided
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `ORD-${dateStr}-${randomSuffix}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
