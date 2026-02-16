import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Package, 
  RefreshCw, 
  ShoppingBag, 
  Tag, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  Grid,
  List,
  ChevronDown,
  Sliders,
  X,
  Home,
  Tv,
  Shield,
  Clock,
  Gift,
  CheckCircle,
  DollarSign,
  LayoutGrid,
  LayoutList,
  ArrowRight,
  SortAsc,
  Check,
  Eye
} from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

// Categories array
const categories = [
  { 
    value: 't-shirts', 
    label: 'TV T-Shirts', 
    icon: '👕',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    show: 'Breaking Bad & GoT',
    description: 'Premium cotton tees'
  },
  { 
    value: 'mugs', 
    label: 'Character Mugs', 
    icon: '☕',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    show: 'Stranger Things',
    description: 'Ceramic & insulated'
  },
  { 
    value: 'accessories', 
    label: 'Accessories', 
    icon: '🎒',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
    show: 'The Office',
    description: 'Bags & keychains'
  },
  { 
    value: 'combos', 
    label: 'Merch Combos', 
    icon: '🎁',
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
    show: 'Bundle Deals',
    description: 'Save up to 30%'
  },
  { 
    value: 'hoodies', 
    label: 'TV Hoodies', 
    icon: '🧥',
    gradient: 'from-gray-800 to-black',
    bgGradient: 'bg-gradient-to-r from-gray-800 to-black',
    show: 'Winter Collection',
    description: 'Premium hoodies'
  },
  { 
    value: 'caps', 
    label: 'Show Caps', 
    icon: '🧢',
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'bg-gradient-to-r from-red-500 to-orange-500',
    show: 'Money Heist',
    description: 'Snapbacks & caps'
  },
  { 
    value: 'posters', 
    label: 'TV Posters', 
    icon: '🖼️',
    gradient: 'from-purple-500 to-indigo-500',
    bgGradient: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    show: 'Wall Art',
    description: 'High-quality prints'
  }
];

// Sorting options
const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'price-low', label: 'Price: Low to High', icon: <TrendingDown className="w-4 h-4" /> },
  { value: 'price-high', label: 'Price: High to Low', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'rating', label: 'Highest Rated', icon: <Star className="w-4 h-4" /> }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [categoryCounts, setCategoryCounts] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllProductsPC, setShowAllProductsPC] = useState(false);
  
  // Create refs for scrolling
  const productsSectionRef = useRef(null);

  // Get category from URL and sync with state
  useEffect(() => {
    const category = searchParams.get('category');
    
    const validCategories = ['all', ...categories.map(cat => cat.value)];
    if (category && validCategories.includes(category)) {
      setSelectedCategory(category);
      if (!initialLoad) {
        fetchProducts(category);
      }
    } else {
      setSelectedCategory('all');
      if (!initialLoad) {
        fetchProducts('all');
      }
    }
  }, [searchParams, location, initialLoad]);

  // Separate fetch function
  const fetchProducts = async (category = selectedCategory) => {
    try {
      setLoading(true);
      
      let response;
      
      if (category !== 'all') {
        response = await productAPI.getProductsByCategory(category);
      } else {
        const params = { _t: lastUpdate };
        response = await productAPI.getAllProducts(params);
      }
      
      if (response.success) {
        const productsData = response.products || [];
        
        let filteredData = productsData;
        if (category !== 'all') {
          filteredData = productsData.filter(product => 
            product.category?.toLowerCase() === category.toLowerCase()
          );
        }
        
        setProducts(filteredData);
        setFilteredProducts(filteredData);
        
        if (category === 'all' || initialLoad) {
          const allResponse = await productAPI.getAllProducts();
          if (allResponse.success && allResponse.products) {
            const allProducts = allResponse.products;
            
            const counts = { 'all': allProducts.length };
            categories.forEach(cat => {
              if (cat.value !== 'all') {
                counts[cat.value] = allProducts.filter(p => p.category === cat.value).length;
              }
            });
            
            setCategoryCounts(counts);
          }
        }
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      fetchProducts(selectedCategory);
    }
  }, [initialLoad]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    
    const newSearchParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', category);
    }
    setSearchParams(newSearchParams);
    
    fetchProducts(category);
    
    // Scroll to products section
    setTimeout(() => {
      if (productsSectionRef.current) {
        productsSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Apply sorting
  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    
    switch (sortBy) {
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'price-low':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sortedProducts);
  }, [sortBy]);

  const handleRefresh = () => {
    setLastUpdate(Date.now());
    fetchProducts(selectedCategory);
  };

  const clearFilters = () => {
    setSearchQuery('');
    handleCategoryChange('all');
    setSortBy('newest');
    setShowFilters(false);
  };

  const getCategoryInfo = (value) => {
    return categories.find(cat => cat.value === value);
  };

  // Function to handle view all products
  const handleViewAllProducts = () => {
    setShowAllProducts(true);
    // Scroll to products section
    setTimeout(() => {
      if (productsSectionRef.current) {
        productsSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Function to handle view all products on PC
  const handleViewAllProductsPC = () => {
    setShowAllProductsPC(true);
  };

  // Calculate products to show based on device and state
  const getProductsToShow = () => {
    if (typeof window === 'undefined') return filteredProducts;
    
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);
    } else {
      return showAllProductsPC ? filteredProducts : filteredProducts.slice(0, 8);
    }
  };

  const displayedProducts = getProductsToShow();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldShowViewAllButton = 
    (isMobile && filteredProducts.length > 4 && !showAllProducts) || 
    (!isMobile && filteredProducts.length > 8 && !showAllProductsPC);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Home</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <span className="text-sm text-gray-600">Products</span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-blue-600">
                  {getCategoryInfo(selectedCategory)?.label}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
                <Tv className="w-4 h-4" />
                <span className="text-sm font-bold">TV MERCHANDISE STORE</span>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  All Products
                </h1>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Premium Quality</span>
                </div>
              </div>
              
              <p className="text-gray-600 max-w-2xl">
                Discover authentic merchandise from the world's most popular TV series. Premium quality, exclusive designs, and official licensing.
              </p>
            </div>
            
            {/* Stats - Hidden on Mobile, Visible on PC */}
            <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg p-4">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{categoryCounts.all || 0}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg p-4">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for TV shows, characters, or products..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:outline-none text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <select
                  className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRefresh}
                className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                <span className="font-semibold">Refresh</span>
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl hover:shadow-xl transition-all lg:hidden"
              >
                <Filter className="w-4 h-4" />
                <span className="font-semibold">Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' || searchQuery || sortBy !== 'newest') && (
            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-sm font-semibold text-gray-700">Active:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3" />
                    {getCategoryInfo(selectedCategory)?.label}
                    <button 
                      onClick={() => handleCategoryChange('all')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                    <Search className="w-3 h-3" />
                    "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Only on desktop */}
          {showFilters && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Min: ₹{priceRange.min}</span>
                      <span className="text-sm text-gray-600">Max: ₹{priceRange.max}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Sorting */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SortAsc className="w-4 h-4" />
                    Sort By
                  </h4>
                  <div className="space-y-2">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                          sortBy === option.value
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.icon}
                        <span className="text-sm">{option.label}</span>
                        {sortBy === option.value && (
                          <Check className="w-4 h-4 ml-auto text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Area */}
          <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'All Products' : getCategoryInfo(selectedCategory)?.label}
                  </h2>
                  <div className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full">
                    <span className="text-sm font-bold text-green-700">
                      {filteredProducts.length} items
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">
                  {selectedCategory === 'all' 
                    ? 'Complete collection of TV merchandise'
                    : `Premium ${getCategoryInfo(selectedCategory)?.label.toLowerCase()} from top TV shows`}
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
                
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Back to Home
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Products Section with ref */}
            <div ref={productsSectionRef}>
              {/* Loading State */}
              {loading ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 text-center mb-12">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 border-4 border-white rounded-full"></div>
                    <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <ShoppingBag className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Loading Products...</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {selectedCategory !== 'all' 
                      ? `Fetching premium ${getCategoryInfo(selectedCategory)?.label.toLowerCase()}...`
                      : 'Loading our complete merchandise collection'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                /* No Products State */
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 text-center mb-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Package className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No Products Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchQuery 
                      ? `No products matching "${searchQuery}"`
                      : `No products available in ${getCategoryInfo(selectedCategory)?.label}`}
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="group inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Browse All Products
                      <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>
                  )}
                </div>
              ) : (
                /* Products Grid */
                <>
                  {/* Products Grid */}
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {displayedProducts.map(product => (
                      <div 
                        key={product._id} 
                        className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>

                  {/* View All Products Button */}
                  {shouldShowViewAllButton && (
                    <div className="mt-12 text-center">
                      <button
                        onClick={isMobile ? handleViewAllProducts : handleViewAllProductsPC}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                      >
                        <Eye className="w-5 h-5" />
                        View All Products ({filteredProducts.length})
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <p className="text-gray-600 mt-4 text-sm">
                        {isMobile 
                          ? `Showing 4 of ${filteredProducts.length} products`
                          : `Showing 8 of ${filteredProducts.length} products`}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Categories Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
                  <p className="text-gray-600">Browse our collection by product type</p>
                </div>
                <button
                  onClick={() => {
                    handleCategoryChange('all');
                    // Scroll to products section
                    setTimeout(() => {
                      if (productsSectionRef.current) {
                        productsSectionRef.current.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }, 100);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>

              {/* Categories Grid - Optimized for Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      handleCategoryChange(category.value);
                    }}
                    className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 h-40 sm:h-48 ${
                      selectedCategory === category.value 
                        ? 'border-blue-500 shadow-blue-100' 
                        : 'border-transparent hover:border-blue-200'
                    }`}
                  >
                    {/* Gradient Header */}
                    <div className={`h-24 sm:h-28 ${category.bgGradient} flex flex-col items-center justify-center relative overflow-hidden`}>
                      <div className="text-2xl sm:text-3xl mb-1 transform group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform"></div>
                      
                      {selectedCategory === category.value && (
                        <div className="absolute top-3 right-3">
                          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      <div className="font-bold text-sm sm:text-base text-gray-900 truncate">{category.label}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate hidden sm:block">{category.show}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate sm:hidden">{category.description}</div>
                      {selectedCategory === category.value && (
                        <div className="mt-2 flex justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Active Indicator */}
                    {selectedCategory === category.value && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Footer */}
            {!loading && filteredProducts.length > 0 && (showAllProducts || showAllProductsPC) && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-gray-600">
                        Showing <span className="font-bold text-blue-600">{filteredProducts.length}</span> products
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Sorted by <span className="font-semibold">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                      </p>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live stock updates</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleRefresh}
                      className="group flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      <span className="font-semibold">Refresh Results</span>
                    </button>
                    
                    <Link
                      to="/"
                      className="group inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;