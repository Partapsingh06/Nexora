const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here require valid JWT + admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
