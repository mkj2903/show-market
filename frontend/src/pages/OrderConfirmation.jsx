import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Package, Home, Truck, Mail } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, email, totalAmount, status, paymentMethod } = location.state || {};
  
  useEffect(() => {
    // If no order data, redirect to home
    if (!orderId || !email) {
      navigate('/');
    }
  }, [orderId, email, navigate]);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h1>
            
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your order. {paymentMethod === 'COD' ? 'Your COD order has been confirmed.' : 'Your payment is being verified by admin.'}
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-left">
                  <p className="text-sm text-gray-500 mb-2">Order ID</p>
                  <div className="flex items-center">
                    <p className="font-mono font-bold text-xl text-gray-900">
                      {orderId || 'ORD2024123456'}
                    </p>
                    {orderId && (
                      <button
                        onClick={() => copyToClipboard(orderId)}
                        className="ml-3 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                        title="Copy Order ID"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">Total Amount</p>
                  <p className="font-bold text-3xl text-blue-600">
                    ₹{totalAmount || '0'}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <p className="text-sm text-gray-500 mb-3">Order Status</p>
                <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-lg">
                  <Package className="h-5 w-5 mr-2" />
                  {paymentMethod === 'COD' ? 'COD Confirmed' : 'Payment Verification Pending'}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {paymentMethod === 'COD' 
                    ? 'Your COD order has been confirmed. You will pay when the order arrives.' 
                    : 'Our admin will verify your UTR within 1-2 hours.'}
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>Confirmation email sent to: <span className="font-medium">{email || 'your email'}</span></span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                What's Next?
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-lg">
                      {paymentMethod === 'COD' ? 'Order Processing' : 'Payment Verification'}
                    </p>
                    <p className="text-gray-600">
                      {paymentMethod === 'COD' 
                        ? 'We prepare your items for shipping'
                        : 'Admin verifies UTR within 1-2 hours'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-lg">Shipping Preparation</p>
                    <p className="text-gray-600">We pack your items with care</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-lg">Delivery</p>
                    <p className="text-gray-600">Order shipped with tracking information</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300"
              >
                <Home className="h-6 w-6" />
                Continue Shopping
              </Link>
              
              <Link
                to={`/track-order/${orderId || ''}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300"
              >
                <Truck className="h-6 w-6" />
                Track Your Order
              </Link>
            </div>
          </div>
          
          <div className="text-center text-gray-500">
            <p className="mb-2">Need help? Contact us: <span className="font-medium text-blue-600">support@tvmerch.com</span></p>
            <p className="text-sm">We're available 9 AM - 6 PM, Monday to Saturday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;