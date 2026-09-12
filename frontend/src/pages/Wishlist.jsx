import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils';

const Wishlist = () => {
  const { wishlist, wishlistCount, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  const handleMoveToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res.success) {
      await removeFromWishlist(product._id);
      setNotification({ type: 'success', message: `${product.name} moved to Cart!` });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: 'error', message: res.message || 'Failed to move to cart' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemove = async (productId, productName) => {
    const res = await removeFromWishlist(productId);
    if (res.success) {
      setNotification({ type: 'success', message: `${productName} removed from your wishlist` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-xs font-semibold">Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-10 sm:p-14 space-y-5 max-w-lg mx-auto">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Your Wishlist is Empty!</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            You have not added any products to your wishlist yet. Explore the Nexora catalog and save your favorites!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-8 py-3 rounded-md shadow-md transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-md text-xs font-semibold flex items-center gap-2 border animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-md shadow-card border border-nexora-border flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          My Wishlist ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
        </h1>
        <Link
          to="/products"
          className="text-xs font-bold text-nexora-blue hover:underline"
        >
          Add More Items
        </Link>
      </div>

      {/* Wishlist Items List */}
      <div className="bg-white rounded-md shadow-card border border-nexora-border divide-y divide-gray-100 overflow-hidden">
        {wishlist.map((product) => {
          const isOutOfStock = Number(product.stock) <= 0;

          return (
            <div
              key={product._id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 hover:bg-gray-50/50 transition"
            >
              {/* Product Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 w-full text-center sm:text-left">
                <Link
                  to={`/products/${product._id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-md p-1 border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0"
                >
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                </Link>

                <div className="space-y-1.5 flex-1 overflow-hidden">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] italic font-bold text-nexora-blue">
                      Plus <Sparkles className="w-2.5 h-2.5 text-nexora-yellow inline fill-nexora-yellow" />
                    </span>
                  </div>

                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base hover:text-nexora-blue line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 bg-green-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                      {product.rating ? product.rating.toFixed(1) : '4.5'} <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-xs text-gray-400">
                      ({product.numReviews ? product.numReviews.toLocaleString() : '120'})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                        <span className="text-xs font-bold text-green-700">
                          {product.discount}% off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="pt-0.5">
                    <span
                      className={`text-xs font-semibold ${
                        !isOutOfStock ? 'text-green-700' : 'text-red-600 font-bold'
                      }`}
                    >
                      {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleMoveToCart(product)}
                  disabled={isOutOfStock}
                  className="flex-1 sm:flex-initial bg-nexora-amber hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded shadow-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" /> Move to Cart
                </button>

                <button
                  onClick={() => handleRemove(product._id, product.name)}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
