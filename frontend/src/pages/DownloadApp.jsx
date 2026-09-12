import React, { useState } from 'react';
import {
  Smartphone,
  Sparkles,
  Zap,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Gift,
  QrCode,
  Layers,
  ShoppingBag,
  Star,
  Check,
  ArrowRight,
  Send,
  Compass,
} from 'lucide-react';
import api from '../services/api';

const APP_FEATURES = [
  {
    icon: Zap,
    title: 'Lightning 1-Swipe Checkout',
    desc: 'Biometric fingerprint / Face ID instant checkout with pre-saved addresses and default payment methods.',
  },
  {
    icon: Bell,
    title: 'Instant Flash Sale Alerts',
    desc: 'Be the first to know about 50%-80% off flash deals, price drop alerts on your wishlist items, and limited restocks.',
  },
  {
    icon: Compass,
    title: 'Live GPS Courier Tracking',
    desc: 'Follow your delivery executive on a live map in real time as your package arrives at your doorstep.',
  },
  {
    icon: Gift,
    title: 'App-Exclusive Rewards & Coins',
    desc: 'Earn 2x Nexora SuperCoins on every purchase and redeem for free gift cards and extra cashback discounts.',
  },
];

const DownloadApp = () => {
  const [contact, setContact] = useState('');
  const [platform, setPlatform] = useState('both');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!contact.trim()) {
      setErrorMessage('Please enter your email or 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/app-launch/notify', {
        contact: contact.trim(),
        platform,
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message);
        setContact('');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to register notification. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Showcase Header */}
      <div className="bg-gradient-to-r from-blue-950 via-nexora-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexora-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header Description */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 px-3 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Mobile Shopping Experience
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Shop Smarter, Faster & Anywhere with the <span className="text-nexora-yellow">Nexora App</span>
              </h1>

              <p className="text-blue-100 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
                We are crafting a blazing fast mobile application engineered for seamless browsing, 1-click checkout, AR previews, and exclusive mobile-only flash discounts.
              </p>

              {/* Status Notice Badge */}
              <div className="mt-6 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-semibold text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>Status: In Final Beta Testing — Launching Soon on Android & iOS</span>
              </div>

              {/* App Store Coming Soon Cards */}
              <div className="flex flex-wrap gap-4 mt-8">
                {/* Google Play Card */}
                <div className="bg-gray-900/90 border border-white/20 px-5 py-3 rounded-xl flex items-center gap-3.5 shadow-lg">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-7 h-7 fill-current text-emerald-400" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.036 2.036 0 0 1-.61-.318c-.286-.24-.499-.586-.499-1.026V3.158c0-.44.213-.786.5-.98.175-.12.38-.246.608-.364zM15.207 13.414l2.586 2.586-11.83 6.83 9.244-9.416zm0-2.828L5.963 1.17l11.83 6.83-2.586 2.586zm1.414 1.414l3.657 2.112c1.02.59 1.02 1.554 0 2.144l-3.657 2.112-2.122-2.122 2.122-4.246z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-medium">Coming Soon to</div>
                    <div className="text-sm font-black text-white">Google Play Store</div>
                  </div>
                </div>

                {/* Apple App Store Card */}
                <div className="bg-gray-900/90 border border-white/20 px-5 py-3 rounded-xl flex items-center gap-3.5 shadow-lg">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.36-.57.65-1.07 1.71-.93 2.73 1.01.08 2.03-.5 2.65-1.24z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-medium">Coming Soon to</div>
                    <div className="text-sm font-black text-white">Apple App Store</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Phone Preview Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 sm:w-72 bg-gray-900 border-4 border-gray-800 rounded-[36px] p-3 shadow-2xl relative">
                {/* Phone Speaker Notch */}
                <div className="w-24 h-4 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-900 mr-2" />
                  <div className="w-8 h-1.5 bg-gray-700 rounded-full" />
                </div>

                {/* Simulated Screen UI */}
                <div className="bg-slate-100 rounded-[26px] overflow-hidden text-gray-900 text-xs shadow-inner">
                  {/* Mock App Header */}
                  <div className="bg-nexora-blue text-white p-3 flex items-center justify-between">
                    <span className="font-extrabold text-sm italic">Nexora App</span>
                    <span className="bg-nexora-yellow text-gray-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                      BETA v1.0
                    </span>
                  </div>

                  {/* Mock Body */}
                  <div className="p-3 space-y-2.5">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2.5 rounded-lg">
                      <div className="font-black text-[11px]">⚡ VIP Flash Sale</div>
                      <div className="text-[9px] opacity-90">Up to 70% Off on Electronics</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-2xs text-center">
                        <div className="w-10 h-10 bg-blue-50 rounded mx-auto mb-1 flex items-center justify-center text-nexora-blue font-bold">
                          📱
                        </div>
                        <div className="font-bold text-[10px] truncate">Mobiles</div>
                        <div className="text-[9px] text-emerald-600 font-bold">From ₹6,999</div>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-2xs text-center">
                        <div className="w-10 h-10 bg-blue-50 rounded mx-auto mb-1 flex items-center justify-center text-nexora-blue font-bold">
                          🎧
                        </div>
                        <div className="font-bold text-[10px] truncate">Audio Gear</div>
                        <div className="text-[9px] text-emerald-600 font-bold">From ₹999</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 text-blue-900 text-[10px]">
                      <div className="font-bold flex items-center gap-1">
                        <Gift className="w-3 h-3 text-nexora-blue" /> Launch Benefit Reserved
                      </div>
                      <div className="text-gray-600 mt-0.5">₹500 Off Coupon for pre-registered users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Lead Capture Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md mb-2">
                <Gift className="w-3.5 h-3.5" /> Exclusive Launch Perks
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Get Notified When App Launches
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Be the first to download the app and receive a reserved <strong>flat ₹500 welcome discount voucher</strong> directly in your inbox or SMS.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs animate-in fade-in duration-150 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">You are on the VIP Launch List!</h4>
                  <p className="mt-1 text-emerald-800">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleNotifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Email Address or Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter your email (e.g. name@domain.com) or 10-digit mobile"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Your Device Platform Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'both', label: '📱 Both / All Devices' },
                    { id: 'android', label: '🤖 Android Only' },
                    { id: 'ios', label: '🍏 iOS / iPhone' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`py-2.5 px-3 rounded-lg border text-center font-bold text-xs transition ${
                        platform === p.id
                          ? 'border-nexora-blue bg-blue-50 text-nexora-blue ring-1 ring-blue-400'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-nexora-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    'Registering...'
                  ) : (
                    <>
                      <Bell className="w-4 h-4" /> Notify Me on Launch + Claim ₹500 Coupon
                    </>
                  )}
                </button>
              </div>

              {/* VIP Benefits list */}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flat ₹500 off welcome voucher code on first app order</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Year FREE Express Delivery on all orders</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Early access to Flipkart/Amazon-grade Big Billion Sale drops</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Features Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-nexora-blue" />
                Why You'll Love the Nexora App
              </h3>

              <div className="space-y-3.5">
                {APP_FEATURES.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-blue-50/40 transition flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-nexora-blue flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick QR Pre-Register Card */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-950 text-white rounded-2xl p-6 shadow-md flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-white">Scan to Bookmark</h4>
                <p className="text-[11px] text-gray-300 mt-1">
                  Scan with your mobile camera to open Nexora mobile web instantly.
                </p>
                <div className="mt-3 inline-block bg-nexora-yellow text-gray-950 font-black text-[10px] px-2 py-0.5 rounded">
                  PWA Ready
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl text-gray-900 shrink-0">
                <QrCode className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
