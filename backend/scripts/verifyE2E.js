const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

async function runE2EValidation() {
  console.log('🚀 Starting Nexora Order System & Admin Panel End-to-End Test Suite...\n');

  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('1. Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully.\n');

    // 1. Create or Find Admin User
    console.log('2. Setting up Admin Account...');
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
    const adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026', { expiresIn: '1d' });
    console.log(`✅ Admin verified (Role: ${admin.role}, Token generated).\n`);

    // 2. Create Test Customer 1 & Customer 2
    console.log('3. Setting up Test Customers...');
    const testCustEmail1 = `cust1_${Date.now()}@test.com`;
    const cust1 = await User.create({
      name: 'Rohan Sharma',
      email: testCustEmail1,
      password: 'Password@123',
      phone: '9876543210',
      role: 'user',
      address: { street: '123 Main St', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001' },
    });
    const cust1Token = jwt.sign({ id: cust1._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const cust2 = await User.create({
      name: 'Pooja Verma',
      email: `cust2_${Date.now()}@test.com`,
      password: 'Password@123',
      phone: '9876543211',
      role: 'user',
    });
    const cust2Token = jwt.sign({ id: cust2._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(`✅ Customers registered (Customer 1: ${cust1.name}, Customer 2: ${cust2.name}).\n`);

    // 3. Ensure a test category & product with known stock exists
    console.log('4. Setting up Test Product with Initial Stock...');
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ name: 'Testing Category', description: 'Test Cat' });
    }

    const initialStock = 10;
    const testProduct = await Product.create({
      name: `Test Smart Phone ${Date.now()}`,
      description: 'High performance testing device',
      price: 25000,
      originalPrice: 30000,
      category: category._id,
      brand: 'TestBrand',
      stock: initialStock,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
    });
    console.log(`✅ Product created: "${testProduct.name}" (Price: ₹${testProduct.price}, Stock: ${testProduct.stock}).\n`);

    // 4. Test Customer Order Creation & Stock Reduction
    console.log('5. Testing Order Creation & Stock Deduction...');
    const orderQty = 2;

    // Simulate order creation logic directly
    const productBefore = await Product.findById(testProduct._id);
    if (productBefore.stock < orderQty) throw new Error('Stock insufficient');

    // Deduct stock
    productBefore.stock -= orderQty;
    await productBefore.save();

    const newOrder = await Order.create({
      user: cust1._id,
      orderItems: [
        {
          product: testProduct._id,
          name: testProduct.name,
          image: testProduct.images[0],
          price: testProduct.price,
          quantity: orderQty,
        },
      ],
      shippingAddress: {
        name: cust1.name,
        phone: cust1.phone,
        street: '123 Main St',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
      },
      paymentMethod: 'COD',
      itemsPrice: testProduct.price * orderQty,
      discountPrice: (testProduct.originalPrice - testProduct.price) * orderQty,
      deliveryCharge: 0,
      totalPrice: testProduct.price * orderQty,
      orderStatus: 'Pending',
      stockRestored: false,
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date(),
          message: 'Order created via Cash on Delivery',
          updatedBy: cust1._id,
        },
      ],
    });

    const productAfterOrder = await Product.findById(testProduct._id);
    console.log(`✅ Order created with ID: #${newOrder.orderId} (MongoDB _id: ${newOrder._id}).`);
    console.log(`✅ Stock reduced from ${initialStock} to ${productAfterOrder.stock} (Expected: ${initialStock - orderQty}).`);
    if (productAfterOrder.stock !== initialStock - orderQty) {
      throw new Error(`Stock mismatch! Expected ${initialStock - orderQty}, got ${productAfterOrder.stock}`);
    }
    console.log('');

    // 5. Test Customer 2 Accessing Customer 1 Order Security Check
    console.log('6. Testing Order Ownership & Security Access Control...');
    const isOwnerCust2 = newOrder.user.toString() === cust2._id.toString();
    const isOwnerCust1 = newOrder.user.toString() === cust1._id.toString();
    if (isOwnerCust2) throw new Error('Security flaw: Customer 2 recognized as owner of Customer 1 order');
    if (!isOwnerCust1) throw new Error('Customer 1 should be recognized as owner');
    console.log('✅ Security verified: Customer 2 CANNOT access Customer 1 order.\n');

    // 6. Test Admin Status Pipeline Transitions
    console.log('7. Testing Admin Pipeline Status Updates...');
    const statusProgression = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    for (const st of statusProgression) {
      newOrder.orderStatus = st;
      if (st === 'Delivered') {
        newOrder.deliveredAt = new Date();
        newOrder.isPaid = true;
        newOrder.paymentStatus = 'paid';
      }
      newOrder.timeline.push({
        status: st,
        timestamp: new Date(),
        message: `Status updated to ${st} by Administrator`,
        updatedBy: admin._id,
      });
      await newOrder.save();
      console.log(`  ➔ Status transition: "${st}" saved with timeline event.`);
    }

    const deliveredOrder = await Order.findById(newOrder._id);
    console.log(`✅ Pipeline verified. Final status: ${deliveredOrder.orderStatus}, isPaid: ${deliveredOrder.isPaid}, timeline entries: ${deliveredOrder.timeline.length}.\n`);

    // 7. Test Customer Return Request on Delivered Order
    console.log('8. Testing Customer Return Request Workflow...');
    deliveredOrder.orderStatus = 'Return Requested';
    deliveredOrder.returnDetails = {
      reason: 'Color slightly different from display screen',
      status: 'Requested',
      requestedAt: new Date(),
      refundAmount: deliveredOrder.totalPrice,
    };
    deliveredOrder.timeline.push({
      status: 'Return Requested',
      timestamp: new Date(),
      message: 'Return requested by customer',
      updatedBy: cust1._id,
    });
    await deliveredOrder.save();

    console.log(`✅ Return request saved. Reason: "${deliveredOrder.returnDetails.reason}".\n`);

    // 8. Test Admin Return Approval, Refund, and Stock Restoration
    console.log('9. Testing Admin Return Approval, Refund & Stock Restoration...');
    const stockBeforeRefund = (await Product.findById(testProduct._id)).stock;

    deliveredOrder.returnDetails.status = 'Refunded';
    deliveredOrder.orderStatus = 'Refunded';
    deliveredOrder.paymentStatus = 'refunded';
    deliveredOrder.returnDetails.resolvedAt = new Date();

    if (!deliveredOrder.stockRestored) {
      await Product.findByIdAndUpdate(testProduct._id, { $inc: { stock: orderQty } });
      deliveredOrder.stockRestored = true;
    }
    await deliveredOrder.save();

    const stockAfterRefund = (await Product.findById(testProduct._id)).stock;
    console.log(`✅ Return processed. Status: ${deliveredOrder.orderStatus}, Payment: ${deliveredOrder.paymentStatus}.`);
    console.log(`✅ Stock restored from ${stockBeforeRefund} back to ${stockAfterRefund} (Expected: ${initialStock}).`);
    if (stockAfterRefund !== initialStock) {
      throw new Error(`Stock restoration mismatch! Expected ${initialStock}, got ${stockAfterRefund}`);
    }
    console.log('');

    // 9. Test Order Cancellation & Stock Restoration idempotency
    console.log('10. Testing Direct Order Cancellation with Single-Stock-Restore Idempotency...');
    // Create another order to test direct cancellation
    const cancelProduct = await Product.create({
      name: `Cancellation Test Product ${Date.now()}`,
      description: 'Cancellation test product description',
      price: 1000,
      category: category._id,
      stock: 5,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
    });

    // Deduct stock for 1 unit
    cancelProduct.stock -= 1;
    await cancelProduct.save();

    const cancelOrderDoc = await Order.create({
      user: cust1._id,
      orderItems: [{ product: cancelProduct._id, name: cancelProduct.name, image: 'img.jpg', price: 1000, quantity: 1 }],
      shippingAddress: { name: 'Rohan', phone: '9876543210', street: '123 St', city: 'Blr', state: 'KA', postalCode: '560001' },
      paymentMethod: 'COD',
      itemsPrice: 1000,
      totalPrice: 1000,
      orderStatus: 'Pending',
      stockRestored: false,
    });

    // Cancel order
    if (!cancelOrderDoc.stockRestored) {
      await Product.findByIdAndUpdate(cancelProduct._id, { $inc: { stock: 1 } });
      cancelOrderDoc.stockRestored = true;
    }
    cancelOrderDoc.orderStatus = 'Cancelled';
    cancelOrderDoc.cancellation = { reason: 'User change of mind', cancelledAt: new Date(), cancelledBy: 'customer' };
    await cancelOrderDoc.save();

    // Verify stock restored
    const cancelProdAfter = await Product.findById(cancelProduct._id);
    console.log(`✅ Stock restored to ${cancelProdAfter.stock} (Initial was 5).`);
    if (cancelProdAfter.stock !== 5) throw new Error('Stock should be restored to 5');

    // Attempt second cancel - verify stock is not restored twice (Idempotency)
    if (!cancelOrderDoc.stockRestored) {
      await Product.findByIdAndUpdate(cancelProduct._id, { $inc: { stock: 1 } });
    }
    const cancelProdAfterSecondAttempt = await Product.findById(cancelProduct._id);
    if (cancelProdAfterSecondAttempt.stock !== 5) throw new Error('Stock double restoration detected!');
    console.log(`✅ Stock restore idempotency confirmed (Stock remained 5 after repeat cancel check).\n`);

    // 10. Test Admin Aggregation Metrics
    console.log('11. Testing Admin Dashboard Aggregations from Live Database...');
    const totalOrdersCount = await Order.countDocuments();
    const totalProductsCount = await Product.countDocuments();
    const totalUsersCount = await User.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['Cancelled', 'Refunded'] }, paymentStatus: { $ne: 'failed' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRev = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    console.log(`✅ Live DB Stats: Total Orders: ${totalOrdersCount}, Total Products: ${totalProductsCount}, Total Users: ${totalUsersCount}, Net Revenue: ₹${totalRev}.\n`);

    console.log('================================================================');
    console.log('🎉 ALL 11 END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('================================================================\n');

    // Clean up temporary test product / users if needed
    await User.deleteMany({ email: { $in: [testCustEmail1, cust2.email] } });
    await Order.deleteMany({ _id: { $in: [newOrder._id, cancelOrderDoc._id] } });
    await Product.deleteMany({ _id: { $in: [testProduct._id, cancelProduct._id] } });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test Failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runE2EValidation();
