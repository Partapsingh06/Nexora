import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Sparkles,
  Star,
  RefreshCw,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';

const pricePresets = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹2,000', min: '0', max: '2000' },
  { label: '₹2,000 - ₹10,000', min: '2000', max: '10000' },
  { label: '₹10,000 - ₹30,000', min: '10000', max: '30000' },
  { label: '₹30,000 - ₹75,000', min: '30000', max: '75000' },
  { label: 'Above ₹75,000', min: '75000', max: '' },
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & meta
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Mobile filters drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Brand search input filter state
  const [brandSearch, setBrandSearch] = useState('');

  // Current query state from URL params
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const featured = searchParams.get('featured') || '';

  // Custom price range inputs state
  const [customMin, setCustomMin] = useState(minPrice);
  const [customMax, setCustomMax] = useState(maxPrice);

  // Keep custom price inputs synced if URL param changes
  useEffect(() => {
    setCustomMin(minPrice);
    setCustomMax(maxPrice);
  }, [minPrice, maxPrice]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('[Categories Load Error]:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all distinct brands from real product catalog on mount
  useEffect(() => {
    const fetchCatalogBrands = async () => {
      try {
        const { data } = await api.get('/products?limit=1000');
        if (data.success && Array.isArray(data.products)) {
          const uniqueBrands = Array.from(
            new Set(
              data.products
                .map((p) => p.brand?.trim())
                .filter((b) => Boolean(b) && typeof b === 'string' && b.length > 0)
            )
          ).sort((a, b) => a.localeCompare(b));
          setAllBrands(uniqueBrands);
        }
      } catch (err) {
        console.error('[Brands Fetch Error]:', err.message);
      }
    };
    fetchCatalogBrands();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `/products?page=${currentPage}&limit=12`;
        if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;
        if (selectedBrand) url += `&brand=${encodeURIComponent(selectedBrand)}`;
        if (minPrice && !isNaN(Number(minPrice))) url += `&minPrice=${encodeURIComponent(minPrice)}`;
        if (maxPrice && !isNaN(Number(maxPrice))) url += `&maxPrice=${encodeURIComponent(maxPrice)}`;
        if (rating && !isNaN(Number(rating))) url += `&rating=${encodeURIComponent(rating)}`;
        if (currentSort) url += `&sort=${encodeURIComponent(currentSort)}`;
        if (featured === 'true') url += `&featured=true`;

        const { data } = await api.get(url);
        if (data.success) {
          setProducts(data.products || []);
          setTotalProducts(data.total || 0);
          setTotalPages(data.pages || 1);
        }
      } catch (err) {
        console.error('[Products Load Error]:', err.message);
        setError(err.response?.data?.message || 'Failed to load products from server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, currentPage, searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, rating, currentSort, featured]);

  // Merge catalog brands with current product brands safely
  const availableBrands = useMemo(() => {
    const currentProductBrands = products
      .map((p) => p.brand?.trim())
      .filter((b) => Boolean(b) && typeof b === 'string' && b.length > 0);
    const combined = Array.from(new Set([...allBrands, ...currentProductBrands]));
    return combined.sort((a, b) => a.localeCompare(b));
  }, [allBrands, products]);

  // Filter brands list based on search input
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    return availableBrands.filter((b) =>
      b.toLowerCase().includes(brandSearch.trim().toLowerCase())
    );
  }, [availableBrands, brandSearch]);

  // Selected category object
  const selectedCategoryObj = useMemo(() => {
    if (!selectedCategory) return null;
    const catLower = selectedCategory.toLowerCase();
    return categories.find(
      (c) =>
        c._id === selectedCategory ||
        c.slug?.toLowerCase() === catLower ||
        c.name?.toLowerCase() === catLower ||
        c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === catLower
    );
  }, [categories, selectedCategory]);

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    return [
      Boolean(searchQuery),
      Boolean(selectedCategory),
      Boolean(selectedBrand),
      Boolean(minPrice || maxPrice),
      Boolean(rating),
      featured === 'true',
      currentSort === 'rating',
    ].filter(Boolean).length;
  }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, rating, featured, currentSort]);

  // Helper to update specific param while resetting page to 1
  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setCustomMin('');
    setCustomMax('');
    setBrandSearch('');
    setSearchParams({});
  };

  const handleCustomPriceSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    const minVal = customMin.trim();
    const maxVal = customMax.trim();

    if (minVal && !isNaN(Number(minVal)) && Number(minVal) >= 0) {
      nextParams.set('minPrice', minVal);
    } else {
      nextParams.delete('minPrice');
    }

    if (maxVal && !isNaN(Number(maxVal)) && Number(maxVal) >= 0) {
      nextParams.set('maxPrice', maxVal);
    } else {
      nextParams.delete('maxPrice');
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Render unified filter content for sidebar and mobile drawer
  const renderFilterSections = (isMobile = false) => (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-nexora-blue" /> Filters
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-nexora-blue hover:underline"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Active Filters
          </span>
          <div className="flex flex-wrap gap-1.5">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                "{searchQuery}"
                <button onClick={() => updateParam('search', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategoryObj && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                {selectedCategoryObj.name}
                <button onClick={() => updateParam('category', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                Brand: {selectedBrand}
                <button onClick={() => updateParam('brand', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                <button
                  onClick={() => {
                    setCustomMin('');
                    setCustomMax('');
                    const next = new URLSearchParams(searchParams);
                    next.delete('minPrice');
                    next.delete('maxPrice');
                    next.set('page', '1');
                    setSearchParams(next);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                Rating: {rating}★ & above
                <button onClick={() => updateParam('rating', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {featured === 'true' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                Featured Deals
                <button onClick={() => updateParam('featured', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {currentSort === 'rating' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-nexora-blue font-semibold px-2 py-1 rounded-full border border-blue-200">
                Top Rated Sort
                <button onClick={() => updateParam('sort', 'newest')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 1. Categories Filter */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
          <span>Category</span>
          {selectedCategory && (
            <button
              onClick={() => updateParam('category', '')}
              className="text-[10px] text-nexora-blue hover:underline font-normal capitalize"
            >
              Reset
            </button>
          )}
        </h3>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center justify-between transition ${
              !selectedCategory
                ? 'bg-blue-50 text-nexora-blue font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected =
              selectedCategory === cat._id ||
              selectedCategory.toLowerCase() === cat.slug?.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.name?.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <button
                key={cat._id}
                onClick={() => updateParam('category', isSelected ? '' : cat._id)}
                className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-blue-50 text-nexora-blue font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat.productCount !== undefined && (
                  <span className="text-[10px] text-gray-400">({cat.productCount})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
          <span>Price Range</span>
          {(minPrice || maxPrice) && (
            <button
              onClick={() => {
                setCustomMin('');
                setCustomMax('');
                const next = new URLSearchParams(searchParams);
                next.delete('minPrice');
                next.delete('maxPrice');
                next.set('page', '1');
                setSearchParams(next);
              }}
              className="text-[10px] text-nexora-blue hover:underline font-normal capitalize"
            >
              Reset
            </button>
          )}
        </h3>
        <div className="space-y-1">
          {pricePresets.map((preset) => {
            const isSelected =
              (minPrice === preset.min && maxPrice === preset.max) ||
              (!minPrice && !maxPrice && preset.min === '' && preset.max === '');
            return (
              <button
                key={preset.label}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  if (preset.min) next.set('minPrice', preset.min);
                  else next.delete('minPrice');
                  if (preset.max) next.set('maxPrice', preset.max);
                  else next.delete('maxPrice');
                  next.set('page', '1');
                  setSearchParams(next);
                }}
                className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center gap-2 transition ${
                  isSelected
                    ? 'bg-blue-50 text-nexora-blue font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-nexora-blue bg-nexora-blue' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Price Inputs */}
        <form onSubmit={handleCustomPriceSubmit} className="pt-2 flex items-center gap-1.5">
          <input
            type="number"
            placeholder="Min ₹"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="w-full min-w-0 px-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:border-nexora-blue"
          />
          <span className="text-gray-400 text-xs shrink-0">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            className="w-full min-w-0 px-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:border-nexora-blue"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-nexora-blue text-white rounded text-xs font-bold hover:bg-nexora-darkBlue transition shrink-0"
          >
            Go
          </button>
        </form>
      </div>

      {/* 3. Brand Filter (Unique brands from real products) */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
          <span>Brand</span>
          {selectedBrand && (
            <button
              onClick={() => updateParam('brand', '')}
              className="text-[10px] text-nexora-blue hover:underline font-normal capitalize"
            >
              Reset
            </button>
          )}
        </h3>

        {/* Brand search input if multiple brands */}
        {availableBrands.length > 4 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search brand..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] focus:bg-white focus:outline-none focus:border-nexora-blue"
            />
            <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        )}

        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          <button
            onClick={() => updateParam('brand', '')}
            className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center justify-between transition ${
              !selectedBrand
                ? 'bg-blue-50 text-nexora-blue font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Brands</span>
          </button>
          {filteredBrands.map((brand) => {
            const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
            return (
              <button
                key={brand}
                onClick={() => updateParam('brand', isSelected ? '' : brand)}
                className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-blue-50 text-nexora-blue font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="truncate">{brand}</span>
                {isSelected && <span className="w-1.5 h-1.5 bg-nexora-blue rounded-full"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Customer Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
          <span>Customer Rating</span>
          {(rating || currentSort === 'rating') && (
            <button
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('rating');
                if (currentSort === 'rating') next.set('sort', 'newest');
                next.set('page', '1');
                setSearchParams(next);
              }}
              className="text-[10px] text-nexora-blue hover:underline font-normal capitalize"
            >
              Reset
            </button>
          )}
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('rating', rating === '4' ? '' : '4')}
            className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center justify-between transition ${
              rating === '4'
                ? 'bg-blue-50 text-nexora-blue font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 text-gray-300" />
              </div>
              <span>4★ & above</span>
            </div>
            {rating === '4' && <span className="w-1.5 h-1.5 bg-nexora-blue rounded-full"></span>}
          </button>

          <button
            onClick={() => updateParam('rating', rating === '3' ? '' : '3')}
            className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center justify-between transition ${
              rating === '3'
                ? 'bg-blue-50 text-nexora-blue font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 text-gray-300" />
                <Star className="w-3.5 h-3.5 text-gray-300" />
              </div>
              <span>3★ & above</span>
            </div>
            {rating === '3' && <span className="w-1.5 h-1.5 bg-nexora-blue rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* 5. Special Deals / Featured */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Deals & Offers
        </h3>
        <button
          onClick={() => updateParam('featured', featured === 'true' ? '' : 'true')}
          className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center gap-2 transition ${
            featured === 'true'
              ? 'bg-blue-50 text-nexora-blue font-bold'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
              featured === 'true' ? 'border-nexora-blue bg-nexora-blue text-white' : 'border-gray-300'
            }`}
          >
            {featured === 'true' && <Sparkles className="w-2.5 h-2.5" />}
          </span>
          <span>Featured Deals Only</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Breadcrumb / Search summary banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-md shadow-card border border-nexora-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            {searchQuery ? (
              <>
                Search Results for <span className="text-nexora-blue">"{searchQuery}"</span>
              </>
            ) : selectedCategoryObj ? (
              <>{selectedCategoryObj.name} Department</>
            ) : selectedBrand ? (
              <>{selectedBrand} Collection</>
            ) : (
              <>Explore All Products & Deals</>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {products.length > 0 ? (currentPage - 1) * 12 + 1 : 0}–
            {Math.min(currentPage * 12, totalProducts)} of {totalProducts} items
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="md:hidden bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters ({activeFiltersCount})</span>
        </button>
      </div>

      {/* Main Content Layout: Consistent Left Sidebar + Right Product Grid */}
      <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-start">
        
        {/* Desktop Left Sidebar Filter Section */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0 bg-white rounded-md shadow-card border border-nexora-border p-4 sm:p-5 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
          {renderFilterSections(false)}
        </aside>

        {/* Mobile Responsive Filter Drawer & Backdrop */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />

            {/* Slide-out Drawer */}
            <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-200">
              <div className="flex-1 overflow-y-auto p-5">
                {renderFilterSections(true)}
              </div>

              {/* Mobile Drawer Footer CTA */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 py-2.5 px-3 border border-gray-300 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-100 transition text-center"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-nexora-blue hover:bg-nexora-darkBlue text-white rounded-md text-xs font-bold shadow-sm transition text-center"
                >
                  View ({totalProducts})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Main Product Grid Area */}
        <div className="flex-1 min-w-0 space-y-4">
          
          {/* Top Sort Toolbar */}
          <div className="bg-white p-3 rounded-md shadow-card border border-nexora-border flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider text-[11px]">
              Sort By:
            </span>

            <div className="flex flex-wrap items-center gap-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateParam('sort', opt.value)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded text-[11px] sm:text-xs font-semibold transition ${
                    currentSort === opt.value
                      ? 'bg-nexora-blue text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid or Skeletons or Empty State */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <div className="bg-white p-8 sm:p-12 text-center rounded-md border border-nexora-border">
              <p className="text-red-600 font-semibold mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-nexora-blue underline font-bold"
              >
                Reload Page
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white p-8 sm:p-12 text-center rounded-md border border-nexora-border space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-nexora-blue rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">No matching products found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try checking your spelling or relaxing your filters to discover more items.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="bg-nexora-blue text-white text-xs font-bold px-5 py-2.5 rounded shadow-sm hover:bg-nexora-darkBlue transition inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white p-3.5 sm:p-4 rounded-md shadow-card border border-nexora-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-700">
              <span className="font-medium text-[11px] sm:text-xs">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => updateParam('page', (currentPage - 1).toString())}
                  className="px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shrink-0 text-xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParam('page', pageNum.toString())}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-bold transition shrink-0 ${
                        currentPage === pageNum
                          ? 'bg-nexora-blue text-white shadow-xs'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => updateParam('page', (currentPage + 1).toString())}
                  className="px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shrink-0 text-xs"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
