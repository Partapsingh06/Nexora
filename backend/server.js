const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supportRoutes = require('./routes/supportRoutes');
const advertiseRoutes = require('./routes/advertiseRoutes');
const appNotificationRoutes = require('./routes/appNotificationRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');

// Models for auto-seeding if empty
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Import seed data
const { targetCategories, get60Products } = require('./data/seedCatalog');

// Auto seed helper if collection is empty
const autoSeedIfEmpty = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nexora.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'Nexora Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('[Server]: Auto-seeding initial 5 categories and 60 rich products...');
      const createdCats = {};
      for (const c of targetCategories) {
        const catDoc = await Category.create(c);
        createdCats[c.name] = catDoc._id;
      }

      const raw60 = get60Products(createdCats);
      for (const p of raw60) {
        const catId = createdCats[p.categoryName];
        if (catId) {
          await Product.create({
            name: p.name,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice,
            category: catId,
            brand: p.brand,
            images: p.images,
            stock: p.stock,
            rating: p.rating,
            numReviews: p.numReviews,
            specifications: p.specifications,
            featured: p.featured,
            isActive: true,
          });
        }
      }
      console.log('✅ [Server]: Auto-seeding completed with 60 products (12 per category).');
    } else {
      // Ensure all 5 categories exist and have products
      const categoryMap = {};
      for (const tc of targetCategories) {
        let cat = await Category.findOne({ name: tc.name });
        if (!cat) {
          cat = await Category.create(tc);
        }
        categoryMap[tc.name] = cat._id;
      }

      // Check each category for products
      for (const tc of targetCategories) {
        const catId = categoryMap[tc.name];
        const count = await Product.countDocuments({ category: catId });
        if (count === 0) {
          console.log(`[Server]: Populating missing products for "${tc.name}"...`);
          const allProds = get60Products(categoryMap);
          const catProds = allProds.filter(p => p.categoryName === tc.name);
          for (const p of catProds) {
            await Product.create({
              name: p.name,
              description: p.description,
              price: p.price,
              originalPrice: p.originalPrice,
              category: catId,
              brand: p.brand,
              images: p.images,
              stock: p.stock,
              rating: p.rating,
              numReviews: p.numReviews,
              specifications: p.specifications,
              featured: p.featured,
              isActive: true,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Server Auto-Seed Warning]:', err.message);
  }
};

// Connect to MongoDB
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nexora API is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/advertise', advertiseRoutes);
app.use('/api/app-launch', appNotificationRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/delivery', deliveryRoutes);

// Custom Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Nexora Server] Server running on port ${PORT}`);
});
