import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Zap, Check, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, setBuyNowItem } = useCart();
  const { inWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [addingCart, setAddingCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = inWishlist(product._id);
  const isOutOfStock = Number(product.stock) <= 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      await toggleWishlist(product._id);
    } catch (err) {
      console.error('[Wishlist Toggle Error]:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingCart(true);
      const res = await addToCart(product._id, 1);
      if (res.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch (err) {
      console.error('[Add to Cart Error]:', err);
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Set immediate direct Buy Now item in CartContext and navigate
    setBuyNowItem({
      product,
      quantity: 1,
      price: product.price,
    });

    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 hover:border-nexora-blue/50 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group relative overflow-hidden h-full">
      
      {/* Top Image & Wishlist Container */}
      <Link to={`/products/${product._id}`} className="block relative p-2.5 sm:p-4 pb-0">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          aria-label="Wishlist"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted ? 'text-red-500 fill-red-500 scale-110' : ''
            }`}
          />
        </button>

        {/* Featured / Discount Tag */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-green-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Product Image */}
        <div className="w-full h-36 sm:h-52 overflow-hidden flex items-center justify-center relative rounded-md bg-gray-50/50">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300 ${
              isOutOfStock ? 'opacity-40 grayscale' : ''
            }`}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'; }}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <span className="bg-gray-900 text-white font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Assured Badge */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-gray-500 tracking-wider truncate">
              {product.brand || 'Nexora'}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] italic font-bold text-nexora-blue">
              Plus <Sparkles className="w-2.5 h-2.5 text-nexora-yellow inline fill-nexora-yellow" />
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product._id}`}>
            <h3
              className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-nexora-blue line-clamp-2 leading-snug mb-1.5 sm:mb-2 transition"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
            <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-green-700 text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded">
              {product.rating ? product.rating.toFixed(1) : '4.2'} <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
              ({product.numReviews ? product.numReviews.toLocaleString() : '120'})
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div>
          <div className="flex items-baseline flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-sm sm:text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-[10px] sm:text-xs font-bold text-green-700">
                {product.discount}% off
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingCart}
              className={`text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded flex items-center justify-center gap-1 transition shadow-xs ${
                justAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-nexora-amber hover:bg-amber-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {addingCart ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded bg-nexora-orange hover:bg-orange-600 text-white flex items-center justify-center gap-1 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5 fill-white" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
