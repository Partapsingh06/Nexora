import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Package,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../services/api';

const SAMPLE_PINCODES = [
  { pin: '110001', label: 'New Delhi' },
  { pin: '560001', label: 'Bengaluru' },
  { pin: '160017', label: 'Chandigarh' },
  { pin: '400001', label: 'Mumbai' },
  { pin: '700001', label: 'Kolkata' },
];

const SHIPPING_TIERS = [
  {
    tier: 'Nexora Same Day / Next Day Express',
    coverage: 'Top Metro Cities (Bengaluru, Delhi NCR, Mumbai, Hyderabad, Chandigarh)',
    timeline: 'Within 24 Hours',
    cost: 'FREE on orders > ₹499',
    badge: 'Fastest',
  },
  {
    tier: 'Standard Express Surface',
    coverage: 'Tier 1 & Tier 2 Cities across 19,000+ PIN Codes',
    timeline: '2 - 3 Business Days',
    cost: 'FREE on orders > ₹499',
    badge: 'Pan-India',
  },
  {
    tier: 'Remote & Special Economic Zones',
    coverage: 'North-East, Island territories & Hilly terrains',
    timeline: '4 - 5 Business Days',
    cost: 'FREE on orders > ₹499',
    badge: 'Reliable',
  },
];

const DELIVERY_FAQS = [
  {
    q: 'How does Nexora offer Express Delivery across 19,000+ PIN codes?',
    a: 'We operate a multi-node automated fulfillment network with regional warehouse hubs across India in direct partnership with BlueDart, Delhivery, and Nexora Express fleets.',
  },
  {
    q: 'What are the shipping charges on Nexora?',
    a: 'All orders with a cart value of ₹499 and above enjoy 100% FREE express shipping. For smaller orders below ₹499, a flat delivery fee of ₹40 applies.',
  },
  {
    q: 'What is Open Box Delivery?',
    a: 'For high-value electronics and smartphones, the delivery partner will unpack the sealed box in front of you so you can verify the physical condition before sharing your delivery OTP.',
  },
  {
    q: 'How do I track my dispatched order?',
    a: 'Visit "My Orders" in your profile and click "Track Order". You will see live map checkpoints and delivery agent contact details.',
  },
];

const DeliveryInfo = () => {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [pincodeResult, setPincodeResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleCheckPincode = async (codeToTest) => {
    const code = (codeToTest || pincode).trim();
    setErrorMsg('');
    setPincodeResult(null);

    if (!/^\d{6}$/.test(code)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setChecking(true);
    try {
      const res = await api.get(`/delivery/check-pincode?pincode=${code}`);
      if (res.data.success) {
        setPincodeResult(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to verify PIN code serviceability.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-blue-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 px-3.5 py-1 rounded-full text-xs font-bold text-nexora-amber mb-4 backdrop-blur-xs">
            <Truck className="w-3.5 h-3.5" /> Express Delivery & Logistics Network
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Lightning Express Delivery <br />
            <span className="text-nexora-yellow">Across 19,000+ PIN Codes</span>
          </h1>

          <p className="text-gray-200 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Delivering millions of smiles daily with next-day dispatch, automated real-time GPS tracking, Open-Box verification, and 100% Free Shipping on orders above ₹499.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/orders"
              className="bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
            >
              <Package className="w-4 h-4" /> Track Active Orders →
            </Link>
            <Link
              to="/products"
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2 transition border border-white/20"
            >
              <Truck className="w-4 h-4" /> Start Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
        {/* Interactive PIN Code Checker Card */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md mb-2">
              <MapPin className="w-3.5 h-3.5 text-nexora-amber" /> Live PIN Code Availability Checker
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              Check Delivery Speed for Your Area
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your 6-digit delivery postal code to check estimated delivery timelines and COD options.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 110001)"
                  className="w-full pl-9 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>

              <button
                onClick={() => handleCheckPincode(pincode)}
                disabled={checking}
                className="px-6 py-3 bg-nexora-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {checking ? (
                  'Checking...'
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Check PIN Code
                  </>
                )}
              </button>
            </div>

            {/* Sample Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] text-gray-500">Try popular cities:</span>
              {SAMPLE_PINCODES.map((s) => (
                <button
                  key={s.pin}
                  onClick={() => {
                    setPincode(s.pin);
                    handleCheckPincode(s.pin);
                  }}
                  className="text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-nexora-blue border border-gray-200 px-2.5 py-1 rounded-md font-semibold transition"
                >
                  {s.label} ({s.pin})
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Live Serviceability Result Card */}
            {pincodeResult && (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-emerald-950">
                        PIN Code {pincodeResult.pincode} ({pincodeResult.city}, {pincodeResult.state}) is Serviceable!
                      </h4>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                        <div className="text-[10px] text-gray-500 font-medium">Estimated Arrival</div>
                        <div className="font-black text-emerald-700 text-xs mt-0.5">
                          {pincodeResult.estimatedDelivery}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                        <div className="text-[10px] text-gray-500 font-medium">Shipping Cost</div>
                        <div className="font-black text-emerald-700 text-xs mt-0.5">
                          FREE (on orders &gt; ₹499)
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                        <div className="text-[10px] text-gray-500 font-medium">Cash on Delivery (COD)</div>
                        <div className="font-black text-emerald-700 text-xs mt-0.5">
                          {pincodeResult.codAvailable ? '✓ Available at Doorstep' : 'Prepaid Only'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Shipping Tiers Table */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-nexora-blue" />
            Nexora Delivery Tiers & Timelines
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Delivery Speed Tier</th>
                  <th className="py-3 px-4">Coverage Region</th>
                  <th className="py-3 px-4">Estimated Time</th>
                  <th className="py-3 px-4">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SHIPPING_TIERS.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {t.tier}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{t.coverage}</td>
                    <td className="py-3.5 px-4 font-semibold text-nexora-blue">{t.timeline}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">{t.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Delivery FAQs */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-nexora-blue" />
            Shipping & Delivery FAQ
          </h3>

          <div className="divide-y divide-gray-100">
            {DELIVERY_FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-800 hover:text-nexora-blue gap-2"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-nexora-blue shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed pl-1 animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeliveryInfo;
