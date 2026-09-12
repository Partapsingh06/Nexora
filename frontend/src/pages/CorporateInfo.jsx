import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const COMPLIANCE_ITEMS = [
  {
    title: 'EPR & Electronic Waste Compliance',
    desc: 'Authorized under Central Pollution Control Board (CPCB) guidelines for responsible collection, handling, and recycling of e-waste materials.',
  },
  {
    title: 'PCI-DSS Level 1 Payment Security',
    desc: 'Certified payment security ensuring bank-grade tokenization and zero plaintext storage of debit/credit card CVVs.',
  },
  {
    title: 'ISO 27001 Information Security',
    desc: 'Strict information management systems protecting consumer and vendor records with 256-Bit SSL encryption.',
  },
  {
    title: 'Consumer Protection (E-Commerce) Rules',
    desc: 'Strict adherence to India Consumer Protection Act 2019 and Legal Metrology (Packaged Commodities) standards.',
  },
];

const CorporateInfo = () => {
  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-blue-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
            <Building2 className="w-3.5 h-3.5" /> Corporate Overview & Legal Governance
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Corporate Information & <br />
            <span className="text-nexora-yellow">Regulatory Governance</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Official statutory details, corporate registration, compliance disclosures, and registered address for Nexora Internet Private Limited.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
        {/* Statutory Details Card */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                Company Registration & Registered Office
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Official entity information and registered corporate headquarters
              </p>
            </div>
            <span className="bg-blue-100 text-nexora-blue text-[10px] font-black px-2.5 py-1 rounded uppercase">
              Incorporated in India
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4 bg-gray-50/70 p-5 rounded-xl border border-gray-200/80">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Legal Entity Name</span>
                <p className="text-sm font-black text-gray-900 mt-0.5">
                  Nexora Internet Private Limited
                </p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold">
                  Corporate Identification Number (CIN)
                </span>
                <p className="text-xs font-mono font-bold text-nexora-blue mt-0.5">
                  U51109KA2024PTC000000
                </p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Main Nature of Business</span>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">
                  B2C / B2B Electronic Commerce Platform & Logistics Technology Services
                </p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Statutory Auditor & Legal Counsel</span>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">
                  Deloitte Haskins & Sells LLP / Nexora Legal Cell
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50/70 p-5 rounded-xl border border-gray-200/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-nexora-blue shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Registered Office Address</span>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium mt-0.5">
                    Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
                    Outer Ring Road, Devarabeesanahalli Village,<br />
                    Bengaluru, 560103, Karnataka, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Corporate Helpline Telephone</span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    <a href="tel:08045470000" className="hover:text-nexora-blue transition underline">
                      080-4547-0000
                    </a>{' '}
                    / <a href="tel:18002089898" className="hover:text-nexora-blue transition underline">
                      1800-208-9898
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Official Communications Email</span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    <a href="mailto:support@nexora.com" className="hover:text-nexora-blue transition underline">
                      support@nexora.com
                    </a>{' '}
                    / corporate@nexora.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Compliance Disclosures */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Statutory & Environmental Compliance Disclosures
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {COMPLIANCE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1"
              >
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-600 leading-relaxed pl-6">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CorporateInfo;
