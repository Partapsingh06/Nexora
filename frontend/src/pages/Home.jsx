import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Tag,
} from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch featured products, top deals, and newest items concurrently
        const [featuredRes, dealsRes, topRatedRes] = await Promise.all([
          api.get('/products?featured=true&limit=6'),
          api.get('/products?limit=8&sort=price-low'),
          api.get('/products?limit=8&sort=rating'),
        ]);

        if (featuredRes.data.success) {
          setFeaturedProducts(featuredRes.data.products || []);
        }
        if (dealsRes.data.success) {
          setDealsProducts(dealsRes.data.products || []);
        }
        if (topRatedRes.data.success) {
          setTopRatedProducts(topRatedRes.data.products || []);
        }
      } catch (err) {
        console.error('[Home Products Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Category Bar */}
      <CategoryBar />

      {/* 2. Hero Promotional Slider */}
      <HeroSlider />

      {/* 3. Featured Products Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-nexora-border overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-transparent">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-nexora-blue text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nexora-yellow fill-nexora-yellow" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">
                  Featured Nexora Picks
                </h2>
                <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">Handpicked flagship tech, audio & smart appliances</p>
              </div>
            </div>

            <Link
              to="/products?featured=true"
              className="bg-nexora-blue hover:bg-nexora-darkBlue text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-sm shadow-xs flex items-center gap-0.5 sm:gap-1 transition shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-3 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No featured products listed yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Promotional Deal Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-nexora-orange to-red-600 rounded-lg p-4 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
          <div className="space-y-1.5 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
              <Tag className="w-3 h-3" /> Special Bank Offer
            </div>
            <h3 className="text-lg sm:text-2xl font-black">Get 10% Instant Cashback with Nexora Pay</h3>
            <p className="text-xs text-amber-100 max-w-xl">
              Applicable on all electronics, mobile accessories, fashion orders over ₹2,499. No coupon code required.
            </p>
          </div>

          <Link
            to="/products"
            className="bg-white text-gray-900 hover:bg-gray-100 text-xs font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-md shadow-md transition whitespace-nowrap z-10 flex items-center gap-2"
          >
            <span>Shop Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Background shapes */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* 5. Best Deals & Trending Products Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-nexora-border overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-transparent">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-nexora-orange text-white flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">
                  Best Value Deals
                </h2>
                <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">Unbeatable prices on bestselling items</p>
              </div>
            </div>

            <Link
              to="/products?sort=price-low"
              className="bg-nexora-orange hover:bg-orange-600 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-sm shadow-xs flex items-center gap-0.5 sm:gap-1 transition shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-3 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : dealsProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {dealsProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No deals listed currently.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Top Customer Rated Recommendations */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-nexora-border overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-transparent">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">
                  Top Customer Rated
                </h2>
                <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1">Highest rated products with 4.5+ star verified reviews</p>
              </div>
            </div>

            <Link
              to="/products?sort=rating"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-sm shadow-xs flex items-center gap-0.5 sm:gap-1 transition shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-3 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : topRatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {topRatedProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No rated products available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
