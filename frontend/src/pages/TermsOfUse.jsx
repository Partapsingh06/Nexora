import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Scale,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const TermsOfUse = () => {
  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-blue-300 mb-4 backdrop-blur-xs">
            <FileText className="w-3.5 h-3.5" /> Legal Terms & Platform Agreement
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Terms of Use & Consumer Agreement
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Please read these terms carefully before using the Nexora electronic commerce platform, mobile applications, or marketplace services.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-8 text-xs leading-relaxed text-gray-700">
          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">1. Platform Membership & Eligibility</h2>
            <p>
              Use of the Nexora platform is available only to persons who can form legally binding contracts under the Indian Contract Act, 1872. You are responsible for maintaining the confidentiality of your account credentials and OTP codes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">2. Pricing, Invoicing & Orders</h2>
            <p>
              All prices listed on Nexora are in Indian Rupees (INR) inclusive of applicable GST taxes. Orders are confirmed upon dispatch notification. We reserve the right to cancel orders arising from typographical pricing errors or system inventory synchronization delays with immediate full refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">3. 7-Day Replacement & Return Policy</h2>
            <p>
              Items delivered with physical defects or mismatch are eligible for return or replacement within 7 calendar days of receipt in accordance with our published Return Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-gray-900">4. Intellectual Property & Trademark Protection</h2>
            <p>
              All trademarks, product designs, website UI assets, and logos are property of Nexora Internet Private Limited or their respective brand licensors.
            </p>
          </section>

          <section className="space-y-2 border-t border-gray-100 pt-6">
            <h2 className="text-base font-black text-gray-900">5. Governing Law & Dispute Jurisdiction</h2>
            <p>
              These Terms of Use shall be governed by and interpreted in accordance with the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
