import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  MapPin,
  Sparkles,
  ArrowRight,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { loadRazorpay } from '../utils/loadRazorpay';
import api from '../services/api';
import { formatCurrency } from '../utils';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, buyNowItem, setBuyNowItem, fetchCart } = useCart();
  const navigate = useNavigate();

  // Active items for this checkout session
  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (itemsToCheckout.length === 0) {
      navigate('/cart');
    }
  }, [itemsToCheckout, navigate]);

  // Calculate order totals
  let calculatedItemsPrice = 0;
  let calculatedOriginalPrice = 0;

  itemsToCheckout.forEach((item) => {
    const p = item.product;
    if (p) {
      const price = Number(p.price || item.price);
      const originalPrice = Number(p.originalPrice || price);
      const qty = Number(item.quantity);
      calculatedItemsPrice += price * qty;
      calculatedOriginalPrice += originalPrice * qty;
    }
  });

  const discountTotal = Math.max(0, calculatedOriginalPrice - calculatedItemsPrice);
  const deliveryCharge = calculatedItemsPrice > 0 && calculatedItemsPrice < 500 ? 40 : 0;
  const totalAmount = calculatedItemsPrice + deliveryCharge;

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate address fields
    if (!address.name || !address.phone || !address.street || !address.city || !address.postalCode) {
      setErrorMessage('Please complete all required delivery address fields');
      return;
    }

    try {
      setLoading(true);

      // 1. Format order payload
      const orderPayload = {
        orderItems: itemsToCheckout.map((item) => ({
          product: item.product._id || item.product,
          name: item.product.name,
          image: item.product.images?.[0] || 'https://via.placeholder.com/150',
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod,
      };

      // 2. Create MongoDB Order (Source of Truth)
      const orderRes = await api.post('/orders', orderPayload);
      if (!orderRes.data.success || !orderRes.data.order) {
        throw new Error(orderRes.data.message || 'Failed to create order');
      }

      const createdOrder = orderRes.data.order;
      // Clear buy now state if active
      if (buyNowItem) {
        setBuyNowItem(null);
      }
      // Refresh cart state
      fetchCart();

      // 3. Handle Payment Method Branching
      if (paymentMethod === 'COD') {
        navigate(`/order-success/${createdOrder._id}`);
        return;
      }

      // Razorpay Flow
      const isScriptLoaded = await loadRazorpay();
      if (!isScriptLoaded) {
        setErrorMessage('Failed to load Razorpay SDK. Please check your internet connection.');
        navigate(`/orders/${createdOrder._id}`);
        return;
      }

      // Create Razorpay Order on server
      const rzpOrderRes = await api.post('/payment/create-order', {
        orderId: createdOrder._id,
      });

      if (!rzpOrderRes.data.success) {
        throw new Error(rzpOrderRes.data.message || 'Failed to initialize payment');
      }

      const rzpData = rzpOrderRes.data;

      // Open Razorpay Checkout Modal
      const options = {
        key: rzpData.key,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Nexora Online Store',
        description: `Payment for Order #${createdOrder._id.slice(-6)}`,
        order_id: rzpData.id,
        prefill: {
          name: rzpData.customer?.name || address.name,
          email: rzpData.customer?.email || user?.email,
          contact: rzpData.customer?.contact || address.phone,
        },
        theme: {
          color: '#2874f0',
        },
        handler: async function (response) {
          try {
            setLoading(true);
            // Server-side cryptographic signature verification
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });

            if (verifyRes.data.success) {
              navigate(`/order-success/${createdOrder._id}`);
            } else {
              setErrorMessage('Payment verification failed on server.');
              navigate(`/orders/${createdOrder._id}`);
            }
          } catch (verifyErr) {
            console.error('[Payment Verification Error]:', verifyErr);
            navigate(`/orders/${createdOrder._id}`);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            // Customer closed modal - navigate to order details for retry
            navigate(`/orders/${createdOrder._id}`);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (failRes) {
        console.error('[Razorpay Payment Failed]:', failRes.error);
        navigate(`/orders/${createdOrder._id}`);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('[Checkout Error]:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Order processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto no-scrollbar py-1">
        <Link to="/" className="hover:text-nexora-blue shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/cart" className="hover:text-nexora-blue shrink-0">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-bold text-gray-900 shrink-0">Secure Checkout</span>
      </nav>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Form: Address & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-md shadow-card border border-nexora-border overflow-hidden">
            <div className="bg-nexora-blue text-white p-3.5 px-5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-nexora-blue flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Delivery Address</span>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={address.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength="10"
                  value={address.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  placeholder="e.g. 9876543210"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Flat, House No., Street, Area *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  placeholder="e.g. 402, Sunshine Apartments, 5th Main"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">City / District *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  placeholder="e.g. Bengaluru"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Pincode *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  maxLength="6"
                  value={address.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  placeholder="e.g. 560001"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Order Items Summary */}
          <div className="bg-white rounded-md shadow-card border border-nexora-border overflow-hidden">
            <div className="bg-nexora-blue text-white p-3.5 px-5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-nexora-blue flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>Order Summary ({itemsToCheckout.length} items)</span>
            </div>

            <div className="p-4 divide-y divide-gray-100">
              {itemsToCheckout.map((item, idx) => {
                const p = item.product;
                return (
                  <div key={idx} className="py-3 flex items-center gap-3 sm:gap-4 text-xs">
                    <img
                      src={p.images?.[0] || 'https://via.placeholder.com/80'}
                      alt={p.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded border p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{p.name}</h4>
                      <p className="text-gray-500 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-gray-900 text-xs sm:text-sm">
                        {formatCurrency(p.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Payment Options */}
          <div className="bg-white rounded-md shadow-card border border-nexora-border overflow-hidden">
            <div className="bg-nexora-blue text-white p-3.5 px-5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-nexora-blue flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>Payment Options</span>
            </div>

            <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
              {/* Razorpay Card Option */}
              <label
                className={`p-3.5 sm:p-4 rounded-md border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'Razorpay'
                    ? 'border-nexora-blue bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-nexora-blue focus:ring-nexora-blue"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm text-gray-900">
                    <CreditCard className="w-4 h-4 text-nexora-blue shrink-0" />
                    <span>Razorpay (Cards, UPI, Net Banking, Wallets)</span>
                    <span className="bg-green-100 text-green-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px]">
                    100% Secure payment processing with instant confirmation via UPI, Google Pay, PhonePe, Cards & Netbanking.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery Option */}
              <label
                className={`p-3.5 sm:p-4 rounded-md border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-nexora-blue bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-nexora-blue focus:ring-nexora-blue"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm text-gray-900">
                    <Banknote className="w-4 h-4 text-gray-700 shrink-0" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-gray-500 text-[11px]">
                    Pay cash or UPI directly to the courier agent upon doorstep package arrival.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Price Details & Place Order */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-md shadow-card border border-nexora-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-xs uppercase tracking-wider text-gray-500">
              Price Details
            </div>

            <div className="p-5 space-y-3.5 text-xs text-gray-700">
              <div className="flex items-center justify-between">
                <span>Items Price</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(calculatedOriginalPrice || calculatedItemsPrice)}
                </span>
              </div>

              {discountTotal > 0 && (
                <div className="flex items-center justify-between text-green-700 font-medium">
                  <span>Discount</span>
                  <span>− {formatCurrency(discountTotal)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-700 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-900">{formatCurrency(deliveryCharge)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-dashed border-gray-200 flex items-baseline justify-between text-sm font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-lg">{formatCurrency(totalAmount)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="pt-2 text-xs text-green-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-green-700" />
                  <span>You are saving {formatCurrency(discountTotal)} on this purchase</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-nexora-orange hover:bg-orange-600 text-white font-extrabold text-sm py-3.5 px-4 rounded shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <span>{paymentMethod === 'Razorpay' ? 'Proceed to Pay' : 'Confirm & Place Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-md shadow-card border border-nexora-border text-xs text-gray-500">
            <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Safe and Secure 256-Bit SSL encrypted payments powered by Razorpay.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
