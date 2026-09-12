import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  Sparkles,
  ArrowRight,
  XCircle,
  RotateCcw,
  Printer,
  Calendar,
  Phone,
  User,
  ShieldCheck,
} from 'lucide-react';
import { loadRazorpay } from '../utils/loadRazorpay';
import api from '../services/api';
import { formatCurrency } from '../utils';

const standardSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/orders/${id}`);
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('[Order Load Error]:', err.message);
      setError(err.response?.data?.message || 'Unable to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  // Cancel order handler
  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!order) return;

    try {
      setActionLoading(true);
      const { data } = await api.put(`/orders/${order._id}/cancel`, {
        reason: cancelReason.trim() || 'Cancelled by customer',
      });

      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Order cancelled successfully. Inventory has been updated.',
        });
        setShowCancelModal(false);
        setCancelReason('');
        setOrder(data.order);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel order',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Return request handler
  const handleRequestReturn = async (e) => {
    e.preventDefault();
    if (!order) return;

    if (!returnReason.trim()) {
      setNotification({ type: 'error', message: 'Please provide a reason for return' });
      return;
    }

    try {
      setActionLoading(true);
      const { data } = await api.post(`/orders/${order._id}/return`, {
        reason: returnReason.trim(),
      });

      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Return request submitted successfully. Support team will review shortly.',
        });
        setShowReturnModal(false);
        setReturnReason('');
        setOrder(data.order);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit return request',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Pay Now retry button handler
  const handlePayNow = async () => {
    if (!order) return;

    try {
      setPaymentLoading(true);
      setNotification(null);

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        setNotification({
          type: 'error',
          message: 'Unable to load Razorpay SDK. Please check internet connection.',
        });
        return;
      }

      // Create Razorpay Order
      const { data: rzpData } = await api.post('/payment/create-order', {
        orderId: order._id,
      });

      if (!rzpData.success) {
        throw new Error(rzpData.message || 'Failed to initialize payment');
      }

      const options = {
        key: rzpData.key,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Nexora Online Store',
        description: `Payment for Order #${order.orderId || order._id.slice(-8)}`,
        order_id: rzpData.id,
        prefill: {
          name: rzpData.customer?.name || order.shippingAddress?.name,
          email: rzpData.customer?.email,
          contact: rzpData.customer?.contact || order.shippingAddress?.phone,
        },
        theme: {
          color: '#2874f0',
        },
        handler: async function (response) {
          try {
            setPaymentLoading(true);
            const { data: verifyData } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            if (verifyData.success) {
              setNotification({
                type: 'success',
                message: 'Payment verified and captured successfully!',
              });
              fetchOrderDetails();
            }
          } catch (verifyErr) {
            setNotification({
              type: 'error',
              message: 'Payment verification failed on server.',
            });
          } finally {
            setPaymentLoading(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error('[Pay Now Error]:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Payment initiation failed',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-xs font-semibold">Loading shipment details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500">{error || 'The requested order does not exist or access is denied.'}</p>
        <Link
          to="/orders"
          className="inline-block bg-nexora-blue text-white text-xs font-bold px-6 py-2.5 rounded shadow"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const normalizedStatus = (order.orderStatus || 'Pending').trim();
  const isPaid = order.isPaid || order.paymentStatus?.toLowerCase() === 'paid';
  const isCancelled = normalizedStatus.toLowerCase() === 'cancelled';
  const isReturnFlow = ['return requested', 'returned', 'refunded'].includes(normalizedStatus.toLowerCase());
  
  // Calculate current step index case-insensitively
  const currentStepIdx = standardSteps.findIndex(
    (step) => step.toLowerCase() === normalizedStatus.toLowerCase()
  );

  const canCancel = ['pending', 'confirmed', 'processing'].includes(normalizedStatus.toLowerCase());
  const canReturn = normalizedStatus.toLowerCase() === 'delivered' && (!order.returnDetails || order.returnDetails.status === 'None');

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'return requested':
      case 'returned':
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
      case 'out for delivery':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-nexora-blue border-blue-200';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const timelineList = (order.timeline && order.timeline.length > 0)
    ? order.timeline
    : [
        {
          status: normalizedStatus,
          timestamp: order.createdAt || new Date(),
          message: `Order registered via ${order.paymentMethod === 'Razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (COD)'}`,
        },
      ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto no-scrollbar py-1">
          <Link to="/" className="hover:text-nexora-blue shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/orders" className="hover:text-nexora-blue shrink-0">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-bold text-gray-900 shrink-0">#{order.orderId || order._id}</span>
        </nav>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs self-start sm:self-auto print:hidden"
        >
          <Printer className="w-3.5 h-3.5" /> Print Invoice
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-md text-xs font-semibold flex items-center gap-2 border animate-in fade-in duration-150 print:hidden ${
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

      {/* Main Status & Tracking Stepper Banner */}
      <div className="bg-white rounded-lg shadow-card border border-nexora-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order ID:</span>
              <span className="font-mono font-black text-gray-900 text-sm sm:text-base break-all">#{order.orderId || order._id}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Live Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadgeStyle(
                order.orderStatus
              )}`}
            >
              {order.orderStatus || 'Pending'}
            </span>
          </div>
        </div>

        {/* Tracking Timeline Stepper (Standard Pipeline) */}
        {!isCancelled && !isReturnFlow && (
          <div className="py-4 sm:py-6 px-1 sm:px-2 overflow-x-auto no-scrollbar">
            <div className="min-w-[480px] sm:min-w-0 relative flex items-center justify-between">
              {/* Progress Track Line Background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-gray-200 z-0"></div>
              {/* Active Progress Track Line Fill */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-600 z-0 transition-all duration-500"
                style={{
                  width: `${
                    currentStepIdx >= 0
                      ? Math.min(100, (currentStepIdx / (standardSteps.length - 1)) * 100)
                      : 0
                  }%`,
                }}
              ></div>

              {standardSteps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-xs ${
                        isPassed
                          ? 'bg-green-600 text-white ring-4 ring-green-50'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-500/30 scale-110' : ''}`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] mt-2 text-center font-medium leading-tight max-w-[65px] sm:max-w-[85px] ${
                        isPassed ? 'font-bold text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-xs text-red-800">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">This order has been cancelled.</p>
              {order.cancellation?.reason && (
                <p className="mt-1">
                  Reason: <span className="font-semibold text-gray-900">"{order.cancellation.reason}"</span>
                </p>
              )}
              {order.cancellation?.cancelledAt && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Cancelled on {new Date(order.cancellation.cancelledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              )}
              {order.paymentStatus === 'refunded' && (
                <p className="mt-2 text-green-700 font-bold bg-green-50 p-2 rounded border border-green-200">
                  ✓ Refund of {formatCurrency(order.totalPrice)} has been processed to your original payment method.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Return Flow Banner */}
        {isReturnFlow && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3 text-xs text-purple-900">
            <RotateCcw className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Return Status: {order.returnDetails?.status || order.orderStatus}</p>
              {order.returnDetails?.reason && (
                <p className="mt-1">
                  Return Reason: <span className="font-semibold text-gray-900">"{order.returnDetails.reason}"</span>
                </p>
              )}
              {order.returnDetails?.adminNote && (
                <p className="mt-1 bg-white/70 p-2 rounded border border-purple-100">
                  Admin Note: <span className="font-semibold">{order.returnDetails.adminNote}</span>
                </p>
              )}
              {order.paymentStatus === 'refunded' && (
                <p className="mt-2 text-green-700 font-bold bg-green-50 p-2 rounded border border-green-200">
                  ✓ Return approved and refund of {formatCurrency(order.returnDetails?.refundAmount || order.totalPrice)} completed!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Customer Actions (Cancel / Return) */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 print:hidden">
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded text-xs font-bold transition flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
          )}

          {canReturn && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Request Return
            </button>
          )}
        </div>
      </div>

      {/* Grid: Delivery Address, Payment Details & Price Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-5 space-y-2 text-xs">
          <h3 className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-nexora-blue" /> Delivery Address
          </h3>
          <div className="text-gray-700 space-y-1 pt-1">
            <p className="font-bold text-gray-900">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-1 font-semibold text-gray-800 flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-400" /> {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-5 space-y-3 text-xs">
          <h3 className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-nexora-blue" /> Payment Details
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Method:</span>
              <span className="font-bold text-gray-800">{order.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Status:</span>
              <span
                className={`font-black uppercase text-[11px] px-2 py-0.5 rounded ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : order.paymentStatus === 'refunded'
                    ? 'bg-purple-100 text-purple-800'
                    : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus === 'paid'
                  ? '✓ Paid'
                  : order.paymentStatus === 'refunded'
                  ? 'Refunded'
                  : order.paymentStatus === 'failed'
                  ? 'Failed'
                  : 'Pending'}
              </span>
            </div>

            {isPaid && order.paymentResult?.razorpay_payment_id && (
              <p className="text-[10px] text-gray-400 font-mono truncate">
                Ref: {order.paymentResult.razorpay_payment_id}
              </p>
            )}

            {/* Pay Now Button if Payment is Pending on Razorpay */}
            {!isPaid && order.paymentMethod === 'Razorpay' && !isCancelled && (
              <div className="pt-2 print:hidden">
                <button
                  onClick={handlePayNow}
                  disabled={paymentLoading}
                  className="w-full bg-nexora-orange hover:bg-orange-600 text-white font-bold py-2 px-3 rounded text-xs shadow transition flex items-center justify-center gap-1.5"
                >
                  {paymentLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Pay Now ({formatCurrency(order.totalPrice)})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-5 space-y-2 text-xs">
          <h3 className="font-bold text-gray-900 uppercase tracking-wider">
            Price Breakdown
          </h3>

          <div className="space-y-1.5 pt-1 text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-800">{formatCurrency(order.itemsPrice)}</span>
            </div>
            {order.discountPrice > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>− {formatCurrency(order.discountPrice)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between font-black text-sm text-gray-900">
              <span>Total Amount</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white rounded-lg shadow-card border border-nexora-border p-4 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Ordered Items ({order.orderItems.length})
        </h3>

        <div className="divide-y divide-gray-100">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 text-xs">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded border p-1 bg-gray-50 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{item.name}</h4>
                  <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5">
                    Price: {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-xs sm:text-sm text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Audit History */}
      {timelineList && timelineList.length > 0 && (
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-nexora-blue" /> Order Activity Log & Tracking Timeline
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {timelineList.map((event, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-nexora-blue ring-4 ring-white"></div>
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{event.status}</span>
                    <span className="text-[10px] text-gray-400">
                      {event.timestamp ? new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-0.5">{event.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" /> Cancel Order #{order.orderId || order._id.slice(-8)}
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to cancel this order? Stock items will be restored immediately.
            </p>

            <form onSubmit={handleCancelOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for cancellation
                </label>
                <textarea
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered by mistake, found better price, delivery delay..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 text-purple-700">
              <RotateCcw className="w-5 h-5" /> Request Return for #{order.orderId || order._id.slice(-8)}
            </h3>
            <p className="text-xs text-gray-600">
              Please specify the reason for returning your product. Our return team will arrange pickup.
            </p>

            <form onSubmit={handleRequestReturn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for return <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Defective item, wrong size/color, damaged packaging..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Submit Return Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
