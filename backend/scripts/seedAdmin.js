const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const targetCategories = [
  {
    name: 'Appliances',
    description: 'Air conditioners, smart refrigerators, washing machines, microwaves, and home cooling appliances',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&auto=format&fit=crop&q=60',
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
  {
    name: 'Beauty & Personal Care',
    description: 'Dermatologist tested skincare, sunscreen serums, shampoos, luxury perfumes, and personal care essentials',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60',
  },
];

// 60 Rich Products — Exactly 12 per Category
const get60Products = (categoryMap) => [
  // ==========================================
  // 1. APPLIANCES (12 Products)
  // ==========================================
  {
    categoryName: 'Appliances',
    name: 'LG 242L 3-Star Smart Inverter Double Door Refrigerator',
    brand: 'LG',
    description: 'Multi Air Flow Cooling with Smart Inverter Compressor, Door Cooling+, and toughened glass shelves for optimal energy efficiency and long-lasting freshness.',
    price: 25990,
    originalPrice: 33990,
    stock: 20,
    rating: 4.6,
    numReviews: 840,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '242 Litres' },
      { key: 'Energy Rating', value: '3 Star BEE' },
      { key: 'Compressor', value: 'Smart Inverter Compressor' },
      { key: 'Defrosting Type', value: 'Frost Free' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'LG 8 Kg 5 Star AI Direct Drive Front Load Washing Machine',
    brand: 'LG',
    description: 'AI DD intelligent fabric protection, Steam allergy care cycle, TurboWash 59 minutes rapid wash, and smart ThinQ Wi-Fi diagnosis.',
    price: 36990,
    originalPrice: 47990,
    stock: 15,
    rating: 4.7,
    numReviews: 890,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '8.0 Kg' },
      { key: 'Energy Rating', value: '5 Star Energy Efficiency' },
      { key: 'Max Spin Speed', value: '1400 RPM' },
      { key: 'Motor Technology', value: 'AI Direct Drive Motor' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'IFB 24L Convection Microwave Oven with 101 Auto-Cook Menus',
    brand: 'IFB',
    description: 'Multi-stage cooking with convection baking, grilling, auto defrost, steam clean, and stainless steel cavity for delicious home cooking.',
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
      { key: 'Control Type', value: 'Touch Key Pad' },
      { key: 'Cooking Modes', value: 'Convection, Grill, Microwave' },
      { key: 'Cavity Material', value: 'Stainless Steel' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC with PM 2.5 Filter',
    brand: 'Daikin',
    description: 'Triple Display Inverter AC with Neo Swing compressor, PM 2.5 air filtration, Dew Clean technology, and 100% copper condenser coil.',
    price: 45990,
    originalPrice: 58900,
    stock: 18,
    rating: 4.8,
    numReviews: 1250,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1614633833026-092523297a76?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '1.5 Ton' },
      { key: 'Energy Rating', value: '5 Star BEE' },
      { key: 'Cooling Capacity', value: '5000 Watts' },
      { key: 'Condenser Coil', value: '100% Pure Copper' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Symphony Diet 3D 30i Portable Tower Air Cooler',
    brand: 'Symphony',
    description: '3-side high efficiency honeycomb cooling pads with i-Pure air purification technology, magnetic remote control, and low power consumption.',
    price: 7999,
    originalPrice: 10499,
    stock: 30,
    rating: 4.2,
    numReviews: 430,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Tank Capacity', value: '30 Litres' },
      { key: 'Air Throw', value: '30 Feet' },
      { key: 'Power Consumption', value: '145 Watts' },
      { key: 'Cooling Media', value: '3D Honeycomb Pads' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Havells Aqua Plus 1.2L 1500W Stainless Steel Electric Kettle',
    brand: 'Havells',
    description: 'Double wall 304 food-grade stainless steel interior, cool touch outer body, auto shut-off, boil-dry protection, and 360-degree cordless base.',
    price: 1499,
    originalPrice: 2495,
    stock: 60,
    rating: 4.5,
    numReviews: 1680,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1594213114663-ddbe3f2a8c2f?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '1.2 Litres' },
      { key: 'Power', value: '1500 Watts' },
      { key: 'Material', value: '304 Food-Grade Stainless Steel' },
      { key: 'Auto Shut Off', value: 'Yes' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Bajaj Rex 750W Heavy Duty Mixer Grinder with 3 Jars',
    brand: 'Bajaj',
    description: 'Titanium motor with 750W power, multi-functional 2-in-1 stainless steel blade system, overload protection, and easy grip handles.',
    price: 2899,
    originalPrice: 4850,
    stock: 40,
    rating: 4.3,
    numReviews: 920,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Wattage', value: '750 Watts' },
      { key: 'Jars Included', value: '3 Stainless Steel Jars (1.5L, 1.0L, 0.4L)' },
      { key: 'Speed Settings', value: '3 Speed with Incher/Pulse' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Philips Viva Collection 2100W Induction Cooktop',
    brand: 'Philips',
    description: 'Electromagnetic induction technology with 10 preset cooking menus, touch sensor controls, timer settings, and full glass top panel.',
    price: 3499,
    originalPrice: 5495,
    stock: 35,
    rating: 4.6,
    numReviews: 1100,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Power', value: '2100 Watts' },
      { key: 'Preset Menus', value: '10 Indian Cooking Modes' },
      { key: 'Timer', value: '0 to 3 Hours' },
      { key: 'Panel', value: 'Full Crystal Glass Panel' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Morphy Richards 2-Slice Pop-Up Toaster with Variable Browning',
    brand: 'Morphy Richards',
    description: '7 variable browning settings, defrost and reheat functions, removable crumb tray, and cool-touch body for crispy golden toasts.',
    price: 1799,
    originalPrice: 2695,
    stock: 45,
    rating: 4.3,
    numReviews: 380,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Slices', value: '2 Slice Capacity' },
      { key: 'Power', value: '800 Watts' },
      { key: 'Browning Levels', value: '7 Control Settings' },
      { key: 'Crumb Tray', value: 'Removable Slide-Out Tray' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Usha Quartz Room Heater with Overheating Protection',
    brand: 'Usha',
    description: 'Instant radiant heating with dual quartz heating tubes, tip-over safety switch, low power consumption, and silent operation for cozy winters.',
    price: 1399,
    originalPrice: 2190,
    stock: 50,
    rating: 4.2,
    numReviews: 610,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Power', value: '800 Watts (400W / 800W Dual Heat)' },
      { key: 'Heating Element', value: 'Quartz Tube' },
      { key: 'Safety', value: 'Tip-over Safety Cut-off Switch' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Eureka Forbes Quick Clean DX Dry Vacuum Cleaner',
    brand: 'Eureka Forbes',
    description: '1200W powerful suction with dust bag full indicator, automatic cord winder, 3 swivel wheels, and versatile accessories for comprehensive home cleaning.',
    price: 3999,
    originalPrice: 5999,
    stock: 28,
    rating: 4.4,
    numReviews: 870,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Motor Power', value: '1200 Watts' },
      { key: 'Suction Pressure', value: '1700 mm of WC' },
      { key: 'Cord Length', value: '4 Metres Automatic Cord' },
    ],
  },
  {
    categoryName: 'Appliances',
    name: 'Kent Grand Plus RO+UV+UF+TDS Water Purifier 9L',
    brand: 'Kent',
    description: 'Multi-stage purification with in-tank UV disinfection, Mineral RO technology to retain essential minerals, and 20L/hr high purification capacity.',
    price: 14999,
    originalPrice: 19500,
    stock: 22,
    rating: 4.7,
    numReviews: 1450,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Storage Capacity', value: '9 Litres' },
      { key: 'Purification Technology', value: 'RO + UV + UF + TDS Control' },
      { key: 'Purification Rate', value: '20 Litres/Hour' },
    ],
  },

  // ==========================================
  // 2. ELECTRONICS (12 Products)
  // ==========================================
  {
    categoryName: 'Electronics',
    name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    brand: 'Apple',
    description: 'Titanium design, A17 Pro chip, customizable Action button, 48MP camera system, and Super Retina XDR display with ProMotion for blazing-fast mobile gaming.',
    price: 127990,
    originalPrice: 134900,
    stock: 25,
    rating: 4.8,
    numReviews: 1420,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Display', value: '6.1-inch Super Retina XDR OLED (120Hz)' },
      { key: 'Processor', value: 'A17 Pro 6-Core GPU' },
      { key: 'Storage', value: '128 GB NVMe' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra-Wide + 12MP Telephoto' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Apple MacBook Air 13.6-inch M2 (8GB RAM, 256GB SSD) - Space Grey',
    brand: 'Apple',
    description: 'Incredibly thin design with fast M2 processor, 13.6-inch Liquid Retina display, MagSafe 3 charging port, 1080p FaceTime HD camera, and up to 18 hours of battery life.',
    price: 89990,
    originalPrice: 99900,
    stock: 14,
    rating: 4.8,
    numReviews: 1850,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Processor', value: 'Apple M2 8-core CPU, 8-core GPU' },
      { key: 'RAM', value: '8GB Unified Memory' },
      { key: 'Display', value: '13.6-inch Liquid Retina with True Tone (500 nits)' },
      { key: 'Storage', value: '256GB SSD' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Apple iPad Air 11-inch M2 Chip (128 GB, Wi-Fi) - Space Grey',
    brand: 'Apple',
    description: 'Supercharged by the Apple M2 chip, 11-inch Liquid Retina display with P3 wide color, landscape 12MP front camera with Center Stage, and Wi-Fi 6E connectivity.',
    price: 59900,
    originalPrice: 64900,
    stock: 20,
    rating: 4.8,
    numReviews: 620,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Screen Size', value: '11 Inches Liquid Retina' },
      { key: 'Processor', value: 'Apple M2 Chip' },
      { key: 'Storage', value: '128 GB' },
      { key: 'Camera', value: '12MP Wide Camera + 12MP Center Stage Front' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Samsung 55-Inch Crystal 4K Ultra HD Smart LED TV (2024 Edition)',
    brand: 'Samsung',
    description: 'PurColor for vibrant lifelike colors, Crystal Processor 4K upscaling, Motion Xcelerator, and Q-Symphony sound compatibility for an immersive home theatre setup.',
    price: 43990,
    originalPrice: 64900,
    stock: 22,
    rating: 4.4,
    numReviews: 1240,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Screen Size', value: '55 Inches (138 cm)' },
      { key: 'Resolution', value: '4K Ultra HD (3840 x 2160)' },
      { key: 'Sound Output', value: '20W with OTS Lite' },
      { key: 'Smart Platform', value: 'Tizen OS with Voice Assistant' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'JBL Charge 5 Portable Waterproof Bluetooth Speaker',
    brand: 'JBL',
    description: 'JBL Original Pro Sound with long excursion driver, separate tweeter and dual passive radiators. IP67 waterproof and dustproof with 20 hours playtime and built-in powerbank.',
    price: 14999,
    originalPrice: 18999,
    stock: 35,
    rating: 4.7,
    numReviews: 2150,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Battery Life', value: 'Up to 20 Hours Playtime' },
      { key: 'Water Resistance', value: 'IP67 Waterproof & Dustproof' },
      { key: 'Output Power', value: '40W RMS' },
      { key: 'Connectivity', value: 'Bluetooth 5.1 with PartyBoost' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones - Silver',
    brand: 'Sony',
    description: 'Industry-leading noise cancellation powered by two processors and 8 microphones, LDAC Hi-Res Audio, 30-hour battery, and Speak-to-Chat automation.',
    price: 26990,
    originalPrice: 34990,
    stock: 45,
    rating: 4.9,
    numReviews: 2310,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Driver Unit', value: '30mm Carbon Fiber Composite' },
      { key: 'Battery Life', value: 'Up to 30 Hours (NC ON)' },
      { key: 'Fast Charge', value: '3 min charge gives 3 hours playback' },
      { key: 'Bluetooth', value: 'Version 5.2 with Multipoint Connection' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Apple Watch Series 9 GPS 45mm - Midnight Aluminum Case',
    brand: 'Apple',
    description: 'S9 SiP chip with Double Tap gesture, brighter Always-On Retina display, Precision Finding for iPhone, ECG tracking, and crash detection.',
    price: 41990,
    originalPrice: 44900,
    stock: 24,
    rating: 4.8,
    numReviews: 890,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Case Size', value: '45mm Aluminum' },
      { key: 'Display', value: 'Always-On Retina (2000 nits)' },
      { key: 'Sensors', value: 'Blood Oxygen, ECG, Temperature Sensing' },
      { key: 'Battery Life', value: 'Up to 18 hours (36 hours Low Power)' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Mi 20000mAh 50W Fast Charging Power Bank Hypersonic',
    brand: 'Xiaomi',
    description: '50W Super Fast Charge capable of charging laptops, smartphones and tablets. 3-port output with Type-C two-way fast charging and 16-layer circuit protection.',
    price: 3499,
    originalPrice: 4999,
    stock: 55,
    rating: 4.5,
    numReviews: 1420,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1609592426868-6f77ec30eb36?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '20,000 mAh Lithium Polymer' },
      { key: 'Max Output', value: '50W Super Fast Charging' },
      { key: 'Ports', value: '1x Type-C + 2x USB-A Triple Port' },
      { key: 'Recharge Time', value: '3.8 Hours with 45W Charger' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'LG UltraGear 27-inch 2K QHD 165Hz IPS Gaming Monitor',
    brand: 'LG',
    description: 'Nano IPS display with 1ms GtG response time, HDR10, NVIDIA G-SYNC and AMD FreeSync Premium compatibility for tear-free competitive gaming.',
    price: 22990,
    originalPrice: 32000,
    stock: 18,
    rating: 4.7,
    numReviews: 760,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Screen Size', value: '27 Inches QHD (2560 x 1440)' },
      { key: 'Refresh Rate', value: '165Hz with 1ms GtG' },
      { key: 'Panel Type', value: 'Nano IPS with sRGB 99%' },
      { key: 'Sync Tech', value: 'NVIDIA G-SYNC & AMD FreeSync' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Logitech MX Keys S Wireless Advanced Backlit Keyboard',
    brand: 'Logitech',
    description: 'Smart illumination, low-profile spherically dished keys, multi-device cross-computer typing via Flow, and rechargeable USB-C battery.',
    price: 9995,
    originalPrice: 12995,
    stock: 30,
    rating: 4.8,
    numReviews: 910,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Connectivity', value: 'Bluetooth Low Energy & Logi Bolt USB' },
      { key: 'Backlight', value: 'Smart Proximity Sensor Backlighting' },
      { key: 'Battery', value: 'Up to 5 months (backlight off)' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    description: '8000 DPI track-on-glass sensor, Quiet Clicks technology, MagSpeed electromagnetic scrolling (1000 lines/sec), and ergonomic thumb rest.',
    price: 8995,
    originalPrice: 10995,
    stock: 40,
    rating: 4.9,
    numReviews: 1850,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Sensor DPI', value: '8,000 DPI Darkfield Sensor' },
      { key: 'Scroll Wheel', value: 'MagSpeed Electromagnetic Wheel' },
      { key: 'Battery Life', value: 'Up to 70 days per full charge' },
      { key: 'Compatibility', value: 'Windows, macOS, Linux, iPadOS' },
    ],
  },
  {
    categoryName: 'Electronics',
    name: 'HyperX Cloud II Wireless Gaming Headset with 7.1 Surround',
    brand: 'HyperX',
    description: 'Signature HyperX memory foam comfort, custom-tuned 53mm drivers, 2.4GHz low latency wireless connection, detachable noise-cancelling microphone, and 30-hour battery.',
    price: 9490,
    originalPrice: 13990,
    stock: 26,
    rating: 4.6,
    numReviews: 1120,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Driver Size', value: '53mm Neodymium Drivers' },
      { key: 'Audio', value: 'Virtual 7.1 Surround Sound' },
      { key: 'Wireless Range', value: '20 Metres (2.4GHz Wireless)' },
      { key: 'Battery', value: 'Up to 30 Hours Playback' },
    ],
  },

  // ==========================================
  // 3. FASHION (12 Products)
  // ==========================================
  {
    categoryName: 'Fashion',
    name: "Puma Classic Graphic Crew Neck Pure Cotton Men's T-Shirt",
    brand: 'Puma',
    description: 'Breathable 100% combed cotton jersey, ribbed collar, athletic regular fit, and signature Puma cat logo print for everyday sportstyle comfort.',
    price: 899,
    originalPrice: 1499,
    stock: 80,
    rating: 4.4,
    numReviews: 670,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fabric', value: '100% Pure Combed Cotton' },
      { key: 'Fit', value: 'Regular Fit' },
      { key: 'Neck Style', value: 'Crew Neck' },
      { key: 'Care', value: 'Machine Wash Cold' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: "Levi's 511 Slim Fit Mid-Rise Stretchable Blue Jeans",
    brand: "Levi's",
    description: 'Iconic 511 modern slim fit with room to move. Premium stretch denim with classic 5-pocket styling and signature red tab.',
    price: 2699,
    originalPrice: 4299,
    stock: 50,
    rating: 4.6,
    numReviews: 1420,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: '99% Cotton, 1% Elastane' },
      { key: 'Fit', value: 'Slim Fit' },
      { key: 'Rise', value: 'Mid Rise' },
      { key: 'Closure', value: 'Zip Fly with Button Closure' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Men Slim Fit Premium Linen Blend Casual Shirt - Sky Blue',
    brand: 'Peter England',
    description: 'Crafted from breathable European linen cotton blend, tailored slim fit silhouette, point collar, and mother-of-pearl buttons. Ideal for office and casual weekends.',
    price: 1499,
    originalPrice: 2999,
    stock: 65,
    rating: 4.3,
    numReviews: 540,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fabric', value: '60% Linen, 40% Cotton' },
      { key: 'Fit', value: 'Slim Fit' },
      { key: 'Pattern', value: 'Solid Sky Blue' },
      { key: 'Care', value: 'Machine wash cold' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Nike Air Max SC Leather Casual Running Sneakers',
    brand: 'Nike',
    description: 'Visible Air cushioning in the heel, durable real and synthetic leather overlays, lightweight foam midsole, and rubber waffle outsole.',
    price: 4995,
    originalPrice: 6995,
    stock: 40,
    rating: 4.7,
    numReviews: 1890,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Sole Material', value: 'Rubber Air Max Sole' },
      { key: 'Closure', value: 'Lace-Up' },
      { key: 'Upper Material', value: 'Genuine Leather & Breathable Mesh' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Women Pure Cotton Printed Kurta with Palazzo & Dupatta Set',
    brand: 'Biba',
    description: 'Traditional floral ethnic motifs with delicate gota patti borders, straight cut round neck kurta, breathable elasticated palazzo, and lightweight chiffon dupatta.',
    price: 1899,
    originalPrice: 4499,
    stock: 50,
    rating: 4.5,
    numReviews: 1120,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: '100% Pure Cotton' },
      { key: 'Set Contents', value: 'Kurta, Palazzo, Dupatta' },
      { key: 'Occasion', value: 'Festive & Daily Ethnic Wear' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Samyakk Kanchipuram Pure Silk Woven Saree with Blouse Piece',
    brand: 'Samyakk',
    description: 'Luxurious rich zari weaving with intricate paisley borders, vibrant festive jewel tones, crafted with pure mulberry silk yarns for royal celebrations.',
    price: 6499,
    originalPrice: 12999,
    stock: 25,
    rating: 4.8,
    numReviews: 430,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fabric', value: 'Pure Kanchipuram Silk' },
      { key: 'Length', value: '6.3 Metres (including 0.8m Blouse)' },
      { key: 'Weave', value: 'Intricate Gold Zari Brocade' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: "Levi's 710 Super Skinny High Rise Dark Wash Jeans",
    brand: "Levi's",
    description: 'Sculpts and holds your shape with innovative hyperstretch denim. Flattering high-rise waistline with ankle-hugging skinny silhouette.',
    price: 2499,
    originalPrice: 3999,
    stock: 45,
    rating: 4.5,
    numReviews: 870,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fit', value: 'Super Skinny Fit' },
      { key: 'Rise', value: 'High Rise' },
      { key: 'Fabric', value: 'Cotton Hyperstretch Blend' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Zara Floral Ruffled Georgette Casual Peplum Top',
    brand: 'Zara',
    description: 'V-neckline with ruffled trim, smocked elasticated waist, billowy semi-sheer bishop sleeves, and delicate spring floral print.',
    price: 1290,
    originalPrice: 2290,
    stock: 55,
    rating: 4.3,
    numReviews: 310,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fabric', value: 'Georgette Poly Blend' },
      { key: 'Pattern', value: 'Floral Printed' },
      { key: 'Sleeve Length', value: 'Long Bishop Sleeve' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Puma Carina Street Retro Platform Sneakers for Women',
    brand: 'Puma',
    description: '80s retro tennis inspired design with slight platform lift, SoftFoam+ cushioned sockliner for step-in comfort, and durable rubber traction.',
    price: 3299,
    originalPrice: 4999,
    stock: 35,
    rating: 4.6,
    numReviews: 780,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Sole', value: 'Platform Rubber Outsole' },
      { key: 'Insole', value: 'SoftFoam+ Dual Density Cushioning' },
      { key: 'Upper', value: 'Synthetic Leather with Perforations' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'Woodland Heavy Duty Quilted Hooded Winter Puffer Jacket',
    brand: 'Woodland',
    description: 'Windproof and water-resistant nylon shell with thermo-insulating polyfill, detachable faux-fur hood, dual fleece-lined handwarmer pockets.',
    price: 4499,
    originalPrice: 7995,
    stock: 30,
    rating: 4.7,
    numReviews: 650,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Insulation', value: 'Thermal Synthetic Down Fill' },
      { key: 'Shell', value: '100% Water-Resistant Ripstop Nylon' },
      { key: 'Hood', value: 'Detachable Fleece-Lined Hood' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: "Lavie Betula Women's Satchel Medium Tote Handbag",
    brand: 'Lavie',
    description: 'Premium saffiano textured faux leather, dual rolled grab handles, detachable adjustable shoulder strap, and spacious multi-compartment interior.',
    price: 1999,
    originalPrice: 4490,
    stock: 40,
    rating: 4.4,
    numReviews: 920,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: 'Vegan PU Leather (Saffiano Texture)' },
      { key: 'Compartments', value: '2 Main Compartments + 3 Utility Pockets' },
      { key: 'Closure', value: 'Smooth Heavy Metal Zipper' },
    ],
  },
  {
    categoryName: 'Fashion',
    name: 'WildHorn Genuine Leather RFID Protected Bi-Fold Wallet',
    brand: 'WildHorn',
    description: 'Handcrafted from 100% full-grain Hunter leather, RFID blocking military-grade security lining, 8 card slots, 2 currency compartments, and coin pocket.',
    price: 799,
    originalPrice: 1999,
    stock: 90,
    rating: 4.6,
    numReviews: 2150,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: '100% Full-Grain Hunter Leather' },
      { key: 'Security', value: 'RFID Shielding Technology' },
      { key: 'Capacity', value: '8 Cards, 2 Cash Slots, 1 Coin Pocket' },
    ],
  },

  // ==========================================
  // 4. HOME & KITCHEN (12 Products)
  // ==========================================
  {
    categoryName: 'Home & Kitchen',
    name: 'Cello Opalware Dazzle Tropical Lagoon 33-Piece Dinner Set',
    brand: 'Cello',
    description: 'Toughened European opal glass, 100% bone-ash free, chip-resistant, microwave and dishwasher safe with elegant floral borders for 6 diners.',
    price: 2999,
    originalPrice: 4995,
    stock: 30,
    rating: 4.5,
    numReviews: 730,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Pieces in Set', value: '33 Pieces (Serves 6)' },
      { key: 'Material', value: 'Bone-Ash Free Opal Glass' },
      { key: 'Safety', value: 'Microwave & Dishwasher Safe' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Hawkins Futura Hard Anodised 5-Piece Non-Stick Cookware Set',
    brand: 'Hawkins',
    description: 'Includes non-stick saute pan, deep fry kadhai with stainless steel lid, tawa, sauce pan, and stew pot. Non-toxic, durable, and compatible with gas & induction.',
    price: 4999,
    originalPrice: 7200,
    stock: 35,
    rating: 4.7,
    numReviews: 940,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1584990347449-a292850983cb?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: 'Hard Anodised Aluminum' },
      { key: 'Pieces in Set', value: '5 Kitchen Essentials' },
      { key: 'Induction Compatible', value: 'Yes' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Prestige Deluxe Alpha Svachh Stainless Steel 5L Pressure Cooker',
    brand: 'Prestige',
    description: 'Unique spillage control deep lid design, durable Alpha base suitable for both induction and gas stoves, sturdy cool-touch handles.',
    price: 2499,
    originalPrice: 3450,
    stock: 45,
    rating: 4.6,
    numReviews: 1820,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '5.0 Litres' },
      { key: 'Material', value: 'Heavy Gauge Stainless Steel' },
      { key: 'Base Type', value: 'Alpha Induction Base' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Prestige Omega Deluxe Granite 24cm Induction Frying Pan',
    brand: 'Prestige',
    description: '5-layer non-stick granite coating made with German technology, metal spoon friendly, scratch-resistant, and PFOA-free for oil-free cooking.',
    price: 1149,
    originalPrice: 1720,
    stock: 60,
    rating: 4.4,
    numReviews: 950,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Diameter', value: '24 cm' },
      { key: 'Coating', value: '5-Layer German Granite Non-Stick' },
      { key: 'Compatibility', value: 'Gas & Induction Compatible' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Milton Thermosteel Flip Lid Insulated Water Bottle 1000ml',
    brand: 'Milton',
    description: 'Double-walled vacuum insulation keeps beverages hot or cold for 24 hours. 100% rustproof 304 food-grade stainless steel with leak-proof flip lid.',
    price: 899,
    originalPrice: 1290,
    stock: 85,
    rating: 4.7,
    numReviews: 3100,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Capacity', value: '1000 ml (1 Litre)' },
      { key: 'Insulation', value: '24 Hours Hot / 24 Hours Cold' },
      { key: 'Material', value: '304 Grade Stainless Steel' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Tupperware Modular Plastic Airtight Kitchen Storage Box 6-Piece',
    brand: 'Tupperware',
    description: 'Space-saving stackable modular design, virtually airtight moisture-lock seals, transparent windows for easy identification of lentils, rice, and spices.',
    price: 1699,
    originalPrice: 2600,
    stock: 50,
    rating: 4.5,
    numReviews: 670,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Set Count', value: '6 Containers (1.1L each)' },
      { key: 'Material', value: '100% Virgin BPA-Free Food Grade Plastic' },
      { key: 'Lid Type', value: 'Airtight Moisture-Proof Tabs' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Spaces 100% Cotton 300 TC Double King Bedsheet with 2 Pillow Covers',
    brand: 'Spaces',
    description: 'Super soft sateen weave crafted with pure long-staple cotton, 300 thread count, hypoallergenic, fade-resistant reactive botanical prints.',
    price: 1899,
    originalPrice: 3499,
    stock: 40,
    rating: 4.6,
    numReviews: 880,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Fabric', value: '100% Pure Long-Staple Cotton' },
      { key: 'Thread Count', value: '300 TC' },
      { key: 'Size', value: 'King Size (108 x 108 inches)' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Story@Home Velvet Geometric Pattern Throw Cushion Covers (Set of 5)',
    brand: 'Story@Home',
    description: 'Ultra-luxurious heavyweight Dutch velvet fabric with golden foil geometric patterns, hidden zipper closure, standard 16x16 inch sofa fit.',
    price: 699,
    originalPrice: 1499,
    stock: 70,
    rating: 4.3,
    numReviews: 450,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Material', value: 'Premium Dutch Velvet' },
      { key: 'Dimensions', value: '16 x 16 Inches (40 x 40 cm)' },
      { key: 'Pack Size', value: 'Set of 5 Cushion Covers' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Philips Smart Wi-Fi 20W LED Batten with 16 Million RGB Colors',
    brand: 'Philips',
    description: 'Smart Wi-Fi enabled LED tubelight and ambient table lamp. Control via WiZ App, Amazon Alexa, or Google Assistant with 16M tunable colors.',
    price: 1199,
    originalPrice: 2499,
    stock: 80,
    rating: 4.4,
    numReviews: 610,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Wattage', value: '20 Watts' },
      { key: 'Connectivity', value: 'Wi-Fi 2.4 GHz' },
      { key: 'Colors', value: '16 Million RGB Colors' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Ajanta Vintage Roman Numerals Silent Sweep Wall Clock 32cm',
    brand: 'Ajanta',
    description: 'Antique copper finish circular frame, easy-to-read Roman numerals, completely silent non-ticking sweep quartz movement.',
    price: 749,
    originalPrice: 1295,
    stock: 65,
    rating: 4.5,
    numReviews: 1230,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Diameter', value: '32 cm (12.5 Inches)' },
      { key: 'Movement', value: 'Silent Sweep Quartz Movement' },
      { key: 'Finish', value: 'Antique Metallic Bronze' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Home Sizzler Blackout Thermal Insulated Eyelet Curtains (Pack of 2)',
    brand: 'Home Sizzler',
    description: 'Triple-weave heavy blackout polyester fabric blocks 90% sunlight and UV rays, reduces outside noise, with rust-resistant silver metal grommets.',
    price: 1299,
    originalPrice: 2499,
    stock: 45,
    rating: 4.4,
    numReviews: 960,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Dimensions', value: '7 Feet Long (Door Size: 4 x 7 ft)' },
      { key: 'Fabric', value: '3-Layer High Density Polyester' },
      { key: 'Grommets', value: '8 Stainless Metal Eyelets Per Panel' },
    ],
  },
  {
    categoryName: 'Home & Kitchen',
    name: 'Godrej Cartini Stainless Steel Pro Kitchen Knife Set (5 Pieces)',
    brand: 'Cartini',
    description: 'High carbon food-grade stainless steel blades, laser-tested taper ground cutting edges, ergonomic hygienic polypropylene handles, and solid wooden block.',
    price: 1499,
    originalPrice: 2250,
    stock: 35,
    rating: 4.6,
    numReviews: 810,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Set Contents', value: 'Chef Knife, Carving Knife, Utility Knife, Paring Knife, Wooden Block' },
      { key: 'Blade Material', value: 'High Carbon Food Grade SS' },
    ],
  },

  // ==========================================
  // 5. BEAUTY & PERSONAL CARE (12 Products)
  // ==========================================
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Himalaya Purifying Neem Face Wash for Acne & Pimple Control (200ml)',
    brand: 'Himalaya',
    description: 'Soap-free herbal formulation enriched with Neem and Turmeric, purifies skin by removing excess oil and unclogging pores without drying.',
    price: 299,
    originalPrice: 399,
    stock: 100,
    rating: 4.6,
    numReviews: 4500,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '200 ml' },
      { key: 'Skin Type', value: 'All Skin Types (Ideal for Acne Prone)' },
      { key: 'Key Ingredients', value: 'Neem & Turmeric Extracts' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Cetaphil Daily Hydrating Moisturizing Cream for Sensitive Skin (100g)',
    brand: 'Cetaphil',
    description: 'Clinically proven 48-hour intense hydration with Sweet Almond Oil, Vitamin E and B5. Fragrance-free, paraben-free, and non-comedogenic.',
    price: 549,
    originalPrice: 625,
    stock: 80,
    rating: 4.8,
    numReviews: 3200,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1608248597359-bb59c986980e?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Weight', value: '100 grams' },
      { key: 'Skin Type', value: 'Dry to Very Dry, Sensitive Skin' },
      { key: 'Formulation', value: 'Hypoallergenic & Fragrance-Free' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++ (50g)',
    brand: 'The Derma Co',
    description: 'Ultra-lightweight aqua gel with Hyaluronic Acid and Vitamin E. Broad spectrum SPF 50 PA++++ protection with zero white cast and non-greasy finish.',
    price: 449,
    originalPrice: 499,
    stock: 90,
    rating: 4.7,
    numReviews: 2800,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'SPF Rating', value: 'SPF 50 PA++++' },
      { key: 'Texture', value: 'Lightweight Aqua Gel' },
      { key: 'Key Actives', value: '1% Hyaluronic Acid & Vitamin E' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Minimalist 10% Vitamin C Face Serum for Glowing & Radiant Skin (30ml)',
    brand: 'Minimalist',
    description: 'Formulated with stable Vitamin C derivative (Ethyl Ascorbic Acid 10%) and Centella Asiatica Water to reduce dark spots, pigmentation, and promote collagen.',
    price: 4,
    originalPrice: 6,
    stock: 70,
    rating: 4.6,
    numReviews: 1950,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '30 ml' },
      { key: 'Active Concentration', value: '10% Ethyl Ascorbic Acid' },
      { key: 'Benefits', value: 'Brightening, Glow & Spot Reduction' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: "L'Oreal Paris Total Repair 5 Keratin Restoring Shampoo (650ml)",
    brand: "L'Oreal",
    description: 'Infused with Keratin-XS and Ceramide to fight the 5 signs of damaged hair: hair fall, dryness, roughness, dullness, and split ends.',
    price: 499,
    originalPrice: 799,
    stock: 65,
    rating: 4.5,
    numReviews: 3800,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '650 ml' },
      { key: 'Hair Type', value: 'Damaged & Weak Hair' },
      { key: 'Key Component', value: 'Keratin-XS Repair Complex' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Tresemme Keratin Smooth Hair Conditioner with Argan Oil (300ml)',
    brand: 'Tresemme',
    description: 'Specially formulated with Moroccan Argan Oil and Micro-Moisture Technology for up to 72 hours of frizz control and salon-smooth shiny hair.',
    price: 289,
    originalPrice: 420,
    stock: 60,
    rating: 4.4,
    numReviews: 2100,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '300 ml' },
      { key: 'Hair Type', value: 'Frizzy, Dry Hair' },
      { key: 'Key Ingredient', value: 'Argan Oil & Keratin Protein' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Streax Professional Vitariche Gloss Hair Serum with Walnut Oil (100ml)',
    brand: 'Streax',
    description: 'Enriched with Walnut Oil and Vitamin E, revitalizes dry and dull hair, providing all-day silky shine, heat protection, and manageable detangling.',
    price: 260,
    originalPrice: 375,
    stock: 75,
    rating: 4.5,
    numReviews: 1720,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '100 ml' },
      { key: 'Texture', value: 'Non-Greasy Glossy Serum' },
      { key: 'Key Oil', value: 'Natural Walnut Oil & Vitamin E' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'NIVEA Shea Smooth Deep Moisture Body Lotion for Dry Skin (400ml)',
    brand: 'Nivea',
    description: 'Enriched with natural Shea Butter and Deep Moisture Serum, melts smoothly into skin for 48-hour long-lasting smoothness and silky soft touch.',
    price: 349,
    originalPrice: 525,
    stock: 80,
    rating: 4.6,
    numReviews: 3400,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '400 ml' },
      { key: 'Skin Type', value: 'Dry Skin' },
      { key: 'Moisture Duration', value: '48 Hours Deep Nourishment' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: "Burt's Bees 100% Natural Moisturizing Beeswax Lip Balm (4.25g)",
    brand: "Burt's Bees",
    description: 'Original Beeswax Lip Balm infused with Peppermint Oil for a refreshing tingle, Vitamin E, and conditioning coconut oil to hydrate chapped lips.',
    price: 399,
    originalPrice: 550,
    stock: 95,
    rating: 4.7,
    numReviews: 1280,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Weight', value: '4.25 grams' },
      { key: 'Ingredients', value: '100% Natural Beeswax, Peppermint Oil, Vitamin E' },
      { key: 'Paraben Free', value: 'Yes' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Titan Skinn Raw Eau De Parfum for Long Lasting Luxury Fragrance (100ml)',
    brand: 'Titan',
    description: 'Crafted in France by master perfumers. Fresh citrus top notes of Bergamot and Mandarin blended with violet leaves, Indonesian patchouli, and woods.',
    price: 2395,
    originalPrice: 2995,
    stock: 35,
    rating: 4.8,
    numReviews: 2450,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '100 ml EDP' },
      { key: 'Fragrance Family', value: 'Fresh Citrus, Floral & Woody' },
      { key: 'Origin', value: 'Crafted in France' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Olay Total Effects 7 In One Anti-Ageing Day Cream with SPF 15 (50g)',
    brand: 'Olay',
    description: 'Formulated with VitaNiacin Complex (Vitamin B3, C & E) to fight 7 signs of aging, smooth fine lines, even skin tone, and protect against UV rays.',
    price: 799,
    originalPrice: 999,
    stock: 50,
    rating: 4.5,
    numReviews: 1650,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Weight', value: '50 grams' },
      { key: 'SPF', value: 'SPF 15 Protection' },
      { key: 'Benefits', value: 'Fights 7 Signs of Ageing' },
    ],
  },
  {
    categoryName: 'Beauty & Personal Care',
    name: 'Dove Deeply Nourishing Moisturizing Body Wash with NutriumMoisture (800ml)',
    brand: 'Dove',
    description: 'Microbiome gentle formula with plant-based cleansers and skin-natural nourishers, creates rich creamy lather for softer, smoother skin after one shower.',
    price: 429,
    originalPrice: 599,
    stock: 70,
    rating: 4.7,
    numReviews: 2900,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&auto=format&fit=crop&q=60',
    ],
    specifications: [
      { key: 'Volume', value: '800 ml' },
      { key: 'Sulfate Free', value: '100% Gentle Cleansers' },
      { key: 'Skin Type', value: 'All Skin Types' },
    ],
  },
];

const seedData = async () => {
  try {
    console.log('[Seeder]: Connecting to database...');
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nexora.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    // 1. Seed or Update Admin User
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Nexora Super Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '9876500000',
        role: 'admin',
        address: {
          street: 'Embassy Tech Village, Outer Ring Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
        },
      });
      console.log(`✅ [Seeder]: Created Admin User: ${adminEmail} (password: ${adminPassword})`);
    } else {
      admin.role = 'admin';
      await admin.save();
      console.log(`ℹ️ [Seeder]: Admin user (${adminEmail}) verified.`);
    }

    // 2. Ensure exactly the 5 target categories exist
    console.log('\n[Seeder]: Synchronizing 5 target categories...');
    const categoryMap = {};
    const targetCategoryNames = targetCategories.map((c) => c.name);

    for (const cat of targetCategories) {
      let createdCat = await Category.findOne({ name: cat.name });
      if (!createdCat) {
        createdCat = await Category.create(cat);
        console.log(`   + Category created: ${createdCat.name}`);
      } else {
        createdCat.image = cat.image;
        createdCat.description = cat.description;
        createdCat.isActive = true;
        await createdCat.save();
        console.log(`   ✓ Category verified: ${createdCat.name}`);
      }
      categoryMap[cat.name] = createdCat._id;
    }

    // Handle any old or redundant categories (like 'Mobiles')
    const obsoleteCategories = await Category.find({ name: { $nin: targetCategoryNames } });
    if (obsoleteCategories.length > 0) {
      for (const obsCat of obsoleteCategories) {
        console.log(`   - Removing obsolete category: ${obsCat.name}`);
        // Remap any existing products pointing to obsolete categories if needed
        await Category.deleteOne({ _id: obsCat._id });
      }
    }

    // 3. Seed Exactly 60 Products (12 per category)
    console.log('\n[Seeder]: Synchronizing exactly 60 products (12 per category)...');
    const rawProducts = get60Products(categoryMap);
    const targetProductNames = rawProducts.map((p) => p.name);

    for (const prodData of rawProducts) {
      const categoryId = categoryMap[prodData.categoryName];
      if (!categoryId) {
        throw new Error(`Category ObjectId not found for category name: ${prodData.categoryName}`);
      }

      let existing = await Product.findOne({ name: prodData.name });
      if (!existing) {
        await Product.create({
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          originalPrice: prodData.originalPrice,
          category: categoryId,
          brand: prodData.brand,
          images: prodData.images,
          stock: prodData.stock,
          rating: prodData.rating,
          numReviews: prodData.numReviews,
          specifications: prodData.specifications,
          featured: prodData.featured,
          isActive: true,
        });
        console.log(`   + Created: [${prodData.categoryName}] ${prodData.name}`);
      } else {
        existing.category = categoryId;
        existing.description = prodData.description;
        existing.price = prodData.price;
        existing.originalPrice = prodData.originalPrice;
        existing.brand = prodData.brand;
        existing.images = prodData.images;
        existing.stock = prodData.stock;
        existing.rating = prodData.rating;
        existing.numReviews = prodData.numReviews;
        existing.specifications = prodData.specifications;
        existing.featured = prodData.featured;
        existing.isActive = true;
        await existing.save();
        console.log(`   ✓ Updated: [${prodData.categoryName}] ${prodData.name}`);
      }
    }

    // Remove any extraneous products not part of the 60 target dataset
    const extraProducts = await Product.find({ name: { $nin: targetProductNames } });
    if (extraProducts.length > 0) {
      console.log(`\n[Seeder]: Cleaning up ${extraProducts.length} obsolete/extra product records...`);
      for (const ep of extraProducts) {
        console.log(`   - Deleted extra product: "${ep.name}"`);
        await Product.deleteOne({ _id: ep._id });
      }
    }

    // 4. Verification Check
    console.log('\n====================================================');
    console.log('📊 NEXORA DATABASE VERIFICATION SUMMARY');
    console.log('====================================================');
    let totalCount = 0;
    for (const catName of targetCategoryNames) {
      const catId = categoryMap[catName];
      const count = await Product.countDocuments({ category: catId, isActive: true });
      totalCount += count;
      console.log(`   • ${catName}: ${count} products`);
    }
    console.log('----------------------------------------------------');
    console.log(`   TOTAL ACTIVE PRODUCTS: ${totalCount} / 60`);
    console.log('====================================================\n');

    if (totalCount === 60) {
      console.log('🎉 [Seeder]: SUCCESS! Exactly 12 products per category (60 total) seeded idempotently.\n');
      process.exit(0);
    } else {
      console.error(`⚠️ [Seeder Warning]: Expected 60 products, found ${totalCount}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ [Seeder Error]:', error.message);
    process.exit(1);
  }
if (require.main === module) {
  seedData();
}

module.exports = {
  targetCategories,
  get60Products,
  seedData,
};
