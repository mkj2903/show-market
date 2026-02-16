import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Shield, Eye, EyeOff, Home } from 'lucide-react';
import { adminApi } from '../../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await adminApi.login(formData);
      
      if (response.success) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        
        // ✅ Redirect to the new admin dashboard URL
        navigate('/mohitaniljangra/dashboard');
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please check if backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="w-full max-w-md">
        {/* Security Notice */}
        <div className="mb-6 bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-300">Secure Admin Area</h3>
          </div>
          <p className="text-sm text-yellow-200/80">
            Access restricted to authorized personnel only. Unauthorized access attempts are logged.
          </p>
          <p className="text-xs text-yellow-200/60 mt-2">
            URL: <code className="bg-black/30 px-2 py-1 rounded"></code>
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                  <p className="text-blue-100 text-sm">ShowmoMarket Control Panel</p>
                </div>
              </div>
              <button
                onClick={goToHome}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Go to Store Home"
              >
                <Home className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="dal id"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  '🔐 Secure Login'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure SSL Connection • Admin Access Only</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Default Credentials: public kyu karu ??
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} ShowmoMarket • Secure Admin Portal v2.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Unauthorized access is strictly prohibited and may be prosecuted
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;