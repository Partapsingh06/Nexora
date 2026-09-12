import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${orderId}`);
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('[Order Fetch Error]:', err.message);
        setError('Unable to load order confirmation details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-xs font-semibold">Confirming your order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Order Information Unavailable</h2>
        <p className="text-xs text-gray-500">{error || 'Order record could not be found'}</p>
        <Link
          to="/orders"
          className="inline-block bg-nexora-blue text-white text-xs font-bold px-6 py-2.5 rounded shadow"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  const isRazorpay = order.paymentMethod === 'Razorpay';
  const isPaid = order.isPaid || order.paymentStatus === 'paid';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Success Hero Card */}
      <div className="bg-white rounded-lg shadow-card border border-nexora-border p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-green-800 bg-green-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Order ID: <strong className="text-gray-800 font-mono">#{order.orderId || order._id}</strong>
          </p>
        </div>

        {/* Payment Confirmation Badge */}
        <div className="inline-flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 text-xs text-gray-700">
          <CreditCard className="w-4 h-4 text-nexora-blue" />
          <span>Payment Method: <strong>{order.paymentMethod}</strong></span>
          <span className="text-gray-300">|</span>
          <span
            className={`font-bold ${
              isPaid ? 'text-green-700' : 'text-amber-700'
            }`}
          >
            {isPaid ? '✓ Payment Verified' : 'Payment Status: Cash on Delivery Pending'}
          </span>
        </div>

        {isRazorpay && order.paymentResult?.razorpay_payment_id && (
          <p className="text-[11px] text-gray-400 font-mono">
            Transaction Ref: {order.paymentResult.razorpay_payment_id}
          </p>
        )}
      </div>

      {/* Order Info & Items Breakdown */}
      <div className="bg-white rounded-lg shadow-card border border-nexora-border divide-y divide-gray-100 overflow-hidden">
        
        {/* Header grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider">Delivery To</span>
            <p className="font-bold text-gray-900 mt-0.5">{order.shippingAddress.name}</p>
            <p className="text-gray-600 text-[11px] mt-0.5">
              {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-500 text-[11px]">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div>
            <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider">Estimated Delivery</span>
            <p className="font-bold text-green-700 mt-0.5">Tomorrow, by 9:00 PM</p>
            <p className="text-gray-500 text-[11px]">Standard Express Delivery</p>
          </div>

          <div>
            <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider">Total Amount</span>
            <p className="text-lg font-black text-gray-900 mt-0.5">{formatCurrency(order.totalPrice)}</p>
            <p className="text-gray-500 text-[11px]">Inclusive of all taxes & delivery fees</p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Items in this Shipment ({order.orderItems.length})
          </h3>

          <div className="divide-y divide-gray-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded border p-1 bg-gray-50"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-gray-500 text-[11px]">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/products"
            className="w-full sm:w-auto text-center px-6 py-2.5 border border-gray-300 rounded font-bold text-xs text-gray-700 hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>

          <Link
            to={`/orders/${order.orderId || order._id}`}
            className="w-full sm:w-auto text-center px-6 py-2.5 bg-nexora-blue text-white rounded font-bold text-xs hover:bg-nexora-darkBlue shadow transition flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
