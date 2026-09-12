const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Category = require('../models/Category');
const generateToken = require('../utils/generateToken');

// @desc    Register a new seller & create business profile
// @route   POST /api/seller/register
// @access  Public
const registerSeller = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      businessType,
      businessAddress,
      gstin,
      pan,
      primaryCategory,
    } = req.body;

    if (!name || !email || !password || !phone || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, phone, and business name are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (user) {
      // If user already exists, verify password or upgrade role if matched
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Incorrect password provided for upgrading to seller.',
        });
      }
      user.role = 'seller';
      if (phone && !user.phone) user.phone = phone.trim();
      await user.save();
    } else {
      // Create new user with seller role
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: phone.trim(),
        role: 'seller',
        address: {
          street: businessAddress?.street || '',
          city: businessAddress?.city || '',
          state: businessAddress?.state || '',
          postalCode: businessAddress?.postalCode || '',
          country: businessAddress?.country || 'India',
        },
      });
    }

    // Check if seller profile already exists
    let seller = await Seller.findOne({ user: user._id });

    const sellerId = seller?.sellerId || `NX-SLR-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    if (!seller) {
      seller = await Seller.create({
        sellerId,
        user: user._id,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        businessName: businessName.trim(),
        businessType: businessType || 'Retailer',
        businessAddress: {
          street: businessAddress?.street || '',
          city: businessAddress?.city || '',
          state: businessAddress?.state || '',
          postalCode: businessAddress?.postalCode || '',
          country: businessAddress?.country || 'India',
        },
        gstin: gstin ? gstin.trim().toUpperCase() : '',
        pan: pan ? pan.trim().toUpperCase() : '',
        primaryCategory: primaryCategory || 'Electronics',
        status: 'approved',
      });
    } else {
      seller.businessName = businessName.trim();
      seller.businessType = businessType || seller.businessType;
      seller.phone = phone.trim();
      seller.status = 'approved';
      await seller.save();
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Congratulations! Your Nexora Seller Account is now active and ready to sell.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      seller,
    });
  } catch (error) {
    console.error('[Seller Register Error]:', error);
    next(error);
  }
};

// @desc    Seller Portal Login
// @route   POST /api/seller/login
// @access  Public
const loginSeller = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if seller profile exists
    let seller = await Seller.findOne({ user: user._id });

    if (!seller && user.role !== 'admin' && user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'This account is not registered as a seller yet. Please register your store first.',
      });
    }

    // If seller record didn't exist but user was seller or admin, create a default one
    if (!seller) {
      seller = await Seller.create({
        sellerId: `NX-SLR-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`,
        user: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '9876543210',
        businessName: `${user.name}'s Official Store`,
        businessType: 'Retailer',
        status: 'approved',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Seller logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      seller,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Seller Profile & Store Info
// @route   GET /api/seller/profile
// @access  Private (Seller/Admin)
const getSellerProfile = async (req, res, next) => {
  try {
    let seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      seller = await Seller.create({
        sellerId: `NX-SLR-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`,
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        businessName: `${req.user.name}'s Store`,
        businessType: 'Retailer',
        status: 'approved',
      });
    }

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Seller Dashboard Statistics
// @route   GET /api/seller/dashboard-stats
// @access  Private (Seller/Admin)
const getSellerDashboardStats = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    
    // Count products created by this seller
    const productCount = await Product.countDocuments({ seller: req.user._id });
    const inStockCount = await Product.countDocuments({ seller: req.user._id, stock: { $gt: 0 } });
    const lowStockCount = await Product.countDocuments({ seller: req.user._id, stock: { $lte: 5 } });

    res.status(200).json({
      success: true,
      data: {
        sellerInfo: seller,
        totalProducts: productCount,
        inStockProducts: inStockCount,
        lowStockProducts: lowStockCount,
        totalOrders: 14,
        pendingDispatch: 2,
        deliveredOrders: 12,
        totalRevenue: 68450,
        storeRating: seller?.rating || 4.8,
        commissionTier: '0% Promotional (Active)',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Products Listed by Current Seller
// @route   GET /api/seller/products
// @access  Private (Seller/Admin)
const getSellerProducts = async (req, res, next) => {
  try {
    let products = await Product.find({ seller: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    // If seller has no specific products yet, show recent products for demo context
    if (products.length === 0) {
      products = await Product.find({})
        .limit(6)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / List a new product by Seller
// @route   POST /api/seller/products
// @access  Private (Seller/Admin)
const createSellerProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      images,
      stock,
      specifications,
    } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, category, and stock are required fields.',
      });
    }

    // Verify category exists or find by name/id
    let categoryDoc;
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
    }

    if (!categoryDoc) {
      const firstCat = await Category.findOne({});
      categoryDoc = firstCat;
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.25,
      category: categoryDoc._id,
      brand: brand || 'Store Brand',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60'],
      stock: Number(stock),
      specifications: specifications || [],
      seller: req.user._id,
      isActive: true,
    });

    // Increment seller product count
    await Seller.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalProducts: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Product listed successfully on Nexora Marketplace!',
      data: product,
    });
  } catch (error) {
    console.error('[Create Seller Product Error]:', error);
    next(error);
  }
};

// @desc    Delete a Seller's Product
// @route   DELETE /api/seller/products/:id
// @access  Private (Seller/Admin)
const deleteSellerProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Allow admin or owning seller to delete
    if (
      req.user.role !== 'admin' &&
      product.seller &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product removed from seller inventory successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
  getSellerDashboardStats,
  getSellerProducts,
  createSellerProduct,
  deleteSellerProduct,
};
