import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
  PackageCheck,
  Building2,
  BadgeCheck,
  ArrowRight,
  HelpCircle,
  ShoppingBag,
  RefreshCcw,
  Zap,
} from 'lucide-react';

const PILLARS = [
  {
    icon: Building2,
    title: 'Direct Brand Procurement',
    desc: 'Every single unit is sourced directly from certified original equipment manufacturers (OEMs) and brand-authorized national distributors.',
    badge: '100% Direct',
  },
  {
    icon: QrCode,
    title: 'Tamper-Evident Holograms',
    desc: 'Products are dispatched with Nexora Verified hologram seals and scanned serial numbers to prevent any tampering during transit.',
    badge: 'Serialized',
  },
  {
    icon: PackageCheck,
    title: 'Dual Quality Inspection',
    desc: 'Our automated fulfillment centers inspect packaging integrity, batch codes, and seal conditions prior to express dispatch.',
    badge: 'Lab Tested',
  },
  {
    icon: BadgeCheck,
    title: '100% Official Warranty',
    desc: 'Your Nexora tax invoice is recognized as official proof of purchase at all brand authorized service centers across India.',
    badge: 'Full Warranty',
  },
];

const VERIFIED_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'boAt',
  'Nike',
  'Puma',
  'Adidas',
  'Philips',
  'LG',
  'OnePlus',
  'Levi\'s',
  'JBL',
];

const Authenticity = () => {
  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-nexora-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexora-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 px-3.5 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
            <Award className="w-3.5 h-3.5" /> Nexora Authenticity & Quality Promise
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            100% Authentic Products. <br />
            <span className="text-nexora-yellow">Directly from Verified Brands.</span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            At Nexora, we have zero tolerance for counterfeit products. We guarantee that every smartphone, gadget, fashion apparel, and appliance is 100% authentic, sealed, and backed by manufacturer warranty.
          </p>

          {/* Money Back Badge */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-nexora-yellow text-gray-950 flex items-center justify-center font-black text-lg shrink-0">
              200%
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Authenticity Guarantee</h4>
              <p className="text-xs text-blue-200">
                200% Money-Back Promise if any product is proven counterfeit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
        {/* 4 Pillars Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              How We Ensure 100% Genuine Quality
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Our multi-stage verification pipeline guarantees flawless product authenticity from warehouse to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-nexora-blue flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-nexora-blue px-2 py-0.5 rounded">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-gray-900 mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Brand Partners Showcase */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authorized Brand Partners
            </div>
            <h3 className="text-xl font-black text-gray-900">
              Over 1,500+ Top National & Global Brands
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Direct tie-ups and certified storefronts ensure you always get genuine original stock.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {VERIFIED_BRANDS.map((brand, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 text-center hover:border-blue-200 hover:bg-blue-50/30 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-gray-800">{brand}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Self-Verification Guide Card */}
        <section className="bg-gradient-to-r from-gray-900 to-blue-950 text-white rounded-2xl p-8 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-nexora-yellow">
                Buyer Protection Tips
              </span>
              <h3 className="text-2xl font-black">
                How to verify your product upon delivery
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                1. Inspect the unbroken Nexora security tape on the outer carton.<br />
                2. Verify the manufacturer barcode and serial number on the product box.<br />
                3. Download your official GST Tax Invoice from "My Orders" for all warranty claims.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to="/products"
                className="w-full text-center bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <ShoppingBag className="w-4 h-4" /> Shop Authentic Products
              </Link>
              <Link
                to="/customer-care"
                className="w-full text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-white/20"
              >
                <HelpCircle className="w-4 h-4" /> Report Authenticity Query
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Authenticity;
