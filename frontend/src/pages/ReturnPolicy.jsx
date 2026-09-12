import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  PackageOpen,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REFUND_MODES = [
  { mode: 'UPI (Google Pay / PhonePe / Paytm)', timeline: 'Instant to 24 Hours', icon: '⚡' },
  { mode: 'Credit / Debit Cards (Visa, Mastercard, RuPay)', timeline: '2 - 4 Business Days', icon: '💳' },
  { mode: 'Net Banking (50+ Supported Banks)', timeline: '2 - 5 Business Days', icon: '🏦' },
  { mode: 'Cash on Delivery (COD)', timeline: 'Instant Nexora Wallet or Bank Transfer', icon: '💵' },
];

const RETURN_STEPS = [
  {
    step: '1',
    title: 'Go to "My Orders"',
    desc: 'Select the delivered item you want to return or replace within 7 days of delivery.',
  },
  {
    step: '2',
    title: 'Choose Return Reason',
    desc: 'Select why you need a return/replacement and attach a quick photo if the item is damaged.',
  },
  {
    step: '3',
    title: 'Doorstep Pickup',
    desc: 'Our courier executive arrives at your address to inspect and pick up the package for free.',
  },
  {
    step: '4',
    title: 'Instant Refund / Replacement',
    desc: 'Once picked up, replacement is dispatched immediately or refund is initiated to your payment source.',
  },
];

const RETURN_FAQS = [
  {
    q: 'How many days do I have to return an item on Nexora?',
    a: 'You can return or request a replacement for eligible products within 7 calendar days from the date of delivery.',
  },
  {
    q: 'Do I have to pay any courier charges for return pickup?',
    a: 'No! Doorstep return pickups are 100% FREE for all eligible orders across India.',
  },
  {
    q: 'What condition should the product be in for a successful return?',
    a: 'The product must be unused, with all original tags, manufacturer seals, manuals, and accessories intact in the original packaging.',
  },
  {
    q: 'Can I choose between replacement and refund?',
    a: 'Yes! For most categories, you can select whether you want a free brand replacement unit or a full refund back to your original payment mode.',
  },
];

const ReturnPolicy = () => {
  const { isAuthenticated } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(0);

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-blue-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 border border-emerald-300/30 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300 mb-4 backdrop-blur-xs">
            <RotateCcw className="w-3.5 h-3.5" /> 7-Day Easy Return & Replacement Guarantee
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Hassle-Free Returns & <br />
            <span className="text-emerald-300">Fast Automated Refunds</span>
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Shop with total confidence. If your purchase doesn’t meet your expectations, is defective, or is the wrong size, return or replace it within 7 days with free doorstep pickup.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={isAuthenticated ? '/orders' : '/login'}
              className="bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-black py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
            >
              <PackageOpen className="w-4 h-4" /> Go to My Orders to Return Item →
            </Link>
            <Link
              to="/customer-care"
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2 transition border border-white/20"
            >
              <HelpCircle className="w-4 h-4" /> Customer Care Assistance
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
        {/* Step-by-Step Return Process */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              How the 7-Day Return Process Works
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Easy 4-step doorstep pickup and resolution
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RETURN_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs mb-3 shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refund Mode & Timelines Table */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Refund Methods & Transfer Timelines
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Payment Method Used</th>
                  <th className="py-3 px-4">Refund Mode</th>
                  <th className="py-3 px-4">Estimated Time to Reflect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {REFUND_MODES.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/60">
                    <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-2">
                      <span>{r.icon}</span>
                      <span>{r.mode}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">Original Source Account</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        {r.timeline}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Return FAQs */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-nexora-blue" />
            Returns & Refunds FAQ
          </h3>

          <div className="divide-y divide-gray-100">
            {RETURN_FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-800 hover:text-emerald-700 gap-2"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
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

export default ReturnPolicy;
