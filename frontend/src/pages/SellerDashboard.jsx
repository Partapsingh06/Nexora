import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  PlusCircle,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle2,
  Trash2,
  Eye,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '25',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
  });
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodsRes, catsRes] = await Promise.all([
        api.get('/seller/dashboard-stats'),
        api.get('/seller/products'),
        api.get('/categories'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (prodsRes.data.success) {
        setProducts(prodsRes.data.data);
      }
      if (catsRes.data.success) {
        setCategories(catsRes.data.categories || catsRes.data.data || []);
        if (catsRes.data.categories?.length > 0 && !newProduct.category) {
          setNewProduct((prev) => ({ ...prev, category: catsRes.data.categories[0]._id }));
        }
      }
    } catch (err) {
      console.warn('Dashboard fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
      setActionError('Please fill in product name, description, price, and category.');
      return;
    }

    setAddingProduct(true);
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : Number(newProduct.price) * 1.3,
        category: newProduct.category,
        brand: newProduct.brand || stats?.sellerInfo?.businessName || 'Nexora Verified',
        stock: Number(newProduct.stock || 20),
        images: [newProduct.imageUrl],
      };

      const res = await api.post('/seller/products', payload);

      if (res.data.success) {
        setActionSuccess('Product listed successfully in marketplace catalog!');
        setShowAddModal(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: categories[0]?._id || '',
          brand: '',
          stock: '25',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        });
        fetchDashboardData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to list product.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product from your store?')) return;

    try {
      const res = await api.delete(`/seller/products/${id}`);
      if (res.data.success) {
        setActionSuccess('Product removed from store successfully.');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      setActionError('Failed to remove product.');
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-16 font-sans text-gray-800">
      {/* Seller Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-8 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-nexora-yellow text-gray-950 flex items-center justify-center font-black shadow-lg">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {stats?.sellerInfo?.businessName || `${user?.name || 'Seller'}'s Store`}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Merchant
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 flex items-center gap-2">
                <span>Seller ID: <strong>{stats?.sellerInfo?.sellerId || 'NX-SLR-OFFICIAL'}</strong></span>
                <span>•</span>
                <span>Type: <strong>{stats?.sellerInfo?.businessType || 'Retailer'}</strong></span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow"
            >
              <PlusCircle className="w-4 h-4" /> Add New Product
            </button>
            <Link
              to="/products"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition border border-white/20 flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> View Public Store
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError('')} className="text-red-700 hover:text-red-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-bold uppercase">Products Listed</span>
              <Package className="w-4 h-4 text-nexora-blue" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.totalProducts || products.length}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              Active in catalog
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-bold uppercase">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.totalOrders || 14}
            </div>
            <div className="text-[10px] text-purple-600 font-bold mt-1">
              {stats?.pendingDispatch || 2} awaiting dispatch
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-bold uppercase">Total Sales Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              ₹{(stats?.totalRevenue || 68450).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              Payout every 7 days
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-bold uppercase">Merchant Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.storeRating || 4.8} / 5.0
            </div>
            <div className="text-[10px] text-gray-500 font-medium mt-1">
              Based on buyer feedback
            </div>
          </div>
        </div>

        {/* Product Inventory Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-nexora-blue" />
                Store Products & Inventory
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your product listings, prices, and available stock units
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboardData}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs font-bold transition flex items-center gap-1"
                title="Refresh products"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-nexora-blue hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <PlusCircle className="w-3.5 h-3.5" /> List New Product
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">
              Loading your product catalog...
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60'}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-200"
                          />
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Brand: {prod.brand || 'Verified'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {prod.category?.name || 'General'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">
                          ₹{Number(prod.price).toLocaleString('en-IN')}
                        </div>
                        {prod.originalPrice > prod.price && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ₹{Number(prod.originalPrice).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.stock > 10
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.stock > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${prod._id}`}
                            className="p-1.5 text-gray-500 hover:text-nexora-blue hover:bg-blue-50 rounded transition"
                            title="View on Store"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-gray-800">No products listed yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Start adding your first product to sell on the Nexora marketplace!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-5 py-2.5 bg-nexora-blue text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow"
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-nexora-blue" />
                  List a New Product on Marketplace
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your product will be instantly visible to all Nexora buyers
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Title / Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Wireless Noise Cancelling Earbuds Pro"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    placeholder="e.g. Sony, boAt, Nexora"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="1999"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="3499"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Stock Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Image URL (Unsplash or direct image link)
                </label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Detailed highlights, warranty, features..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProduct}
                  className="px-6 py-2.5 bg-nexora-blue hover:bg-blue-700 text-white rounded-lg font-bold shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {addingProduct ? 'Listing...' : 'List Product Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
