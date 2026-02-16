import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Sparkles,
  Tag,
  Package,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [removingItem, setRemovingItem] = useState(null);

  // FIXED: Added color parameter
  const handleRemoveItem = (productId, size, color = '') => {
    setRemovingItem(`${productId}-${size}-${color}`);
    setTimeout(() => {
      removeFromCart(productId, size, color);
      setRemovingItem(null);
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // FIXED: Added color parameter to quantity update functions
  const handleIncreaseQuantity = (productId, size, currentQuantity, color = '') => {
    updateQuantity(productId, size, currentQuantity + 1, color);
  };

  const handleDecreaseQuantity = (productId, size, currentQuantity, color = '') => {
    if (currentQuantity > 1) {
      updateQuantity(productId, size, currentQuantity - 1, color);
    }
  };

  // Function to handle item click (navigate to product detail)
  const handleItemClick = (productId, e) => {
    // Check if the click is on a button or link (prevent navigation for buttons)
    const isButton = e.target.tagName === 'BUTTON' || 
                     e.target.closest('button') || 
                     e.target.closest('a');
    
    if (!isButton) {
      window.location.href = `/product/${productId}`;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              {/* Animated Empty Cart */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative w-40 h-40 bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center mx-auto border-2 border-gray-100 shadow-2xl">
                  <div className="relative">
                    <ShoppingCart className="w-20 h-20 text-gray-300" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">0</span>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Your Cart is Feeling Empty
              </h1>
              <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto">
                Looks like you haven't added any awesome TV show merchandise yet. Let's fill it up!
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exclusive Products</h3>
                  <p className="text-sm text-gray-600">Limited edition TV show collectibles</p>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                    <Truck className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
                  <p className="text-sm text-gray-600">On orders above ₹199</p>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Checkout</h3>
                  <p className="text-sm text-gray-600">Safe & encrypted transactions</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <Link
                  to="/products"
                  className="relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Start Shopping
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                </Link>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                Browse our collection of 7 categories including T-Shirts, Mugs, Accessories and more!
              </p>
            </div>
          </div>
        </div>
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
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">{cartItems.length}</span>
                </div>
                <ShoppingCart className="w-8 h-8 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="font-semibold text-gray-900">Cart</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gradient-to-r from-purple-600 via-blue-600 to-gray-200 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                2
              </div>
              <span className="text-gray-500">Checkout</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Total: <span className="font-semibold text-gray-900">₹{getTotalPrice()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Free shipping on ₹199+</span>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.product._id}-${item.size}-${item.color || 'default'}-${index}`}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                    removingItem === `${item.product._id}-${item.size}-${item.color || 'default'}` 
                      ? 'opacity-0 scale-95' 
                      : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image - Clickable */}
                      <div className="relative flex-shrink-0">
                        <Link 
                          to={`/product/${item.product._id}`}
                          className="block group"
                        >
                          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 relative">
                            <img
                              src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
                              alt={item.product.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* View Product Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">View Product</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                          <span className="text-white text-xs font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              {/* Product Name - Clickable */}
                              <Link 
                                to={`/product/${item.product._id}`}
                                className="group"
                              >
                                <h3 className="font-bold text-gray-900 text-lg mb-1 hover:text-blue-600 transition-colors duration-200 group-hover:underline">
                                  {item.product.name}
                                  <ExternalLink className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                                </h3>
                              </Link>
                              <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                ₹{item.product.price * item.quantity}
                              </p>
                            </div>
                            
                            {/* Product Info */}
                            <div 
                              className="flex flex-wrap items-center gap-4 mt-3 cursor-pointer"
                              onClick={(e) => handleItemClick(item.product._id, e)}
                            >
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                                <Tag className="w-3 h-3" />
                                {item.product.category}
                              </span>
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                Size: <span className="font-bold">{item.size}</span>
                              </span>
                              {item.color && item.color !== '' && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                  Color: <span className="font-bold">{item.color}</span>
                                </span>
                              )}
                              <span className="text-gray-600">
                                ₹{item.product.price} each
                              </span>
                            </div>
                            
                            {/* Product Description - Clickable Area */}
                            <div 
                              className="mt-3 cursor-pointer"
                              onClick={(e) => handleItemClick(item.product._id, e)}
                            >
                              <p className="text-gray-600 text-sm line-clamp-2 hover:text-gray-800 transition-colors">
                                {item.product.description.substring(0, 100)}...
                                <span className="ml-1 text-blue-600 font-medium inline-flex items-center gap-1">
                                  View details
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quantity Controls - FIXED: Added color parameter */}
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center">
                            <div className="flex items-center bg-gray-50 rounded-xl p-1">
                              <button
                                onClick={() => handleDecreaseQuantity(
                                  item.product._id, 
                                  item.size, 
                                  item.quantity,
                                  item.color
                                )}
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4 text-gray-700" />
                              </button>
                              <div className="w-16 h-10 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-900">{item.quantity}</span>
                              </div>
                              <button
                                onClick={() => handleIncreaseQuantity(
                                  item.product._id, 
                                  item.size, 
                                  item.quantity,
                                  item.color
                                )}
                                disabled={item.quantity >= 10}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(
                                item.product._id, 
                                item.size,
                                item.color
                              )}
                              className="ml-4 flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                          
                          {/* Quick View Button */}
                          <Link
                            to={`/product/${item.product._id}`}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Quick View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-blue-600" />
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
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="sticky top-24">
              <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6" />
                    Order Summary
                  </h2>
                </div>
                
                {/* Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-bold text-gray-900">₹{getTotalPrice()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Shipping</span>
                      <span className={`font-bold ${getTotalPrice() >= 199 ? 'text-green-600' : 'text-gray-900'}`}>
                        {getTotalPrice() >= 199 ? (
                          <span className="flex items-center gap-1">
                            FREE <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">SAVED ₹9</span>
                          </span>
                        ) : '₹9'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taxes</span>
                        <span className="text-gray-600">Included</span>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <div>
                          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            ₹{getTotalPrice() + (getTotalPrice() >= 199 ? 0 : 9)}
                          </p>
                          <p className="text-sm text-gray-500 text-right">Including all charges</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <div className="pt-6 space-y-4">
                      {currentUser ? (
                        <Link
                          to="/checkout"
                          className="block w-full group"
                        >
                          <div className="relative overflow-hidden rounded-xl">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 animate-gradient-x"></div>
                            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300">
                              Proceed to Checkout
                              <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="block w-full group"
                        >
                          <div className="relative overflow-hidden rounded-xl">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 animate-gradient-x"></div>
                            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300">
                              Login to Checkout
                            </div>
                          </div>
                        </Link>
                      )}
                      
                      {!currentUser && (
                        <p className="text-center text-sm text-blue-600 font-medium">
                          Login required for secure checkout
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features Card */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders above ₹199</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-600">UPI with verification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">7-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Cart;