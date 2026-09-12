const AppNotificationLead = require('../models/AppNotificationLead');

// @desc    Register contact for app launch notification
// @route   POST /api/app-launch/notify
// @access  Public
const subscribeAppNotification = async (req, res) => {
  try {
    const { contact, platform } = req.body;

    if (!contact || contact.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address or 10-digit mobile number.',
      });
    }

    const trimmedContact = contact.trim().toLowerCase();

    // Check if already subscribed
    let lead = await AppNotificationLead.findOne({ contact: trimmedContact });
    if (lead) {
      lead.platform = platform || lead.platform;
      await lead.save();
      return res.status(200).json({
        success: true,
        message: 'You are already on the VIP launch priority list! We will notify you the moment the app goes live.',
        data: lead,
      });
    }

    lead = await AppNotificationLead.create({
      contact: trimmedContact,
      platform: platform || 'both',
    });

    res.status(201).json({
      success: true,
      message: '🎉 Congratulations! You are now subscribed to the Nexora VIP App Launch list with an exclusive 20% launch coupon code reserved for you.',
      data: lead,
    });
  } catch (error) {
    console.error('[App Notification Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register notification lead',
    });
  }
};

module.exports = {
  subscribeAppNotification,
};
