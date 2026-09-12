import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  Loader2,
  ArrowRight,
  Search,
  RotateCcw,
  XCircle,
  Truck,
} from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = '/orders/myorders';
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('status', activeTab);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const { data } = await api.get(url);
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('[My Orders Error]:', err.message);
      setError('Failed to load your order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMyOrders();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Return Requested':
      case 'Returned':
      case 'Refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Confirmed':
      case 'Processing':
        return 'bg-blue-100 text-nexora-blue border-blue-200';
      case 'Pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-md shadow-card border border-nexora-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-nexora-blue shrink-0" />
            My Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track shipments, cancel pre-shipping orders, or request returns.
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-nexora-blue hover:underline self-start sm:self-auto"
        >
          Explore More Products →
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-md shadow-card border border-nexora-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active / In Transit' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled & Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-nexora-blue text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by Order ID or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-lg p-12 border border-gray-200">
          <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
          <p className="text-gray-500 text-xs font-semibold">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-lg shadow-card border border-nexora-border p-10 sm:p-14 space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-blue-50 text-nexora-blue rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10 text-nexora-blue" />
            </div>
            <h2 className="text-xl font-black text-gray-900">No Orders Found</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              {searchTerm || activeTab !== 'all'
                ? 'No orders match your selected filters. Try changing filters or clearing search.'
                : 'You have not placed any orders yet. Discover trending deals and shop now!'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-6 py-2.5 rounded-md shadow-md transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => {
            const isPaid = order.isPaid || order.paymentStatus === 'paid';

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-card border border-nexora-border overflow-hidden hover:border-nexora-blue/50 transition"
              >
                {/* Top Meta Bar */}
                <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div>
                      <span className="text-gray-400 font-semibold text-[10px] uppercase">Order ID</span>
                      <p className="font-bold text-gray-900 font-mono text-[11px] sm:text-xs break-all">
                        #{order.orderId || order._id}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold text-[10px] uppercase">Placed On</span>
                      <p className="font-semibold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span
                      className={`font-black uppercase text-[10px] px-2.5 py-1 rounded-full border ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {order.paymentStatus === 'paid'
                        ? '✓ Paid'
                        : order.paymentStatus === 'refunded'
                        ? 'Refunded'
                        : order.paymentStatus === 'failed'
                        ? 'Payment Failed'
                        : 'Payment Pending'}
                    </span>

                    <span
                      className={`font-black uppercase text-[10px] px-2.5 py-1 rounded-full border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items Body */}
                <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-contain rounded border p-1 bg-gray-50"
                        />
                        <div className="max-w-[220px]">
                          <h4 className="font-semibold text-xs text-gray-900 truncate">{item.name}</h4>
                          <p className="text-gray-500 text-[11px]">
                            Qty: {item.quantity} · {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Amount</span>
                      <p className="text-base font-black text-gray-900">{formatCurrency(order.totalPrice)}</p>
                    </div>

                    <Link
                      to={`/orders/${order.orderId || order._id}`}
                      className="inline-flex items-center gap-1 bg-nexora-blue hover:bg-nexora-darkBlue text-white font-bold text-xs px-4 py-2 rounded shadow-xs transition"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
