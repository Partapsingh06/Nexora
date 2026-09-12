const express = require('express');
const router = express.Router();
const {
  subscribeAppNotification,
} = require('../controllers/appNotificationController');

router.post('/notify', subscribeAppNotification);

module.exports = router;
