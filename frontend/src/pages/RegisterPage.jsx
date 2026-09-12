import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, Loader2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setAuthError(null);

    const { name, email, phone, password, confirmPassword } = formData;

    // Form Validations
    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setFormError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* Left Side Flipkart Blue Banner */}
        <div className="bg-nexora-blue md:w-2/5 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-nexora-yellow" /> Join Nexora
            </span>
            <h2 className="text-3xl font-extrabold mb-3">Looks like you're new here!</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Sign up with your details to start shopping, tracking orders, and unlocking exclusive member deals.
            </p>
          </div>

          <div className="mt-12 z-10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-nexora-yellow" /> Instant access to member-only discounts
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-nexora-yellow" /> Seamless checkout & order tracking
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-3/5 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Create your account</h3>
            <p className="text-sm text-gray-500 mt-1">Fill in the information below to get started.</p>
          </div>

          {(formError || authError) && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm animate-in fade-in duration-200">
              {formError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nexora-blue focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nexora-orange hover:bg-orange-600 text-white font-semibold py-3 rounded-md shadow-md hover:shadow-lg transition duration-150 flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-600">
              Existing User?{' '}
              <Link
                to="/login"
                className="font-bold text-nexora-blue hover:underline inline-flex items-center gap-0.5"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
