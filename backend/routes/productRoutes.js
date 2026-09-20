const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Optional auth: attaches req.user if a valid Bearer token is present, but does NOT block if absent
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexora_fallback_secret_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Invalid token — continue as unauthenticated
    }
  }
  next();
};

// Public routes (with optional auth for admin features)
router.route('/')
  .get(optionalAuth, getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
