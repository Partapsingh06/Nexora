import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nexora_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get('/auth/profile');
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('[Auth Error]: Failed to fetch user profile', err.response?.data?.message || err.message);
        // If token is invalid or expired, clear it
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Register user
  const register = async ({ name, email, password, phone, address }) => {
    try {
      setLoading(true);
      setAuthError(null);
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data.success) {
        localStorage.setItem('nexora_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem('nexora_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setAuthError(null);
      const { data } = await api.put('/auth/profile', profileData);
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('nexora_token');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
