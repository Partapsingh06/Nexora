import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  RotateCcw,
  Users,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Returns', path: '/admin/returns', icon: RotateCcw },
  { name: 'Customers', path: '/admin/users', icon: Users },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Enforce noindex for Admin pages in search engines
  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-nexora-yellow" />
          <span className="font-extrabold text-lg tracking-wider">NEXORA ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded hover:bg-gray-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-35 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-800">
            <ShieldCheck className="w-6 h-6 text-nexora-yellow" />
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-lg tracking-wider leading-none">NEXORA</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Control Center
              </span>
            </div>
          </div>

          {/* User Info Capsule */}
          <div className="p-4 mx-3 my-4 bg-gray-800/80 rounded-lg border border-gray-700/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-nexora-blue text-white font-bold flex items-center justify-center text-sm uppercase shadow">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <span className="inline-block text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase">
                Administrator
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-nexora-blue text-white shadow-sm font-semibold'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition"
          >
            <Store className="w-4 h-4 text-nexora-amber" />
            <span>Go to Customer Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-3.5 py-2 text-sm text-red-400 hover:bg-red-950/40 rounded-md transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
