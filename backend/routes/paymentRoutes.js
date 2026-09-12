const express = require('express');
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
