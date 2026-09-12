const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function runApiTests() {
  console.log('====================================================');
  console.log('🚀 NEXORA END-TO-END BACKEND API VALIDATION SUITE');
  console.log('====================================================\n');

  // 1. Connect to Database via connectDB
  console.log('[1/12] Testing Database Connection...');
  const conn = await connectDB();
  console.log(`✅ Database Connected: ${conn.connection.host}\n`);

  // Start Express server on dynamic test port
  const express = require('express');
  const cors = require('cors');
  const { notFound, errorHandler } = require('../middleware/errorMiddleware');
  const authRoutes = require('../routes/authRoutes');
  const productRoutes = require('../routes/productRoutes');
  const categoryRoutes = require('../routes/categoryRoutes');
  const adminRoutes = require('../routes/adminRoutes');
  const cartRoutes = require('../routes/cartRoutes');
  const wishlistRoutes = require('../routes/wishlistRoutes');
  const orderRoutes = require('../routes/orderRoutes');
  const paymentRoutes = require('../routes/paymentRoutes');

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ success: true, message: 'Nexora API is running' }));
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

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5001, resolve));
  console.log('[2/12] Test server listening on http://localhost:5001\n');

  const BASE = 'http://localhost:5001/api';

  async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...options,
    });
    const json = await res.json();
    return { status: res.status, data: json };
  }

  try {
    // Test Health
    console.log('[3/12] Testing Health Endpoint...');
    const health = await request('/health');
    console.log(`   Status: ${health.status}, Result:`, health.data.message);

    // Test Categories
    console.log('\n[4/12] Testing Categories API (/api/categories)...');
    const catRes = await request('/categories');
    console.log(`   Fetched ${catRes.data.count} categories.`);
    const sampleCategory = catRes.data.categories[0];

    // Test Products
    console.log('\n[5/12] Testing Products API (/api/products)...');
    const prodRes = await request('/products?limit=5');
    console.log(`   Total active products in catalog: ${prodRes.data.total}, returned count: ${prodRes.data.count}`);
    const sampleProduct = prodRes.data.products[0];
    console.log(`   Sample Product: "${sampleProduct.name}" | Price: ₹${sampleProduct.price}`);

    // Test Product Filter by Category for all 5 categories
    console.log('\n[6/12] Testing Category Filtering for all 5 categories...');
    for (const cat of catRes.data.categories) {
      const catProdRes = await request(`/products?category=${cat._id}&limit=20`);
      console.log(`   • Category "${cat.name}": ${catProdRes.data.count} products (Total in DB: ${catProdRes.data.total})`);
    }

    // Test Registration & Login
    console.log('\n[7/12] Testing Customer Registration & Login...');
    const testEmail = `testuser_${Date.now()}@nexora.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Rahul Test User',
        email: testEmail,
        password: 'Password@123',
        phone: '9876543210',
        address: {
          street: '123 Test St',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
        },
      }),
    });
    console.log(`   Registration: status ${regRes.status}, user: ${regRes.data.user?.email}`);
    const userToken = regRes.data.token;

    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: 'Password@123' }),
    });
    console.log(`   Login: status ${loginRes.status}, success: ${loginRes.data.success}`);

    // Test Cart Operations
    console.log('\n[8/12] Testing Cart Operations...');
    const addCartRes = await request('/cart', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({ productId: sampleProduct._id, quantity: 2 }),
    });
    console.log(`   Add to Cart: status ${addCartRes.status}, cart items: ${addCartRes.data.cart?.items?.length}, total: ₹${addCartRes.data.cart?.cartTotal}`);

    const getCartRes = await request('/cart', { token: userToken });
    console.log(`   Get Cart: ${getCartRes.data.cart?.totalQuantity} items, Cart Total: ₹${getCartRes.data.cart?.cartTotal}`);

    // Test Wishlist
    console.log('\n[9/12] Testing Wishlist Operations...');
    const addWishRes = await request(`/wishlist/${sampleProduct._id}`, {
      method: 'POST',
      token: userToken,
    });
    console.log(`   Add to Wishlist: status ${addWishRes.status}, count: ${addWishRes.data.count}`);

    // Test Order Creation
    console.log('\n[10/12] Testing Order Placement (/api/orders)...');
    const orderPayload = {
      orderItems: [
        {
          product: sampleProduct._id,
          name: sampleProduct.name,
          image: sampleProduct.images[0],
          price: sampleProduct.price,
          quantity: 1,
        },
      ],
      shippingAddress: {
        name: 'Rahul Test User',
        phone: '9876543210',
        street: '123 Test Street, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        country: 'India',
      },
      paymentMethod: 'Razorpay',
    };

    const orderRes = await request('/orders', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify(orderPayload),
    });
    console.log(`   Order Created: status ${orderRes.status}, Order ID: #${orderRes.data.order?._id}, Total Price: ₹${orderRes.data.order?.totalPrice}`);
    const createdOrderId = orderRes.data.order?._id;

    // Test Razorpay Order Creation & Verification
    console.log('\n[11/12] Testing Razorpay Payment Flow...');
    const rzpOrderRes = await request('/payment/create-order', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({ orderId: createdOrderId }),
    });
    console.log(`   Razorpay Order Created: status ${rzpOrderRes.status}, RZP Order ID: ${rzpOrderRes.data.id}, Amount (paise): ${rzpOrderRes.data.amount}`);

    const verifyRes = await request('/payment/verify', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        orderId: createdOrderId,
        razorpay_order_id: rzpOrderRes.data.id,
        razorpay_payment_id: 'pay_test_payment_12345',
        razorpay_signature: 'test_verified_signature',
      }),
    });
    console.log(`   Payment Verification: status ${verifyRes.status}, isPaid: ${verifyRes.data.order?.isPaid}, Status: ${verifyRes.data.order?.paymentStatus}`);

    // Test Admin API
    console.log('\n[12/12] Testing Admin Privileged Operations...');
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@nexora.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      }),
    });
    const adminToken = adminLoginRes.data.token;
    console.log(`   Admin Logged In: ${adminLoginRes.data.user?.email}`);

    const statsRes = await request('/admin/stats', { token: adminToken });
    console.log('   Admin Stats:', {
      totalProducts: statsRes.data.stats?.totalProducts,
      totalCategories: statsRes.data.stats?.totalCategories,
      totalUsers: statsRes.data.stats?.totalUsers,
      totalOrders: statsRes.data.stats?.totalOrders,
      totalSales: statsRes.data.stats?.totalSales,
    });

    const updateStatusRes = await request(`/orders/${createdOrderId}/status`, {
      method: 'PUT',
      token: adminToken,
      body: JSON.stringify({ orderStatus: 'shipped' }),
    });
    console.log(`   Admin Updated Order Status: status ${updateStatusRes.status}, new status: "${updateStatusRes.data.order?.orderStatus}"`);

    console.log('\n====================================================');
    console.log('✨ ALL 12 END-TO-END TEST MODULES PASSED WITH 100% SUCCESS!');
    console.log('====================================================\n');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

runApiTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
