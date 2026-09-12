const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getStats,
} = require('../controllers/advertiseController');

router.post('/inquiry', submitInquiry);
router.get('/stats', getStats);

module.exports = router;
