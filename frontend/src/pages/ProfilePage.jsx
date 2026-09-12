import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogOut,
  Building,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    });

    setLoading(false);

    if (result.success) {
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(result.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-md shadow-card border border-nexora-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-nexora-blue text-white flex items-center justify-center font-bold text-xl uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs text-gray-500">Hello,</span>
              <h3 className="font-bold text-gray-900 truncate">{user?.name}</h3>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-card border border-nexora-border overflow-hidden">
            <div className="p-3 border-b border-gray-100 font-semibold text-xs text-gray-400 uppercase tracking-wider">
              Account Settings
            </div>
            <nav className="divide-y divide-gray-100 text-sm">
              <button
                className="w-full text-left px-4 py-3 font-semibold text-nexora-blue bg-blue-50/50 flex items-center justify-between"
              >
                <span>Profile Information</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Right Main Content Panel */}
        <div className="md:col-span-3 bg-white p-6 sm:p-8 rounded-md shadow-card border border-nexora-border">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Personal Information
                {user?.role === 'admin' && (
                  <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage your personal details and delivery addresses.</p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-nexora-blue hover:underline"
              >
                Edit Details
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form / Details */}
          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                    required
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-gray-400 text-[10px] lowercase">(cannot be changed)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Add phone number"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                </div>
              </div>

              {/* Account Created Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Member Since
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }) : 'N/A'}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-nexora-blue" /> Delivery Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Street / House No / Area</label>
                  <input
                    type="text"
                    name="street"
                    disabled={!isEditing}
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City / District</label>
                  <input
                    type="text"
                    name="city"
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    disabled={!isEditing}
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pincode / Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    disabled={!isEditing}
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    disabled={!isEditing}
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-nexora-blue"
                  />
                </div>
              </div>
            </div>

            {/* Save Button in Edit Mode */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-nexora-blue hover:bg-nexora-darkBlue text-white font-semibold px-6 py-2.5 rounded shadow text-sm flex items-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
