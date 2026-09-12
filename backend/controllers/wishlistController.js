const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug price originalPrice discount images brand rating numReviews stock isActive',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Filter out deleted/inactive products
    const validProducts = (wishlist.products || []).filter(
      (prod) => prod && prod.isActive !== false
    );

    return res.status(200).json({
      success: true,
      count: validProducts.length,
      wishlist: validProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const alreadyInWishlist = wishlist.products.some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyInWishlist) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    await wishlist.populate({
      path: 'products',
      select: 'name slug price originalPrice discount images brand rating numReviews stock isActive',
    });

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      count: wishlist.products.length,
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();
    await wishlist.populate({
      path: 'products',
      select: 'name slug price originalPrice discount images brand rating numReviews stock isActive',
    });

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      count: wishlist.products.length,
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if a product is in user's wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const inWishlist = wishlist
      ? wishlist.products.some((id) => id.toString() === productId.toString())
      : false;

    return res.status(200).json({
      success: true,
      inWishlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};
