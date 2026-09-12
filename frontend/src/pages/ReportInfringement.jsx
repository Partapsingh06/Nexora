import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  Building2,
  Mail,
  Phone,
  Scale,
  Lock,
  ArrowRight,
} from 'lucide-react';

const ReportInfringement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brandName: '',
    infringementType: 'Trademark Infringement',
    productUrl: '',
    ipRegNumber: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.brandName || !formData.description) {
      setErrorMsg('Please provide your name, official email, brand name, and violation description.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSuccessNotice({
        noticeId: `NX-IPR-${Date.now().toString().slice(-6)}`,
        email: formData.email,
        brand: formData.brandName,
      });
      setSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        brandName: '',
        infringementType: 'Trademark Infringement',
        productUrl: '',
        ipRegNumber: '',
        description: '',
      });
    }, 600);
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-red-300 mb-4 backdrop-blur-xs">
            <Scale className="w-3.5 h-3.5" /> Intellectual Property Protection Cell
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Report Intellectual Property <br />
            <span className="text-red-400">Infringement & Takedown</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Nexora is committed to removing infringing products. If you are a copyright, trademark, or patent holder and believe a seller is violating your rights, submit a notice below for immediate review.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                Submit an Infringement Notice
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Our Legal & Compliance Cell investigates and removes confirmed infringing listings within 24 to 48 business hours.
              </p>
            </div>

            {successNotice && (
              <div className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-950">
                      Infringement Notice Logged
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Case Reference ID:{' '}
                      <span className="font-extrabold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                        {successNotice.noticeId}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                      Thank you. An acknowledgment has been generated for <strong>{successNotice.brand}</strong> at <strong>{successNotice.email}</strong>. Our grievance team will review the flagged product and notify you of the takedown status.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Complainant Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Adv. Rohit Deshmukh"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Official / Corporate Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="legal@brandowner.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Brand / IP Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g. Sony Corporation"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Type of Violation
                  </label>
                  <select
                    name="infringementType"
                    value={formData.infringementType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    <option value="Trademark Infringement">Trademark / Logo Violation</option>
                    <option value="Copyright Infringement">Copyrighted Images / Text</option>
                    <option value="Counterfeit Goods">Suspected Counterfeit / Fake Product</option>
                    <option value="Design / Patent Violation">Design Patent Infringement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nexora Product Link or Product ID
                  </label>
                  <input
                    type="text"
                    name="productUrl"
                    value={formData.productUrl}
                    onChange={handleChange}
                    placeholder="e.g. /products/64d9f... or Product Name"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    IP Registration / Trademark Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="ipRegNumber"
                    value={formData.ipRegNumber}
                    onChange={handleChange}
                    placeholder="e.g. TM-982189-IN"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Specific Violation Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain why this listing infringes your rights, proof of ownership, or details of unauthorized distributor..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting Notice...' : 'Submit Takedown Notice'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Grievance Officer Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-600" />
                Designated Grievance Officer
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                In accordance with the Information Technology Act 2000 and rules made thereunder, the contact details of the Grievance Officer are:
              </p>

              <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200/70">
                <div>
                  <span className="font-bold text-gray-900">Name:</span> Rajat Verma
                </div>
                <div>
                  <span className="font-bold text-gray-900">Designation:</span> Head of Legal & Grievance Redressal
                </div>
                <div>
                  <span className="font-bold text-gray-900">Email:</span>{' '}
                  <a href="mailto:grievance-officer@nexora.com" className="text-nexora-blue underline">
                    grievance-officer@nexora.com
                  </a>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Address:</span> Nexora Internet Pvt Ltd, Outer Ring Road, Bengaluru, 560103
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900 text-xs space-y-2">
              <h4 className="font-bold text-sm text-nexora-blue flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> 24-48 Hour SLA Guarantee
              </h4>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                All genuine complaints are reviewed by legal experts and infringing seller catalogs are disabled with immediate effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportInfringement;
