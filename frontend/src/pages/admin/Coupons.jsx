import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  Percent,
  IndianRupee,
  CheckCircle,
  Copy,
  BarChart2,
  Users,
  Clock,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [usageStats, setUsageStats] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    totalQuantity: '',
    perUserLimit: '1',
    applicableCategories: ['All'],
    isActive: true
  });

  // Fetch coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/coupons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch usage stats
  const fetchUsageStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/coupons/stats/usage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsageStats(data.stats || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchUsageStats();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'applicableCategories') {
      const categories = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        applicableCategories: categories
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = editingCoupon 
        ? `http://localhost:5000/api/admin/coupons/${editingCoupon._id}`
        : 'http://localhost:5000/api/admin/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reset form and refresh data
        resetForm();
        fetchCoupons();
        fetchUsageStats();
        alert(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
      } else {
        alert(data.message || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(error.message || 'Failed to save coupon');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      totalQuantity: '',
      perUserLimit: '1',
      applicableCategories: ['All'],
      isActive: true
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  // Edit coupon
  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount || '',
      startDate: coupon.startDate.split('T')[0],
      endDate: coupon.endDate.split('T')[0],
      totalQuantity: coupon.totalQuantity,
      perUserLimit: coupon.perUserLimit,
      applicableCategories: coupon.applicableCategories,
      isActive: coupon.isActive
    });
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  // Delete coupon
  const handleDelete = async (couponId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchCoupons();
        fetchUsageStats();
        setShowDeleteConfirm(null);
        alert('Coupon deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert(error.message || 'Failed to delete coupon');
    }
  };

  // Copy coupon code
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    
    // Search filter
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let statusMatch = true;
    if (filter === 'active') {
      statusMatch = coupon.isActive && now >= startDate && now <= endDate;
    } else if (filter === 'expired') {
      statusMatch = now > endDate;
    } else if (filter === 'upcoming') {
      statusMatch = now < startDate;
    } else if (filter === 'inactive') {
      statusMatch = !coupon.isActive;
    }
    
    return matchesSearch && statusMatch;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate usage percentage
  const calculateUsage = (used, total) => {
    return ((used / total) * 100).toFixed(1);
  };

  // Status badge
  const getStatusBadge = (coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    
    if (!coupon.isActive) {
      return { text: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }
    
    if (now < startDate) {
      return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    }
    
    if (now > endDate) {
      return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-gray-600 mt-2">Create and manage discount coupons for your store</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all"
              >
                <BarChart2 className="h-4 w-4" />
                Usage Stats
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Coupon
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Coupons</p>
                  <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Coupons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {coupons.filter(c => {
                      const now = new Date();
                      const start = new Date(c.startDate);
                      const end = new Date(c.endDate);
                      return c.isActive && now >= start && now <= end;
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {coupons.filter(c => {
                      const now = new Date();
                      const end = new Date(c.endDate);
                      const daysLeft = (end - now) / (1000 * 60 * 60 * 24);
                      return c.isActive && daysLeft <= 7 && daysLeft > 0;
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search coupons by code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Coupons</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        {/* Usage Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Coupon Usage Statistics</h2>
                  <button
                    onClick={() => setShowStats(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {usageStats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Coupon Code</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Used</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Total</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Usage %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usageStats.map((stat, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono font-bold">{stat.code}</td>
                            <td className="py-3 px-4">{stat.name}</td>
                            <td className="py-3 px-4">
                              <span className="font-bold">{stat.used}</span>
                            </td>
                            <td className="py-3 px-4">{stat.total}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                    style={{ width: `${stat.usagePercentage}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold">{stat.usagePercentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No usage statistics available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Coupon Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                      placeholder="SUMMER20"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Summer Sale 20% Off"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Coupon description..."
                    rows="2"
                  />
                </div>
                
                {/* Discount Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={formData.discountType === 'percentage' ? '20' : '200'}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Order Amount (₹) *
                    </label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={formData.minOrderAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                {/* Max Discount for Percentage */}
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500"
                      min="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum discount amount for percentage coupons (optional)
                    </p>
                  </div>
                )}
                
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                {/* Quantity & Limits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Quantity *
                    </label>
                    <input
                      type="number"
                      name="totalQuantity"
                      value={formData.totalQuantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per User Limit *
                    </label>
                    <input
                      type="number"
                      name="perUserLimit"
                      value={formData.perUserLimit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicable Categories *
                    </label>
                    <select
                      name="applicableCategories"
                      value={formData.applicableCategories}
                      onChange={handleInputChange}
                      multiple
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    >
                      <option value="All">All Categories</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Mugs">Mugs</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple
                    </p>
                  </div>
                </div>
                
                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Active (Coupon can be used)
                  </label>
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupons List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Coupon Code</th>
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Name & Details</th>
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Validity</th>
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Usage</th>
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Status</th>
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon) => {
                    const status = getStatusBadge(coupon);
                    
                    return (
                      <tr key={coupon._id} className="border-b hover:bg-gray-50">
                        {/* Coupon Code */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-lg">{coupon.code}</span>
                            <button
                              onClick={() => copyCode(coupon.code)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy code"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {coupon.discountType === 'percentage' ? (
                              <Percent className="h-3 w-3 text-blue-500" />
                            ) : (
                              <IndianRupee className="h-3 w-3 text-green-500" />
                            )}
                            <span className="text-sm text-gray-600">
                              {coupon.discountType === 'percentage' 
                                ? `${coupon.discountValue}% OFF` 
                                : `₹${coupon.discountValue} OFF`}
                            </span>
                          </div>
                        </td>
                        
                        {/* Name & Details */}
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium">{coupon.name}</p>
                            {coupon.description && (
                              <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Min. order: ₹{coupon.minOrderAmount}
                            </p>
                          </div>
                        </td>
                        
                        {/* Validity */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{formatDate(coupon.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{formatDate(coupon.endDate)}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Usage */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-bold">{coupon.usedCount}</span>
                              <span className="text-gray-600"> / {coupon.totalQuantity}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${calculateUsage(coupon.usedCount, coupon.totalQuantity)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {calculateUsage(coupon.usedCount, coupon.totalQuantity)}% used
                            </p>
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(coupon)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                              title="Edit coupon"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => setShowDeleteConfirm(coupon._id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              title="Delete coupon"
                              disabled={coupon.usedCount > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try a different search term' : 'Create your first coupon to get started'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              Create Coupon
            </button>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Coupon</h3>
                  <p className="text-gray-600">Are you sure you want to delete this coupon?</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;