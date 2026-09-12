const mongoose = require('mongoose');

const adInquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide your business email'],
      trim: true,
      lowercase: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please provide your company or brand name'],
      trim: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your contact phone number'],
      trim: true,
    },
    adGoal: {
      type: String,
      enum: [
        'Sponsored Search Ads',
        'Homepage Banner Showcase',
        'Brand Spotlight Campaign',
        'Category Top Placement',
        'Video & Interactive Ads',
        'Custom Enterprise Package',
      ],
      default: 'Sponsored Search Ads',
    },
    budget: {
      type: String,
      enum: [
        '₹10,000 - ₹50,000 / month',
        '₹50,000 - ₹2,00,000 / month',
        '₹2,00,000 - ₹10,00,000 / month',
        '₹10,00,000+ / month',
      ],
      default: '₹50,000 - ₹2,00,000 / month',
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Please provide details about your advertising requirements'],
      trim: true,
      maxlength: 2500,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'under_review', 'converted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdInquiry', adInquirySchema);
