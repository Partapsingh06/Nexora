const express = require('express');
const router = express.Router();
const { protect, sellerOnly } = require('../middleware/authMiddleware');
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  getSellerDashboardStats,
  getSellerProducts,
  createSellerProduct,
  deleteSellerProduct,
} = require('../controllers/sellerController');

// Public seller routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);

// Protected seller routes (must be authenticated AND have seller/admin role)
router.get('/profile', protect, sellerOnly, getSellerProfile);
router.get('/dashboard-stats', protect, sellerOnly, getSellerDashboardStats);
router.get('/products', protect, sellerOnly, getSellerProducts);
router.post('/products', protect, sellerOnly, createSellerProduct);
router.delete('/products/:id', protect, sellerOnly, deleteSellerProduct);

module.exports = router;
