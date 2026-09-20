import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, loading, authError, setAuthError, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to appropriate portal
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from !== '/admin' ? from : '/', { replace: true });
      }
    }
  }, [user, isAdmin, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setAuthError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      const loggedUser = result.user;

      if (loggedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from && from !== '/admin' ? from : '/', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* Left Side Banner */}
        <div className="md:w-2/5 p-8 text-white flex flex-col justify-between relative overflow-hidden bg-nexora-blue">
          <div className="z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-nexora-yellow" /> Nexora Account
            </span>
            <h2 className="text-3xl font-extrabold mb-3">
              Login
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Get access to your Orders, Wishlist, Personalized Recommendations, and fast checkout.
            </p>
          </div>

          <div className="mt-10 z-10 space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-xs text-blue-100">
              <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-nexora-yellow" /> Role-Based JWT Security
              </p>
              <p>Protected by cryptographic token verification and database authorization.</p>
            </div>
          </div>

          {/* Background Decorative Circles */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-3/5 p-8 sm:p-10 flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Welcome to Nexora
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your registered email and password to sign in.
            </p>
          </div>

          {(formError || authError) && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-md shadow-md transition duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed bg-nexora-orange hover:bg-orange-600 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              New to Nexora?{' '}
              <Link
                to="/register"
                className="font-bold text-nexora-blue hover:underline inline-flex items-center gap-0.5"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

