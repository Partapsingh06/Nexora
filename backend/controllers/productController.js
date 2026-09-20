const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, search, pagination, and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Only return active products for public users
    // includeInactive is only honored if the request comes from an authenticated admin
    const isAdmin = req.user && req.user.role === 'admin';
    if (!(isAdmin && req.query.includeInactive === 'true')) {
      query.isActive = true;
    }

    // Search query (matches name, description, or brand)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
      ];
    }

    // Category filter (supports ObjectId, slug, or name with case-insensitivity and formatting tolerance)
    if (req.query.category) {
      const rawCategory = req.query.category.toString().trim();
      if (rawCategory) {
        let resolvedCategoryId = null;

        // 1. Try finding category by ObjectId
        if (rawCategory.match(/^[0-9a-fA-F]{24}$/)) {
          const catById = await Category.findById(rawCategory);
          if (catById) {
            resolvedCategoryId = catById._id;
          } else {
            // Check if any product directly has this category ID
            const prodExists = await Product.exists({ category: rawCategory });
            if (prodExists) resolvedCategoryId = rawCategory;
          }
        }

        // 2. If not resolved by ObjectId, search by slug, name regex, or normalized slug
        if (!resolvedCategoryId) {
          const normalizedSlug = rawCategory
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

          const escapedName = rawCategory.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

          const catDoc = await Category.findOne({
            $or: [
              { slug: rawCategory.toLowerCase() },
              { slug: normalizedSlug },
              { name: new RegExp(`^${escapedName}$`, 'i') },
              { name: new RegExp(`^${rawCategory.replace(/-/g, ' ')}$`, 'i') },
            ],
          });

          if (catDoc) {
            resolvedCategoryId = catDoc._id;
          }
        }

        if (resolvedCategoryId) {
          query.category = resolvedCategoryId;
        } else {
          query.category = rawCategory;
        }
      }
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = new RegExp(`^${req.query.brand}$`, 'i');
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter (supports minRating or rating query)
    if (req.query.minRating || (req.query.rating && !isNaN(Number(req.query.rating)))) {
      const minRat = Number(req.query.minRating || req.query.rating);
      if (!isNaN(minRat) && minRat > 0) {
        query.rating = { $gte: minRat };
      }
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (req.query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug image');
    } else {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug image');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
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
      featured,
      isActive,
    } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, stock',
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist',
      });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category,
      brand: brand ? brand.trim() : 'Generic',
      images: images && images.length > 0 ? images : undefined,
      stock: Number(stock),
      specifications: specifications || [],
      featured: Boolean(featured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    const savedProduct = await product.save();
    await savedProduct.populate('category', 'name slug');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

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
      featured,
      isActive,
    } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist',
        });
      }
      product.category = category;
    }

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (brand !== undefined) product.brand = brand.trim();
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);
    if (specifications !== undefined) product.specifications = specifications;
    if (featured !== undefined) product.featured = Boolean(featured);
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    const updatedProduct = await product.save();
    await updatedProduct.populate('category', 'name slug');

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate a product (soft delete by default)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if hard delete was requested
    if (req.query.hard === 'true') {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Product permanently deleted',
      });
    }

    // Soft delete: toggle or set isActive to false
    product.isActive = false;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product deactivated successfully (Soft Deleted)',
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
