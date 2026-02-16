import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { adminApi } from '../../utils/api';
import OrderTable from '../../components/admin/OrderTable';
import OrderModal from '../../components/admin/OrderModal';
import PaymentVerificationModal from '../../components/admin/PaymentVerificationModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getOrders({
        page: currentPage,
        status: statusFilter,
        search: searchTerm
      });
      
      if (response.success) {
        setOrders(response.orders || []);
        setTotalPages(response.totalPages || 1);
      } else {
        // Demo data for testing if API fails
        setOrders([
          { 
            _id: '1',
            orderId: 'ORD-001', 
            user: { name: 'John Doe', email: 'john@example.com' },
            totalAmount: '1499', 
            status: 'delivered', 
            paymentStatus: 'verified', 
            createdAt: '2024-01-20',
            utrNumber: '123456789012'
          },
          { 
            _id: '2',
            orderId: 'ORD-002', 
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            totalAmount: '899', 
            status: 'processing', 
            paymentStatus: 'verified', 
            createdAt: '2024-01-21',
            utrNumber: '123456789013'
          },
          { 
            _id: '3',
            orderId: 'ORD-003', 
            user: { name: 'Robert Johnson', email: 'robert@example.com' },
            totalAmount: '2299', 
            status: 'payment_pending', 
            paymentStatus: 'pending', 
            createdAt: '2024-01-22',
            utrNumber: ''
          },
          { 
            _id: '4',
            orderId: 'ORD-004', 
            user: { name: 'Emily Davis', email: 'emily@example.com' },
            totalAmount: '1199', 
            status: 'shipped', 
            paymentStatus: 'verified', 
            createdAt: '2024-01-23',
            utrNumber: '123456789014'
          },
          { 
            _id: '5',
            orderId: 'ORD-005', 
            user: { name: 'Michael Wilson', email: 'michael@example.com' },
            totalAmount: '799', 
            status: 'delivered', 
            paymentStatus: 'verified', 
            createdAt: '2024-01-24',
            utrNumber: '123456789015'
          },
        ]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      console.log(`Updating order ${orderId} status to ${status}`);
      const response = await adminApi.updateOrderStatus(orderId, { status });
      
      if (response.success) {
        fetchOrders();
        alert('Order status updated successfully!');
      } else {
        alert(`Failed to update order status: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const handleVerifyPayment = async (orderId, action, utrNumber = '') => {
    try {
      console.log(`Verifying payment: orderId=${orderId}, action=${action}, utr=${utrNumber}`);
      
      const response = await adminApi.verifyPayment(orderId, {
        action,
        utrNumber
      });
      
      console.log('Payment verification response:', response);
      
      if (response.success) {
        fetchOrders();
        setShowPaymentModal(false);
        alert(`Payment ${action}d successfully!`);
      } else {
        alert(`Payment verification failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment. Check console for details.');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleVerifyPaymentClick = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  // ✅ ADDED: Function to format status for display
  const formatStatus = (status) => {
    const statusMap = {
      'payment_pending': 'Payment Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Payment Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCurrentPage(1);
              fetchOrders();
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <OrderTable
          orders={orders}
          loading={loading}
          onViewOrder={handleViewOrder}
          onVerifyPayment={handleVerifyPaymentClick}
          onUpdateStatus={handleStatusUpdate}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {/* Payment Verification Modal */}
      {showPaymentModal && selectedOrder && (
        <PaymentVerificationModal
          order={selectedOrder}
          onVerify={handleVerifyPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default Orders;