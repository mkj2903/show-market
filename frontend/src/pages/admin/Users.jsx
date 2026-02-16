import React, { useState, useEffect } from 'react';
import { 
  Search, Mail, Phone, Calendar, ShoppingBag, 
  Shield, Trash2, Edit, Eye, UserX, UserCheck, 
  Filter, RefreshCw, ChevronRight, ExternalLink,
  AlertCircle, CheckCircle, XCircle, Users, Package
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [userStats, setUserStats] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  useEffect(() => {
    updateActiveFilters();
  }, [searchTerm, filterStatus, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers();
      
      if (response.success) {
        const usersWithStats = response.users.map(user => ({
          ...user,
          ordersCount: user.ordersCount || 0,
          totalSpent: user.totalSpent || 0,
          lastOrderDate: user.lastOrderDate || null
        }));
        setUsers(usersWithStats);
      } else {
        console.error('Error fetching users:', response.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    // Calculate stats from users data
    if (users.length > 0) {
      const stats = {
        total: users.length,
        active: users.filter(u => u.isActive !== false).length,
        inactive: users.filter(u => u.isActive === false).length,
        withOrders: users.filter(u => (u.ordersCount || 0) > 0).length,
        withoutOrders: users.filter(u => (u.ordersCount || 0) === 0).length,
        newToday: users.filter(u => {
          const today = new Date();
          const userDate = new Date(u.createdAt);
          return userDate.toDateString() === today.toDateString();
        }).length
      };
      setUserStats(stats);
    }
  };

  const fetchUserOrders = async (userId, userEmail) => {
    try {
      setLoadingOrders(true);
      // We need to fetch all orders and filter by user
      const response = await adminApi.getOrders({ limit: 100 });
      if (response.success) {
        // Filter orders by user email
        const userOrders = response.orders.filter(order => 
          order.user?.email === userEmail || order.userEmail === userEmail
        );
        setUserOrders(userOrders);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // In a real app, you would have deleteUser API
      // For now, we'll just remove from state
      const updatedUsers = users.filter(user => user._id !== userToDelete._id);
      setUsers(updatedUsers);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      
      // Show success message
      alert(`User "${userToDelete.name || userToDelete.email}" has been removed from the list.`);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleEditUser = (user) => {
    // In a real app, you would open an edit modal
    // For now, we'll show an alert with user details
    const editMessage = `
Edit User: ${user.name || 'No Name'}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}
Status: ${user.isActive !== false ? 'Active' : 'Inactive'}
Total Orders: ${user.ordersCount || 0}
    `;
    alert(editMessage);
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user._id, user.email);
    setShowUserDetails(true);
  };

  const handleViewAllOrders = (userEmail) => {
    // Navigate to orders page with user filter
    navigate(`/mohitaniljangra/orders?email=${encodeURIComponent(userEmail)}`);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // In a real app, you would call API to update user status
      const updatedUsers = users.map(user => {
        if (user._id === userId) {
          return { ...user, isActive: !currentStatus };
        }
        return user;
      });
      setUsers(updatedUsers);
      
      alert(`User status updated to ${!currentStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const updateActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (filterStatus !== 'all') filters.push(`Status: ${filterStatus === 'active' ? 'Active' : 'Inactive'}`);
    if (sortBy !== 'newest') filters.push(`Sort: ${sortBy}`);
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('newest');
  };

  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.phone && user.phone.includes(searchTerm));
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (filterStatus === 'active' && user.isActive === false) return false;
    if (filterStatus === 'inactive' && user.isActive !== false) return false;
    
    return true;
  }).sort((a, b) => {
    // Sorting
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'orders-high':
        return (b.ordersCount || 0) - (a.ordersCount || 0);
      case 'orders-low':
        return (a.ordersCount || 0) - (b.ordersCount || 0);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer accounts ({users.length} total users)
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Total Users
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.isActive !== false).length}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {users.filter(u => (u.ordersCount || 0) > 0).length}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <ShoppingBag className="w-4 h-4 mr-2" />
            With Orders
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => (u.ordersCount || 0) === 0).length}
          </div>
          <div className="text-sm text-gray-600">Without Orders</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name: A to Z</option>
              <option value="orders-high">Orders: High to Low</option>
              <option value="orders-low">Orders: Low to High</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {filter}
                  <button 
                    onClick={() => {
                      if (filter.includes('Search')) setSearchTerm('');
                      else if (filter.includes('Status')) setFilterStatus('all');
                      else if (filter.includes('Sort')) setSortBy('newest');
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try a different search term' 
                : 'Users will appear here when they register'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders & Spending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name || 'No Name'}
                            {user.isActive === false && (
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id?.substring(0, 8).toUpperCase() || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(user.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDateTime(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <ShoppingBag className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {user.ordersCount || 0} orders
                          </span>
                        </div>
                        {user.lastOrderDate && (
                          <div className="text-xs text-gray-500">
                            Last order: {formatDate(user.lastOrderDate)}
                          </div>
                        )}
                        {user.totalSpent > 0 && (
                          <div className="text-sm font-bold text-green-600">
                            ₹{(user.totalSpent || 0).toLocaleString('en-IN')} spent
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center ${
                            user.isActive !== false
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.isActive !== false ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUserDetails(user)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {(user.ordersCount || 0) > 0 && (
                          <button
                            onClick={() => handleViewAllOrders(user.email)}
                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                            title="View All Orders"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{selectedUser.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Account Status</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          selectedUser.isActive !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium">{formatDateTime(selectedUser.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">User ID</p>
                        <p className="font-medium text-xs font-mono">{selectedUser._id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Orders */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                    <button
                      onClick={() => handleViewAllOrders(selectedUser.email)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      View All Orders <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  {loadingOrders ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : userOrders.length > 0 ? (
                    <div className="space-y-3">
                      {userOrders.slice(0, 5).map(order => (
                        <div key={order._id} className="bg-white p-3 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order #{order.orderId}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(order.createdAt)} • ₹{order.totalAmount}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleViewAllOrders(selectedUser.email)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user <strong>{userToDelete.name || userToDelete.email}</strong>?
              This action cannot be undone and will remove all their data.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;