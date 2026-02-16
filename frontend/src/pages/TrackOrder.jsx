import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Package, CheckCircle, Clock, Truck, XCircle, Home,
  Search, Copy, Calendar, MapPin, Phone, Mail,
  ChevronRight, RefreshCw, ArrowLeft, AlertCircle,
  DollarSign, CreditCard, TruckIcon, ExternalLink
} from 'lucide-react';
import { orderAPI } from '../utils/api';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(orderId || '');
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  // Order status steps
  const statusSteps = [
    { 
      status: 'payment_pending', 
      label: 'Payment Pending', 
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      description: 'Waiting for payment verification'
    },
    { 
      status: 'confirmed', 
      label: 'Confirmed', 
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'Order confirmed by admin'
    },
    { 
      status: 'processing', 
      label: 'Processing', 
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'Order is being prepared'
    },
    { 
      status: 'shipped', 
      label: 'Shipped', 
      icon: Truck,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'Order has been dispatched'
    },
    { 
      status: 'delivered', 
      label: 'Delivered', 
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'Order has been delivered'
    }
  ];

  const fetchOrderDetails = async (id, email) => {
    if (!id.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // ✅ FIXED: Use trackOrder function correctly with both parameters
      const response = await orderAPI.trackOrder(id, email);
      
      if (response.success && response.order) {
        setOrder(response.order);
      } else {
        setError(response.message || 'Order not found. Please check your Order ID and try again.');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Error fetching order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && currentUser?.email) {
      setSearchInput(orderId);
      setUserEmail(currentUser.email);
      fetchOrderDetails(orderId, currentUser.email);
    }
  }, [orderId, currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const emailToUse = currentUser?.email || userEmail;
      if (!emailToUse) {
        setError('Please enter your email address');
        return;
      }
      fetchOrderDetails(searchInput, emailToUse);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusInfo = (status) => {
    const step = statusSteps.find(step => step.status === status);
    if (step) return step;
    
    return {
      status,
      label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
      icon: Package,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      description: 'Order status'
    };
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const step = statusSteps.findIndex(step => step.status === order.status);
    return step >= 0 ? step : 0;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <Link to="/my-orders" className="text-white/80 hover:text-white transition-colors">
                My Orders
              </Link>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <span className="text-white">Track Order</span>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 rounded-full mb-6">
                <Truck className="w-5 h-5" />
                <span className="font-bold">ORDER TRACKING</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Track Your Order
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Enter your Order ID to track its current status and delivery details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              {/* Email Input (for non-logged in users) */}
              {!currentUser && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This should be the email you used when placing the order
                  </p>
                </div>
              )}
              
              {/* Order ID Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order ID *
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Order ID (e.g., ORD2602097041)"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </form>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Find Order ID in your order confirmation email</span>
              </div>
              {currentUser && (
                <Link 
                  to="/my-orders" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Orders →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-700 mb-1">Order Not Found</h3>
                  <p className="text-red-600">{error}</p>
                  <p className="text-sm text-red-500 mt-2">
                    Tip: Make sure you entered the correct Order ID and Email address
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 border-4 border-white rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <Truck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Tracking Your Order...</h3>
            <p className="text-gray-600">Fetching order details and tracking information</p>
          </div>
        )}

        {/* Order Tracking Details */}
        {order && !loading && (
          <div className="max-w-6xl mx-auto">
            {/* Order Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-xl ${getStatusInfo(order.status).bg}`}>
                      {(() => {
                        const Icon = getStatusInfo(order.status).icon;
                        return <Icon className={`w-6 h-6 ${getStatusInfo(order.status).color}`} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Order #{order.orderId}
                      </h2>
                      <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusInfo(order.status).bg} ${getStatusInfo(order.status).color}`}>
                      {getStatusInfo(order.status).label}
                    </span>
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {order.items?.length || 0} Items
                    </span>
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Total: {formatCurrency(order.totalAmount)}
                    </span>
                    {order.paymentMethod && (
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        order.paymentMethod === 'COD' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                  <button
                    onClick={() => fetchOrderDetails(order.orderId, order.userEmail)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200">
                  <div 
                    className="absolute top-0 left-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="relative">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.status} className="flex items-start mb-8 last:mb-0">
                        <div className="relative z-10 flex-shrink-0">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                              : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          {isCurrent && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="ml-6 pt-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className={`text-lg font-bold ${
                              isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full font-bold">
                                CURRENT
                              </span>
                            )}
                            {isCompleted && !isCurrent && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">
                                COMPLETED
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{step.description}</p>
                          
                          {isCurrent && order.status === step.status && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-700">
                                {step.status === 'payment_pending' && 'Waiting for payment verification by admin...'}
                                {step.status === 'confirmed' && 'Your order has been confirmed and is being processed.'}
                                {step.status === 'processing' && 'Your order is being processed and prepared for shipping.'}
                                {step.status === 'shipped' && 'Your order has been shipped and is on its way to you.'}
                                {step.status === 'delivered' && 'Your order has been successfully delivered.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Estimated Delivery</p>
                    <p className="text-green-700">
                      {order.status === 'delivered' 
                        ? `Delivered on ${formatDate(order.deliveredAt || order.updatedAt || order.createdAt)}`
                        : '3-7 business days from order confirmation'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details (Collapsible) */}
            {showDetails && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            {item.size && <span className="text-sm text-gray-600">Size: {item.size}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="space-y-6">
                  {/* Shipping Info */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TruckIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Shipping Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                          <p className="text-gray-600">{order.shippingAddress?.address}</p>
                          <p className="text-gray-600">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{order.shippingAddress?.phone || 'Not provided'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{order.shippingAddress?.email || order.userEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Payment Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium">
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI Payment'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Status</span>
                        <span className={`font-medium ${
                          order.paymentStatus === 'verified' || order.paymentStatus === 'collected' ? 'text-green-600' :
                          order.paymentStatus === 'to_collect' ? 'text-yellow-600' :
                          'text-yellow-600'
                        }`}>
                          {order.paymentStatus === 'verified' ? 'Verified' :
                           order.paymentStatus === 'collected' ? 'Collected' :
                           order.paymentStatus === 'to_collect' ? 'To Collect (COD)' :
                           'Pending'}
                        </span>
                      </div>
                      
                      {order.utrNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">UTR Number</span>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {order.utrNumber}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(order.utrNumber)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Order Breakdown */}
                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">₹{order.subtotalAmount || 0}</span>
                        </div>
                        
                        {order.deliveryCharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Charge</span>
                            <span className="font-medium">₹{order.deliveryCharge}</span>
                          </div>
                        )}
                        
                        {order.handlingCharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Handling Charge</span>
                            <span className="font-medium text-red-600">+ ₹{order.handlingCharge}</span>
                          </div>
                        )}
                        
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-green-600">- ₹{order.discount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">Total Amount</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              {currentUser && (
                <Link
                  to="/my-orders"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  View All Orders
                </Link>
              )}
              
              <button
                onClick={() => copyToClipboard(order.orderId)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all"
              >
                <Copy className="w-5 h-5" />
                Copy Order ID
              </button>
              
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!order && !loading && !error && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Track Your Order</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Find Your Order ID</h4>
                  <p className="text-gray-600">
                    Check your order confirmation email for the Order ID
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Enter Details</h4>
                  <p className="text-gray-600">
                    Enter your Order ID and email address in the form above
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">View Status</h4>
                  <p className="text-gray-600">
                    See real-time updates on your order status and delivery date
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Need Help?</p>
                    <p className="text-gray-600">
                      If you're having trouble tracking your order, please contact our support team at 
                      <span className="font-medium text-blue-600"> support@tvmerch.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;