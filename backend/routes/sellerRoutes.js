const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  getSellerDashboardStats,
  getSellerProducts,
  createSellerProduct,
  deleteSellerProduct,
} = require('../controllers/sellerController');

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/profile', protect, getSellerProfile);
router.get('/dashboard-stats', protect, getSellerDashboardStats);
router.get('/products', protect, getSellerProducts);
router.post('/products', protect, createSellerProduct);
router.delete('/products/:id', protect, deleteSellerProduct);

module.exports = router;
