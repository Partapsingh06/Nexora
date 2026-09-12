const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/db');

async function verifyAll() {
  await connectDB();
  console.log('--- DETAILED NEXORA CATALOG VERIFICATION ---');

  const expectedCategories = [
    'Appliances',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
  ];

  const categories = await Category.find({}).sort({ name: 1 });
  console.log(`Found Categories in DB: ${categories.length} (Expected: 5)`);

  let grandTotal = 0;
  let allPass = true;

  for (const expCat of expectedCategories) {
    const cat = categories.find((c) => c.name === expCat);
    if (!cat) {
      console.error(`❌ Missing category: ${expCat}`);
      allPass = false;
      continue;
    }
    const prods = await Product.find({ category: cat._id });
    console.log('\n========================================');
    console.log(`Category: ${cat.name} | ID: ${cat._id} | Slug: ${cat.slug}`);
    console.log(`Product Count: ${prods.length} ${prods.length === 12 ? '✅ (EXACTLY 12)' : '❌ (NOT 12)'}`);
    console.log('========================================');

    if (prods.length !== 12) allPass = false;

    prods.forEach((p, idx) => {
      console.log(`  ${(idx + 1).toString().padStart(2, ' ')}. [${p.brand}] ${p.name} - ₹${p.price} (Stock: ${p.stock}, Rating: ${p.rating})`);
      if (!p.images || p.images.length === 0 || !p.images[0].startsWith('http')) {
        console.error('     ❌ Invalid image URL:', p.images);
        allPass = false;
      }
      if (!p.category || p.category.toString() !== cat._id.toString()) {
        console.error('     ❌ Category ref mismatch:', p.category);
        allPass = false;
      }
    });

    grandTotal += prods.length;
  }

  const allProds = await Product.find({});
  console.log('\n========================================');
  console.log(`Total Products in Entire Database: ${allProds.length}`);
  console.log(`Total Expected: 60`);
  console.log('========================================');

  if (allProds.length === 60 && grandTotal === 60 && allPass) {
    console.log('\n🎉 ALL 5 CATEGORIES (12 PRODUCTS EACH = 60 TOTAL) VERIFIED WITH 100% ACCURACY! 🎉\n');
    process.exit(0);
  } else {
    console.error('\n❌ Verification check failed!\n');
    process.exit(1);
  }
}

verifyAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
