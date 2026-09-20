import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

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
    const redirectPath = requireSeller ? '/seller/login' : '/login';

    return (
      <Navigate
        to={redirectPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // If route requires admin role and user is not an authenticated admin, redirect immediately to customer home
  if (requireAdmin && (!isAdmin || user?.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  // If route requires seller role and user is not seller/admin
  if (requireSeller && user.role !== 'seller' && user.role !== 'admin') {
    return <Navigate to="/become-seller" replace />;
  }

  return children;
};

export default ProtectedRoute;

