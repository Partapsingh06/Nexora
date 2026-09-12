import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const AdminProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60'],
    specifications: [
      { key: 'Model', value: '' },
      { key: 'Warranty', value: '1 Year Manufacturer' },
    ],
    featured: false,
    isActive: true,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories || []);
          if (!isEditMode && data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: data.categories[0]._id }));
          }
        }
      } catch (err) {
        console.error('[Categories Fetch Error]:', err.message);
      }
    };

    fetchCategories();
  }, [isEditMode]);

  // If in edit mode, fetch product details
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setInitialLoading(true);
          const { data } = await api.get(`/products/${id}`);
          if (data.success && data.product) {
            const p = data.product;
            setFormData({
              name: p.name,
              description: p.description,
              price: p.price,
              originalPrice: p.originalPrice || p.price,
              category: p.category?._id || p.category,
              brand: p.brand || '',
              stock: p.stock,
              images: p.images && p.images.length > 0 ? p.images : [''],
              specifications: p.specifications && p.specifications.length > 0 ? p.specifications : [{ key: '', value: '' }],
              featured: Boolean(p.featured),
              isActive: Boolean(p.isActive),
            });
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load product details');
        } finally {
          setInitialLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image handlers
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Specification handlers
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const removeSpecRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Calculated discount preview
  const calculatedDiscount =
    formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a product description');
      return;
    }
    if (Number(formData.price) <= 0) {
      setError('Selling price must be greater than 0');
      return;
    }
    if (!formData.category) {
      setError('Please select a valid category');
      return;
    }
    if (Number(formData.stock) < 0) {
      setError('Stock cannot be negative');
      return;
    }

    // Filter valid image URLs
    const cleanImages = formData.images.filter((img) => img.trim().length > 0);
    if (cleanImages.length === 0) {
      setError('Please provide at least one valid image URL');
      return;
    }

    // Filter non-empty specifications
    const cleanSpecs = formData.specifications.filter((s) => s.key.trim() && s.value.trim());

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        category: formData.category,
        brand: formData.brand.trim() || 'Generic',
        stock: Number(formData.stock),
        images: cleanImages,
        specifications: cleanSpecs,
        featured: formData.featured,
        isActive: formData.isActive,
      };

      if (isEditMode) {
        const { data } = await api.put(`/products/${id}`, payload);
        if (data.success) {
          setSuccess('Product updated successfully!');
          setTimeout(() => navigate('/admin/products'), 1500);
        }
      } else {
        const { data } = await api.post('/products', payload);
        if (data.success) {
          setSuccess('Product created successfully!');
          setTimeout(() => navigate('/admin/products'), 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-nexora-blue animate-spin mb-3" />
        <p className="text-gray-500 text-sm font-medium">Fetching product data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-white rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditMode ? 'Update pricing, images, and catalog specs' : 'List a new product in the Nexora store'}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Basic Information
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Title / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apple iPhone 15 Pro (128 GB) - Natural Titanium"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Apple, Sony, Samsung"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Comprehensive product specifications, features, warranty, and package box contents..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
              required
            ></textarea>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Pricing & Stock Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="999"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Original MRP Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="1499"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue"
                required
              />
            </div>
          </div>

          {calculatedDiscount > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-800 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-green-600" />
              Customer Discount: <strong>{calculatedDiscount}% OFF</strong> will be displayed on the product badge.
            </div>
          )}
        </div>

        {/* Product Images */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              3. Product Images (URLs)
            </h2>
            <button
              type="button"
              onClick={addImageField}
              className="text-xs text-nexora-blue font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Image URL
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((imgUrl, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                    required
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt="Preview"
                    className="w-9 h-9 object-cover rounded border border-gray-200 flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Invalid'; }}
                  />
                )}

                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              4. Technical Specifications
            </h2>
            <button
              type="button"
              onClick={addSpecRow}
              className="text-xs text-nexora-blue font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="space-y-2">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Battery Life)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="w-1/3 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Up to 30 Hours)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility Flags */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-nexora-blue rounded focus:ring-nexora-blue"
            />
            <span className="text-xs font-semibold text-gray-800">Featured on Homepage Banner</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-nexora-blue rounded focus:ring-nexora-blue"
            />
            <span className="text-xs font-semibold text-gray-800">Active (Visible to customers)</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-nexora-blue hover:bg-nexora-darkBlue text-white text-xs font-bold px-6 py-2.5 rounded-md shadow flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {isEditMode ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
