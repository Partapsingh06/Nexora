import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      if (data.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      console.error('[Wishlist Load Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const inWishlist = (productId) => {
    if (!productId || !Array.isArray(wishlist)) return false;
    return wishlist.some(
      (item) => (item._id || item).toString() === productId.toString()
    );
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, requireLogin: true };

    try {
      const { data } = await api.post(`/wishlist/${productId}`);
      if (data.success) {
        setWishlist(data.wishlist || []);
        return { success: true, message: data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, requireLogin: true };

    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      if (data.success) {
        setWishlist(data.wishlist || []);
        return { success: true, message: data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to remove from wishlist' };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, requireLogin: true };

    if (inWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        inWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
