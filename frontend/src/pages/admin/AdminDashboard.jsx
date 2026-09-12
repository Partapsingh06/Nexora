import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Users,
  ShoppingBag,
  IndianRupee,
  PlusCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Loader2,
  RefreshCw,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/admin/stats');
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setRecentProducts(data.recentProducts || []);
      }
    } catch (err) {
      console.error('[Admin Stats Error]:', err.message);
      setError(err.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-sm font-medium">Loading store analytics & metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Admin Overview</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time sales revenue, pipeline metrics, and database catalog stats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={fetchStats}
            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition shrink-0"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/products/new"
            className="bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-3.5 py-2 rounded-md shadow flex items-center gap-1.5 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow flex items-center gap-1.5 transition shrink-0"
          >
            <ShoppingBag className="w-4 h-4" /> View Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Financial & Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {formatCurrency(stats?.totalRevenue ?? 0)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Today's Sales: <strong className="text-emerald-700 font-bold">{formatCurrency(stats?.todayRevenue ?? 0)}</strong></span>
            <span className="text-emerald-600 font-semibold">Live DB</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-nexora-blue flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{stats?.totalOrders ?? 0}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {stats?.pendingOrders ?? 0} Pending
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Delivered: <strong className="text-green-600">{stats?.deliveredOrders ?? 0}</strong></span>
            <Link to="/admin/orders" className="text-nexora-blue hover:underline font-semibold flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Customers</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{stats?.totalCustomers ?? 0}</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {stats?.totalUsers ?? 0} Total Users
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Admins: <strong>{stats?.adminUsers ?? 0}</strong></span>
            <Link to="/admin/users" className="text-purple-600 hover:underline font-semibold flex items-center gap-0.5">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Catalog Products & Stock */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-amber-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inventory Products</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-nexora-amber flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{stats?.totalProducts ?? 0}</span>
            {stats?.lowStockProducts > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {stats.lowStockProducts} Low Stock
              </span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Out of Stock: <strong className="text-red-600">{stats?.outOfStockProducts ?? 0}</strong></span>
            <Link to="/admin/products" className="text-nexora-blue hover:underline font-semibold flex items-center gap-0.5">
              Inventory <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Order Pipeline Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Pending</span>
          <span className="text-xl font-black text-amber-600">{stats?.pendingOrders ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Confirmed</span>
          <span className="text-xl font-black text-blue-600">{stats?.confirmedOrders ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Processing</span>
          <span className="text-xl font-black text-indigo-600">{stats?.processingOrders ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">In Transit</span>
          <span className="text-xl font-black text-sky-600">{stats?.shippedOrders ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Delivered</span>
          <span className="text-xl font-black text-green-600">{stats?.deliveredOrders ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Cancelled / Ret.</span>
          <span className="text-xl font-black text-red-600">
            {(stats?.cancelledOrders ?? 0) + (stats?.returnOrders ?? 0)}
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest customer transactions recorded in MongoDB</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-nexora-blue hover:underline flex items-center gap-1"
          >
            View All Orders <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const isPaid = order.isPaid || order.paymentStatus === 'paid';
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-gray-900 block">
                          #{order.orderId || order._id.slice(-8)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800 block">
                          {order.shippingAddress?.name || order.user?.name}
                        </span>
                        <span className="text-[11px] text-gray-400">{order.user?.email}</span>
                      </td>

                      <td className="py-3 px-4 font-black text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'refunded'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'refunded' ? 'Refunded' : 'Pending'} ({order.paymentMethod})
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block font-black text-[10px] px-2.5 py-0.5 rounded-full ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : ['Return Requested', 'Returned', 'Refunded'].includes(order.orderStatus)
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-nexora-blue'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/admin/orders"
                          className="text-xs font-bold text-nexora-blue hover:underline"
                        >
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 text-xs">
                    No orders placed yet. As customers order, they will appear here live.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
