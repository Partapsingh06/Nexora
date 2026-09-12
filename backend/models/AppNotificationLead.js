const mongoose = require('mongoose');

const appNotificationLeadSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: [true, 'Please provide your email or mobile number'],
      trim: true,
      lowercase: true,
    },
    platform: {
      type: String,
      enum: ['android', 'ios', 'both'],
      default: 'both',
    },
    status: {
      type: String,
      enum: ['subscribed', 'notified'],
      default: 'subscribed',
    },
    source: {
      type: String,
      default: 'download_app_page',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AppNotificationLead', appNotificationLeadSchema);
