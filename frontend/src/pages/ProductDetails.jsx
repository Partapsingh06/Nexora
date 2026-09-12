import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Tag,
  MapPin,
  Clock,
  Check,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';
import { ProductDetailsSkeleton } from '../components/SkeletonLoader';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { formatCurrency } from '../utils';

const availableOffers = [
  'Bank Offer: 5% Cashback on Nexora Axis Bank Credit Card',
  'Special Price: Get extra 15% off on this product (price inclusive of discount)',
  'Partner Offer: Sign-up for Nexora Pay Later and get ₹500 welcome voucher',
  'No Cost EMI: Avail 0% interest EMI on select bank cards on orders above ₹3,000',
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart, setBuyNowItem } = useCart();
  const { inWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Pincode check state
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);

  const isWishlisted = inWishlist(product?._id);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedImage(0);
        setQuantity(1);

        const { data } = await api.get(`/products/${id}`);
        if (data.success && data.product) {
          setProduct(data.product);

          // Fetch similar products in same category
          if (data.product.category?._id || data.product.category) {
            const catId = data.product.category?._id || data.product.category;
            const similarRes = await api.get(`/products?category=${catId}&limit=5`);
            if (similarRes.data.success) {
              setSimilarProducts(
                (similarRes.data.products || []).filter((p) => p._id !== data.product._id)
              );
            }
          }
        }
      } catch (err) {
        console.error('[Product Details Error]:', err.message);
        setError(err.response?.data?.message || 'Product not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const res = await toggleWishlist(product._id);
    if (res?.message) {
      setNotification({ type: 'success', message: res.message });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingCart(true);
      const res = await addToCart(product._id, quantity);
      if (res.success) {
        setJustAdded(true);
        setNotification({ type: 'success', message: `${product.name} added to cart!` });
        setTimeout(() => {
          setJustAdded(false);
          setNotification(null);
        }, 3000);
      } else {
        setNotification({ type: 'error', message: res.message || 'Failed to add item to cart' });
        setTimeout(() => setNotification(null), 4000);
      }
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBuyNowItem({
      product,
      quantity,
      price: product.price,
    });

    navigate('/cart');
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          {error || 'The product you are looking for does not exist or has been discontinued.'}
        </p>
        <Link
          to="/products"
          className="inline-block bg-nexora-blue text-white text-xs font-bold px-6 py-2.5 rounded shadow hover:bg-nexora-darkBlue transition"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = Number(product.stock) <= 0;
  const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600'];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-md text-xs font-semibold flex items-center gap-2 border animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto no-scrollbar py-1">
        <Link to="/" className="hover:text-nexora-blue shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link to="/products" className="hover:text-nexora-blue shrink-0">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              to={`/products?category=${product.category._id || product.category}`}
              className="hover:text-nexora-blue shrink-0"
            >
              {product.category.name || 'Category'}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-800 font-semibold truncate max-w-[180px] sm:max-w-xs shrink-0">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="bg-white rounded-lg shadow-card border border-nexora-border p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Image Gallery & Sticky Action Buttons */}
        <div className="md:col-span-5 space-y-4 md:sticky md:top-20">
          
          {/* Main Visual Image Box */}
          <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex items-center justify-center min-h-[260px] sm:min-h-[420px]">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className={`max-h-[280px] sm:max-h-[380px] w-full object-contain transition-transform duration-300 hover:scale-105 ${
                isOutOfStock ? 'opacity-40 grayscale' : ''
              }`}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600'; }}
            />

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow hover:bg-white transition"
              title="Save to Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-400'
                }`}
              />
            </button>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <span className="bg-gray-900 text-white font-bold text-sm px-4 py-2 rounded-md shadow">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-2 no-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md border-2 p-1 overflow-hidden transition bg-white flex-shrink-0 ${
                    selectedImage === index ? 'border-nexora-blue shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 text-xs">
              <span className="font-bold text-gray-700">Select Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-1.5 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1.5 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Cart & Buy Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingCart}
              className={`py-3 sm:py-3.5 px-3 sm:px-4 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition ${
                justAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-nexora-amber hover:bg-amber-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {addingCart ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="py-3 sm:py-3.5 px-3 sm:px-4 rounded-md font-bold text-xs sm:text-sm bg-nexora-orange hover:bg-orange-600 text-white flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white" /> Buy Now
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Product Information */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-nexora-blue">
                {product.brand}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] italic font-bold text-nexora-blue bg-blue-50 px-2 py-0.5 rounded">
                Nexora <span className="text-nexora-yellow">Plus</span>
                <Sparkles className="w-3 h-3 text-nexora-yellow fill-nexora-yellow inline" />
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
              <span className="inline-flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.rating ? product.rating.toFixed(1) : '4.5'} <Star className="w-3 h-3 fill-white" />
              </span>
              <span className="text-xs font-medium text-gray-500">
                {product.numReviews ? product.numReviews.toLocaleString() : '1,420'} Ratings & Reviews
              </span>
              <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Genuine
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-green-700">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Inclusive of all taxes. Free delivery on orders over ₹500.</p>
          </div>

          {/* Available Offers */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-green-600" /> Available Offers
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-700">
              {availableOffers.map((offer, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Tag className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{offer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-800">Delivery Options</span>
            </div>

            <form onSubmit={handlePincodeSubmit} className="flex items-center gap-2 max-w-xs">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-nexora-blue text-white rounded text-xs font-bold hover:bg-nexora-darkBlue transition shadow-xs shrink-0"
              >
                Check
              </button>
            </form>

            {pincodeChecked && (
              <div className="space-y-1 text-xs text-gray-700 animate-in fade-in duration-150">
                <p className="font-semibold text-green-700 flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Delivery by Tomorrow, 9 PM | Free ₹40
                </p>
                <p className="text-gray-500 text-[11px]">Cash on Delivery also available.</p>
              </div>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="pt-2">
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                product.stock > 10
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : product.stock > 0
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {product.stock > 10
                ? 'In Stock'
                : product.stock > 0
                ? `Hurry, only ${product.stock} items left in stock!`
                : 'Currently Out of Stock'}
            </span>
          </div>

          {/* Technical Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Specifications
              </h3>

              <div className="border border-gray-200 rounded-md overflow-x-auto text-xs">
                <table className="w-full text-left min-w-[280px]">
                  <tbody className="divide-y divide-gray-200">
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                        <td className="py-2.5 px-3 sm:px-4 font-semibold text-gray-500 w-1/3 border-r border-gray-200">
                          {spec.key}
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-gray-900 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Similar / Recommended Products Carousel */}
      {similarProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-card border border-nexora-border p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-gray-900">Similar Products You May Like</h2>
            <Link
              to={`/products?category=${product.category?._id || product.category}`}
              className="text-xs font-bold text-nexora-blue hover:underline"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
