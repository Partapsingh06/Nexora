import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Award,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SELLER_PERKS = [
  {
    icon: DollarSign,
    title: '0% Commission Promo',
    desc: 'Pay 0% platform commission on all eligible orders for your first 30 days.',
  },
  {
    icon: Users,
    title: '10.5M+ Active Shoppers',
    desc: 'Reach high-intent consumers looking to buy daily across 19,000+ PIN codes.',
  },
  {
    icon: Truck,
    title: 'Nexora Express Logistics',
    desc: 'Doorstep pickup from your warehouse and rapid delivery to your buyers.',
  },
  {
    icon: TrendingUp,
    title: '7-Day Fast Payouts',
    desc: 'Timely automated bank transfers directly into your registered bank account.',
  },
];

const SELLER_FAQS = [
  {
    q: 'What documents are required to start selling on Nexora?',
    a: 'You only need a valid Email, Contact Phone, Business Name, Bank Account details for payouts, and GSTIN (if applicable to your product category). Individual artisans can register with PAN.',
  },
  {
    q: 'How does shipping and order pickup work?',
    a: 'When an order is placed, you pack the product. Nexora Express logistics courier partners pick it up directly from your doorstep and deliver it to the buyer.',
  },
  {
    q: 'When do I receive payment for my sold products?',
    a: 'Payments are automatically transferred to your bank account within 7 business days following order delivery completion.',
  },
  {
    q: 'Can I sell my products across multiple categories?',
    a: 'Yes! Once registered, your Seller Hub allows you to list unlimited products across Electronics, Fashion, Home, Beauty, and more.',
  },
];

const BecomeSeller = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    phone: user?.phone || '',
    businessName: '',
    businessType: 'Retailer',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    gstin: '',
    pan: '',
    primaryCategory: 'Electronics',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessData(null);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.businessName
    ) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India',
        },
        gstin: formData.gstin,
        pan: formData.pan,
        primaryCategory: formData.primaryCategory,
      };

      const res = await api.post('/seller/register', payload);

      if (res.data.success) {
        // Save token to localStorage
        localStorage.setItem('nexora_token', res.data.token);
        setSuccessData(res.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Seller registration failed. Please check your details.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-nexora-blue to-indigo-900 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexora-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 px-3 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" /> Nexora Marketplace Seller Onboarding
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
                Sell to <span className="text-nexora-yellow">10.5M+ Customers</span> Across India
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
                Launch your online store on Nexora with 0% commission for 30 days, express doorstep pickups, and fast 7-day automated payouts.
              </p>
            </div>

            {/* Quick Login Link Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-xs text-white min-w-[260px] shadow-xl">
              <div className="text-xs text-blue-200">Already registered as a seller?</div>
              <div className="text-base font-black text-white mt-1">Access Your Seller Hub</div>
              <Link
                to="/seller/login"
                className="mt-3.5 w-full bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs transition shadow-md"
              >
                <Store className="w-4 h-4" /> Seller Hub Login →
              </Link>
            </div>
          </div>

          {/* Perks Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {SELLER_PERKS.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-md text-left"
                >
                  <Icon className="w-6 h-6 text-nexora-yellow mb-2" />
                  <div className="text-sm font-black text-white">{perk.title}</div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-snug">{perk.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form & Content Container */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-nexora-blue text-xs font-bold px-2.5 py-1 rounded-md mb-2">
                <Store className="w-3.5 h-3.5" /> Seller Registration
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Register as a Nexora Seller
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your authorized contact and store details. Your account is automatically activated for instant product listing.
              </p>
            </div>

            {/* Success Modal / Banner */}
            {successData && (
              <div className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <h3 className="text-base font-bold text-emerald-950">
                      Seller Account Created Successfully!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Seller ID:{' '}
                      <span className="font-extrabold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                        {successData.seller?.sellerId}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                      Welcome <strong>{successData.seller?.businessName}</strong>! Your store is active and you can now start listing products and tracking orders.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          window.location.href = '/seller/dashboard';
                        }}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition shadow"
                      >
                        <Store className="w-4 h-4" /> Go to Seller Dashboard
                      </button>
                      <Link
                        to="/products"
                        className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 transition"
                      >
                        Browse Marketplace
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Contact Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Authorized Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Gurpreet Singh"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Seller Email (Login ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. store@business.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: Password & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Create Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Contact Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 3: Store Name & Business Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Store / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Royal Electronics Hub"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Business Model Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    <option value="Retailer">Retailer (Local Shop / Trader)</option>
                    <option value="Wholesaler">Wholesaler / Distributor</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Brand Owner">Direct Brand Owner</option>
                    <option value="Direct Importer">Direct Importer</option>
                    <option value="Artisan / Handcrafted">Artisan / Handcrafted</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Business Address */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Pickup / Business Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. Shop 24, Commercial Complex, Sector 17"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Chandigarh"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Punjab"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 160017"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 5: GSTIN & Primary Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    GSTIN / Tax ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 03AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Primary Product Category
                  </label>
                  <select
                    name="primaryCategory"
                    value={formData.primaryCategory}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    <option value="Electronics">Electronics & Gadgets</option>
                    <option value="Mobiles">Mobiles & Tablets</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty">Beauty & Personal Care</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-nexora-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    'Creating Seller Account...'
                  ) : (
                    <>
                      <Store className="w-4 h-4" /> Complete Registration & Start Selling
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-gray-600">
                Already registered?{' '}
                <Link to="/seller/login" className="text-nexora-blue font-bold hover:underline">
                  Log in to Seller Hub
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: How It Works & FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 3 Step Selling Blueprint */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-nexora-yellow" />
                How to Sell on Nexora in 3 Steps
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexora-yellow text-gray-950 font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Register & List Products</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Create your seller account in 2 minutes and upload your product catalog.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexora-yellow text-gray-950 font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Receive Orders & Ship</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Pack your orders. Nexora Express logistics picks them up from your doorstep.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexora-yellow text-gray-950 font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Fast 7-Day Payouts</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Receive automated bank credits directly into your account every 7 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-blue-200 flex items-center justify-between">
                <span>Seller Desk Helpline:</span>
                <span className="font-bold text-white">seller-support@nexora.com</span>
              </div>
            </div>

            {/* Seller FAQs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-nexora-blue" />
                Frequently Asked Questions
              </h3>

              <div className="divide-y divide-gray-100">
                {SELLER_FAQS.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="py-3">
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
                        <p className="mt-2 text-[11px] text-gray-600 leading-relaxed pl-1 animate-in fade-in duration-150">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
