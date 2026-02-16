import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  ChevronRight,
  ShoppingBag,
  Home,
  ExternalLink,
  Filter,
  RefreshCw,
  DollarSign,
  Calendar,
  ArrowRight,
  Star,
  Award,
  CreditCard,
  Smartphone,
  IndianRupee,
  Wallet,
  QrCode
} from 'lucide-react';
import { getUserOrdersByEmail } from '../utils/api';

const MyOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Status icons and colors
  const statusConfig = {
    'payment_pending': { 
      icon: Clock, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      label: 'Payment Pending',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    'confirmed': { 
      icon: CheckCircle, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      label: 'Confirmed',
      badge: 'bg-blue-100 text-blue-800'
    },
    'processing': { 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      label: 'Processing',
      badge: 'bg-blue-100 text-blue-800'
    },
    'shipped': { 
      icon: Truck, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100', 
      label: 'Shipped',
      badge: 'bg-purple-100 text-purple-800'
    },
    'delivered': { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      label: 'Delivered',
      badge: 'bg-green-100 text-green-800'
    },
    'cancelled': { 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      label: 'Cancelled',
      badge: 'bg-red-100 text-red-800'
    }
  };

  // Payment method config
  const paymentMethodConfig = {
    'upi': {
      icon: Smartphone,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      label: 'UPI Payment',
      badge: 'bg-blue-100 text-blue-800',
      description: '₹10 discount applied'
    },
    'cod': {
      icon: Wallet,
      color: 'text-green-600',
      bg: 'bg-green-100',
      label: 'Cash on Delivery',
      badge: 'bg-green-100 text-green-800',
      description: '₹9 handling charge'
    }
  };

  const fetchOrders = async () => {
    if (!currentUser?.email) return;

    setLoading(true);
    try {
      const response = await getUserOrdersByEmail(currentUser.email);
      if (response.success) {
        // Sort by latest first
        const sortedOrders = response.orders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        // Fallback: try to get all orders and filter
        console.log('Using fallback for orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    if (filter === 'active') {
      return orders.filter(order => 
        !['delivered', 'cancelled'].includes(order.status)
      );
    }
    if (filter === 'delivered') {
      return orders.filter(order => order.status === 'delivered');
    }
    return orders.filter(order => order.status === filter);
  };

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.payment_pending;
  };

  const getPaymentMethodInfo = (paymentMethod) => {
    return paymentMethodConfig[paymentMethod] || paymentMethodConfig.upi;
  };

  const filteredOrders = getFilteredOrders();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-full mb-4">
                <Package className="w-4 h-4" />
                <span className="text-sm font-bold">MY ORDER HISTORY</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                My Orders
              </h1>
              <p className="text-blue-200 text-lg max-w-2xl">
                View all your past and current orders in one place
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">
                  {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-3xl font-bold mt-2 text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold mt-2 text-purple-600">
                  {formatCurrency(orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'active'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active Orders
              </button>
              
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'delivered'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivered
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 border-4 border-white rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Loading Your Orders...</h3>
            <p className="text-gray-600">Fetching your order history</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No Orders Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `No ${filter} orders found.`}
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const paymentInfo = getPaymentMethodInfo(order.paymentMethod);
              const PaymentIcon = paymentInfo.icon;
              
              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${statusInfo.bg}`}>
                          <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.orderId || order._id?.slice(-8).toUpperCase()}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.badge}`}>
                              {statusInfo.label}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(order.totalAmount || 0)}
                          </p>
                        </div>
                        
                        <Link
                          to={`/track-order/${order.orderId || order._id}`}
                          className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Track Order
                        </Link>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} • Size: {item.size || 'One Size'}
                              </p>
                              <p className="text-sm font-bold text-blue-600">
                                {formatCurrency((item.price || 0) * (item.quantity || 1))}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {order.items?.length > 3 && (
                          <div className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                            <span className="font-medium text-gray-700">
                              +{order.items.length - 3} more items
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment & Order Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
                      {/* Payment Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Payment Information</h4>
                        
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${paymentInfo.bg}`}>
                            <PaymentIcon className={`w-5 h-5 ${paymentInfo.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{paymentInfo.label}</p>
                            <p className="text-sm text-gray-600">{paymentInfo.description}</p>
                            {order.paymentMethod === 'upi' && order.utrNumber && (
                              <p className="text-xs font-mono text-gray-700 mt-1">
                                UTR: {order.utrNumber}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.paymentStatus === 'verified' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'to_collect' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.paymentStatus === 'verified' ? 'Verified' :
                             order.paymentStatus === 'to_collect' ? 'To Collect (COD)' :
                             'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Order Summary Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Order Summary</h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₹{order.subtotalAmount || 0}</span>
                          </div>
                          
                          {order.deliveryCharge !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery</span>
                              <span className={`font-medium ${order.deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                                {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                              </span>
                            </div>
                          )}
                          
                          {order.handlingCharge && order.handlingCharge > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cash Handling Charge</span>
                              <span className="font-medium text-red-600">+ ₹{order.handlingCharge}</span>
                            </div>
                          )}
                          
                          {order.discount && order.discount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">UPI Discount</span>
                              <span className="font-medium text-green-600">- ₹{order.discount}</span>
                            </div>
                          )}
                          
                          <div className="pt-2 border-t">
                            <div className="flex justify-between font-bold">
                              <span>Total Amount</span>
                              <span className="text-lg text-purple-600">
                                ₹{order.totalAmount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t">
                      <div className="text-sm text-gray-600">
                        <p>Order will be shipped to:</p>
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress?.fullName || 'Customer'}, {order.shippingAddress?.city || ''}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Write Review
                          </button>
                        )}
                        
                        <button 
                          onClick={() => navigate(`/track-order/${order.orderId || order._id}`)}
                          className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                          <Truck className="w-4 h-4" />
                          View Tracking
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && orders.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;