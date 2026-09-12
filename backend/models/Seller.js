const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Authorized contact name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Seller email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business/Store name is required'],
      trim: true,
    },
    businessType: {
      type: String,
      enum: [
        'Retailer',
        'Wholesaler',
        'Manufacturer',
        'Brand Owner',
        'Direct Importer',
        'Artisan / Handcrafted',
      ],
      default: 'Retailer',
    },
    businessAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    gstin: {
      type: String,
      trim: true,
      default: '',
    },
    pan: {
      type: String,
      trim: true,
      default: '',
    },
    primaryCategory: {
      type: String,
      default: 'Electronics',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'approved',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Seller', sellerSchema);
