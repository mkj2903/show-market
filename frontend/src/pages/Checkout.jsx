import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  QrCode, 
  CheckCircle, 
  Copy, 
  Package, 
  Loader,
  MapPin,
  Edit2,
  ShoppingBag,
  Shield,
  CreditCard,
  AlertCircle,
  Wallet,
  Smartphone,
  Truck,
  IndianRupee,
  Tag,
  Percent,
  XCircle
} from 'lucide-react';
import { orderAPI } from '../utils/api';
import CouponApply from '../components/CouponApply';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getTotalPrice, clearCart, getIsBuyNow, resetBuyNowMode } = useCart();
  const { currentUser } = useAuth();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderData, setOrderData] = useState(null);
  
  const [storeSettings, setStoreSettings] = useState({
    upiId: 'tvmerch@upi',
    qrCodeImage: null
  });
  
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    discount: 0,
    delivery: 0,
    handlingCharge: 0,
    couponDiscount: 0,
    total: 0
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ✅ FIXED: Check if cart is empty
  useEffect(() => {
    resetBuyNowMode();
    
    if (cartItems.length === 0 && !success) {
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    }
  }, [cartItems, resetBuyNowMode, navigate, success]);

  // Load selected address
  useEffect(() => {
    if (location.state?.selectedAddress) {
      setSelectedAddress(location.state.selectedAddress);
    } else if (currentUser) {
      const addresses = JSON.parse(localStorage.getItem(`addresses_${currentUser.email}`)) || [];
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else {
        navigate('/address');
      }
    }
  }, [location.state, currentUser, navigate]);

  // Load store settings
  useEffect(() => {
    const loadStoreSettings = () => {
      try {
        const savedSettings = localStorage.getItem('storeSettings');
        const savedQrCode = localStorage.getItem('storeQrCode');
        const savedUpiId = localStorage.getItem('storeUpiId');
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setStoreSettings(prev => ({
            ...prev,
            upiId: parsedSettings.upiId || savedUpiId || 'tvmerch@upi',
            qrCodeImage: parsedSettings.qrCodeImage || savedQrCode
          }));
        } else if (savedUpiId || savedQrCode) {
          setStoreSettings(prev => ({
            ...prev,
            upiId: savedUpiId || 'tvmerch@upi',
            qrCodeImage: savedQrCode
          }));
        }
      } catch (error) {
        // Silent error
      }
    };
    
    loadStoreSettings();
    
    if (!currentUser) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    calculateOrderSummary();
    
    window.addEventListener('storage', loadStoreSettings);
    
    return () => {
      window.removeEventListener('storage', loadStoreSettings);
    };
  }, [currentUser, navigate, cartItems, paymentMethod, appliedCoupon]);

  // ✅ FIXED: Calculate order summary - WITH COUPON
  const calculateOrderSummary = () => {
    const subtotal = getTotalPrice();
    const delivery = subtotal >= 199 ? 0 : 9;
    
    let discount = 0;
    let handlingCharge = 0;
    
    if (paymentMethod === 'upi') {
      discount = 10;
      handlingCharge = 0;
    } else if (paymentMethod === 'cod') {
      discount = 0;
      handlingCharge = 9;
    }

    // Calculate coupon discount
    let couponDiscount = 0;
    if (appliedCoupon) {
      couponDiscount = appliedCoupon.discount;
    }
    
    // ✅ FIX: Add ALL charges correctly
    const total = subtotal + delivery + handlingCharge - discount - couponDiscount;
    
    setOrderSummary({ 
      subtotal, 
      discount, 
      delivery, 
      handlingCharge, 
      couponDiscount,
      total 
    });
  };

  const validateForm = () => {
    if (!selectedAddress) {
      setError('Please select a shipping address');
      return false;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return false;
    }

    // UPI validation
    if (paymentMethod === 'upi') {
      if (!utr || utr.length !== 12) {
        setError('Please enter a valid 12-digit UTR number for UPI payment');
        return false;
      }

      if (!/^\d{12}$/.test(utr)) {
        setError('UTR must contain only 12 digits (0-9) for UPI payment');
        return false;
      }
    }

    // COD validation
    if (paymentMethod === 'cod') {
      if (utr) {
        setError('UTR should not be entered for Cash on Delivery');
        return false;
      }
    }

    // Validate coupon minimum amount
    if (appliedCoupon && orderSummary.subtotal < appliedCoupon.minOrderAmount) {
      setError(`Coupon requires minimum order of ₹${appliedCoupon.minOrderAmount}`);
      return false;
    }

    return true;
  };

  // ✅ FIXED: Handle Place Order with coupon data
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (!currentUser) {
      setError('Please login to place order');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // ✅ FIXED: Prepare items correctly
      const items = cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        size: item.size || 'M',
        price: item.product.price,
        image: item.product.images?.[0] || ''
      }));

      // ✅ FIXED: Send order data with coupon
      const orderDataToSend = {
        userEmail: currentUser.email,
        userName: currentUser.displayName || selectedAddress.fullName || currentUser.email.split('@')[0],
        items: items,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          email: currentUser.email,
          phone: selectedAddress.phone,
          address: `${selectedAddress.houseFlat || ''} ${selectedAddress.street || ''}`.trim(),
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: 'India'
        },
        // ✅ SEND ALL CALCULATED AMOUNTS SEPARATELY
        totalAmount: orderSummary.total,
        subtotalAmount: orderSummary.subtotal,
        deliveryCharge: orderSummary.delivery,
        handlingCharge: orderSummary.handlingCharge,
        discount: orderSummary.discount,
        couponDiscount: orderSummary.couponDiscount,
        couponCode: appliedCoupon?.code || '',
        couponDetails: appliedCoupon || null,
        paymentMethod: paymentMethod.toUpperCase(),
        utrNumber: paymentMethod === 'upi' ? utr.trim() : '',
        status: 'payment_pending',
        paymentStatus: paymentMethod === 'cod' ? 'to_collect' : 'pending'
      };

      console.log('📦 Sending order data:', orderDataToSend);
      
      // ✅ FIXED: Use orderAPI.createOrder
      const response = await orderAPI.createOrder(orderDataToSend);

      if (response.success && response.order) {
        const order = response.order;
        setOrderData(order);
        setSuccess(`Order placed successfully! Order ID: ${order.orderId}`);
        clearCart();
        setAppliedCoupon(null);

        localStorage.setItem('lastOrderId', order.orderId);
        localStorage.setItem('lastOrderEmail', currentUser.email);

        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              orderId: order.orderId,
              email: currentUser.email,
              totalAmount: order.totalAmount,
              status: order.status,
              paymentMethod: order.paymentMethod,
              couponCode: order.couponCode
            }
          });
        }, 1500);
      } else {
        setError(response.message || 'Failed to create order. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle coupon apply
  const handleCouponApplied = (coupon) => {
    setAppliedCoupon(coupon);
    setError('');
  };

  // Handle coupon remove
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const upiInstructions = [
    'Open your UPI app (Google Pay, PhonePe, Paytm)',
    'Scan the QR code below',
    'Pay the exact amount shown',
    'Enter 12-digit UTR from payment receipt',
    'Click "Confirm & Place Order"'
  ];

  const codInstructions = [
    'Select Cash on Delivery option',
    '₹9 handling charge will be added',
    'No discount available for COD',
    'Pay when the delivery agent arrives',
    'Click "Confirm & Place Order"'
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // If cart is empty
  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty!</h1>
          <p className="text-gray-600 mb-6">Redirecting to products page...</p>
          <Link 
            to="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 text-yellow-500 mx-auto mb-4 flex items-center justify-center">
          <Package className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-gray-600 mb-6">Please login to proceed with checkout</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Checkout
              </h1>
              <p className="text-gray-600 mt-2">
                Complete your order with payment details
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/address"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Change Address
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center max-w-md mx-auto mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                1
              </div>
              <div className="ml-2">
                <p className="text-gray-500">Cart</p>
                <p className="text-sm text-gray-400">Review items</p>
              </div>
            </div>
            
            <div className="flex-1 h-1 mx-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                2
              </div>
              <div className="ml-2">
                <p className="text-gray-500">Address</p>
                <p className="text-sm text-gray-400">Delivery</p>
              </div>
            </div>
            
            <div className="flex-1 h-1 mx-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full"></div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                3
              </div>
              <div className="ml-2">
                <p className="font-semibold text-gray-900">Checkout</p>
                <p className="text-sm text-gray-500">Payment</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-700 font-medium">{success}</p>
                {orderData && (
                  <div className="mt-3 bg-white p-4 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Order ID:</p>
                        <p className="font-mono text-lg font-bold">{orderData.orderId}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(orderData.orderId)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-semibold text-yellow-600">Payment Pending</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Payment Method: <span className="font-semibold text-blue-600">{orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI'}</span>
                    </p>
                    {orderData.couponCode && (
                      <p className="text-sm text-gray-600 mt-1">
                        Coupon Applied: <span className="font-semibold text-green-600">{orderData.couponCode}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Redirecting to order confirmation...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UPI Option */}
                <div 
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Smartphone className={`h-6 w-6 ${paymentMethod === 'upi' ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Pay with UPI</h3>
                      <p className="text-sm text-gray-600">Instant & secure payment</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount</span>
                      <span className="text-green-600 font-bold">- ₹10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Handling Charge</span>
                      <span className="text-gray-700">₹0</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-bold">
                        <span>You Save</span>
                        <span className="text-green-600">₹10</span>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center text-blue-600 text-sm">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          ✓
                        </div>
                        <span>Selected - Get ₹10 discount</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div 
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Truck className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount</span>
                      <span className="text-gray-700">₹0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Handling Charge</span>
                      <span className="text-red-600 font-bold">+ ₹9</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Extra Charge</span>
                        <span className="text-red-600">₹9</span>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex items-center text-green-600 text-sm">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          ✓
                        </div>
                        <span>Selected - Pay when delivered</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Note:</span> {
                    paymentMethod === 'upi' 
                    ? '₹10 discount applied for online payment. No extra charges.' 
                    : '₹9 cash handling charge added for COD. Pay when your order arrives.'
                  }
                </p>
              </div>
            </div>

            {/* COUPON SECTION */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600" />
                Apply Coupon Code
              </h2>
              
              <CouponApply
                orderAmount={orderSummary.subtotal}
                onCouponApplied={handleCouponApplied}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />
            </div>

            {/* Selected Address Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-gray-600">Your order will be shipped to this address</p>
                  </div>
                </div>
                <Link
                  to="/address"
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 font-medium hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Change
                </Link>
              </div>

              {selectedAddress ? (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{selectedAddress.fullName}</h3>
                        {selectedAddress.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{selectedAddress.phone}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-sm border">
                      {selectedAddress.addressType}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-700">
                    <p>{selectedAddress.houseFlat}, {selectedAddress.street}</p>
                    {selectedAddress.landmark && (
                      <p className="text-gray-600">Near {selectedAddress.landmark}</p>
                    )}
                    <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No address selected</p>
                  <Link
                    to="/address"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Select Delivery Address →
                  </Link>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                  Order Items ({cartItems.length})
                </h2>
                <span className="text-gray-600">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
              
              {/* BUY NOW BADGE */}
              {getIsBuyNow && getIsBuyNow() && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center">
                    <span className="text-blue-600 font-bold mr-2">⚡</span>
                    <span className="text-blue-700 font-medium">Buy Now Mode</span>
                    <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      Only this item will be checked out
                    </span>
                  </div>
                </div>
              )}
              
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={`${item.product._id}-${item.size || 'M'}-${item.color || 'default'}`} className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex-shrink-0">
                        <img 
                          src={item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="font-bold text-gray-900">{item.product.name}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <span className="mr-4">Size: {item.size || 'M'}</span>
                          {item.color && <span className="mr-4">Color: {item.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{item.product.price}</p>
                        <p className="text-sm text-gray-600">
                          Total: ₹{item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Cart Total</span>
                      <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-3">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-3">Redirecting to products page...</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              )}
            </div>

            {/* Continue Shopping */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Need more merchandise?</p>
                    <p className="text-sm text-gray-600">Browse our exclusive collection</p>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-700 transition-all duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{orderSummary.subtotal}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Delivery</span>
                  <span className={orderSummary.delivery === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {orderSummary.delivery === 0 ? (
                      <span className="flex items-center gap-1">
                        FREE <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">SAVED ₹9</span>
                      </span>
                    ) : `₹${orderSummary.delivery}`}
                  </span>
                </div>
                
                {/* Handling Charge for COD */}
                {paymentMethod === 'cod' && orderSummary.handlingCharge > 0 && (
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Cash Handling Charge</span>
                    <span className="text-red-600 font-medium">+ ₹{orderSummary.handlingCharge}</span>
                  </div>
                )}
                
                {/* Discount for UPI */}
                {paymentMethod === 'upi' && orderSummary.discount > 0 && (
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-600">UPI Discount</span>
                    <span className="text-green-600 font-medium">- ₹{orderSummary.discount}</span>
                  </div>
                )}
                
                {/* Coupon Discount */}
                {orderSummary.couponDiscount > 0 && (
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Coupon Discount</span>
                      {appliedCoupon && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          {appliedCoupon.code}
                        </span>
                      )}
                    </div>
                    <span className="text-green-600 font-medium">- ₹{orderSummary.couponDiscount}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ₹{orderSummary.total}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
                {orderSummary.subtotal < 199 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    Add ₹{199 - orderSummary.subtotal} more for FREE delivery
                  </p>
                )}
                {paymentMethod === 'upi' && (
                  <p className="text-sm text-green-600 mt-1">
                    You save ₹10 with UPI payment
                  </p>
                )}
                {paymentMethod === 'cod' && (
                  <p className="text-sm text-gray-600 mt-1">
                    ₹9 handling charge added for COD
                  </p>
                )}
                {orderSummary.couponDiscount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    You saved ₹{orderSummary.couponDiscount} with coupon
                  </p>
                )}
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                  {paymentMethod === 'upi' ? (
                    <QrCode className="h-7 w-7 text-blue-600" />
                  ) : (
                    <Wallet className="h-7 w-7 text-green-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === 'upi' ? 'Scan QR code and enter UTR' : 'Pay when you receive the order'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* UPI QR Code Section */}
                {paymentMethod === 'upi' && (
                  <>
                    {/* QR Code Section */}
                    <div className="text-center">
                      <div className="inline-block p-4 border-2 border-gray-200 rounded-2xl bg-white">
                        <div className="w-56 h-56 mx-auto mb-4 flex items-center justify-center bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
                          {storeSettings.qrCodeImage ? (
                            <img 
                              src={storeSettings.qrCodeImage} 
                              alt="UPI QR Code" 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                              <div className="text-center">
                                <div className="h-20 w-20 text-blue-500 mx-auto mb-3 flex items-center justify-center">
                                  <QrCode className="h-16 w-16" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">Scan to Pay</p>
                                <p className="text-xs text-gray-500 mt-1">{storeSettings.upiId}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                          <p className="text-sm font-medium text-gray-700 mb-1">Pay Exact Amount</p>
                          <p className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{orderSummary.total}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            UPI ID: {storeSettings.upiId}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Steps */}
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Steps:</h3>
                      <ol className="space-y-3">
                        {upiInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {/* UTR Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        12-digit UTR Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={utr}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setUtr(value);
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg bg-gray-50"
                          placeholder="Enter 12-digit UTR from payment"
                          maxLength={12}
                          required
                        />
                        {utr && (
                          <button
                            onClick={() => copyToClipboard(utr)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            title="Copy UTR"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Enter the 12-digit UTR number from your UPI payment receipt
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Test UTR: <span className="font-mono">123456789012</span>
                      </p>
                    </div>
                  </>
                )}

                {/* COD Instructions */}
                {paymentMethod === 'cod' && (
                  <>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-3">How COD works:</h3>
                      <ol className="space-y-3">
                        {codInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="p-4 border-2 border-green-200 rounded-xl bg-green-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <IndianRupee className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Cash Payment at Delivery</h4>
                          <p className="text-sm text-gray-600">
                            Pay ₹{orderSummary.total} (including ₹9 handling charge) when your order arrives
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-yellow-200 rounded-xl bg-yellow-50">
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• ₹9 cash handling charge is added for COD orders</li>
                        <li>• No UTR number needed for COD</li>
                        <li>• Have exact change ready for the delivery agent</li>
                        <li>• Order will be processed immediately</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0 || !selectedAddress}
                  className={`w-full group ${loading || cartItems.length === 0 || !selectedAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${paymentMethod === 'upi' ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-amber-600'} rounded-xl blur opacity-70 group-hover:opacity-100 animate-gradient-x ${
                      loading || cartItems.length === 0 || !selectedAddress ? 'opacity-30' : ''
                    }`}></div>
                    <div className={`relative ${paymentMethod === 'upi' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-orange-600 to-amber-600'} text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 ${
                      loading || cartItems.length === 0 || !selectedAddress ? 'bg-gray-400' : ''
                    }`}>
                      {loading ? (
                        <>
                          <Loader className="animate-spin h-6 w-6 mr-3" />
                          Processing Order...
                        </>
                      ) : cartItems.length === 0 ? (
                        'Cart is Empty'
                      ) : !selectedAddress ? (
                        'Select Address First'
                      ) : paymentMethod === 'upi' ? (
                        'Confirm & Place Order'
                      ) : (
                        'Place COD Order'
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Secure Checkout</h4>
                  <p className="text-sm text-gray-600">Your order is protected</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                {paymentMethod === 'upi' ? (
                  <>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                      <span>UPI with manual verification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                      <span>Admin verifies every payment</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                      <span>₹10 discount for online payment</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                      <span>Pay when you receive the order</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                      <span>No upfront payment required</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                      <span>₹9 handling charge for COD</span>
                    </div>
                  </>
                )}
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                  <span>Order tracking after payment/confirmation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                  <span>Email notifications for all updates</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">✓</div>
                    <span>Coupon applied: Save ₹{appliedCoupon.discount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default Checkout;