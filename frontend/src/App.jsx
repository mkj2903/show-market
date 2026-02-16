import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import ProtectedRoute from './components/ProtectedRoute'
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import AboutUs from './pages/AboutUs'
import ShippingPolicy from './pages/ShippingPolicy'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ContactUs from './pages/ContactUs'
import TVShow from './pages/TVShow';
import Address from './pages/Address';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/Users';
import AdminReviews from './pages/admin/Reviews';
import AdminSettings from './pages/admin/Settings';
import Coupons from './pages/admin/Coupons'; // ✅ ADDED: Import Coupons page

// ✅ Add ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

function MainLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/mohitaniljangra');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Navbar will NOT show on admin routes */}
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* ✅ Footer will NOT show on admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          
          <MainLayout>
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/track-order/:orderId" element={<TrackOrder />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              
              {/* ✅ NEW Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              
              {/* ✅ TV Show Page Route */}
              <Route path="/tv-show/:showName" element={<TVShow />} />
              
              {/* ✅ Protected Routes */}
              <Route path="/address" element={
                <ProtectedRoute>
                  <Address />
                </ProtectedRoute>
              } />
              
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />

              {/* ✅ SECURITY FIXED: Admin Routes changed from /admin to /mohitaniljangra */}
              <Route path="/mohitaniljangra/login" element={<AdminLogin />} />
              <Route path="/mohitaniljangra" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="coupons" element={<Coupons />} /> {/* ✅ ADDED: Coupons route */}
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App