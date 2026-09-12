import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import api from '../services/api';

const SellerLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your seller email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/seller/login', {
        email: email.trim(),
        password,
      });

      if (res.data.success) {
        localStorage.setItem('nexora_token', res.data.token);
        // Navigate directly to seller dashboard
        window.location.href = '/seller/dashboard';
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-[85vh] flex items-center justify-center py-12 px-4 font-sans text-gray-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-950 via-nexora-blue to-indigo-900 text-white p-6 text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/20 mb-3 shadow-inner">
            <Store className="w-6 h-6 text-nexora-yellow" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Nexora Seller Hub
          </h1>
          <p className="text-blue-100 text-xs mt-1">
            Sign in to manage your store catalog, orders, and sales payouts
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Seller Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@yourbusiness.com"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/customer-care"
                  className="text-[11px] text-nexora-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-nexora-blue hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
            >
              {submitting ? (
                'Signing In...'
              ) : (
                <>
                  <Store className="w-4 h-4" /> Sign In to Seller Hub
                </>
              )}
            </button>
          </form>

          {/* Switch to Registration */}
          <div className="border-t border-gray-100 pt-5 mt-6 text-center text-xs space-y-2">
            <p className="text-gray-600">
              New to Nexora?{' '}
              <Link
                to="/become-seller"
                className="font-bold text-nexora-blue hover:underline"
              >
                Register as a New Seller
              </Link>
            </p>
            <p className="text-gray-500 text-[11px]">
              Looking to buy products?{' '}
              <Link to="/login" className="text-gray-700 font-semibold hover:underline">
                Customer Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
