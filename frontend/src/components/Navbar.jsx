import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Sparkles,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  HelpCircle,
  TrendingUp,
  Download,
  Store,
  Shield,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const moreRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync search input with URL search param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) setSearchQuery(q);
  }, [location.search]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-nexora-blue sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2 select-none group">
            <div className="flex flex-col items-start leading-none">
              <span className="text-xl sm:text-2xl font-black italic text-white tracking-wide flex items-center gap-1">
                Nexora
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-nexora-yellow fill-nexora-yellow inline group-hover:scale-110 transition-transform" />
              </span>
              <span className="text-[10px] sm:text-[11px] italic font-semibold text-gray-200 flex items-center gap-0.5">
                Explore <span className="text-nexora-yellow font-bold">Plus</span>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-nexora-yellow inline" />
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands, categories..."
            className="w-full bg-white text-gray-800 text-xs sm:text-sm py-2 sm:py-2.5 pl-4 pr-10 rounded-sm focus:outline-none shadow-sm placeholder:text-gray-400 border border-transparent focus:border-blue-300 transition"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-nexora-blue hover:opacity-80 transition"
            aria-label="Submit Search"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </form>

        {/* Right: Action Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-white font-medium text-sm">
          
          {/* Admin Direct Panel Button (When Logged in as Admin) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-black text-xs px-3 py-1.5 rounded shadow-sm hover:from-purple-800 hover:to-indigo-900 transition border border-purple-400/40 animate-pulse"
            >
              <ShieldCheck className="w-4 h-4 text-nexora-yellow" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Auth Login / User Dropdown */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 bg-white text-nexora-blue px-3.5 py-1.5 rounded-sm font-bold text-xs sm:text-sm hover:bg-gray-50 transition shadow-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl py-2 z-50 text-gray-800 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold truncate text-gray-900">{user?.email}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                        user?.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-50 text-nexora-blue'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-nexora-blue transition"
                  >
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-nexora-blue transition"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-nexora-blue transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span>Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition border-t border-gray-100"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="bg-white text-nexora-blue font-bold text-xs sm:text-sm px-5 py-1.5 rounded-sm hover:bg-gray-100 transition shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/login?role=admin"
                className="flex items-center gap-1 text-xs font-bold bg-purple-900/80 hover:bg-purple-900 text-purple-100 px-3 py-1.5 rounded-sm border border-purple-400/30 transition shadow-xs"
                title="Admin Control Login"
              >
                <Shield className="w-3.5 h-3.5 text-nexora-yellow" />
                <span>Admin</span>
              </Link>
            </div>
          )}

          {/* Become a Seller */}
          <Link
            to={user?.role === 'seller' ? '/seller/dashboard' : '/become-seller'}
            className="hidden lg:flex items-center gap-1 hover:text-nexora-yellow transition text-xs font-semibold"
          >
            <Store className="w-4 h-4 text-nexora-yellow" />
            <span>{user?.role === 'seller' ? 'Seller Hub' : 'Become a Seller'}</span>
          </Link>

          {/* More Dropdown */}
          <div className="relative hidden lg:block" ref={moreRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 hover:text-nexora-yellow transition text-xs font-semibold"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded shadow-xl py-2 z-50 text-gray-800 border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  to="/login?role=admin"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-purple-800 hover:bg-purple-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Portal Login
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  to="/customer-care"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-gray-50 hover:text-nexora-blue cursor-pointer flex items-center gap-2 text-gray-700 transition"
                >
                  <HelpCircle className="w-4 h-4 text-nexora-blue" /> 24x7 Customer Care
                </Link>
                <Link
                  to="/advertise"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-gray-50 hover:text-nexora-blue cursor-pointer flex items-center gap-2 text-gray-700 transition"
                >
                  <TrendingUp className="w-4 h-4 text-nexora-blue" /> Advertise on Nexora
                </Link>
                <Link
                  to="/download-app"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-gray-50 hover:text-nexora-blue cursor-pointer flex items-center gap-2 text-gray-700 transition"
                >
                  <Download className="w-4 h-4 text-nexora-blue" /> Download App
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist Link with Live Counter Badge */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 hover:text-nexora-yellow transition relative"
          >
            <div className="relative">
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-nexora-yellow text-gray-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold">Wishlist</span>
          </Link>

          {/* Cart Link with Live Counter Badge */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 hover:text-nexora-yellow transition relative"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-nexora-yellow text-gray-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold">Cart</span>
          </Link>
        </nav>

        {/* Mobile Mini Action Icons */}
        <div className="flex md:hidden items-center gap-2 text-white">
          <Link to="/wishlist" className="p-1 relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-nexora-yellow text-gray-900 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="p-1 relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-nexora-yellow text-gray-900 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link to="/profile" className="p-1">
              <UserIcon className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/login" className="text-xs font-bold bg-white text-nexora-blue px-2.5 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 top-16 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-white border-t border-gray-200 text-gray-800 px-4 py-4 space-y-3 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
            {isAuthenticated ? (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-gray-500">Welcome,</p>
                <p className="font-bold text-sm text-nexora-blue">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Administrator
                  </span>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-nexora-blue text-white font-bold py-2 rounded text-xs shadow"
                >
                  Customer Sign In
                </Link>
                <Link
                  to="/login?role=admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-purple-900 text-white font-bold py-2 rounded text-xs shadow"
                >
                  Admin Sign In
                </Link>
              </div>
            )}

            <div className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 hover:text-nexora-blue"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 hover:text-nexora-blue"
              >
                All Products & Deals
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-nexora-blue"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 hover:text-nexora-blue"
                  >
                    My Orders
                  </Link>
                </>
              )}
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 hover:text-nexora-blue"
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 hover:text-nexora-blue"
              >
                <span>Shopping Cart</span>
                {cartCount > 0 && (
                  <span className="bg-nexora-yellow text-gray-900 text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to={user?.role === 'seller' ? '/seller/dashboard' : '/become-seller'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 hover:text-nexora-blue text-amber-700 font-bold"
              >
                🏪 {user?.role === 'seller' ? 'Seller Hub Dashboard' : 'Become a Seller'}
              </Link>
              <Link
                to="/customer-care"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 hover:text-nexora-blue text-blue-700 font-semibold"
              >
                🎧 24x7 Customer Care & Help
              </Link>
              <Link
                to="/advertise"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 hover:text-nexora-blue text-gray-700"
              >
                📈 Advertise on Nexora
              </Link>
              <Link
                to="/download-app"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 hover:text-nexora-blue text-gray-700"
              >
                📲 Download App (Coming Soon)
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-purple-700 font-bold"
                >
                  🛡️ Admin Dashboard
                </Link>
              )}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2.5 text-red-600 font-bold"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
