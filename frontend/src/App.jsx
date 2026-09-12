import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import CustomerCare from './pages/CustomerCare';
import Advertise from './pages/Advertise';
import DownloadApp from './pages/DownloadApp';
import BecomeSeller from './pages/BecomeSeller';
import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';
import Authenticity from './pages/Authenticity';
import ReturnPolicy from './pages/ReturnPolicy';
import DeliveryInfo from './pages/DeliveryInfo';
import AboutUs from './pages/AboutUs';
import NexoraStories from './pages/NexoraStories';
import CorporateInfo from './pages/CorporateInfo';
import ReportInfringement from './pages/ReportInfringement';
import SecurityTrust from './pages/SecurityTrust';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReturns from './pages/admin/AdminReturns';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Admin Protected Dashboard Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="returns" element={<AdminReturns />} />
              </Route>

              {/* Customer Facing Application Layout */}
              <Route element={<CustomerLayout />}>
                {/* Public Shopping Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/customer-care" element={<CustomerCare />} />
                <Route path="/faq" element={<CustomerCare />} />
                <Route path="/advertise" element={<Advertise />} />
                <Route path="/download-app" element={<DownloadApp />} />
                <Route path="/authenticity" element={<Authenticity />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/returns-policy" element={<ReturnPolicy />} />
                <Route path="/cancellation-returns" element={<ReturnPolicy />} />
                <Route path="/delivery-info" element={<DeliveryInfo />} />
                <Route path="/shipping-delivery" element={<DeliveryInfo />} />
                <Route path="/shipping-policy" element={<DeliveryInfo />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/stories" element={<NexoraStories />} />
                <Route path="/nexora-stories" element={<NexoraStories />} />
                <Route path="/corporate-info" element={<CorporateInfo />} />
                <Route path="/corporate-information" element={<CorporateInfo />} />
                <Route path="/report-infringement" element={<ReportInfringement />} />
                <Route path="/security-trust" element={<SecurityTrust />} />
                <Route path="/security" element={<SecurityTrust />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/become-seller" element={<BecomeSeller />} />
                <Route path="/seller/register" element={<BecomeSeller />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute requireSeller={true}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller"
                  element={
                    <ProtectedRoute requireSeller={true}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Customer Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track-order"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track-order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 handler */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
