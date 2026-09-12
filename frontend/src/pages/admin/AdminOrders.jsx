import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  CreditCard,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  X,
  XCircle,
  RotateCcw,
  Printer,
  Calendar,
  Phone,
  User,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils';

const availableStatuses = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null); // Details Modal
  const [updatingStatusModal, setUpdatingStatusModal] = useState({
    open: false,
    order: null,
    newStatus: '',
    note: '',
    loading: false,
  });
  const [cancelModal, setCancelModal] = useState({
    open: false,
    order: null,
    reason: '',
    loading: false,
  });

  const [notification, setNotification] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (statusFilter) params.append('orderStatus', statusFilter);
      if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
      if (paymentMethodFilter) params.append('paymentMethod', paymentMethodFilter);

      const { data } = await api.get(`/orders?${params.toString()}`);
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
        setStatusCounts(data.statusCounts || {});
      }
    } catch (err) {
      console.error('[Admin Orders Load Error]:', err.message);
      setNotification({ type: 'error', message: 'Failed to load customer orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentStatusFilter, paymentMethodFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const openStatusChangeModal = (order, newStatus) => {
    setUpdatingStatusModal({
      open: true,
      order,
      newStatus,
      note: '',
      loading: false,
    });
  };

  const handleConfirmStatusChange = async (e) => {
    e.preventDefault();
    const { order, newStatus, note } = updatingStatusModal;
    if (!order || !newStatus) return;

    try {
      setUpdatingStatusModal((prev) => ({ ...prev, loading: true }));
      const { data } = await api.put(`/orders/${order._id}/status`, {
        orderStatus: newStatus,
        note: note.trim(),
      });

      if (data.success) {
        setNotification({
          type: 'success',
          message: `Order #${order.orderId || order._id.slice(-8)} updated to ${newStatus}`,
        });
        setUpdatingStatusModal({ open: false, order: null, newStatus: '', note: '', loading: false });
        if (selectedOrder && selectedOrder._id === order._id) {
          setSelectedOrder(data.order);
        }
        fetchOrders();
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update order status',
      });
      setUpdatingStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    const { order, reason } = cancelModal;
    if (!order) return;

    try {
      setCancelModal((prev) => ({ ...prev, loading: true }));
      const { data } = await api.put(`/orders/${order._id}/cancel`, {
        reason: reason.trim() || 'Cancelled by administrator',
      });

      if (data.success) {
        setNotification({
          type: 'success',
          message: `Order #${order.orderId || order._id.slice(-8)} cancelled and inventory restored`,
        });
        setCancelModal({ open: false, order: null, reason: '', loading: false });
        if (selectedOrder && selectedOrder._id === order._id) {
          setSelectedOrder(data.order);
        }
        fetchOrders();
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel order',
      });
      setCancelModal((prev) => ({ ...prev, loading: false }));
    }
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-600" />
            Order Fulfillment & Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time pipeline tracking, status transitions, cancellations, and customer shipment details.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition self-start sm:self-auto"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-md text-xs font-semibold flex items-center gap-2 border animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Quick Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
        <button
          onClick={() => { setStatusFilter(''); setPage(1); }}
          className={`p-3 rounded-lg border transition ${
            !statusFilter ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-[10px] uppercase block text-gray-400 font-bold">All</span>
          <span className="text-base font-black">{totalCount}</span>
        </button>
        {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => { setStatusFilter(st); setPage(1); }}
            className={`p-3 rounded-lg border transition ${
              statusFilter === st ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-[10px] uppercase block text-gray-400 font-bold">{st}</span>
            <span className="text-base font-black">{statusCounts[st] || 0}</span>
          </button>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold focus:bg-white"
            >
              <option value="">All Statuses</option>
              {availableStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Return Requested">Return Requested</option>
              <option value="Returned">Returned</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-semibold">Payment:</span>
            <select
              value={paymentStatusFilter}
              onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold focus:bg-white"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-semibold">Method:</span>
            <select
              value={paymentMethodFilter}
              onChange={(e) => { setPaymentMethodFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold focus:bg-white"
            >
              <option value="">All Methods</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Razorpay">Razorpay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium">Loading customer orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status & Pipeline</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const isPaid = order.isPaid || order.paymentStatus === 'paid';
                  const isCancelled = order.orderStatus === 'Cancelled';

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/70 transition">
                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-gray-900 block">
                          #{order.orderId || order._id.slice(-8)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            dateStyle: 'medium',
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">
                          {order.shippingAddress?.name || order.user?.name}
                        </span>
                        <span className="text-[11px] text-gray-500 block">{order.user?.email}</span>
                        <span className="text-[10px] text-gray-400">
                          {order.shippingAddress?.city}, {order.shippingAddress?.phone}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-700">
                          {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                        </span>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                          {order.orderItems[0]?.name}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-black text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-gray-800 block text-[11px]">
                            {order.paymentMethod}
                          </span>
                          <span
                            className={`inline-block font-black uppercase text-[10px] px-2 py-0.5 rounded border ${
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
                              ? 'Paid'
                              : order.paymentStatus === 'refunded'
                              ? 'Refunded'
                              : order.paymentStatus === 'failed'
                              ? 'Failed'
                              : 'Pending'}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            disabled={isCancelled || ['Returned', 'Refunded'].includes(order.orderStatus)}
                            onChange={(e) => openStatusChangeModal(order, e.target.value)}
                            className={`px-2.5 py-1.5 border rounded font-bold text-xs focus:bg-white ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {availableStatuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                            {['Return Requested', 'Returned', 'Refunded'].includes(order.orderStatus) && (
                              <option value={order.orderStatus}>{order.orderStatus}</option>
                            )}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded transition border border-gray-200"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isCancelled && order.orderStatus !== 'Delivered' && (
                            <button
                              onClick={() => setCancelModal({ open: true, order, reason: '', loading: false })}
                              className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded transition border border-gray-200"
                              title="Cancel Order & Restore Stock"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total orders)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 font-semibold"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      {updatingStatusModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900">
              Update Order #{updatingStatusModal.order?.orderId || updatingStatusModal.order?._id.slice(-8)}
            </h3>
            <p className="text-xs text-gray-600">
              Change status from <strong className="text-gray-900">{updatingStatusModal.order?.orderStatus}</strong> to{' '}
              <strong className="text-purple-700">{updatingStatusModal.newStatus}</strong>?
            </p>

            <form onSubmit={handleConfirmStatusChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status Note / Comment (Optional)
                </label>
                <input
                  type="text"
                  value={updatingStatusModal.note}
                  onChange={(e) =>
                    setUpdatingStatusModal((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="e.g. Dispatched with Bluedart Tracking #12345..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setUpdatingStatusModal({ open: false, order: null, newStatus: '', note: '', loading: false })
                  }
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatusModal.loading}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-1.5"
                >
                  {updatingStatusModal.loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Confirm Status Update'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Cancel Order #{cancelModal.order?.orderId || cancelModal.order?._id.slice(-8)}
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to cancel this order as Admin? Product inventory will be restored to MongoDB.
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cancellation Reason
                </label>
                <textarea
                  rows="3"
                  value={cancelModal.reason}
                  onChange={(e) => setCancelModal((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g. Stock unavailable, customer requested cancellation, fake order..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCancelModal({ open: false, order: null, reason: '', loading: false })}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={cancelModal.loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-1.5"
                >
                  {cancelModal.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Order #{selectedOrder.orderId || selectedOrder._id}
                </h2>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Customer & Address */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1.5">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" /> Customer & Shipping
                </h4>
                <p className="font-bold text-gray-800 pt-1">{selectedOrder.shippingAddress?.name}</p>
                <p className="text-gray-600">{selectedOrder.user?.email}</p>
                <p className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" /> {selectedOrder.shippingAddress?.phone}
                </p>
                <p className="text-gray-600 pt-1">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                </p>
              </div>

              {/* Payment & Status */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-purple-600" /> Payment & Status
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-bold text-gray-800">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <span
                    className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                      selectedOrder.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : selectedOrder.paymentStatus === 'refunded'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                {selectedOrder.paymentResult?.razorpay_payment_id && (
                  <p className="text-[10px] text-gray-400 font-mono truncate">
                    Ref: {selectedOrder.paymentResult.razorpay_payment_id}
                  </p>
                )}
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Current Status:</span>
                  <span
                    className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Order Items ({selectedOrder.orderItems.length})
              </h4>
              <div className="divide-y divide-gray-100 border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded border p-0.5 bg-gray-50 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-gray-500 text-[11px]">
                          Price: {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(selectedOrder.itemsPrice)}</span>
              </div>
              {selectedOrder.discountPrice > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount:</span>
                  <span>− {formatCurrency(selectedOrder.discountPrice)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : formatCurrency(selectedOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200 text-sm font-black text-gray-900">
                <span>Grand Total:</span>
                <span>{formatCurrency(selectedOrder.totalPrice)}</span>
              </div>
            </div>

            {/* Timeline Log */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600" /> Timeline Events
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-2 max-h-36 overflow-y-auto">
                  {selectedOrder.timeline.map((ev, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 border-b border-gray-200/50 pb-1.5 last:border-0 last:pb-0">
                      <div>
                        <span className="font-bold text-gray-900">{ev.status}</span>: {ev.message}
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded text-xs font-bold hover:bg-gray-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
