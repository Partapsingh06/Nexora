import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  Award,
  Users,
  TrendingUp,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ArrowRight,
  Globe2,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const METRICS = [
  { label: 'Active Shoppers', value: '10.5M+', desc: 'Across all Indian states' },
  { label: 'Verified Sellers', value: '150,000+', desc: 'Empowering Indian businesses' },
  { label: 'PIN Codes Covered', value: '19,000+', desc: 'Pan-India logistics network' },
  { label: 'Orders Delivered', value: '50M+', desc: 'With 99.4% on-time rate' },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Quality',
    desc: 'Direct manufacturer sourcing and tamper-evident hologram packaging for zero counterfeit tolerance.',
  },
  {
    icon: Zap,
    title: 'Lightning Express Speed',
    desc: 'Next-day fulfillment powered by smart regional warehousing and automated dispatch hubs.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer Obsession',
    desc: '24x7 dedicated human assistance with seamless 7-day hassle-free returns and instant refunds.',
  },
  {
    icon: TrendingUp,
    title: 'Seller Growth First',
    desc: 'Empowering local retailers, artisans, and manufacturers with 0% promotional commissions and modern seller tools.',
  },
];

const TIMELINE = [
  {
    year: '2022',
    title: 'The Inception',
    desc: 'Founded with a mission to deliver Flipkart/Amazon-grade commerce with hyper-personalized shopping.',
  },
  {
    year: '2023',
    title: 'Pan-India Expansion',
    desc: 'Expanded express logistics network across 19,000+ postal codes with automated hub fulfillment.',
  },
  {
    year: '2024',
    title: 'Marketplace Scaling',
    desc: 'Surpassed 10 Million active monthly shoppers and onboarded 150,000+ certified brand sellers.',
  },
  {
    year: '2026',
    title: 'Next-Gen Commerce',
    desc: 'Pioneering AI-assisted search, AR previews, biometric 1-swipe checkout, and express delivery.',
  },
];

const AboutUs = () => {
  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-nexora-blue to-indigo-900 text-white py-16 px-4 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexora-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 px-3.5 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" /> Shaping the Future of Indian Commerce
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Empowering Millions of <br />
            <span className="text-nexora-yellow">Shoppers & Businesses Daily</span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Nexora is India’s fastest growing online marketplace engineered to deliver verified authentic products, lightning express doorstep logistics, and transparent seller growth.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" /> Explore Marketplace Catalog →
            </Link>
            <Link
              to="/become-seller"
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2 transition border border-white/20"
            >
              <TrendingUp className="w-4 h-4" /> Join as a Seller
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-12">
        {/* Metric Highlights */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-center sm:text-left"
            >
              <div className="text-3xl font-black text-nexora-blue">{m.value}</div>
              <div className="text-xs font-bold text-gray-900 mt-1">{m.label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{m.desc}</div>
            </div>
          ))}
        </section>

        {/* Our Mission & Story */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-nexora-blue">
                Our Story & Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Building Commerce for India’s Next Billion Shoppers
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Founded with a bold vision to eliminate counterfeit gray-market goods and delivery delays, Nexora unites world-class technology with India’s deepest logistics network.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                From metro cities to remote rural pincodes, we enable equal access to authentic electronics, fashion, lifestyle, and household essentials at the lowest guaranteed prices with 7-day hassle-free replacements.
              </p>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md space-y-4 text-xs">
              <h3 className="text-base font-bold text-nexora-yellow flex items-center gap-2">
                <Globe2 className="w-5 h-5" /> Pan-India Trust Network
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Genuine seal on every dispatched carton</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free doorstep pickups for returns across 19,000+ PIN codes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24x7 real human customer support hotline</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-gray-900">Our Core Pillars</h2>
            <p className="text-xs text-gray-500 mt-1">
              The fundamental principles that guide every decision at Nexora
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-nexora-blue flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 mb-1.5">{val.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Our Journey of Continuous Innovation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE.map((t, idx) => (
              <div key={idx} className="relative border-l-2 border-nexora-blue pl-4 py-2">
                <div className="text-xs font-black text-nexora-blue mb-1">{t.year}</div>
                <h4 className="text-sm font-bold text-gray-900">{t.title}</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
