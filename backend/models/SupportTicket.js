const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    orderId: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a problem category'],
      enum: [
        'Orders & Delivery',
        'Returns & Refunds',
        'Payments & Billing',
        'Account & Security',
        'Product & Warranty',
        'Other Inquiries',
      ],
      default: 'Other Inquiries',
    },
    issueType: {
      type: String,
      trim: true,
      default: 'General Assistance',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    message: {
      type: String,
      required: [true, 'Please provide a description of your issue'],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
