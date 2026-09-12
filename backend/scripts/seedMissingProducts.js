const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const realisticProductsByCategory = {
  'Home & Kitchen': [
    {
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
        { key: 'Warranty', value: '5 Years' },
      ],
    },
    {
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
        { key: 'Number of Jars', value: '3 (Chutney, Dry, Wet)' },
        { key: 'Blade Material', value: 'Stainless Steel' },
      ],
    },
    {
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
      name: 'Pigeon by Stovekraft 1.5L Stainless Steel Electric Kettle',
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
        { key: 'Thread Count', value: '144 TC' },
      ],
    },
    {
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
        { key: 'Set Contents', value: '18 Containers (300ml, 650ml, 1200ml)' },
        { key: 'Material', value: 'BPA Free PET Plastic' },
        { key: 'Features', value: 'Airtight & Stackable' },
      ],
    },
    {
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
        { key: 'Steel Grade', value: '18/8 Stainless Steel' },
      ],
    },
    {
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
        { key: 'Glass Type', value: '100% Borosilicate Glass' },
        { key: 'Care', value: 'Microwave, Oven & Dishwasher Safe' },
      ],
    },
  ],
  Mobiles: [
    {
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
        { key: 'Camera', value: '200MP Quad Rear + 12MP Front' },
        { key: 'Battery', value: '5000 mAh' },
      ],
    },
    {
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
        { key: 'Charging', value: '100W Wired + 50W Wireless' },
      ],
    },
    {
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
        { key: 'Processor', value: 'Google Tensor G3 with Titan M2' },
        { key: 'Display', value: '6.7-inch LTPO OLED 120Hz' },
        { key: 'OS', value: 'Pure Android with 7 Years Updates' },
      ],
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+ 5G (8GB RAM, 256GB Fusion Purple)',
      brand: 'Xiaomi',
      description: '200MP OIS camera with 4x lossless zoom, 120W HyperCharge (0-100% in 19 mins), 1.5K 120Hz Curved AMOLED display, and IP68 water resistance.',
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
        { key: 'Camera', value: '200MP Samsung ISOCELL HP3 OIS' },
        { key: 'Charging', value: '120W HyperCharge In-Box' },
        { key: 'Protection', value: 'Corning Gorilla Glass Victus + IP68' },
      ],
    },
  ],
  Electronics: [
    {
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
        { key: 'Chip', value: 'Apple M2 8-Core CPU / 8-Core GPU' },
        { key: 'Display', value: '13.6-inch Liquid Retina with True Tone' },
        { key: 'Battery', value: 'Up to 18 Hours Battery Life' },
      ],
    },
    {
      name: 'Dell XPS 15 9530 Intel Core i7-13700H (16GB, 1TB SSD, RTX 4050)',
      brand: 'Dell',
      description: 'Creator powerhouse laptop with 15.6-inch 3.5K OLED InfinityEdge touch display, CNC machined aluminum chassis, and quad-speaker studio sound.',
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
        { key: 'Processor', value: '13th Gen Intel Core i7-13700H' },
        { key: 'Graphics', value: 'NVIDIA GeForce RTX 4050 6GB GDDR6' },
        { key: 'Display', value: '15.6-inch 3.5K OLED Touch 400 nits' },
      ],
    },
    {
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
        { key: 'Accessory Support', value: 'Apple Pencil Pro & Magic Keyboard' },
      ],
    },
  ],
  Appliances: [
    {
      name: 'LG 242L 3-Star Smart Inverter Double Door Refrigerator',
      brand: 'LG',
      description: 'Multi Air Flow Cooling with Smart Inverter Compressor, Door Cooling+, and toughened glass shelves for optimal freshness.',
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
      name: 'Daikin 1.5 Ton 5 Star Inverter Split AC (Copper, PM 2.5 Filter)',
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
        { key: 'Energy Rating', value: '5 Star BEE' },
      ],
    },
  ],
  Fashion: [
    {
      name: "Levi's Men 511 Slim Fit Mid Rise Blue Stretch Jeans",
      brand: "Levi's",
      description: 'Modern slim-cut with room to move, crafted from premium stretch denim with signature 5-pocket styling and leather patch.',
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
        { key: 'Sole Material', value: 'Nike React Foam + Max Air 270 Unit' },
        { key: 'Upper Material', value: 'Engineered Breathable Mesh' },
      ],
    },
  ],
  'Beauty & Personal Care': [
    {
      name: 'Minimalist 10% Niacinamide Face Serum with Zinc for Acne Scars (30ml)',
      brand: 'Minimalist',
      description: 'Nourishing oil-free serum formulated with pure 10% Niacinamide and Zinc to reduce blemish marks, regulate sebum, and strengthen skin barrier.',
      price: 599,
      originalPrice: 699,
      stock: 80,
      rating: 4.6,
      numReviews: 3100,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60',
      ],
      specifications: [
        { key: 'Skin Type', value: 'All Skin Types / Acne Prone' },
        { key: 'Key Ingredients', value: '10% Niacinamide + 1% Zinc PCA' },
      ],
    },
    {
      name: 'Titan Skinn Raw Eau De Parfum for Long Lasting Luxury Fragrance (100ml)',
      brand: 'Skinn by Titan',
      description: 'Bold masculine citrus and woody perfume with top notes of Italian Lemon and Watermelon, heart of Geranium, and base of Indonesian Patchouli.',
      price: 2495,
      originalPrice: 2995,
      stock: 45,
      rating: 4.8,
      numReviews: 1870,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=60',
      ],
      specifications: [
        { key: 'Fragrance Type', value: 'Eau De Parfum (EDP)' },
        { key: 'Volume', value: '100 ml' },
      ],
    },
  ],
};

async function seedMissingProducts() {
  console.log('====================================================');
  console.log('🌱 NEXORA REALISTIC CATALOG EXPANSION & POPULATION');
  console.log('====================================================\n');

  await connectDB();

  const categories = await Category.find({});
  console.log(`Found ${categories.length} total categories in database.\n`);

  let newlyAdded = 0;

  for (const cat of categories) {
    const existingCount = await Product.countDocuments({ category: cat._id });
    console.log(`Checking Category: "${cat.name}" (ID: ${cat._id}) | Current Products: ${existingCount}`);

    // Check if we have defined realistic products for this category
    const productTemplates = realisticProductsByCategory[cat.name] || [];

    for (const prodData of productTemplates) {
      const existingProduct = await Product.findOne({ name: prodData.name });
      if (!existingProduct) {
        await Product.create({
          ...prodData,
          category: cat._id,
          isActive: true,
        });
        console.log(`   + [ADDED NEW PRODUCT]: "${prodData.name}" -> Category: ${cat.name}`);
        newlyAdded++;
      } else if (existingProduct.category.toString() !== cat._id.toString()) {
        existingProduct.category = cat._id;
        await existingProduct.save();
        console.log(`   ✓ [UPDATED CATEGORY REF]: "${prodData.name}"`);
      }
    }
  }

  console.log(`\n====================================================`);
  console.log(`✅ Newly Added Products: ${newlyAdded}`);
  console.log(`====================================================\n`);

  // Final category product tally
  console.log('📊 FINAL TALLY OF PRODUCTS PER CATEGORY:');
  let totalInDb = 0;
  let allCategoriesHaveProducts = true;

  for (const cat of categories) {
    const count = await Product.countDocuments({ category: cat._id, isActive: true });
    totalInDb += count;
    console.log(`   • ${cat.name} (Slug: ${cat.slug}): ${count} products ${count > 0 ? '✅' : '❌ EMPTY!'}`);
    if (count === 0) allCategoriesHaveProducts = false;
  }

  console.log('----------------------------------------------------');
  console.log(`Total active products in database: ${totalInDb}`);
  console.log(`All categories have products: ${allCategoriesHaveProducts ? '✅ YES' : '❌ NO'}`);
  console.log('====================================================\n');

  process.exit(allCategoriesHaveProducts ? 0 : 1);
}

seedMissingProducts().catch((err) => {
  console.error('❌ Error seeding products:', err);
  process.exit(1);
});
