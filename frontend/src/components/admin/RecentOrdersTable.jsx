import React from 'react';
import { Package, CheckCircle, Clock, Truck, AlertCircle, DollarSign } from 'lucide-react';

const RecentOrdersTable = ({ orders, loading }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing': return <Package className="w-4 h-4 text-indigo-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'payment_pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600">Orders will appear here when customers place them</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 10).map((order) => (
            <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium block">
                      {order.orderId || `#ORD-${order._id?.toString().slice(-6).toUpperCase()}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {order.user?.name || order.customer || order.userName || 'Customer'}
                  </div>
                  <div className="text-gray-500 truncate max-w-[150px]">
                    {order.user?.email || order.userEmail || 'No email'}
                  </div>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 text-gray-400 mr-1" />
                  <div className="text-sm font-medium text-gray-900">
                    ₹{(order.totalAmount || order.amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2 text-sm font-medium capitalize">
                    {formatStatus(order.status)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {order.paymentStatus === 'verified' ? 'Paid' : 'Payment Pending'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {orders.length > 10 && (
        <div className="text-center py-3 border-t">
          <a 
            href="/admin/orders" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all orders →
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;