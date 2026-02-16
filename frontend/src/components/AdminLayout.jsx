import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Star,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  Tag  // ✅ ADDED: Tag icon for Coupons
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ADDED: To highlight active menu item

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/mohitaniljangra/dashboard' },
    { name: 'Orders', icon: ShoppingCart, path: '/mohitaniljangra/orders' },
    { name: 'Products', icon: Package, path: '/mohitaniljangra/products' },
    { name: 'Users', icon: Users, path: '/mohitaniljangra/users' },
    { name: 'Reviews', icon: Star, path: '/mohitaniljangra/reviews' },
    { name: 'Coupons', icon: Tag, path: '/mohitaniljangra/coupons' }, // ✅ ADDED: Coupons menu
    { name: 'Settings', icon: Settings, path: '/mohitaniljangra/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/mohitaniljangra/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  // ✅ ADDED: Function to check if current path matches menu item
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-xl font-bold text-blue-600">Admin Panel</div>
          <button
            onClick={goToHome}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Go to Home"
          >
            <Home size={20} />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white shadow-lg transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300
            flex flex-col
          `}
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">TV Merch Admin</h1>
            <p className="text-gray-500 text-sm">Secure Admin Area</p>
            <p className="text-xs text-gray-400 mt-1">URL: /mohitaniljangra</p>
          </div>

          <nav className="p-4 flex-grow">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                      ${isActive(item.path) 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'hover:bg-blue-50 hover:text-blue-600 text-gray-700'
                      }
                    `}
                    onClick={() => {
                      // Close sidebar on mobile when item is clicked
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <item.icon size={20} className={isActive(item.path) ? 'text-white' : ''} />
                    <span className="font-medium">{item.name}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ✅ ADDED: Admin Info Section */}
            <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Admin Controls</p>
                  <p className="text-xs text-gray-600">Full access to manage store</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Menu Items:</span>
                  <span className="font-bold">{menuItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Tab:</span>
                  <span className="font-bold text-blue-600">
                    {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t bg-white">
            <div className="flex space-x-3">
              <button
                onClick={goToHome}
                className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors group"
                title="Go to Store Home"
              >
                <Home size={18} className="group-hover:text-blue-600" />
                <span className="text-sm group-hover:text-blue-600">Store Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 text-red-600 transition-colors group"
              >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
            
            {/* ✅ ADDED: Session Info */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Session:</span>
                <span className="font-mono">
                  {localStorage.getItem('adminToken') ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>Version:</span>
                <span className="font-bold">1.2.0</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar for Desktop */}
          <div className="hidden lg:flex items-center justify-between bg-white px-8 py-4 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h1>
              <p className="text-gray-600">
                {isActive('/mohitaniljangra/dashboard') && 'Overview of your store performance'}
                {isActive('/mohitaniljangra/orders') && 'Manage customer orders and payments'}
                {isActive('/mohitaniljangra/products') && 'Add, edit or remove products'}
                {isActive('/mohitaniljangra/users') && 'View and manage registered users'}
                {isActive('/mohitaniljangra/reviews') && 'Approve or reject customer reviews'}
                {isActive('/mohitaniljangra/coupons') && 'Create and manage discount coupons'} {/* ✅ ADDED */}
                {isActive('/mohitaniljangra/settings') && 'Configure store settings and email'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={goToHome}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="Go to Store Home"
              >
                <Home size={18} />
                <span className="font-medium">Visit Store</span>
              </button>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 lg:p-8">
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <Outlet />
            </div>
            
            {/* ✅ ADDED: Footer for Admin Panel */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>
                TV Merchandise Admin Panel • Secure Area • 
                <span className="font-mono ml-2">/mohitaniljangra</span>
              </p>
              <p className="mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ ADDED: Custom CSS for scrollbar */}
      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        aside::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;