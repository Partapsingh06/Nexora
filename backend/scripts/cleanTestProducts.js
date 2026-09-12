const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Product');
const Category = require('../models/Category');

async function cleanAndVerify() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Cleaning stray test items...');
  const res = await Product.deleteMany({
    $or: [{ name: { $regex: 'Test', $options: 'i' } }, { brand: { $regex: 'Test', $options: 'i' } }],
  });
  console.log(`Deleted ${res.deletedCount} stray test products.`);
  await mongoose.disconnect();
}

cleanAndVerify();
