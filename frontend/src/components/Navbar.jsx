// frontend/src/components/Navbar.jsx - COMPLETELY FIXED & OPTIMIZED
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut,
  ChevronDown,
  Tv,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const mobileMenuRef = useRef(null);

  // Categories data
  const categories = [
    { id: 't-shirts', name: 'T-Shirts', icon: '👕', gradient: 'from-blue-600 to-indigo-600' },
    { id: 'mugs', name: 'Coffee Mugs', icon: '☕', gradient: 'from-amber-600 to-orange-600' },
    { id: 'accessories', name: 'Accessories', icon: '🎒', gradient: 'from-green-600 to-emerald-600' },
    { id: 'combos', name: 'Combos', icon: '🎁', gradient: 'from-pink-600 to-rose-600' },
    { id: 'hoodies', name: 'Hoodies', icon: '🧥', gradient: 'from-gray-800 to-black' },
    { id: 'caps', name: 'Caps', icon: '🧢', gradient: 'from-red-600 to-orange-600' },
    { id: 'posters', name: 'Photo Frame', icon: '🖼️', gradient: 'from-purple-600 to-indigo-600' }
  ];

  const infoLinks = [
    { name: 'Shipping Policy', path: '/shipping-policy' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // ✅ FIXED: Scroll effect for desktop navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ FIXED: Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ✅ FIXED: Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      {/* 📱 Mobile Header - FIXED STICKY */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white py-3'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Menu Button - FIXED */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            
            {/* Logo - FIXED */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800">ShowmoMarket</span>
            </Link>
            
            {/* Cart Icon - FIXED */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              
              <Link 
                to="/cart" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🖥️ Desktop Navigation Bar - FIXED STICKY */}
      <div 
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-900 shadow-lg py-3' 
            : 'bg-gradient-to-br from-gray-900 via-black to-gray-900 py-4'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Tv className="w-8 h-8 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">ShowmoMarket</div>
                <div className="text-xs text-gray-400">Official Store</div>
              </div>
            </Link>

            {/* Categories Navigation */}
            <div className="flex items-center gap-1">
              {categories.slice(0, 5).map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-white text-sm font-medium">{cat.name}</span>
                  </div>
                </Link>
              ))}
              
              {/* More Dropdown - FIXED */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  More <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {categories.slice(5).map(cat => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <span>{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                    
                    <div className="border-t my-2"></div>
                    
                    {infoLinks.map(link => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                    
                    {currentUser && (
                      <>
                        <div className="border-t my-2"></div>
                        <Link
                          to="/my-orders"
                          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          My Orders
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Search Bar - FIXED */}
              <div className="relative">
                <Search className="w-5 h-5 text-gray-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search Products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 w-64 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </form>
              </div>
              
              {/* Cart - FIXED */}
              <Link 
                to="/cart" 
                className="relative hover:bg-white/10 p-2 rounded-lg transition-colors"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              
              {/* User/Login - FIXED */}
              {currentUser ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <span>{currentUser.name?.split(' ')[0] || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b">
                      <p className="font-medium text-gray-800">{currentUser.name}</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/my-orders" 
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu - COMPLETELY FIXED */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl shadow-2xl animate-slideDown max-h-[90vh] overflow-y-auto"
          >
            {/* Mobile Menu Header - FIXED */}
            <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">TVMerch</div>
                  <div className="text-xs text-gray-500">Official Store</div>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Mobile Search Bar - FIXED */}
            <div className="p-4 border-b">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search TV shows, products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>
              </form>
            </div>

            {/* User Section - FIXED */}
            <div className="p-4 border-b">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{currentUser.name}</div>
                      <div className="text-sm text-gray-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-bold hover:shadow-lg transition-all shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>

            {/* Quick Links - FIXED */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Quick Links</h3>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                <Link 
                  to="/my-orders" 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">My Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link 
                  to="/track-order" 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-green-600">📍</div>
                    <span className="text-gray-700">Track Order</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Categories Grid - FIXED */}
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800 mb-4">Shop Categories</h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-3xl mb-2">{cat.icon}</span>
                    <span className="text-xs font-medium text-center text-gray-700">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Information Pages - FIXED */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-3">Information</h3>
              <div className="space-y-1">
                {infoLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center justify-between py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Shipping Info Banner - FIXED */}
            <div className="sticky bottom-0 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🚚</span>
                </div>
                <div>
                  <div className="font-bold text-blue-700 text-sm">Free Shipping</div>
                  <div className="text-xs text-blue-600">On orders above ₹199</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to body when mobile menu is open to prevent scroll */}
      {isMenuOpen && (
        <style>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
    </>
  );
}