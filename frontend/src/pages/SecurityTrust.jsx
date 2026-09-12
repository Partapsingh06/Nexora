import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  KeyRound,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';

const SECURITY_PILLARS = [
  {
    icon: Lock,
    title: '256-Bit SSL End-to-End Encryption',
    desc: 'Every communication between your web browser and our servers is encrypted using bank-grade TLS 1.3 / 256-bit SSL protocols.',
  },
  {
    icon: CreditCard,
    title: 'PCI-DSS Level 1 Payment Gateways',
    desc: 'We never store raw card numbers, PINs, or CVVs. All transactions are securely processed through RBI-authorized payment aggregators.',
  },
  {
    icon: KeyRound,
    title: 'Two-Factor OTP Authentication',
    desc: 'Account logins, phone updates, and delivery confirmations require one-time authentication passwords sent directly to your registered mobile.',
  },
  {
    icon: FileCheck2,
    title: 'Proactive Fraud Detection AI',
    desc: 'Automated machine learning algorithms monitor transactions 24x7 to flag suspicious checkout activities and protect your funds.',
  },
];

const SecurityTrust = () => {
  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 px-3.5 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Nexora Trust & Cyber Security Center
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Bank-Grade Security & <br />
            <span className="text-nexora-yellow">Consumer Data Protection</span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Your safety and privacy are our top priorities. Discover how Nexora safeguards your account, payment details, and personal data with industry-leading encryption standards.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
        {/* Security Pillars */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-nexora-blue flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-1.5">{p.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Safety Guidelines for Shoppers */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Safety Tips & Scam Prevention Guidelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5">
              <h4 className="font-bold text-gray-900">Never Share Your OTP</h4>
              <p className="text-gray-600 leading-relaxed">
                Nexora employees will never ask for your SMS OTP, credit card CVV, or UPI PIN over phone or WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5">
              <h4 className="font-bold text-gray-900">Verify Official Links</h4>
              <p className="text-gray-600 leading-relaxed">
                Always ensure you are shopping on official `nexora.com` domains with valid SSL lock icons in your address bar.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5">
              <h4 className="font-bold text-gray-900">Open-Box Verification</h4>
              <p className="text-gray-600 leading-relaxed">
                Inspect physical sealed boxes before providing your delivery verification OTP to delivery agents.
              </p>
            </div>
          </div>
        </section>

        {/* Support Link */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Have a security question or suspect suspicious activity?</h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Our 24x7 Cyber Trust team is available around the clock.
            </p>
          </div>
          <Link
            to="/customer-care"
            className="px-6 py-2.5 bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black rounded-lg text-xs transition shadow whitespace-nowrap"
          >
            Contact Security Desk →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecurityTrust;
