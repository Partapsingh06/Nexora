const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Optional auth: attaches req.user if a valid Bearer token is present, does NOT block unauthenticated
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

// Public & Admin routes
router.route('/')
  .get(optionalAuth, getCategories)
  .post(protect, adminOnly, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
