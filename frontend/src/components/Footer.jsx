import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-nexora-dark text-gray-400 text-xs mt-auto border-t border-gray-800">
      
      {/* Top Value Proposition Bar */}
      <div className="bg-gray-950/80 border-b border-gray-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <Link to="/authenticity" className="flex flex-col sm:flex-row items-center gap-3 hover:opacity-90 transition group">
            <div className="p-2.5 rounded-full bg-blue-900/40 text-nexora-blue border border-blue-800/50 group-hover:bg-blue-800/60 transition">
              <Award className="w-5 h-5 text-nexora-yellow" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs group-hover:text-nexora-yellow transition">100% Authentic</h4>
              <p className="text-[11px] text-gray-400">Directly from verified brands</p>
            </div>
          </Link>

          <Link to="/return-policy" className="flex flex-col sm:flex-row items-center gap-3 hover:opacity-90 transition group">
            <div className="p-2.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 group-hover:bg-emerald-800/60 transition">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs group-hover:text-emerald-300 transition">7 Days Easy Return</h4>
              <p className="text-[11px] text-gray-400">Hassle-free refunds & replacement</p>
            </div>
          </Link>

          <Link to="/delivery-info" className="flex flex-col sm:flex-row items-center gap-3 hover:opacity-90 transition group">
            <div className="p-2.5 rounded-full bg-amber-900/40 text-nexora-amber border border-amber-800/50 group-hover:bg-amber-800/60 transition">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs group-hover:text-amber-300 transition">Express Delivery</h4>
              <p className="text-[11px] text-gray-400">Across 19,000+ pincodes in India</p>
            </div>
          </Link>

          <Link to="/customer-care" className="flex flex-col sm:flex-row items-center gap-3 hover:opacity-90 transition group">
            <div className="p-2.5 rounded-full bg-purple-900/40 text-purple-400 border border-purple-800/50 group-hover:bg-purple-800/60 transition">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs group-hover:text-purple-300 transition">24x7 Customer Support</h4>
              <p className="text-[11px] text-gray-400">Dedicated assistance anytime</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-gray-800">
          
          {/* Column 1: About */}
          <div>
            <h4 className="text-gray-200 font-bold uppercase text-[11px] tracking-wider mb-3">About Nexora</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/about-us" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/become-seller" className="hover:text-nexora-yellow font-semibold transition">Become a Seller</Link></li>
              <li><Link to="/advertise" className="hover:text-nexora-yellow font-semibold transition">Advertise on Nexora</Link></li>
              <li><Link to="/download-app" className="hover:text-nexora-yellow font-semibold transition">Download App</Link></li>
              <li><Link to="/stories" className="hover:text-white transition">Nexora Stories</Link></li>
              <li><Link to="/corporate-info" className="hover:text-white transition">Corporate Information</Link></li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h4 className="text-gray-200 font-bold uppercase text-[11px] tracking-wider mb-3">Help Center</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/customer-care" className="hover:text-white transition">24x7 Customer Care</Link></li>
              <li><Link to="/delivery-info" className="hover:text-white transition">Shipping & Delivery</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition">Cancellation & Returns</Link></li>
              <li><Link to="/customer-care" className="hover:text-white transition">FAQ & Support Tickets</Link></li>
              <li><Link to="/report-infringement" className="hover:text-white transition">Report Infringement</Link></li>
            </ul>
          </div>

          {/* Column 3: Consumer Policy */}
          <div>
            <h4 className="text-gray-200 font-bold uppercase text-[11px] tracking-wider mb-3">Consumer Policy</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/authenticity" className="hover:text-white transition">100% Authenticity Guarantee</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition">7-Day Return Policy</Link></li>
              <li><Link to="/delivery-info" className="hover:text-white transition">Express Delivery Terms</Link></li>
              <li><Link to="/security-trust" className="hover:text-white transition">Security & Trust</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="hover:text-white transition">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Column 4: Mail Us */}
          <div className="border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-6">
            <h4 className="text-gray-200 font-bold uppercase text-[11px] tracking-wider mb-3">Mail Us</h4>
            <p className="text-[11px] leading-relaxed text-gray-400">
              Nexora Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India
            </p>
          </div>

          {/* Column 5: Registered Office */}
          <div className="border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-6">
            <h4 className="text-gray-200 font-bold uppercase text-[11px] tracking-wider mb-3">Registered Office</h4>
            <p className="text-[11px] leading-relaxed text-gray-400 space-y-1">
              <span>CIN: <strong className="text-gray-300 font-mono">U51109KA2024PTC000000</strong></span><br />
              <span>
                Telephone:{' '}
                <a href="tel:08045470000" className="text-nexora-yellow font-semibold hover:underline">
                  080-4547-0000
                </a>
              </span><br />
              <span>
                Email:{' '}
                <a href="mailto:support@nexora.com" className="text-gray-300 hover:text-white hover:underline">
                  support@nexora.com
                </a>
              </span>
            </p>
            <div className="mt-2 text-[10px] text-gray-500 bg-gray-900/80 p-1.5 rounded border border-gray-800">
              ⚡ Demo Marketplace & Engineering Showcase
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4 text-center sm:text-left text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base italic flex items-center gap-1">
              Nexora <ShoppingBag className="w-4 h-4 text-nexora-yellow fill-nexora-yellow inline" />
            </span>
            <span>© {new Date().getFullYear()} Nexora.com — All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-gray-300 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-nexora-yellow" /> 256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-nexora-yellow" /> Flipkart-Grade Experience
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
