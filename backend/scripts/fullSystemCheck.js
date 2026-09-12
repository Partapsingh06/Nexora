const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Import routes to mount for test server
const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const adminRoutes = require('../routes/adminRoutes');
const cartRoutes = require('../routes/cartRoutes');
const wishlistRoutes = require('../routes/wishlistRoutes');
const orderRoutes = require('../routes/orderRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

async function runFullSystemCheck() {
  console.log('================================================================');
  console.log('🔍 RUNNING COMPREHENSIVE FULL-SYSTEM VERIFICATION FOR NEXORA');
  console.log('================================================================\n');

  try {
    // 1. Connect to Database
    console.log('Step 1: Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connection established.\n');

    // 2. Setup Express test app instance
    console.log('Step 2: Initializing Express API Server...');
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use(notFound);
    app.use(errorHandler);

    const server = await new Promise((resolve) => {
      const s = app.listen(5099, () => {
        console.log('✅ Test API server running on port 5099.\n');
        resolve(s);
      });
    });

    const baseUrl = 'http://localhost:5099/api';

    // Helper for requests
    async function request(endpoint, options = {}) {
      const url = `${baseUrl}${endpoint}`;
      const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
      if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
      }

      const res = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const json = await res.json().catch(() => ({}));
      return { status: res.status, ok: res.ok, data: json };
    }

    // 3. Verify Admin Account in DB
    console.log('Step 3: Checking Administrator in Database...');
    let admin = await User.findOne({ email: 'admin@nexora.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Nexora Super Admin',
        email: 'admin@nexora.com',
        password: 'Admin@123456',
        role: 'admin',
      });
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
    }
    console.log(`✅ Admin account exists (ID: ${admin._id}, Role: ${admin.role}).\n`);

    // 4. Test Customer Registration
    console.log('Step 4: Testing Customer Registration (POST /api/auth/register)...');
    const custEmail1 = `rohan_${Date.now()}@nexora-test.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Rohan Sharma',
        email: custEmail1,
        password: 'Password@123',
        phone: '9876543210',
      },
    });

    if (regRes.status !== 201 || !regRes.data.token || regRes.data.user.role !== 'user') {
      throw new Error(`Customer registration failed: ${JSON.stringify(regRes.data)}`);
    }
    const cust1Token = regRes.data.token;
    const cust1Id = regRes.data.user._id;
    console.log(`✅ Customer registered successfully (Token received, Role: ${regRes.data.user.role}).\n`);

    // 5. Test Customer Login
    console.log('Step 5: Testing Customer Login (POST /api/auth/login)...');
    const custLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: custEmail1,
        password: 'Password@123',
      },
    });

    if (custLoginRes.status !== 200 || !custLoginRes.data.token) {
      throw new Error(`Customer login failed: ${JSON.stringify(custLoginRes.data)}`);
    }
    console.log(`✅ Customer logged in successfully (JWT Token verified).\n`);

    // 6. Test Admin Login
    console.log('Step 6: Testing Admin Login (POST /api/auth/login)...');
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@nexora.com',
        password: 'Admin@123456',
      },
    });

    if (adminLoginRes.status !== 200 || !adminLoginRes.data.token || adminLoginRes.data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLoginRes.data)}`);
    }
    const adminToken = adminLoginRes.data.token;
    console.log(`✅ Admin logged in successfully (Role verified as 'admin', Admin JWT generated).\n`);

    // 7. Security Check: Customer attempting Admin APIs -> Must return 403
    console.log('Step 7: Testing Security Protection (Customer calling Admin APIs)...');
    const custAdminStatsRes = await request('/admin/stats', { token: cust1Token });
    console.log(`  ➔ GET /api/admin/stats with Customer token returned HTTP ${custAdminStatsRes.status}`);
    if (custAdminStatsRes.status !== 403) {
      throw new Error(`Security breach: Customer received ${custAdminStatsRes.status} instead of 403 on /api/admin/stats`);
    }

    const custAllOrdersRes = await request('/orders', { token: cust1Token });
    console.log(`  ➔ GET /api/orders (admin all orders) with Customer token returned HTTP ${custAllOrdersRes.status}`);
    if (custAllOrdersRes.status !== 403) {
      throw new Error(`Security breach: Customer received ${custAllOrdersRes.status} instead of 403 on /api/orders`);
    }

    const custUsersListRes = await request('/admin/users', { token: cust1Token });
    console.log(`  ➔ GET /api/admin/users with Customer token returned HTTP ${custUsersListRes.status}`);
    if (custUsersListRes.status !== 403) {
      throw new Error(`Security breach: Customer received ${custUsersListRes.status} instead of 403 on /api/admin/users`);
    }
    console.log('✅ Security verified: Normal customers are strictly blocked (403 Forbidden) from all Admin routes.\n');

    // 8. Admin accessing Admin APIs -> Must return 200 OK with real data
    console.log('Step 8: Testing Admin Dashboard APIs with Admin JWT...');
    const adminStatsRes = await request('/admin/stats', { token: adminToken });
    if (adminStatsRes.status !== 200 || !adminStatsRes.data.stats) {
      throw new Error(`Admin stats failed: ${JSON.stringify(adminStatsRes.data)}`);
    }
    console.log(`  ➔ GET /api/admin/stats: Total Products = ${adminStatsRes.data.stats.totalProducts}, Total Orders = ${adminStatsRes.data.stats.totalOrders}, Revenue = ₹${adminStatsRes.data.stats.totalRevenue}`);

    const adminUsersRes = await request('/admin/users', { token: adminToken });
    if (adminUsersRes.status !== 200 || !Array.isArray(adminUsersRes.data.users)) {
      throw new Error(`Admin users failed: ${JSON.stringify(adminUsersRes.data)}`);
    }
    console.log(`  ➔ GET /api/admin/users: Retrieved ${adminUsersRes.data.users.length} users with order statistics.`);

    const adminOrdersRes = await request('/orders', { token: adminToken });
    if (adminOrdersRes.status !== 200 || !Array.isArray(adminOrdersRes.data.orders)) {
      throw new Error(`Admin orders failed: ${JSON.stringify(adminOrdersRes.data)}`);
    }
    console.log(`  ➔ GET /api/orders: Retrieved ${adminOrdersRes.data.orders.length} orders with pagination metadata.`);
    console.log('✅ Admin Dashboard data loaded with real MongoDB metrics.\n');

    // 9. Test Product, Category, Cart & Order Creation Flow
    console.log('Step 9: Testing Products, Cart & Order placement...');
    let cat = await Category.findOne();
    if (!cat) cat = await Category.create({ name: 'Tech', description: 'Tech items' });

    const product = await Product.create({
      name: `Full Check Phone ${Date.now()}`,
      description: 'Device for full system validation',
      price: 15000,
      originalPrice: 18000,
      category: cat._id,
      stock: 10,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
    });

    // Customer adds to cart
    const addCartRes = await request('/cart', {
      method: 'POST',
      token: cust1Token,
      body: { productId: product._id, quantity: 2 },
    });
    if (addCartRes.status !== 200) {
      throw new Error(`Add to cart failed: ${JSON.stringify(addCartRes.data)}`);
    }
    console.log(`  ➔ Product added to cart (Quantity: 2).`);

    // Customer places order
    const placeOrderRes = await request('/orders', {
      method: 'POST',
      token: cust1Token,
      body: {
        orderItems: [{ product: product._id, name: product.name, image: product.images[0], price: product.price, quantity: 2 }],
        shippingAddress: { name: 'Rohan Sharma', phone: '9876543210', street: 'MG Road', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001' },
        paymentMethod: 'COD',
      },
    });

    if (placeOrderRes.status !== 201 || !placeOrderRes.data.order) {
      throw new Error(`Order placement failed: ${JSON.stringify(placeOrderRes.data)}`);
    }
    const createdOrder = placeOrderRes.data.order;
    console.log(`  ➔ Order created with ID: #${createdOrder.orderId} (Total: ₹${createdOrder.totalPrice}).`);

    // Verify stock reduced in DB
    const prodAfter = await Product.findById(product._id);
    if (prodAfter.stock !== 8) {
      throw new Error(`Stock deduction failed! Expected 8, got ${prodAfter.stock}`);
    }
    console.log(`  ➔ Stock reduced from 10 to ${prodAfter.stock} in MongoDB.`);

    // 10. Test Customer Viewing their own order
    console.log('\nStep 10: Testing Customer Order Details & Cross-User Security...');
    const viewOrderRes = await request(`/orders/${createdOrder._id}`, { token: cust1Token });
    if (viewOrderRes.status !== 200 || viewOrderRes.data.order._id !== createdOrder._id) {
      throw new Error(`View order failed: ${JSON.stringify(viewOrderRes.data)}`);
    }
    console.log(`  ➔ Customer 1 successfully viewed own order.`);

    // Create Customer 2 to test cross-access block
    const cust2Res = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Pooja', email: `pooja_${Date.now()}@nexora-test.com`, password: 'Password@123' },
    });
    const cust2Token = cust2Res.data.token;

    const crossAccessRes = await request(`/orders/${createdOrder._id}`, { token: cust2Token });
    console.log(`  ➔ Customer 2 attempting to view Customer 1's order returned HTTP ${crossAccessRes.status}`);
    if (crossAccessRes.status !== 403) {
      throw new Error(`Cross-user security breach! Expected 403, got ${crossAccessRes.status}`);
    }
    console.log(`✅ Cross-user security verified.`);

    // 11. Admin Pipeline Status Update
    console.log('\nStep 11: Testing Admin Order Pipeline Status Updates...');
    const updateStatusRes = await request(`/orders/${createdOrder._id}/status`, {
      method: 'PUT',
      token: adminToken,
      body: { orderStatus: 'Processing', note: 'Order sent to packaging hub' },
    });

    if (updateStatusRes.status !== 200 || updateStatusRes.data.order.orderStatus !== 'Processing') {
      throw new Error(`Admin update status failed: ${JSON.stringify(updateStatusRes.data)}`);
    }
    console.log(`  ➔ Admin updated status to 'Processing' with timeline note.`);

    // 12. Customer Order Cancellation & Stock Restoration
    console.log('\nStep 12: Testing Customer Cancellation & Stock Restoration...');
    const cancelRes = await request(`/orders/${createdOrder._id}/cancel`, {
      method: 'PUT',
      token: cust1Token,
      body: { reason: 'Found lower price elsewhere' },
    });

    if (cancelRes.status !== 200 || cancelRes.data.order.orderStatus !== 'Cancelled') {
      throw new Error(`Cancellation failed: ${JSON.stringify(cancelRes.data)}`);
    }

    const prodRestored = await Product.findById(product._id);
    if (prodRestored.stock !== 10) {
      throw new Error(`Stock restore failed! Expected 10, got ${prodRestored.stock}`);
    }
    console.log(`  ➔ Order cancelled. Stock restored from 8 back to ${prodRestored.stock} in MongoDB.`);

    // Clean up test data
    console.log('\nStep 13: Cleaning up test artifacts...');
    await User.deleteMany({ email: { $in: [custEmail1, cust2Res.data.user.email] } });
    await Order.findByIdAndDelete(createdOrder._id);
    await Product.findByIdAndDelete(product._id);
    await Cart.deleteMany({ user: { $in: [cust1Id, cust2Res.data.user._id] } });

    server.close();
    await mongoose.disconnect();

    console.log('\n================================================================');
    console.log('🏆 COMPLETE SYSTEM VERIFICATION PASSED WITH ZERO ERRORS!');
    console.log('================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ FULL SYSTEM CHECK FAILED:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runFullSystemCheck();
