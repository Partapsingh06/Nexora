import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    totalQuantity: 0,
    itemsPrice: 0,
    originalPriceTotal: 0,
    discountTotal: 0,
    deliveryCharge: 0,
    cartTotal: 0,
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Temporary direct "Buy Now" state for single-product fast checkout
  const [buyNowItem, setBuyNowItem] = useState(null);

  // Fetch cart on authentication change
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        totalQuantity: 0,
        itemsPrice: 0,
        originalPriceTotal: 0,
        discountTotal: 0,
        deliveryCharge: 0,
        cartTotal: 0,
      });
      return;
    }

    try {
      setLoading(true);
      setCartError(null);
      const { data } = await api.get('/cart');
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('[Cart Load Error]:', err.message);
      setCartError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, requireLogin: true };
    }

    try {
      setActionLoading(true);
      setCartError(null);
      const { data } = await api.post('/cart', { productId, quantity });
      if (data.success && data.cart) {
        setCart(data.cart);
        return { success: true, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      setCartError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false, requireLogin: true };

    try {
      setActionLoading(true);
      setCartError(null);
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      if (data.success && data.cart) {
        setCart(data.cart);
        return { success: true, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update item quantity';
      setCartError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false, requireLogin: true };

    try {
      setActionLoading(true);
      setCartError(null);
      const { data } = await api.delete(`/cart/${productId}`);
      if (data.success && data.cart) {
        setCart(data.cart);
        return { success: true, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item from cart';
      setCartError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setActionLoading(true);
      const { data } = await api.delete('/cart');
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('[Clear Cart Error]:', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items || [],
        cartCount: cart.totalQuantity || 0,
        cartTotal: cart.cartTotal || 0,
        itemsPrice: cart.itemsPrice || 0,
        originalPriceTotal: cart.originalPriceTotal || 0,
        discountTotal: cart.discountTotal || 0,
        deliveryCharge: cart.deliveryCharge || 0,
        loading,
        actionLoading,
        cartError,
        setCartError,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        buyNowItem,
        setBuyNowItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
