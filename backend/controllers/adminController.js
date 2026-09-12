const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard aggregate statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    // 1. Product & Category counts
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const featuredProducts = await Product.countDocuments({ featured: true });

    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });

    // 2. User & Customer counts
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // 3. Order status counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: { $in: ['Shipped', 'Out for Delivery'] } });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const returnOrders = await Order.countDocuments({
      orderStatus: { $in: ['Return Requested', 'Returned', 'Refunded'] },
    });

    // 4. Revenue aggregations
    // Total Revenue (excluding cancelled and refunded orders)
    const validSalesAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ['Cancelled', 'Refunded'] },
          paymentStatus: { $ne: 'failed' },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = validSalesAgg.length > 0 ? validSalesAgg[0].totalRevenue : 0;

    // Today's Revenue
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          orderStatus: { $nin: ['Cancelled', 'Refunded'] },
          paymentStatus: { $ne: 'failed' },
        },
      },
      { $group: { _id: null, todayRevenue: { $sum: '$totalPrice' } } },
    ]);
    const todayRevenue = todaySalesAgg.length > 0 ? todaySalesAgg[0].todayRevenue : 0;

    // 5. Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(6);

    // 6. Recent Products
    const recentProducts = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Last 7 days sales breakdown for analytics charts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: { $nin: ['Cancelled', 'Refunded'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnOrders,
        totalCustomers,
        totalUsers,
        adminUsers,
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        featuredProducts,
        totalCategories,
        activeCategories,
      },
      recentOrders,
      recentProducts,
      dailySales: dailyRevenueAgg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with customer spending stats (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    let matchQuery = {};

    if (role && role !== 'all') {
      matchQuery.role = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      matchQuery.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const users = await User.find(matchQuery).select('-password').sort({ createdAt: -1 });

    // Aggregate user order stats in bulk for fast performance
    const userOrderStats = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          ordersCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$orderStatus', 'Cancelled'] },
                    { $ne: ['$orderStatus', 'Refunded'] },
                  ],
                },
                '$totalPrice',
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsMap = {};
    userOrderStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        ordersCount: stat.ordersCount,
        totalSpent: stat.totalSpent,
      };
    });

    const enrichedUsers = users.map((u) => {
      const uObj = u.toObject();
      const stats = statsMap[u._id.toString()] || { ordersCount: 0, totalSpent: 0 };
      return {
        ...uObj,
        ordersCount: stats.ordersCount,
        totalSpent: stats.totalSpent,
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be "user" or "admin"',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent changing role of current logged in user to non-admin
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote your own admin account',
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
};
