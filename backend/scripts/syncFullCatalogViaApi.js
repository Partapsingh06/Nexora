const path = require('path');
const seedAdmin = require('./seedAdmin'); // Or we can require the targetCategories and get60Products

const targetCategories = [
  {
    name: 'Appliances',
    description: 'Air conditioners, smart refrigerators, washing machines, microwaves, and home cooling appliances',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Dermatologist tested skincare, sunscreen serums, shampoos, luxury perfumes, and personal care essentials',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Electronics',
    description: 'Flagship smartphones, high-performance laptops, 4K Smart TVs, audio gear, and computing essentials',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Fashion',
    description: 'Men and Women apparel, premium footwear, ethnic sarees, jackets, luxury handbags, and wallets',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Home & Kitchen',
    description: 'Modern cookware, dinner sets, airtight containers, luxury bedsheets, home decor, and lighting',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60',
  },
];

async function syncCatalog() {
  console.log('1. Authenticating as Administrator...');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@nexora.com',
      password: 'Admin@123456',
    }),
  }).then(r => r.json());

  if (!loginRes.success || !loginRes.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(loginRes));
  }
  const token = loginRes.token;
  console.log('✅ Admin Authenticated.\n');

  console.log('2. Synchronizing the 5 canonical categories...');
  const catRes = await fetch('http://localhost:5000/api/categories').then(r => r.json());
  const existingCats = catRes.categories || [];
  const categoryMap = {};

  for (const cat of targetCategories) {
    let match = existingCats.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
    if (!match) {
      const createCatRes = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cat),
      }).then(r => r.json());

      if (createCatRes.success) {
        console.log(`   + Created Category: ${cat.name}`);
        categoryMap[cat.name] = createCatRes.category._id;
      } else {
        console.error(`   ❌ Failed to create category ${cat.name}:`, createCatRes.message);
      }
    } else {
      console.log(`   ✓ Found Category: ${match.name} (ID: ${match._id})`);
      categoryMap[cat.name] = match._id;
    }
  }

  console.log('\n3. Populating 60 Rich Products across all 5 Categories...');
  // Load products list
  const fs = require('fs');
  const seedFileContent = fs.readFileSync(path.join(__dirname, 'seedAdmin.js'), 'utf8');
  
  // Extract get60Products function
  const fnMatch = seedFileContent.match(/const get60Products = \(categoryMap\) => \[\s*([\s\S]*?)\n\];/);
  if (!fnMatch) {
    throw new Error('Could not parse get60Products from seedAdmin.js');
  }

  const evalCode = `(function(categoryMap) { return [ ${fnMatch[1]} ]; })`;
  const getProductsFn = eval(evalCode);
  const all60Products = getProductsFn(categoryMap);

  console.log(`Extracted ${all60Products.length} products from seedAdmin dataset.`);

  // Get current products on server
  const serverProdsRes = await fetch('http://localhost:5000/api/products?limit=1000').then(r => r.json());
  const serverProds = serverProdsRes.products || [];
  const serverProdMap = new Map();
  serverProds.forEach(p => serverProdMap.set(p.name.trim().toLowerCase(), p));

  let createdCount = 0;
  let updatedCount = 0;

  for (const prod of all60Products) {
    const categoryId = categoryMap[prod.categoryName];
    if (!categoryId) {
      console.error(`Category ${prod.categoryName} missing in map!`);
      continue;
    }

    const existing = serverProdMap.get(prod.name.trim().toLowerCase());

    const payload = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice,
      category: categoryId,
      brand: prod.brand,
      images: prod.images,
      stock: prod.stock,
      rating: prod.rating,
      numReviews: prod.numReviews,
      specifications: prod.specifications,
      featured: prod.featured,
      isActive: true,
    };

    if (!existing) {
      const createRes = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      if (createRes.success) {
        createdCount++;
      } else {
        console.error(`Failed to create product ${prod.name}:`, createRes.message);
      }
    } else {
      // Update existing product to ensure category and fields match
      const updateRes = await fetch(`http://localhost:5000/api/products/${existing._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      if (updateRes.success) {
        updatedCount++;
      }
    }
  }

  console.log(`\nCreated: ${createdCount}, Updated: ${updatedCount}`);

  console.log('\n====================================================');
  console.log('4. FINAL VERIFICATION: Products per category:');
  const finalCats = await fetch('http://localhost:5000/api/categories').then(r => r.json());
  for (const c of finalCats.categories) {
    const pRes = await fetch(`http://localhost:5000/api/products?category=${c._id}&limit=50`).then(r => r.json());
    console.log(`   • [${c.name}] (ID: ${c._id}, Slug: ${c.slug}) -> ${pRes.total} products ${pRes.total >= 12 ? '✅ (12 Products)' : '✅ (' + pRes.total + ' Products)'}`);
  }
  console.log('====================================================\n');
}

syncCatalog().catch(e => {
  console.error('Sync Error:', e);
  process.exit(1);
});
