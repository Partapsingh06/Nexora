import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  ShieldCheck,
  FileText,
  UserCheck,
  Eye,
  Database,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-blue-300 mb-4 backdrop-blur-xs">
            <Lock className="w-3.5 h-3.5" /> Privacy & Consumer Data Protection
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Nexora Privacy Policy
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Last Updated: September 2026. We value the trust you place in us and insist upon the highest standards for secure transactions and consumer information privacy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-8 text-xs leading-relaxed text-gray-700">
          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">1. Information We Collect</h2>
            <p>
              When you use our marketplace website or mobile application, we collect and store your personal information provided by you from time to time. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
              <li><strong>Contact Information:</strong> Name, verified email address, mobile number, and delivery street address.</li>
              <li><strong>Transaction Data:</strong> Ordered items, billing address, payment mode, and order identifiers. (We do NOT store credit/debit card CVV or PIN numbers).</li>
              <li><strong>Technical Data:</strong> IP address, operating system, browser type, and anonymous session cookies to remember cart items.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">2. How We Use Your Information</h2>
            <p>
              We use personal information to fulfill orders, facilitate doorstep logistics dispatch, resolve customer care tickets, prevent fraudulent transactions, and send order status notifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">3. Information Sharing & Third Parties</h2>
            <p>
              We do NOT sell, rent, or trade your personal data to marketing brokers. Your data is shared strictly with authorized service providers necessary to fulfill your purchases:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
              <li><strong>Logistics Partners:</strong> BlueDart, Delhivery, and Nexora Express for order pickup and delivery.</li>
              <li><strong>Payment Aggregators:</strong> RBI-licensed payment gateways for encrypted transaction settlement.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">4. Your Data Rights & Choices</h2>
            <p>
              You have the right to access, review, modify, or request deletion of your account and personal information at any time from your Profile settings or by contacting our 24x7 Support Desk.
            </p>
          </section>

          <section className="space-y-2 border-t border-gray-100 pt-6">
            <h2 className="text-base font-black text-gray-900">5. Grievance & Data Protection Officer</h2>
            <p>
              In accordance with the Digital Personal Data Protection Act and Information Technology Rules, queries may be directed to:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2 space-y-1">
              <p><strong>Officer Name:</strong> Rajat Verma, Data Protection Officer</p>
              <p><strong>Email:</strong> <a href="mailto:privacy@nexora.com" className="text-nexora-blue underline">privacy@nexora.com</a> / <a href="mailto:support@nexora.com" className="text-nexora-blue underline">support@nexora.com</a></p>
              <p><strong>Address:</strong> Nexora Internet Pvt Ltd, Embassy Tech Village, Outer Ring Road, Bengaluru, 560103, Karnataka, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
