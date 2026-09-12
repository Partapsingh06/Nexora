import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Sparkles, ArrowRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    badge: 'Mega Electronics Festival',
    title: 'Flagship Smartphones & Laptops',
    subtitle: 'Up to 45% OFF on Apple, Samsung, Sony & Dell with No Cost EMI',
    bgGradient: 'from-blue-900 via-indigo-900 to-blue-950',
    accentColor: 'text-yellow-400',
    btnBg: 'bg-nexora-orange hover:bg-orange-600',
    link: '/products?category=electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    badge: 'Mobile Bonanza Deals',
    title: 'Next-Gen 5G Powerhouses',
    subtitle: 'Extra ₹5,000 Exchange Bonus on iPhone 15 & Galaxy S24 Series',
    bgGradient: 'from-slate-900 via-blue-900 to-indigo-950',
    accentColor: 'text-amber-300',
    btnBg: 'bg-nexora-amber hover:bg-amber-600',
    link: '/products?category=mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    badge: 'Grand Fashion Season',
    title: 'Trendy Ethnic & Casual Apparel',
    subtitle: 'Flat 50-80% OFF on Top Brands Peter England, Biba, Levi\'s & more',
    bgGradient: 'from-purple-950 via-indigo-900 to-slate-900',
    accentColor: 'text-pink-300',
    btnBg: 'bg-pink-600 hover:bg-pink-700',
    link: '/products?category=fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    badge: 'Home & Kitchen Upgrades',
    title: 'Smart Living Essentials',
    subtitle: 'Transform your space with cookware, Philips smart lights & 4K TVs',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    accentColor: 'text-emerald-300',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const slide = bannerSlides[currentSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-hidden select-none">
      <div
        className={`w-full rounded-lg bg-gradient-to-r ${slide.bgGradient} text-white shadow-md relative min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex items-center transition-all duration-500 overflow-hidden`}
      >
        {/* Background Overlay image */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-25 md:opacity-50 pointer-events-none overflow-hidden">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent hidden md:block"></div>
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-xl p-5 sm:p-10 md:p-12 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white border border-white/20">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-nexora-yellow fill-nexora-yellow" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight drop-shadow-sm">
            {slide.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
            {slide.subtitle}
          </p>

          <div className="pt-1 sm:pt-2">
            <Link
              to={slide.link}
              className={`inline-flex items-center gap-2 ${slide.btnBg} text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-md shadow-lg transition transform hover:-translate-y-0.5`}
            >
              <span>Explore Offers</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>

        {/* Previous & Next Control Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-11 sm:w-10 sm:h-16 bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white rounded-r flex items-center justify-center transition z-20"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-11 sm:w-10 sm:h-16 bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white rounded-l flex items-center justify-center transition z-20"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
