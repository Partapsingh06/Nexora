const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  processReturn,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/myorders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id/return')
  .post(protect, requestReturn);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

router.route('/:id/return-status')
  .put(protect, adminOnly, processReturn);

module.exports = router;
