import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Award,
  CheckCircle2,
  Send,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Search,
  Smartphone,
} from 'lucide-react';
import api from '../services/api';

const AD_FORMATS = [
  {
    icon: Search,
    title: 'Sponsored Search Ads',
    desc: 'Appear at the very top of search results when buyers search for your product category or keywords.',
    roas: '4.2x Avg ROAS',
    badge: 'High Intent',
  },
  {
    icon: Layers,
    title: 'Homepage Top Banners',
    desc: 'Massive brand visibility on Nexora’s homepage visited by millions of high-spending shoppers every day.',
    roas: '3.6x Brand Lift',
    badge: 'Maximum Reach',
  },
  {
    icon: Zap,
    title: 'Deal of the Day Spotlight',
    desc: 'Feature your exclusive promotions prominently in top flash sale ribbons and lightning deal sections.',
    roas: '5.1x Conversion Boost',
    badge: 'High Conversion',
  },
  {
    icon: Smartphone,
    title: 'Category & Checkout Placements',
    desc: 'Target high-intent shoppers directly on complementary category pages and post-add-to-cart recommendation grids.',
    roas: '3.9x Avg ROAS',
    badge: 'Targeted',
  },
];

const METRICS = [
  { label: 'Active Shoppers', value: '10.5M+', sub: 'High purchasing intent' },
  { label: 'Avg ROAS', value: '3.8x', sub: 'Across top brands' },
  { label: 'Pincodes Covered', value: '19,000+', sub: 'Pan-India reach' },
  { label: 'Monthly Pageviews', value: '250M+', sub: 'Engaged audience' },
];

const Advertise = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    phone: '',
    adGoal: 'Sponsored Search Ads',
    budget: '₹50,000 - ₹2,00,000 / month',
    websiteUrl: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
      !formData.businessName ||
      !formData.phone ||
      !formData.message
    ) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/advertise/inquiry', formData);
      if (res.data.success) {
        setSuccessData(res.data.data);
        setFormData({
          name: '',
          email: '',
          businessName: '',
          phone: '',
          adGoal: 'Sponsored Search Ads',
          budget: '₹50,000 - ₹2,00,000 / month',
          websiteUrl: '',
          message: '',
        });
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to submit inquiry. Please check your network connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-950 via-blue-950 to-nexora-blue text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-nexora-yellow mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" /> Nexora Advertising Network (NAN)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Scale Your Brand with <span className="text-nexora-yellow">Nexora Ads</span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-lg mt-4 max-w-2xl leading-relaxed">
            Reach over 10.5 Million high-intent shoppers across India at the exact moment they are looking to buy. Get industry-leading ROAS and hyper-targeted ad placements.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {METRICS.map((m, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-lg text-left"
              >
                <div className="text-2xl sm:text-3xl font-black text-nexora-yellow">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">
                  {m.label}
                </div>
                <div className="text-[10px] text-blue-200 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-nexora-blue text-xs font-bold px-2.5 py-1 rounded-md mb-2">
                <Target className="w-3.5 h-3.5" /> Business & Vendor Inquiry
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Submit Your Advertising Inquiry
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Tell us about your brand and advertising goals. Our Growth Strategy Team will prepare a customized proposal within 24 hours.
              </p>
            </div>

            {successData && (
              <div className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-950">
                      Inquiry Received Successfully!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Inquiry Reference ID:{' '}
                      <span className="font-extrabold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                        {successData.inquiryId}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-700 mt-2">
                      Thank you, <strong>{successData.name}</strong> from <strong>{successData.businessName}</strong>. A dedicated Nexora Ad Strategist will contact you at <strong>{successData.email}</strong> and <strong>{successData.phone}</strong>.
                    </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Business / Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ads@yourcompany.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Company / Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Lumina Audio Technologies"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Primary Advertising Goal
                  </label>
                  <select
                    name="adGoal"
                    value={formData.adGoal}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    <option value="Sponsored Search Ads">Sponsored Search Ads (Keywords)</option>
                    <option value="Homepage Banner Showcase">Homepage Banner Showcase</option>
                    <option value="Brand Spotlight Campaign">Brand Spotlight Campaign</option>
                    <option value="Category Top Placement">Category Top Placement</option>
                    <option value="Video & Interactive Ads">Video & Interactive Ads</option>
                    <option value="Custom Enterprise Package">Custom Enterprise Package</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Estimated Monthly Budget
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    <option value="₹10,000 - ₹50,000 / month">₹10,000 - ₹50,000 / month (Starter)</option>
                    <option value="₹50,000 - ₹2,00,000 / month">₹50,000 - ₹2,00,000 / month (Growth)</option>
                    <option value="₹2,00,000 - ₹10,00,000 / month">₹2,00,000 - ₹10,00,000 / month (Scale)</option>
                    <option value="₹10,00,000+ / month">₹10,00,000+ / month (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Brand Website / Catalog Link (Optional)
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourbrand.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Campaign Details & Products <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the products you wish to promote, your target audience, launch timelines, or specific performance targets..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-nexora-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    'Processing Inquiry...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Advertising Inquiry
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  We respect your privacy. No spam guarantee.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Why Advertise & Formats (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ad Placements Showcase */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-nexora-blue" />
                High-Performance Ad Formats
              </h3>

              <div className="space-y-3">
                {AD_FORMATS.map((fmt, idx) => {
                  const Icon = fmt.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-blue-50/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xs text-gray-900">
                          <Icon className="w-4 h-4 text-nexora-blue" />
                          {fmt.title}
                        </div>
                        <span className="bg-blue-100 text-nexora-blue text-[9px] font-black px-1.5 py-0.5 rounded">
                          {fmt.roas}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        {fmt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Step Process Card */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-nexora-yellow" />
                How to Get Started
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexora-yellow text-gray-950 font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Submit Your Inquiry</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Fill the form with your brand goals and budget tier.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexora-yellow text-gray-950 font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Custom Growth Plan</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Your assigned Growth Specialist provides keyword and placement blueprint.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexora-yellow text-gray-950 font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Launch & Multiply Sales</h4>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Watch your products appear in front of millions of active shoppers with real-time analytics.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-blue-200 flex items-center justify-between">
                <span>Direct Ad Desk:</span>
                <span className="font-bold text-white">ads@nexora.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;
