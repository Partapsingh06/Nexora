const SupportTicket = require('../models/SupportTicket');

// @desc    Create a new support ticket
// @route   POST /api/support/ticket
// @access  Public (Optionally authenticated)
const createTicket = async (req, res) => {
  try {
    const { name, email, phone, orderId, category, issueType, priority, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message description are required',
      });
    }

    const ticketId = `NX-TKT-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    const ticket = await SupportTicket.create({
      ticketId,
      user: req.user ? req.user._id : null,
      name,
      email,
      phone: phone || '',
      orderId: orderId || '',
      category: category || 'Other Inquiries',
      issueType: issueType || 'General Assistance',
      priority: priority || 'medium',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your support ticket has been registered successfully! Our 24x7 team will reach out shortly.',
      data: ticket,
    });
  } catch (error) {
    console.error('[Support Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create support ticket',
    });
  }
};

// @desc    Get tickets for logged-in user
// @route   GET /api/support/my-tickets
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch support tickets',
    });
  }
};

// @desc    Get pre-packaged FAQ data
// @route   GET /api/support/faqs
// @access  Public
const getFaqs = async (req, res) => {
  const faqs = [
    {
      category: 'Orders & Delivery',
      questions: [
        {
          q: 'How do I track my active order shipment?',
          a: 'You can track your order in real-time by visiting "My Orders" in your profile. Click on "Track Order" on any item to view live dispatch, transit, and delivery updates with carrier details.',
        },
        {
          q: 'What if my delivery is delayed beyond the estimated date?',
          a: 'Delivery delays rarely occur due to adverse weather or logistical transit checks. If your order has not arrived within 24 hours of the expected delivery date, our 24x7 automated resolution system will prioritize express rerouting or issue an instant courtesy credit.',
        },
        {
          q: 'Can I change the delivery address after placing an order?',
          a: 'Address changes can be requested while the order status is in "Processing" or "Confirmed". Once marked "Dispatched", kindly contact our 24x7 support team immediately so we can coordinate with our courier partner.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is Nexora’s 7-Day Replacement & Return Policy?',
          a: 'Items are eligible for return or replacement within 7 days of delivery if they are damaged, defective, or different from described. Simply go to "My Orders" -> "Return / Replace" to initiate pickup.',
        },
        {
          q: 'How long does it take for a refund to reflect in my bank?',
          a: 'Once the returned item passes quality verification at our hub, refunds to UPI / Cards are processed within 2-4 business days. COD refunds are credited immediately as Nexora Wallet balance or to your provided bank account.',
        },
      ],
    },
    {
      category: 'Payments & Billing',
      questions: [
        {
          q: 'What payment modes are accepted on Nexora?',
          a: 'We accept all major Credit/Debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, and Cash on Delivery (COD).',
        },
        {
          q: 'My money was debited but the order was not placed. What should I do?',
          a: 'If payment was deducted during a temporary gateway timeout, your bank will automatically reverse the transaction within 24 to 48 banking hours. You can also share the payment transaction ID with our support team.',
        },
      ],
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'How can I update my registered mobile number or email?',
          a: 'Navigate to "My Profile" -> "Account Settings". You can update your contact details and verify with a quick OTP confirmation.',
        },
        {
          q: 'Is my payment information and account data secure?',
          a: 'Yes, Nexora uses 256-bit bank-grade SSL encryption and PCI-DSS Level 1 compliant payment processing. We never store raw CVV or banking credentials on our servers.',
        },
      ],
    },
  ];

  res.status(200).json({
    success: true,
    data: faqs,
  });
};

module.exports = {
  createTicket,
  getMyTickets,
  getFaqs,
};
