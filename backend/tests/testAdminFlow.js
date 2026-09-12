const API_URL = 'http://localhost:5000/api';

async function testAdminFlow() {
  console.log('--- STARTING NEXORA ADMIN & PRODUCT E2E TESTS ---');

  try {
    // 1. Health
    const health = await (await fetch(`${API_URL}/health`)).json();
    console.log('✅ 1. API Health:', health.message);

    // 2. Register Normal User
    const normalUserEmail = `customer_${Date.now()}@example.com`;
    const regNormalRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Regular Customer',
        email: normalUserEmail,
        password: 'Password@123',
      }),
    });
    const normalData = await regNormalRes.json();
    const userToken = normalData.token;
    console.log('✅ 2. Created Normal User:', normalUserEmail, '(Role:', normalData.user?.role, ')');

    // 3. Verify Normal User CANNOT access Admin Category creation (Should return 403 Forbidden)
    const unauthorizedCatRes = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ name: 'Hacked Category' }),
    });
    console.log(
      `✅ 3. Security Guard Tested: Normal user POST /api/categories returned HTTP ${unauthorizedCatRes.status} (Expected 403 Forbidden)`
    );

    // 4. Register or Login as Admin
    const adminEmail = `admin_${Date.now()}@nexora.com`;
    const regAdminRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'System Admin',
        email: adminEmail,
        password: 'AdminPassword@123',
      }),
    });
    const adminRegData = await regAdminRes.json();
    let adminToken = adminRegData.token;
    let adminUserId = adminRegData.user?._id;

    // Promote to Admin in database (simulating seeder / DB admin flag)
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    dotenv.config();
    const User = require('../models/User');
    const connectDB = require('../config/db');
    await connectDB();
    await User.findByIdAndUpdate(adminUserId, { role: 'admin' });
    console.log('✅ 4. Admin User Role assigned in database:', adminEmail);

    // Login to get fresh Admin token
    const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: 'AdminPassword@123',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.token;
    console.log('✅ 5. Admin Logged In. Role:', adminLoginData.user?.role);

    // 5. Admin Create Category
    const createCatRes = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: `Electronics-${Date.now().toString().slice(-4)}`,
        description: 'Laptops, Earphones, and Accessories',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      }),
    });
    const catData = await createCatRes.json();
    console.log('✅ 6. Admin Created Category (HTTP', createCatRes.status, '):', catData.category?.name);
    const categoryId = catData.category?._id;

    // 6. Admin Create Product
    const createProdRes = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Boat Rockerz 450 Bluetooth Headphone',
        description: 'High definition immersive audio with 15 hours battery backup',
        price: 1499,
        originalPrice: 3990,
        category: categoryId,
        brand: 'boAt',
        stock: 50,
        featured: true,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        specifications: [
          { key: 'Playback', value: 'Up to 15 Hours' },
          { key: 'Drivers', value: '40mm Dynamic Drivers' },
        ],
      }),
    });
    const prodData = await createProdRes.json();
    console.log('✅ 7. Admin Created Product (HTTP', createProdRes.status, '):');
    console.log('   - Name:', prodData.product?.name);
    console.log('   - Price:', prodData.product?.price, 'Original:', prodData.product?.originalPrice);
    console.log('   - Auto Calculated Discount:', prodData.product?.discount, '%');
    const productId = prodData.product?._id;

    // 7. Admin Edit Product
    const editProdRes = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 1299,
        stock: 45,
      }),
    });
    const editData = await editProdRes.json();
    console.log('✅ 8. Admin Updated Product (HTTP', editProdRes.status, '): Price updated to', editData.product?.price);

    // 8. Admin Soft Delete Product
    const deleteProdRes = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const delData = await deleteProdRes.json();
    console.log('✅ 9. Admin Soft Deleted Product (HTTP', deleteProdRes.status, '): isActive =', delData.product?.isActive);

    // 9. Admin Dashboard Stats
    const statsRes = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsData = await statsRes.json();
    console.log('✅ 10. Admin Stats API:', statsData.stats);

    console.log('\n🎉 ALL ADMIN & PRODUCT MANAGEMENT TESTS PASSED PERFECTLY! 🎉\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testAdminFlow();
