import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  MapPin,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils';

const Cart = () => {
  const {
    cartItems,
    cartCount,
    cartTotal,
    itemsPrice,
    originalPriceTotal,
    discountTotal,
    deliveryCharge,
    loading,
    actionLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartError,
  } = useCart();

  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  const handleQtyChange = async (productId, currentQty, delta, maxStock) => {
    const nextQty = currentQty + delta;
    if (nextQty < 1 || nextQty > maxStock) return;

    const result = await updateQuantity(productId, nextQty);
    if (!result.success) {
      setNotification({ type: 'error', message: result.message });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleRemove = async (productId, productName) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      setNotification({ type: 'success', message: `${productName} removed from your cart` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleMoveToWishlist = async (product) => {
    await addToWishlist(product._id);
    await removeFromCart(product._id);
    setNotification({ type: 'success', message: `${product.name} moved to your wishlist` });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-xs font-semibold">Loading your shopping cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-10 sm:p-14 space-y-5 max-w-lg mx-auto">
          <div className="w-24 h-24 bg-blue-50 text-nexora-blue rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-12 h-12 text-nexora-blue" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty!</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Explore our bestselling products, great discounts, and tech deals to fill your bag.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-8 py-3 rounded-md shadow-md transition"
          >
            <span>Shop Now</span>
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

      {cartError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{cartError}</span>
        </div>
      )}

      {/* Grid: Cart Items (Left) & Price Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Header Bar */}
          <div className="bg-white p-4 rounded-md shadow-card border border-nexora-border flex items-center justify-between">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-nexora-blue" />
              My Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h1>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 transition"
            >
              Clear Cart
            </button>
          </div>

          {/* User Delivery Address Capsule */}
          {user?.address?.city && (
            <div className="bg-white p-3.5 rounded-md shadow-card border border-nexora-border flex items-center justify-between text-xs text-gray-700">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-nexora-blue flex-shrink-0" />
                <span className="truncate">
                  Deliver to: <strong>{user.name}</strong>, {user.address.city}, {user.address.postalCode}
                </span>
              </div>
              <Link to="/profile" className="text-nexora-blue font-bold hover:underline flex-shrink-0 ml-2">
                Change
              </Link>
            </div>
          )}

          {/* Cart Item Cards */}
          <div className="bg-white rounded-md shadow-card border border-nexora-border divide-y divide-gray-100 overflow-hidden">
            {cartItems.map((item) => {
              const p = item.product;
              if (!p) return null;

              const isMaxStock = item.quantity >= p.stock;
              const isMinStock = item.quantity <= 1;

              return (
                <div key={item._id || p._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start">
                  
                  {/* Left: Thumbnail & Quantity */}
                  <div className="flex flex-col items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                    <Link to={`/products/${p._id}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-md p-1 border border-gray-100 bg-gray-50 flex items-center justify-center">
                      <img
                        src={p.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={p.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      />
                    </Link>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden shadow-xs">
                      <button
                        onClick={() => handleQtyChange(p._id, item.quantity, -1, p.stock)}
                        disabled={isMinStock || actionLoading}
                        className="p-1.5 bg-gray-50 hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="px-3 text-xs font-bold text-gray-900 select-none min-w-[28px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleQtyChange(p._id, item.quantity, 1, p.stock)}
                        disabled={isMaxStock || actionLoading}
                        className="p-1.5 bg-gray-50 hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Info & Actions */}
                  <div className="flex-1 flex flex-col justify-between space-y-3 w-full">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/products/${p._id}`}>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base hover:text-nexora-blue line-clamp-2 leading-snug">
                            {p.name}
                          </h3>
                        </Link>
                      </div>

                      <p className="text-[11px] text-gray-500 mt-0.5">Brand: {p.brand || 'Nexora'}</p>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2.5 mt-2">
                        <span className="text-base sm:text-lg font-black text-gray-900">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice > p.price && (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(p.originalPrice)}
                            </span>
                            <span className="text-xs font-bold text-green-700">
                              {p.discount}% off
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock availability */}
                      <div className="mt-1">
                        <span
                          className={`text-[11px] font-semibold ${
                            p.stock > 5 ? 'text-green-700' : 'text-amber-700 font-bold'
                          }`}
                        >
                          {p.stock > 5 ? 'In Stock' : `Only ${p.stock} units left!`}
                        </span>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100 text-xs font-bold text-gray-600">
                      <button
                        onClick={() => handleMoveToWishlist(p)}
                        className="hover:text-nexora-blue flex items-center gap-1 transition"
                      >
                        <Heart className="w-3.5 h-3.5 text-nexora-blue" />
                        <span>Move to Wishlist</span>
                      </button>

                      <button
                        onClick={() => handleRemove(p._id, p.name)}
                        className="hover:text-red-600 flex items-center gap-1 transition text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Price Details Order Summary */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-md shadow-card border border-nexora-border overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 font-bold text-xs uppercase tracking-wider text-gray-500">
              Price Details
            </div>

            {/* Breakdown */}
            <div className="p-4 sm:p-5 space-y-3.5 text-xs text-gray-700">
              <div className="flex items-center justify-between">
                <span>Price ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(originalPriceTotal || itemsPrice)}
                </span>
              </div>

              {discountTotal > 0 && (
                <div className="flex items-center justify-between text-green-700 font-medium">
                  <span>Discount</span>
                  <span>− {formatCurrency(discountTotal)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Charges</span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-700 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-900">{formatCurrency(deliveryCharge)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-dashed border-gray-200 flex items-baseline justify-between text-sm font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-lg">{formatCurrency(cartTotal)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="pt-2 text-xs text-green-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-green-700" />
                  <span>You will save {formatCurrency(discountTotal)} on this order</span>
                </div>
              )}
            </div>

            {/* Checkout Action */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-nexora-orange hover:bg-orange-600 text-white font-extrabold text-sm py-3.5 px-4 rounded shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Safe & Secure Guarantee Capsule */}
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-md shadow-card border border-nexora-border text-xs text-gray-500">
            <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Safe and Secure Payments. 100% Authentic products guaranteed with easy returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
