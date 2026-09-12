import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  PlusCircle,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Save,
  X,
  Package,
} from 'lucide-react';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modal Form State (for Create & Edit)
  const [modalState, setModalState] = useState({
    open: false,
    isEdit: false,
    categoryId: null,
    loading: false,
    formData: {
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60',
      isActive: true,
    },
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null, loading: false });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/categories?includeInactive=true');
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('[Fetch Categories Error]:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setModalState({
      open: true,
      isEdit: false,
      categoryId: null,
      loading: false,
      formData: {
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60',
        isActive: true,
      },
    });
  };

  const openEditModal = (cat) => {
    setModalState({
      open: true,
      isEdit: true,
      categoryId: cat._id,
      loading: false,
      formData: {
        name: cat.name,
        description: cat.description || '',
        image: cat.image || '',
        isActive: Boolean(cat.isActive),
      },
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { isEdit, categoryId, formData } = modalState;

    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Category name is required' });
      return;
    }

    try {
      setModalState((prev) => ({ ...prev, loading: true }));

      if (isEdit) {
        const { data } = await api.put(`/categories/${categoryId}`, formData);
        if (data.success) {
          setNotification({ type: 'success', message: 'Category updated successfully' });
        }
      } else {
        const { data } = await api.post('/categories', formData);
        if (data.success) {
          setNotification({ type: 'success', message: 'Category created successfully' });
        }
      }

      setModalState({ open: false, isEdit: false, categoryId: null, loading: false, formData: {} });
      fetchCategories();
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save category',
      });
      setModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteConfirm = async (hard = false) => {
    if (!deleteModal.category) return;

    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const url = `/categories/${deleteModal.category._id}${hard ? '?force=true' : ''}`;
      const { data } = await api.delete(url);

      if (data.success) {
        setNotification({
          type: 'success',
          message: hard ? 'Category deleted permanently' : 'Category deactivated (soft-deleted)',
        });
        setDeleteModal({ open: false, category: null, loading: false });
        fetchCategories();
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to remove category',
      });
      setDeleteModal({ open: false, category: null, loading: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-nexora-blue" />
            Category Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize products into Flipkart-style departments and navigation taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition"
            title="Refresh categories"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreateModal}
            className="bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-4 py-2.5 rounded-md shadow flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Category
          </button>
        </div>
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

      {/* Categories Grid */}
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <Loader2 className="w-8 h-8 text-nexora-blue animate-spin mx-auto mb-2" />
          <span className="text-xs text-gray-500">Loading catalog categories...</span>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={cat.image || 'https://via.placeholder.com/100'}
                    alt={cat.name}
                    className="w-14 h-14 object-cover rounded-md border border-gray-200 flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Img'; }}
                  />
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{cat.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cat.isActive
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1 font-medium">
                  <Package className="w-3.5 h-3.5 text-nexora-blue" />
                  <strong>{cat.productCount ?? 0}</strong> products
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-gray-600 hover:text-nexora-blue hover:bg-white rounded transition border border-transparent hover:border-gray-200"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, category: cat, loading: false })}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-white rounded transition border border-transparent hover:border-gray-200"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-lg border border-gray-200 text-gray-500 text-xs">
          No categories found. Click <strong>Add Category</strong> above or run <code>npm run seed</code> in the backend.
        </div>
      )}

      {/* Modal Form for Add/Edit */}
      {modalState.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {modalState.isEdit ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setModalState({ open: false, isEdit: false, categoryId: null, loading: false, formData: {} })}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalState.formData.name || ''}
                  onChange={(e) =>
                    setModalState((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, name: e.target.value },
                    }))
                  }
                  placeholder="e.g. Mobiles & Tablets"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={modalState.formData.image || ''}
                    onChange={(e) =>
                      setModalState((prev) => ({
                        ...prev,
                        formData: { ...prev.formData, image: e.target.value },
                      }))
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={modalState.formData.description || ''}
                  onChange={(e) =>
                    setModalState((prev) => ({
                      ...prev,
                      formData: { ...prev.formData, description: e.target.value },
                    }))
                  }
                  placeholder="Category department summary..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(modalState.formData.isActive)}
                    onChange={(e) =>
                      setModalState((prev) => ({
                        ...prev,
                        formData: { ...prev.formData, isActive: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 text-nexora-blue rounded focus:ring-nexora-blue"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Active (Show in customer navigation)
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalState({ open: false, isEdit: false, categoryId: null, loading: false, formData: {} })}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalState.loading}
                  className="bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-5 py-2 rounded shadow flex items-center gap-1.5"
                >
                  {modalState.loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> {modalState.isEdit ? 'Update Category' : 'Create Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Remove Category</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to remove <strong>{deleteModal.category?.name}</strong>?
            </p>

            {deleteModal.category?.productCount > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-semibold">
                ⚠️ Warning: There are {deleteModal.category?.productCount} active products linked to this category.
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, category: null, loading: false })}
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
                Force Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
