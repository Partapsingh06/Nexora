import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null, loading: false });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories?includeInactive=true');
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('[Fetch Categories Error]:', err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/products?includeInactive=true&page=${page}&limit=10`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const { data } = await api.get(url);
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error('[Fetch Products Error]:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDeleteConfirm = async (hard = false) => {
    if (!deleteModal.product) return;

    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const url = `/products/${deleteModal.product._id}${hard ? '?hard=true' : ''}`;
      const { data } = await api.delete(url);

      if (data.success) {
        setNotification({
          type: 'success',
          message: hard ? 'Product permanently removed' : 'Product deactivated (soft-deleted)',
        });
        setDeleteModal({ open: false, product: null, loading: false });
        fetchProducts();
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete product',
      });
      setDeleteModal({ open: false, product: null, loading: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-nexora-blue" />
            Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your store's inventory, prices, stock levels, and Flipkart catalog.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-nexora-blue hover:bg-nexora-darkBlue text-white text-sm font-bold px-4 py-2.5 rounded-md shadow flex items-center gap-2 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm flex items-center gap-2 border animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, brand..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-gray-50 border border-gray-300 rounded-md text-xs py-2 px-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue w-full md:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchProducts}
            className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Discount</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 text-nexora-blue animate-spin mx-auto mb-2" />
                    <span className="text-xs">Loading products...</span>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                      />
                      <div className="overflow-hidden max-w-sm">
                        <p className="font-semibold text-gray-900 text-xs truncate hover:text-nexora-blue">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Brand: <span className="font-medium text-gray-600">{p.brand}</span>
                          {p.featured && (
                            <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-700 font-medium">
                      {p.category?.name || 'Uncategorized'}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-bold text-gray-900">{formatCurrency(p.price)}</div>
                      {p.originalPrice > p.price && (
                        <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                          <span className="line-through">{formatCurrency(p.originalPrice)}</span>
                          <span className="text-green-600 font-bold">({p.discount}% off)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                          p.stock > 5
                            ? 'bg-green-50 text-green-700'
                            : p.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700 font-bold'
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                        {p.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-1.5 text-gray-600 hover:text-nexora-blue hover:bg-blue-50 rounded transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, product: p, loading: false })}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete / Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 text-xs">
                    No products matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 font-semibold"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Manage Product Removal</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Choose how you wish to delete <strong>{deleteModal.product?.name}</strong>:
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <strong>Soft Delete:</strong> Hides product from customer store while keeping order records intact.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, product: null, loading: false })}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(false)}
                disabled={deleteModal.loading}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold shadow"
              >
                Soft Deactivate
              </button>
              <button
                onClick={() => handleDeleteConfirm(true)}
                disabled={deleteModal.loading}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow"
              >
                Permanent Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
