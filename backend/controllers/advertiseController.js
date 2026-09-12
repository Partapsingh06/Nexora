const AdInquiry = require('../models/AdInquiry');

// @desc    Submit advertising inquiry
// @route   POST /api/advertise/inquiry
// @access  Public
const submitInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      businessName,
      phone,
      adGoal,
      budget,
      websiteUrl,
      message,
    } = req.body;

    if (!name || !email || !businessName || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, business name, phone number, and requirements message are required.',
      });
    }

    const inquiryId = `NX-ADV-${Date.now().toString().slice(-5)}${Math.floor(100 + Math.random() * 900)}`;

    const inquiry = await AdInquiry.create({
      inquiryId,
      name,
      email,
      businessName,
      phone,
      adGoal: adGoal || 'Sponsored Search Ads',
      budget: budget || '₹50,000 - ₹2,00,000 / month',
      websiteUrl: websiteUrl || '',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Advertising inquiry submitted successfully! A dedicated Nexora Growth Manager will connect with you within 24 hours.',
      data: inquiry,
    });
  } catch (error) {
    console.error('[Advertise Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit advertising inquiry',
    });
  }
};

// @desc    Get advertising stats and benchmarks
// @route   GET /api/advertise/stats
// @access  Public
const getStats = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      activeShoppers: '10.5M+',
      monthlyImpressions: '250M+',
      averageROAS: '3.8x',
      pinCodesCovered: '19,000+',
      conversionRateLift: '+42%',
      brandPartners: '1,500+',
    },
  });
};

module.exports = {
  submitInquiry,
  getStats,
};
