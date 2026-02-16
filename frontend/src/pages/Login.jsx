import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Mail, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Smartphone, 
  ShoppingBag,
  Tv,
  Sparkles,
  Star,
  Award,
  Gift,
  ChevronRight,
  ArrowRight,
  Heart,
  Users,
  Package,
  Truck,
  Lock,
  UserPlus,
  ShieldCheck,
  Zap,
  CreditCard,
  Globe,
  TrendingUp,
  BadgeCheck,
  Clock,
  RefreshCw
} from 'lucide-react'

export default function Login() {
  const { loginWithGoogle, currentUser, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('login')

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true })
    }
  }, [currentUser, navigate, from])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage('')
    
    const actionText = activeTab === 'login' ? 'Logging in' : 'Creating account'
    setMessage(`${actionText} with Google...`)
    
    const result = await loginWithGoogle()
    
    if (result.success) {
      setMessage(activeTab === 'login' ? '🎉 Login successful! Redirecting...' : '✨ Account created! Welcome!')
      
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1500)
    } else {
      setMessage(`❌ ${result.error || 'Authentication failed'}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Desktop Hero Section - Hidden on Mobile */}
      <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Container with padding for navbar */}
      <div className="relative min-h-screen pt-16"> {/* pt-16 adds padding for navbar */}
        {/* Mobile Header - Only on Mobile */}
        <div className="lg:hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Tv className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ShowmoMarket</h1>
                <p className="text-blue-100 text-sm">Official Fan Store</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              <Sparkles className="h-4 w-4 inline mr-1" />
              Premium
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join Our Community'}
            </h2>
            <p className="text-blue-100">
              {activeTab === 'login' 
                ? 'Sign in to access exclusive merchandise' 
                : 'Create account for member benefits'}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Desktop Only */}
          <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white min-h-[calc(100vh-4rem)]">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                      <Tv className="h-7 w-7" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      ShowmoMarket
                    </h1>
                    <p className="text-blue-200 text-sm flex items-center gap-1">
                      <span className="animate-pulse">●</span> Official Fan Store
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 text-yellow-300 animate-spin" />
                  <span className="text-sm font-medium">Premium Store</span>
                </div>
              </div>

              {/* Hero Content */}
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-pulse">
                  <TrendingUp className="h-4 w-4 text-green-300" />
                  <span className="text-sm font-medium">#1 Fan Merchandise Store</span>
                </div>
                
                <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="block">Wear Your</span>
                  <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Favorite Shows
                  </span>
                </h2>
                
                <p className="text-lg text-blue-100 opacity-90 max-w-lg mb-8">
                  Join 50,000+ fans expressing their fandom with premium quality merchandise from top TV series.
                </p>

                {/* TV Shows Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Office', 'Friends', 'Money Heist'].map((show, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full animate-slideIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="font-bold">{show}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Grid - Desktop Only */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                {[
                  { icon: <Package />, title: 'Premium Quality', desc: 'Official Licensed', color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-300' },
                  { icon: <Truck />, title: 'Free Shipping', desc: 'Orders above ₹199', color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-300' },
                  { icon: <ShieldCheck />, title: '100% Secure', desc: 'UPI & SSL Protected', color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-300' },
                  { icon: <Gift />, title: 'Exclusive Deals', desc: 'Member Benefits', color: 'from-rose-500/20 to-red-500/20', iconColor: 'text-rose-300' }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                  >
                    <div className={`p-2 bg-gradient-to-br ${feature.color} rounded-xl`}>
                      <div className={feature.iconColor}>{feature.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                      <p className="text-xs text-blue-200">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial - Desktop Only */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                </div>
                <span className="text-sm text-blue-200">Rated 4.8/5 by fans</span>
              </div>
              <p className="text-blue-100 italic mb-4">
                "Finally found authentic Breaking Bad merch! Quality exceeded expectations."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-white">Rahul Sharma</p>
                  <p className="text-xs text-blue-200">Breaking Bad Collector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form (Full width on mobile, half on desktop) */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-md mt-4 lg:mt-0">
              {/* Main Card - Different styling for mobile */}
              <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-2xl overflow-hidden border border-gray-100">
                {/* Card Header - Hidden on mobile (already shown in mobile header) */}
                <div className="hidden lg:block relative p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">Welcome Back!</h1>
                      <p className="text-blue-100">Access your fan account</p>
                    </div>
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl animate-bounce">
                      <Heart className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Mobile Tabs Header */}
                <div className="lg:hidden flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-4 text-center font-bold transition-all relative ${
                      activeTab === 'login'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4" />
                      Login
                    </div>
                    {activeTab === 'login' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-4 text-center font-bold transition-all relative ${
                      activeTab === 'register'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </div>
                    {activeTab === 'register' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    )}
                  </button>
                </div>

                {/* Desktop Tabs - Below header */}
                <div className="hidden lg:flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-4 text-center font-bold transition-all relative ${
                      activeTab === 'login'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4" />
                      Login
                    </div>
                    {activeTab === 'login' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-4 text-center font-bold transition-all relative ${
                      activeTab === 'register'
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </div>
                    {activeTab === 'register' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    )}
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-6 lg:p-8">
                  {/* Messages */}
                  {(error || message) && (
                    <div className="mb-6 animate-fadeIn">
                      <div className={`flex items-center gap-3 p-4 rounded-xl ${
                        error 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                      }`}>
                        {error ? (
                          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                        <p className={error ? 'text-red-700' : 'text-green-700'}>{error || message}</p>
                      </div>
                    </div>
                  )}

                  {/* Desktop Only Content */}
                  <div className="hidden lg:block text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {activeTab === 'login' ? 'Secure Login' : 'Join Our Community'}
                    </h2>
                    <p className="text-gray-600">
                      {activeTab === 'login'
                        ? 'Sign in with Google to access your account'
                        : 'Create your account instantly with Google'}
                    </p>
                  </div>

                  {/* Mobile Icon - Only on mobile */}
                  <div className="lg:hidden flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center">
                        {activeTab === 'login' ? (
                          <Lock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <UserPlus className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Benefits - Only on desktop */}
                  <div className="hidden lg:block space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700">Track all your orders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Gift className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Exclusive member discounts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700">Earn loyalty points</span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group w-full mb-6"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      {/* Hover Effect - Desktop only */}
                      <div className="hidden lg:block absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                      
                      {/* Button */}
                      <div className="relative bg-white border-2 border-gray-200 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 lg:group-hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                            <span className="text-gray-700">
                              {activeTab === 'login' ? 'Logging in...' : 'Creating account...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-gray-800">
                              Continue with Google
                            </span>
                            <ArrowRight className="hidden lg:block h-5 w-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Security Info - Different on mobile */}
                  <div className="bg-gray-50 rounded-xl p-4 lg:p-5 border border-gray-100 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Secure & Instant</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Google-level security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">No password required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Your data is protected</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Shopping */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <Link 
                      to="/products" 
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Continue shopping without account
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      (Account required for checkout & order tracking)
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                      By continuing, you agree to our{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
                        Privacy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Footer - Desktop Only */}
              <div className="hidden lg:grid mt-8 grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-600">Happy Fans</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">4.8★</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>

              {/* Mobile Bottom Stats */}
              <div className="lg:hidden mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg">
                  <p className="text-lg font-bold">50K+</p>
                  <p className="text-xs opacity-90">Fans</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">
                  <p className="text-lg font-bold">24/7</p>
                  <p className="text-xs opacity-90">Support</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                  <p className="text-lg font-bold">4.8★</p>
                  <p className="text-xs opacity-90">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Banner - Adjusted for navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Ready to Shop?</p>
            <p className="text-sm text-blue-100">Browse products now</p>
          </div>
          <Link 
            to="/products" 
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Browse
          </Link>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}