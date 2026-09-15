import React, { useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

const ProtectedRoute = ({ children, requireAdmin = false, requireSeller = false }) => {
  const { user, token, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Enforce noindex if this route requires admin access
  useEffect(() => {
    if (requireAdmin) {
      let meta = document.querySelector('meta[name="robots"]');
      const created = !meta;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        document.head.appendChild(meta);
      }
      const prevContent = meta.content;
      meta.content = 'noindex, nofollow, noarchive';

      return () => {
        if (created) {
          meta.remove();
        } else {
          meta.content = prevContent || 'index, follow';
        }
      };
    }
  }, [requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-sm font-medium">Verifying authentication...</p>
      </div>
    );
  }

  // If no token or user not logged in, redirect to login
  if (!token || !user) {
    let redirectPath = '/login';
    if (requireAdmin) redirectPath = '/login?role=admin';
    if (requireSeller) redirectPath = '/seller/login';

    return (
      <Navigate
        to={redirectPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // If route requires admin role and user is not admin
  if (requireAdmin && (!isAdmin || user?.role !== 'admin')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-gray-200 p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-red-700 bg-red-50 px-2.5 py-1 rounded">
              403 Forbidden
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">Access Denied</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              This section is restricted to authorized Nexora store administrators. Your account (
              <strong className="text-gray-800">{user.email}</strong>) does not have admin permissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-2.5 rounded transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
            </Link>
            <Link
              to="/login?role=admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold px-5 py-2.5 rounded shadow transition"
            >
              <Lock className="w-3.5 h-3.5" /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If route requires seller role and user is not seller/admin
  if (requireSeller && user.role !== 'seller' && user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-gray-200 p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
              Seller Access Required
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">Store Not Registered</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Your account (<strong className="text-gray-800">{user.email}</strong>) is currently a customer account. Complete the quick 1-minute seller registration to access the Seller Hub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/become-seller"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-nexora-blue hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded shadow transition"
            >
              Register as Seller Now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
