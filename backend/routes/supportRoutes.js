const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const {
  createTicket,
  getMyTickets,
  getFaqs,
} = require('../controllers/supportController');

// Optional auth helper: attaches req.user if Bearer token is provided
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'nexora_fallback_secret_key_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

router.post('/ticket', optionalProtect, createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/faqs', getFaqs);

module.exports = router;
