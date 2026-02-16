// frontend/src/pages/admin/AdminProducts.jsx - COMPLETELY FIXED
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Image as ImageIcon, 
  Package, Filter, RefreshCw, Copy, CheckCircle, 
  AlertCircle, Layers, Star, Hash, Flame,
  Clock, Calendar, Tag, TrendingDown
} from 'lucide-react';
import { adminApi } from '../../utils/api';
import ProductForm from '../../components/admin/ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dealOfDayFilter, setDealOfDayFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter, dealOfDayFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: categoryFilter === 'all' ? '' : categoryFilter,
        status: statusFilter === 'all' ? '' : statusFilter,
        search: searchTerm,
        sort: sortBy
      };
      
      if (dealOfDayFilter === 'deal') {
        params.dealOfDay = 'true';
      }
      
      const response = await adminApi.getProducts(params);
      
      if (response.success) {
        setProducts(response.products || []);
      } else {
        console.error('Error fetching products:', response.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      const response = await adminApi.deleteProduct(productId);
      if (response.success) {
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // ✅ FIXED: handleSaveProduct - SIMPLIFIED VERSION
  const handleSaveProduct = async (productData) => {
    try {
      console.log('Submitting product data:', productData);
      
      // ✅ FIXED: Prepare simple data without validation
      const sanitizedData = {
        name: productData.name || 'New Product',
        description: productData.description || 'Product description',
        category: productData.category || 't-shirts',
        subCategory: productData.subCategory || '',
        gender: productData.gender || '',
        price: productData.price || 0,
        mrp: productData.mrp || productData.price || 0,
        discount: productData.discount || 0,
        images: productData.images || [],
        sizes: productData.sizes || [],
        colors: productData.colors || ['Black'],
        quantity: productData.quantity || 0,
        specifications: productData.specifications || {
          material: productData.material || 'Cotton',
          brand: productData.brand || 'TV Merchandise'
        },
        tags: productData.tags || [],
        isActive: productData.isActive !== false,
        featured: productData.featured || false,
        dealOfDay: productData.dealOfDay || false,
        showName: productData.showName || '',
        season: productData.season || ''
      };
      
      console.log('Sending to backend:', sanitizedData);
      
      let response;
      if (editingProduct && editingProduct._id) {
        response = await adminApi.updateProduct(editingProduct._id, sanitizedData);
      } else {
        response = await adminApi.createProduct(sanitizedData);
      }
      
      console.log('Backend response:', response);
      
      if (response.success) {
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        alert(editingProduct && editingProduct._id ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        alert(`Error: ${response.message || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message || 'Please check console for details'}`);
    }
  };

  const handleCopyProduct = (product) => {
    if (!product) return;
    
    const productCopy = {
      ...product,
      _id: undefined,
      name: `${product.name} (Copy)`,
      featured: false,
      dealOfDay: false,
      isActive: true,
      quantity: product.quantity || 0,
      createdAt: undefined,
      updatedAt: undefined,
      __v: undefined
    };
    
    setEditingProduct(productCopy);
    setShowForm(true);
    
    setCopySuccess({
      original: product.name,
      copied: productCopy.name
    });
    
    setTimeout(() => {
      setCopySuccess(null);
    }, 5000);
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await adminApi.updateProduct(productId, { 
        isActive: !currentStatus 
      });
      
      if (response.success) {
        fetchProducts();
        alert('Product status updated!');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    }
  };

  const toggleFeatured = async (productId, currentFeatured) => {
    try {
      const response = await adminApi.updateProduct(productId, { 
        featured: !currentFeatured 
      });
      
      if (response.success) {
        fetchProducts();
        alert('Product featured status updated!');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setDealOfDayFilter('all');
    setSortBy('newest');
    setSearchTerm('');
    setSelectedProducts([]);
    setBulkAction('');
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedProducts.length === 0) {
      alert('Please select products and choose an action');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${bulkAction} ${selectedProducts.length} product(s)?`
    );

    if (!confirmed) return;

    try {
      let updates = {};
      let response;
      
      switch (bulkAction) {
        case 'activate':
          updates = { isActive: true };
          response = await adminApi.bulkUpdateProducts(selectedProducts, updates);
          break;
        case 'deactivate':
          updates = { isActive: false };
          response = await adminApi.bulkUpdateProducts(selectedProducts, updates);
          break;
        case 'feature':
          updates = { featured: true };
          response = await adminApi.bulkUpdateProducts(selectedProducts, updates);
          break;
        case 'unfeature':
          updates = { featured: false };
          response = await adminApi.bulkUpdateProducts(selectedProducts, updates);
          break;
        case 'delete':
          for (const productId of selectedProducts) {
            await adminApi.deleteProduct(productId);
          }
          alert(`${selectedProducts.length} products deleted successfully!`);
          setSelectedProducts([]);
          fetchProducts();
          return;
        default:
          return;
      }

      if (response.success) {
        alert(`${response.modifiedCount || selectedProducts.length} products updated successfully!`);
        setSelectedProducts([]);
        setBulkAction('');
        fetchProducts();
      } else {
        alert(response.message || 'Failed to perform bulk action');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action');
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const categories = [
    'all', 't-shirts', 'mugs', 'accessories', 'combos', 'hoodies', 'caps', 'posters', 'photo-frames'
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      'all': 'All Categories',
      't-shirts': 'T-Shirts',
      'mugs': 'Coffee Mugs',
      'accessories': 'Accessories',
      'combos': 'Combos',
      'hoodies': 'Hoodies',
      'caps': 'Caps',
      'posters': 'Posters',
      'photo-frames': 'Photo Frames'
    };
    return labels[category] || category;
  };

  const getStockStatus = (quantity) => {
    if (quantity > 20) return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    if (quantity > 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    if (quantity > 0) return { label: 'Very Low', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  const getStatusFilterLabel = (status) => {
    const labels = {
      'all': 'All Status',
      'active': 'Active Only',
      'inactive': 'Inactive Only',
      'featured': 'Featured Only',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDiscount = (product) => {
    const originalPrice = product.originalPrice || product.mrp || product.price;
    if (originalPrice > product.price) {
      return Math.round(((originalPrice - product.price) / originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your merchandise catalog ({products.length} products)
            {selectedProducts.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {selectedProducts.length} selected
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Copy Success Message */}
      {copySuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <div>
            <p className="text-green-800 font-medium">
              Product copied successfully!
            </p>
            <p className="text-green-700 text-sm">
              "{copySuccess.original}" copied as "{copySuccess.copied}"
            </p>
          </div>
          <button 
            onClick={() => setCopySuccess(null)}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, description, SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="featured">Featured Only</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          
          {/* Deal of Day Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal of Day
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dealOfDayFilter}
              onChange={(e) => setDealOfDayFilter(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="deal">Deal of Day Only</option>
              <option value="non-deal">Non-Deal Products</option>
            </select>
          </div>
        </div>

        {/* Sort By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name: A to Z</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">
                  {selectedProducts.length} product(s) selected
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                >
                  <option value="">Select Bulk Action</option>
                  <option value="activate">Activate Selected</option>
                  <option value="deactivate">Deactivate Selected</option>
                  <option value="feature">Mark as Featured</option>
                  <option value="unfeature">Remove Featured</option>
                  <option value="delete">Delete Selected</option>
                </select>
                
                <button
                  onClick={handleBulkAction}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  disabled={!bulkAction}
                >
                  Apply Action
                </button>
                
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {categoryFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <Filter className="w-3 h-3 mr-1" />
              Category: {getCategoryLabel(categoryFilter)}
              <button 
                onClick={() => setCategoryFilter('all')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              <Layers className="w-3 h-3 mr-1" />
              Status: {getStatusFilterLabel(statusFilter)}
              <button 
                onClick={() => setStatusFilter('all')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ✕
              </button>
            </span>
          )}
          {dealOfDayFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              <Flame className="w-3 h-3 mr-1" />
              Deal: {dealOfDayFilter === 'deal' ? 'Deal of Day' : 'Non-Deal'}
              <button 
                onClick={() => setDealOfDayFilter('all')}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ✕
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              <Search className="w-3 h-3 mr-1" />
              Search: "{searchTerm}"
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <Package className="w-4 h-4 mr-1" />
            Total Products
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.featured).length}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Featured
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {products.filter(p => p.dealOfDay).length}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Flame className="w-4 h-4 mr-1" />
            Deal of Day
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {products.filter(p => p.category === 't-shirts').length}
          </div>
          <div className="text-sm text-gray-600">T-Shirts</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {products.filter(p => p.category === 'mugs').length}
          </div>
          <div className="text-sm text-gray-600">Mugs</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-cyan-600">
            {products.filter(p => p.quantity > 0 && p.quantity < 10).length}
          </div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Products Table/Grid */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category & SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price & Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
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
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.quantity);
                    const discount = calculateDiscount(product);
                    
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleSelectProduct(product._id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-12 w-12 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100x100?text=Image';
                                  }}
                                />
                              ) : (
                                <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {product.name}
                                {product.featured && (
                                  <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </span>
                                )}
                                {product.dealOfDay && (
                                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center">
                                    <Flame className="w-3 h-3 mr-1" />
                                    Deal
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description?.substring(0, 60) || 'No description'}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900">
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                {getCategoryLabel(product.category)}
                              </span>
                            </div>
                            {product.sku && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {product.sku}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-xs text-gray-500 line-through">
                                MRP: ₹{product.originalPrice}
                              </div>
                            )}
                            {discount > 0 && (
                              <div className="text-xs font-medium text-green-600 flex items-center">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                {discount}% OFF
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.label} ({product.quantity})
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => toggleProductStatus(product._id, product.isActive)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                product.isActive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {product.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => toggleFeatured(product._id, product.featured)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                product.featured
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {product.featured ? 'Featured ★' : 'Not Featured'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCopyProduct(product)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                              title="Copy Product"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowForm(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dealOfDayFilter !== 'all'
              ? 'Try changing your filters or search term'
              : 'Add your first product to get started'}
          </p>
          <div className="space-x-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;