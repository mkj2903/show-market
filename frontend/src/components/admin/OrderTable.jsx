import React from 'react';
import { Eye, CheckCircle, XCircle, Package, ShoppingBag, MapPin, Smartphone, Wallet, DollarSign } from 'lucide-react';

const OrderTable = ({ 
  orders, 
  loading, 
  onViewOrder, 
  onVerifyPayment, 
  onUpdateStatus,
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': 
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
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

  const getPaymentMethodColor = (paymentMethod) => {
    switch (paymentMethod) {
      case 'upi': return 'bg-blue-100 text-blue-800';
      case 'cod': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'upi': return <Smartphone className="w-3 h-3 mr-1" />;
      case 'cod': return <Wallet className="w-3 h-3 mr-1" />;
      default: return <DollarSign className="w-3 h-3 mr-1" />;
    }
  };

  const formatPaymentMethod = (paymentMethod) => {
    switch (paymentMethod) {
      case 'upi': return 'UPI';
      case 'cod': return 'COD';
      default: return paymentMethod || 'Unknown';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'collected': return 'bg-green-100 text-green-800';
      case 'to_collect': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPaymentStatus = (paymentStatus) => {
    switch (paymentStatus) {
      case 'verified': return 'Verified';
      case 'collected': return 'Collected';
      case 'to_collect': return 'To Collect';
      case 'pending': return 'Pending';
      default: return paymentStatus || 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id || order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderId ? `#${order.orderId}` : `#ORD-${order._id?.toString().slice(-6).toUpperCase()}`}
                  </div>
                  {order.trackingNumber && (
                    <div className="text-xs text-gray-500 mt-1">
                      Tracking: {order.trackingNumber}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.user?.name || order.shippingAddress?.fullName || order.userName || 'Customer'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user?.email || order.shippingAddress?.email || order.userEmail || 'No email'}
                  </div>
                  {order.shippingAddress?.phone && (
                    <div className="text-xs text-gray-500 mt-1">
                      📞 {order.shippingAddress.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="text-sm">
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      <div className="text-xs text-gray-500">
                        {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                        {order.items?.length > 2 && '...'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{order.totalAmount?.toLocaleString('en-IN') || '0'}
                  </div>
                  {order.discount > 0 && (
                    <div className="text-xs text-green-600">
                      ₹{order.discount} discount
                    </div>
                  )}
                  {order.handlingCharge > 0 && (
                    <div className="text-xs text-red-600">
                      ₹{order.handlingCharge} handling
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(order.paymentMethod)}`}>
                      {getPaymentMethodIcon(order.paymentMethod)}
                      {formatPaymentMethod(order.paymentMethod)}
                    </span>
                    {order.utrNumber && order.paymentMethod === 'upi' && (
                      <div className="text-xs text-gray-500 font-mono">
                        UTR: {order.utrNumber}
                      </div>
                    )}
                    {order.paymentMethod === 'cod' && (
                      <div className="text-xs text-yellow-600">
                        ₹{order.handlingCharge || 9} handling
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus === 'verified' || order.paymentStatus === 'collected' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : order.paymentStatus === 'to_collect' ? (
                      <Wallet className="w-3 h-3 mr-1" />
                    ) : (
                      <Package className="w-3 h-3 mr-1" />
                    )}
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    
                    {/* Show Verify Payment button only for UPI orders with pending status */}
                    {order.paymentMethod === 'upi' && order.paymentStatus === 'pending' && (
                      <button
                        onClick={() => onVerifyPayment(order)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Verify Payment
                      </button>
                    )}
                    
                    {/* Show Collect COD button for COD orders with to_collect status */}
                    {order.paymentMethod === 'cod' && order.paymentStatus === 'to_collect' && (
                      <button
                        onClick={() => onVerifyPayment(order)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Collect COD
                      </button>
                    )}
                    
                    <select
                      onChange={(e) => onUpdateStatus(order._id || order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={order.status}
                    >
                      <option value="payment_pending">Payment Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {orders.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter</p>
        </div>
      )}
    </>
  );
};

export default OrderTable;