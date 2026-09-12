import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  Eye,
  Check,
  X,
  IndianRupee,
  Package,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils';

const AdminReturns = () => {
  const [returnOrders, setReturnOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Return Action Modal
  const [actionModal, setActionModal] = useState({
    open: false,
    order: null,
    targetStatus: '',
    adminNote: '',
    refundAmount: '',
    loading: false,
  });

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders?orderStatus=all');
      if (data.success) {
        // Filter orders that have return activity
        const returns = (data.orders || []).filter(
          (o) =>
            ['Return Requested', 'Returned', 'Refunded'].includes(o.orderStatus) ||
            (o.returnDetails && o.returnDetails.status && o.returnDetails.status !== 'None')
        );
        setReturnOrders(returns);
      }
    } catch (err) {
      console.error('[Fetch Returns Error]:', err.message);
      setNotification({ type: 'error', message: 'Failed to fetch returns data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const openActionModal = (order, targetStatus) => {
    setActionModal({
      open: true,
      order,
      targetStatus,
      adminNote: '',
      refundAmount: order.returnDetails?.refundAmount || order.totalPrice,
      loading: false,
    });
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    const { order, targetStatus, adminNote, refundAmount } = actionModal;
    if (!order || !targetStatus) return;

    try {
      setActionModal((prev) => ({ ...prev, loading: true }));
      const { data } = await api.put(`/orders/${order._id}/return-status`, {
        returnStatus: targetStatus,
        adminNote: adminNote.trim(),
        refundAmount: Number(refundAmount) || order.totalPrice,
      });

      if (data.success) {
        setNotification({
          type: 'success',
          message: `Return request marked as ${targetStatus}`,
        });
        setActionModal({
          open: false,
          order: null,
          targetStatus: '',
          adminNote: '',
          refundAmount: '',
          loading: false,
        });
        fetchReturns();
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to process return action',
      });
      setActionModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const filteredReturns = returnOrders.filter((o) => {
    const retStatus = o.returnDetails?.status || o.orderStatus;
    const matchSearch =
      o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.returnDetails?.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter ? retStatus === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const getReturnBadge = (status) => {
    switch (status) {
      case 'Refunded':
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Picked Up':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Requested':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-purple-600" />
            Customer Returns & Refunds
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Approve returns, schedule pickups, issue refunds, and restore product stock automatically.
          </p>
        </div>

        <button
          onClick={fetchReturns}
          className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition self-start sm:self-auto"
          title="Refresh returns"
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

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search return by Order ID, customer, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-semibold">Return Stage:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold focus:bg-white"
          >
            <option value="">All Return Stages</option>
            <option value="Requested">Requested</option>
            <option value="Approved">Approved</option>
            <option value="Picked Up">Picked Up</option>
            <option value="Refunded">Refunded</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading returns...</p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500">
            No active return requests found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Order & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Return Reason</th>
                  <th className="py-3.5 px-4">Refund Amount</th>
                  <th className="py-3.5 px-4">Return Stage</th>
                  <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReturns.map((order) => {
                  const retStatus = order.returnDetails?.status || 'Requested';

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-gray-900 block">
                          #{order.orderId || order._id.slice(-8)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.returnDetails?.requestedAt
                            ? new Date(order.returnDetails.requestedAt).toLocaleDateString('en-IN')
                            : new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">
                          {order.shippingAddress?.name || order.user?.name}
                        </span>
                        <span className="text-[11px] text-gray-500">{order.user?.email}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-800 line-clamp-2 max-w-xs">
                          "{order.returnDetails?.reason || 'No reason provided'}"
                        </p>
                        {order.returnDetails?.adminNote && (
                          <p className="text-[10px] text-purple-700 mt-0.5">
                            Note: {order.returnDetails.adminNote}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-black text-gray-900">
                        {formatCurrency(order.returnDetails?.refundAmount || order.totalPrice)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block font-black uppercase text-[10px] px-2.5 py-1 rounded-full border ${getReturnBadge(
                            retStatus
                          )}`}
                        >
                          {retStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {retStatus === 'Requested' && (
                            <>
                              <button
                                onClick={() => openActionModal(order, 'Approved')}
                                className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-bold border border-blue-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openActionModal(order, 'Rejected')}
                                className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded font-bold border border-red-200"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {retStatus === 'Approved' && (
                            <button
                              onClick={() => openActionModal(order, 'Picked Up')}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded font-bold border border-indigo-200"
                            >
                              Mark Picked Up
                            </button>
                          )}

                          {retStatus === 'Picked Up' && (
                            <button
                              onClick={() => openActionModal(order, 'Refunded')}
                              className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded font-bold border border-green-200 flex items-center gap-1"
                            >
                              <IndianRupee className="w-3 h-3" /> Issue Refund
                            </button>
                          )}

                          {['Refunded', 'Completed', 'Rejected'].includes(retStatus) && (
                            <span className="text-[11px] text-gray-400 italic">Resolved</span>
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
      </div>

      {/* Return Action Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900">
              Update Return for Order #{actionModal.order?.orderId || actionModal.order?._id.slice(-8)}
            </h3>
            <p className="text-xs text-gray-600">
              Set return workflow status to <strong className="text-purple-700">{actionModal.targetStatus}</strong>.
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              {actionModal.targetStatus === 'Refunded' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Refund Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={actionModal.refundAmount}
                    onChange={(e) =>
                      setActionModal((prev) => ({ ...prev, refundAmount: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white"
                    required
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Product stock will be automatically restored into database inventory.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Admin Note (Optional)
                </label>
                <textarea
                  rows="3"
                  value={actionModal.adminNote}
                  onChange={(e) =>
                    setActionModal((prev) => ({ ...prev, adminNote: e.target.value }))
                  }
                  placeholder="e.g. Item received in original box, refund approved to customer wallet..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setActionModal({
                      open: false,
                      order: null,
                      targetStatus: '',
                      adminNote: '',
                      refundAmount: '',
                      loading: false,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionModal.loading}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-1.5"
                >
                  {actionModal.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
