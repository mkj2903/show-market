import React, { useState, useEffect } from 'react';
import { 
  X, Package, User, Mail, MapPin, CreditCard, 
  Truck, Calendar, Phone, Home, ShoppingBag, 
  DollarSign, FileText, Hash 
} from 'lucide-react';

const OrderModal = ({ order, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fullOrderDetails, setFullOrderDetails] = useState(null);

  useEffect(() => {
    if (order?._id) {
      fetchFullOrderDetails(order._id);
    }
  }, [order]);

  const fetchFullOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setFullOrderDetails(data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  // Use full details if available, otherwise use basic order data
  const displayOrder = fullOrderDetails || order;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    if (!displayOrder.items) return 0;
    return displayOrder.items.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const shippingCharge = displayOrder.shippingAddress?.country === 'India' ? 9 : 200;
  const subtotal = calculateSubtotal();
  const total = displayOrder.totalAmount || subtotal + shippingCharge;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600">
                Order ID: <span className="font-mono font-semibold">
                  {displayOrder.orderId || `ORD-${displayOrder._id?.toString().slice(-6).toUpperCase()}`}
                </span>
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Order Status & Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Order Status</h3>
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(displayOrder.status)}`}>
                      {formatStatus(displayOrder.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                {/* Status Timeline */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {['payment_pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => (
                    <div key={status} className="text-center">
                      <div className={`h-2 rounded-full mb-2 ${
                        displayOrder.status === status 
                          ? 'bg-blue-600' 
                          : displayOrder.status === 'cancelled' 
                            ? 'bg-red-300'
                            : index <= ['payment_pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(displayOrder.status)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                      }`}></div>
                      <span className="text-xs font-medium capitalize">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {displayOrder.user?.name || displayOrder.shippingAddress?.fullName || 'Customer'}
                          </p>
                          <p className="text-sm text-gray-600">Customer Name</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {displayOrder.user?.email || displayOrder.shippingAddress?.email || 'No email'}
                          </p>
                          <p className="text-sm text-gray-600">Email Address</p>
                        </div>
                      </div>
                      {displayOrder.shippingAddress?.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {displayOrder.shippingAddress.phone}
                            </p>
                            <p className="text-sm text-gray-600">Phone Number</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                      Shipping Address
                    </h3>
                    {displayOrder.shippingAddress ? (
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Home className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {displayOrder.shippingAddress.fullName}
                            </p>
                            <p className="text-gray-600">
                              {displayOrder.shippingAddress.address}
                              <br />
                              {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.state}
                              <br />
                              {displayOrder.shippingAddress.pincode}, {displayOrder.shippingAddress.country}
                            </p>
                          </div>
                        </div>
                        {displayOrder.shippingAddress.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-3" />
                            <p className="text-gray-600">{displayOrder.shippingAddress.phone}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No shipping address provided</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-purple-600" />
                      Order Items ({displayOrder.items?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {displayOrder.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center flex-1">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name || `Product ${index + 1}`}</h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-600">Size: {item.size || 'One Size'}</span>
                                <span className="text-sm text-gray-600">Qty: {item.quantity || 1}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                            <p className="text-sm text-gray-600">
                              Total: ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-red-600" />
                      Payment & Summary
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Payment Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="font-medium text-gray-900">{displayOrder.paymentMethod || 'UPI'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Status</p>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            displayOrder.paymentStatus === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : displayOrder.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {displayOrder.paymentStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                      </div>
                      
                      {/* UTR Number */}
                      {displayOrder.utrNumber && (
                        <div>
                          <p className="text-sm text-gray-600">UTR Number</p>
                          <p className="font-mono font-medium text-gray-900">{displayOrder.utrNumber}</p>
                        </div>
                      )}
                      
                      {/* Tracking Information */}
                      {displayOrder.trackingNumber && (
                        <div>
                          <p className="text-sm text-gray-600">Tracking Information</p>
                          <div className="flex items-center mt-1">
                            <Truck className="w-4 h-4 text-gray-400 mr-2" />
                            <p className="font-medium text-gray-900">
                              {displayOrder.trackingNumber}
                              {displayOrder.carrier && ` via ${displayOrder.carrier}`}
                            </p>
                          </div>
                          {displayOrder.trackingUrl && (
                            <a 
                              href={displayOrder.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm hover:underline mt-1 inline-block"
                            >
                              Track Package →
                            </a>
                          )}
                        </div>
                      )}
                      
                      {/* Order Summary */}
                      <div className="border-t pt-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">₹{shippingCharge.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total Amount</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order Created</p>
                        <p className="text-sm text-gray-600">{formatDate(displayOrder.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">✓ Completed</span>
                  </div>
                  
                  {displayOrder.paymentVerifiedAt && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CreditCard className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Payment Verified</p>
                          <p className="text-sm text-gray-600">{formatDate(displayOrder.paymentVerifiedAt)}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">✓ Completed</span>
                    </div>
                  )}
                  
                  {displayOrder.shippedAt && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Truck className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Shipped</p>
                          <p className="text-sm text-gray-600">{formatDate(displayOrder.shippedAt)}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">✓ Completed</span>
                    </div>
                  )}
                  
                  {displayOrder.deliveredAt && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                          <Package className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Delivered</p>
                          <p className="text-sm text-gray-600">{formatDate(displayOrder.deliveredAt)}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">✓ Completed</span>
                    </div>
                  )}
                  
                  {displayOrder.expectedDelivery && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Expected Delivery</p>
                          <p className="text-sm text-gray-600">{formatDate(displayOrder.expectedDelivery)}</p>
                        </div>
                      </div>
                      <span className="text-sm text-yellow-600">⌛ Pending</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Admin Notes */}
              {displayOrder.adminNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-yellow-600" />
                    Admin Notes
                  </h3>
                  <p className="text-gray-700">{displayOrder.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Order Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;