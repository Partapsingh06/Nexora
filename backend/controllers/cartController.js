const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate cart totals and summary
const formatCartResponse = (cart) => {
  if (!cart || !cart.items) {
    return {
      _id: cart?._id || null,
      items: [],
      totalQuantity: 0,
      itemsPrice: 0,
      originalPriceTotal: 0,
      discountTotal: 0,
      deliveryCharge: 0,
      cartTotal: 0,
    };
  }

  // Filter out any items where product might have been deleted or is inactive
  const validItems = cart.items.filter((item) => item.product && item.product.isActive !== false);

  let totalQuantity = 0;
  let itemsPrice = 0;
  let originalPriceTotal = 0;

  validItems.forEach((item) => {
    const qty = item.quantity;
    const currentPrice = item.product.price !== undefined ? item.product.price : item.price;
    const origPrice = item.product.originalPrice || currentPrice;

    totalQuantity += qty;
    itemsPrice += currentPrice * qty;
    originalPriceTotal += origPrice * qty;
  });

  const discountTotal = Math.max(0, originalPriceTotal - itemsPrice);
  const deliveryCharge = itemsPrice > 0 && itemsPrice < 500 ? 40 : 0;
  const cartTotal = itemsPrice + deliveryCharge;

  return {
    _id: cart._id,
    items: validItems,
    totalQuantity,
    itemsPrice,
    originalPriceTotal,
    discountTotal,
    deliveryCharge,
    cartTotal,
  };
};

// @desc    Get user's shopping cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price originalPrice discount images brand stock isActive',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid Product ID is required',
      });
    }

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // 1. Verify Product exists and has stock in MongoDB (Price Security)
    const product = await Product.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Product is unavailable or does not exist',
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this product is currently out of stock',
      });
    }

    // 2. Find or create user cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // 3. Check if product is already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items are available in stock. You already have ${cart.items[itemIndex].quantity} in your cart.`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price; // DB price security
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items are available in stock`,
        });
      }
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: product.price, // DB price security
      });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice discount images brand stock isActive',
    });

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Product is unavailable',
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot set quantity to ${qty}. Only ${product.stock} items in stock.`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in your cart',
      });
    }

    item.quantity = qty;
    item.price = product.price; // Refresh price from DB

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice discount images brand stock isActive',
    });

    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice discount images brand stock isActive',
    });

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items from user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        _id: cart?._id || null,
        items: [],
        totalQuantity: 0,
        itemsPrice: 0,
        originalPriceTotal: 0,
        discountTotal: 0,
        deliveryCharge: 0,
        cartTotal: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
