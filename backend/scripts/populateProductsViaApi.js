const allProductsToAdd = [
  // ==========================================
  // HOME & KITCHEN (Rich Products)
  // ==========================================
  {
    categoryName: 'Home & Kitchen',
    name: 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker (5.5 Litres)',
    brand: 'Prestige',
    description: 'Alpha base for induction and gas compatibility, heavy gauge food grade stainless steel, and durable pressure indicator for safe family cooking.',
    price: 2699,
    originalPrice: 3499,
    stock: 40,
    rating: 4.6,
    numReviews: 1250,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '5.5 Litres' },
      { key: 'Material', value: 'High Grade Stainless Steel' },
      { key: 'Base', value: 'Alpha Induction Base' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Philips HL7756/00 750W Mixer Grinder with 3 Stainless Steel Jars',
    brand: 'Philips',
    description: 'Advanced air ventilation for continuous heavy grinding, leak-proof jars with secure lock, and triangular body design for superior stability.',
    price: 3499,
    originalPrice: 5295,
    stock: 35,
    rating: 4.5,
    numReviews: 2180,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Wattage', value: '750 Watts' },
      { key: 'Speed Control', value: '3 Speeds + Pulse' },
      { key: 'Number of Jars', value: '3 Jars' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Hawkins Futura Hard Anodised Non-Stick Deep Kadhai with Lid (3.75L)',
    brand: 'Hawkins',
    description: 'Extra thick hard anodised 4.06 mm base, high heat retention, scratch-resistant surface, and comfortable stay-cool stainless steel handles.',
    price: 2150,
    originalPrice: 2850,
    stock: 28,
    rating: 4.7,
    numReviews: 940,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1556911073-38141963c9e0?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '3.75 Litres' },
      { key: 'Coating', value: 'German Non-Stick PFOA Free' },
      { key: 'Diameter', value: '26 cm' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Pigeon by Stovekraft 1.5L Stainless Steel Electric Kettle (1500W)',
    brand: 'Pigeon',
    description: 'Cordless rapid 1500W water boiling kettle with auto shut-off, boil-dry safety protection, and cool-touch ergonomic handle.',
    price: 699,
    originalPrice: 1295,
    stock: 60,
    rating: 4.3,
    numReviews: 3450,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '1.5 Litres' },
      { key: 'Power', value: '1500 Watts' },
      { key: 'Safety', value: 'Automatic Turn-off' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Solimo 100% Cotton 144 TC Floral King Size Bedsheet with 2 Pillow Covers',
    brand: 'Solimo',
    description: 'Soft breathable pure cotton king bedsheet woven with 144 thread count, vibrant fast colors, and skin-friendly luxury finish.',
    price: 899,
    originalPrice: 1600,
    stock: 50,
    rating: 4.4,
    numReviews: 1840,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Size', value: 'King (108 x 108 inches)' },
      { key: 'Material', value: '100% Pure Cotton' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Milton Thermosteel Flip Lid Insulated Water Bottle (1000 ml)',
    brand: 'Milton',
    description: 'Vacuum insulated double-walled 304 food-grade stainless steel flask that retains hot or cold drinks for up to 24 hours.',
    price: 849,
    originalPrice: 1150,
    stock: 70,
    rating: 4.8,
    numReviews: 4200,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '1000 ml' },
      { key: 'Insulation', value: '24 Hours Hot / Cold' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Borosil Gourmet 8-Piece Glass Dinner Set with Microwave Bowls',
    brand: 'Borosil',
    description: '100% borosilicate clarity dining plates and bowls resistant to thermal shock up to 350 deg C, dishwasher and microwave safe.',
    price: 1899,
    originalPrice: 2690,
    stock: 30,
    rating: 4.6,
    numReviews: 760,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Pieces in Set', value: '8 Pieces' },
      { key: 'Material', value: '100% Borosilicate Glass' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Cello Checkers 18-Piece Airtight Kitchen Storage Plastic Container Set',
    brand: 'Cello',
    description: '100% BPA-free food safe clear modular canisters with easy-grip checker pattern and silicone airtight freshness sealing lids.',
    price: 1199,
    originalPrice: 2200,
    stock: 45,
    rating: 4.5,
    numReviews: 1120,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Set Contents', value: '18 Containers' },
      { key: 'Features', value: 'Airtight & Stackable' },
    ],
  },

  // ==========================================
  // MOBILES
  // ==========================================
  {
    categoryName: 'Mobiles',
    name: 'Samsung Galaxy S24 Ultra 5G (256GB Titanium Gray)',
    brand: 'Samsung',
    description: 'Galaxy AI, 200MP camera system with 100x Space Zoom, built-in S Pen, Snapdragon 8 Gen 3 chipset, and durable Titanium frame.',
    price: 129999,
    originalPrice: 134999,
    stock: 20,
    rating: 4.8,
    numReviews: 1890,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { key: 'Display', value: '6.8-inch QHD+ Dynamic AMOLED 2X 120Hz' },
    ],
  },
  {
    categoryName: 'Mobiles',
    name: 'OnePlus 12 5G (16GB RAM, 512GB Flowy Emerald)',
    brand: 'OnePlus',
    description: '4th Gen Hasselblad Camera System, 100W SUPERVOOC flash charge, 50W wireless charging, and 2K 120Hz ProXDR display.',
    price: 69999,
    originalPrice: 74999,
    stock: 35,
    rating: 4.7,
    numReviews: 1420,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'RAM / Storage', value: '16GB LPDDR5X / 512GB UFS 4.0' },
      { key: 'Chipset', value: 'Snapdragon 8 Gen 3' },
    ],
  },
  {
    categoryName: 'Mobiles',
    name: 'Google Pixel 8 Pro (128GB Obsidian Black)',
    brand: 'Google',
    description: 'Google Tensor G3 AI chip, Super Actua display, Pro camera controls with 50MP main lens, Best Take, and 7 years of OS updates.',
    price: 89999,
    originalPrice: 106999,
    stock: 18,
    rating: 4.6,
    numReviews: 960,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Processor', value: 'Google Tensor G3' },
      { key: 'Display', value: '6.7-inch LTPO OLED 120Hz' },
    ],
  },
  {
    categoryName: 'Mobiles',
    name: 'Xiaomi Redmi Note 13 Pro+ 5G (8GB RAM, 256GB Fusion Purple)',
    brand: 'Xiaomi',
    description: '200MP OIS camera with 4x lossless zoom, 120W HyperCharge, 1.5K 120Hz Curved AMOLED display, and IP68 water resistance.',
    price: 29999,
    originalPrice: 33999,
    stock: 45,
    rating: 4.4,
    numReviews: 2450,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Camera', value: '200MP OIS' },
      { key: 'Charging', value: '120W HyperCharge' },
    ],
  },

  // ==========================================
  // ELECTRONICS
  // ==========================================
  {
    categoryName: 'Electronics',
    name: 'Apple MacBook Air 13.6-inch M2 Chip (8GB RAM, 256GB Midnight)',
    brand: 'Apple',
    description: 'Strikingly thin design, up to 18 hours battery life, 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, and MagSafe charging.',
    price: 89990,
    originalPrice: 99900,
    stock: 25,
    rating: 4.9,
    numReviews: 3200,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Chip', value: 'Apple M2 8-Core CPU' },
      { key: 'Display', value: '13.6-inch Liquid Retina' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Dell XPS 15 9530 Intel Core i7-13700H (16GB, 1TB SSD, RTX 4050)',
    brand: 'Dell',
    description: 'Creator powerhouse laptop with 15.6-inch 3.5K OLED InfinityEdge touch display, CNC machined aluminum chassis, and studio sound.',
    price: 179990,
    originalPrice: 219900,
    stock: 12,
    rating: 4.7,
    numReviews: 640,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Processor', value: 'Intel Core i7-13700H' },
      { key: 'Graphics', value: 'NVIDIA RTX 4050 6GB' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Apple iPad Air 11-inch M2 Chip (128GB Wi-Fi, Space Gray)',
    brand: 'Apple',
    description: 'Supercharged by the M2 chip, Liquid Retina display, landscape front camera with Center Stage, and Wi-Fi 6E connectivity.',
    price: 59900,
    originalPrice: 64900,
    stock: 30,
    rating: 4.8,
    numReviews: 1150,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Chip', value: 'Apple M2 Chip' },
      { key: 'Display', value: '11-inch Liquid Retina Display' },
    ],
  },

  // ==========================================
  // APPLIANCES
  // ==========================================
  {
    categoryName: 'Appliances',
    name: 'LG 242L 3-Star Smart Inverter Double Door Refrigerator',
    brand: 'LG',
    description: 'Multi Air Flow Cooling with Smart Inverter Compressor, Door Cooling+, and toughened glass shelves for optimal energy efficiency.',
    price: 25990,
    originalPrice: 33990,
    stock: 20,
    rating: 4.6,
    numReviews: 840,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '242 Litres' },
      { key: 'Energy Rating', value: '3 Star BEE' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC with PM 2.5 Filter',
    brand: 'Daikin',
    description: 'Triple Display Inverter AC with Neo Swing compressor, PM 2.5 air filtration, and 100% copper condenser coil.',
    price: 45990,
    originalPrice: 58900,
    stock: 18,
    rating: 4.8,
    numReviews: 1250,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '1.5 Ton' },
      { key: 'Energy Rating', value: '5 Star' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'IFB 24L Convection Microwave Oven with 101 Auto-Cook Menus',
    brand: 'IFB',
    description: 'Multi-stage cooking with convection baking, grilling, auto defrost, steam clean, and stainless steel cavity.',
    price: 13490,
    originalPrice: 17990,
    stock: 25,
    rating: 4.4,
    numReviews: 520,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '24 Litres' },
      { key: 'Cooking Modes', value: 'Convection, Grill, Microwave' },
    ],
  },

  // ==========================================
  // FASHION
  // ==========================================
  {
    categoryName: 'Fashion',
    name: "Levi's Men 511 Slim Fit Mid Rise Blue Stretch Jeans",
    brand: "Levi's",
    description: 'Modern slim-cut with room to move, crafted from premium stretch denim with signature 5-pocket styling.',
    price: 2499,
    originalPrice: 3999,
    stock: 55,
    rating: 4.5,
    numReviews: 1680,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fit', value: '511 Slim Fit' },
      { key: 'Fabric', value: '99% Cotton, 1% Elastane' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Nike Air Max 270 React Running Shoes for Men (Black/White)',
    brand: 'Nike',
    description: 'Features Nike largest heel Air unit yet for a super-soft ride, breathable engineered mesh upper, and durable rubber traction.',
    price: 8995,
    originalPrice: 12995,
    stock: 40,
    rating: 4.7,
    numReviews: 2450,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Sole Material', value: 'Nike React Foam' },
      { key: 'Upper Material', value: 'Engineered Mesh' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Puma Men Solid Track Jacket with Contrast Piping',
    brand: 'Puma',
    description: 'Athletic fit full-zip jacket featuring dryCELL moisture-wicking technology and ribbed cuffs.',
    price: 2199,
    originalPrice: 3999,
    stock: 48,
    rating: 4.4,
    numReviews: 720,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: '100% Polyester with dryCELL' },
      { key: 'Fit', value: 'Regular Fit' },
    ],
  },
];

async function populateViaApi() {
  console.log('1. Logging in as Administrator...');
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
  console.log('✅ Admin login successful!\n');

  console.log('2. Fetching current categories...');
  const catRes = await fetch('http://localhost:5000/api/categories').then(r => r.json());
  const categories = catRes.categories || [];
  const categoryMap = {};
  for (const c of categories) {
    categoryMap[c.name] = c._id;
  }
  console.log('Current category map:', categoryMap);

  console.log('\n3. Adding products to all categories...');
  let addedCount = 0;
  for (const prod of allProductsToAdd) {
    const categoryId = categoryMap[prod.categoryName];
    if (!categoryId) {
      console.warn(`Category "${prod.categoryName}" not found in DB! Skipping product "${prod.name}"`);
      continue;
    }

    // Check if product already exists by searching
    const checkRes = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(prod.name)}`).then(r => r.json());
    const existing = (checkRes.products || []).find(p => p.name.trim().toLowerCase() === prod.name.trim().toLowerCase());

    if (existing) {
      console.log(`   - Already exists: "${prod.name}"`);
      continue;
    }

    const payload = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice,
      category: categoryId,
      brand: prod.brand,
      images: prod.images,
      stock: prod.stock,
      specifications: prod.specifications,
      featured: prod.featured,
      isActive: true,
    };

    const createRes = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).then(r => r.json());

    if (createRes.success) {
      console.log(`   + [CREATED] [${prod.categoryName}] ${prod.name}`);
      addedCount++;
    } else {
      console.error(`   ❌ Failed to create "${prod.name}":`, createRes.message);
    }
  }

  console.log(`\n====================================================`);
  console.log(`Successfully added ${addedCount} products.`);
  console.log(`====================================================\n`);

  console.log('4. Verifying product counts for all categories:');
  const verifyCatRes = await fetch('http://localhost:5000/api/categories').then(r => r.json());
  for (const c of verifyCatRes.categories) {
    const pRes = await fetch(`http://localhost:5000/api/products?category=${c._id}&limit=50`).then(r => r.json());
    console.log(`   • ${c.name}: ${pRes.total} products ${pRes.total > 0 ? '✅' : '❌'}`);
  }
}

populateViaApi().catch(e => {
  console.error('Error in populateViaApi:', e);
  process.exit(1);
});
