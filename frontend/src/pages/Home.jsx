import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Shield, 
  Truck, 
  Zap,
  TrendingUp, 
  CheckCircle, 
  Tag, 
  Award,
  Clock,
  Users,
  Package,
  Headphones,
  ChevronRight,
  Sparkles,
  Gift,
  Percent,
  Tv,
  ShoppingCart,
  Search,
  ExternalLink,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  RotateCcw,
  ThumbsUp,
  UserCheck,
  Shirt,
  Coffee,
  Image,
  TrendingDown,
  Eye,
  ThumbsDown,
  Loader,
  Calendar,
  Heart,
  Tv as TvIcon,
  Box,
  Layers,
  Palette,
  Camera,
  Sparkles as SparklesIcon,
  Crown,
  Zap as ZapIcon,
  ShoppingBag as ShoppingBagIcon,
  Home as HomeIcon,
  Shirt as ShirtIcon,
  Coffee as CoffeeIcon,
  Gift as GiftIcon,
  Box as BoxIcon,
  Crown as CrownIcon,
  Image as ImageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Heart as HeartIcon,
  Truck as TruckIcon,
  Shield as ShieldIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  RotateCcw as RotateCcwIcon,
  UserCheck as UserCheckIcon
} from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [tShirts, setTShirts] = useState([]);
  const [photoFrames, setPhotoFrames] = useState([]);
  const [coffeeMugs, setCoffeeMugs] = useState([]);
  const [loading, setLoading] = useState({
    featured: true,
    tshirts: true,
    photoFrames: true,
    coffeeMugs: true
  });
  const [viewMode, setViewMode] = useState('grid');
  const [processingBuyNow, setProcessingBuyNow] = useState(null);
  
  const heroRef = useRef(null);
  const tShirtsRef = useRef(null);
  const photoFramesRef = useRef(null);
  const coffeeMugsRef = useRef(null);
  
  const { addToCart, buyNow } = useCart();
  const navigate = useNavigate();

  // 🎯 UPDATED CATEGORIES - Clean professional look
  const categories = [
    { 
      id: 't-shirts', 
      name: 'TV T-Shirts', 
      icon: <ShirtIcon className="w-6 h-6" />, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      count: 128,
      popular: true,
      description: 'Premium cotton tees'
    },
    { 
      id: 'mugs', 
      name: 'Character Mugs', 
      icon: <CoffeeIcon className="w-6 h-6" />, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      count: 76,
      popular: true,
      description: 'Ceramic & insulated'
    },
    { 
      id: 'accessories', 
      name: 'Accessories', 
      icon: <GiftIcon className="w-6 h-6" />, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      count: 92,
      description: 'Bags, frames & more'
    },
    { 
      id: 'combos', 
      name: 'Merch Combos', 
      icon: <Package className="w-6 h-6" />, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-100',
      count: 34,
      offer: 'Save 25%',
      description: 'Bundle deals'
    },
    { 
      id: 'hoodies', 
      name: 'TV Hoodies', 
      icon: <BoxIcon className="w-6 h-6" />, 
      color: 'text-gray-800',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      count: 58,
      description: 'Premium hoodies'
    },
    { 
      id: 'caps', 
      name: 'Show Caps', 
      icon: <CrownIcon className="w-6 h-6" />, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      count: 41,
      description: 'Snapbacks & caps'
    },
    { 
      id: 'posters', 
      name: 'Posters', 
      icon: <ImageIcon className="w-6 h-6" />, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      count: 103,
      description: 'High-quality prints'
    }
  ];

  // Featured TV shows with real show names (NON-CLICKABLE)
  const featuredShows = [
    { 
      name: 'Tu Juliet Jatt Di', 
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600', 
      tag: 'Trending', 
      icon: '⚗️'
    },
    { 
      name: 'Tarrak Mehta', 
      color: 'bg-gradient-to-br from-purple-500 to-pink-600', 
      tag: 'Comedy', 
      icon: '👾'
    },
    { 
      name: 'Laughter Chef', 
      color: 'bg-gradient-to-br from-red-500 to-red-700', 
      tag: 'Funny', 
      icon: '🐉'
    },
    { 
      name: 'The 50', 
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500', 
      tag: 'Classic', 
      icon: '☕'
    },
    { 
      name: 'The Office', 
      color: 'bg-gradient-to-br from-green-500 to-emerald-600', 
      tag: 'Funny', 
      icon: '📄'
    },
    { 
      name: 'Money Heist', 
      color: 'bg-gradient-to-br from-red-600 to-red-800', 
      tag: 'Action', 
      icon: '🎭'
    }
  ];

  // Stats with animation
  const stats = [
    { value: '1K+', label: 'Happy Fans', icon: Users, color: 'text-blue-500', delay: '100' },
    { value: '4.7★', label: 'Avg Rating', icon: Star, color: 'text-amber-500', delay: '200' },
    { value: '1.5K+', label: 'Orders', icon: Package, color: 'text-green-500', delay: '300' },
    { value: '24/7', label: 'Support', icon: Headphones, color: 'text-purple-500', delay: '400' },
    { value: '500+', label: 'Products', icon: ShoppingBag, color: 'text-pink-500', delay: '500' },
    { value: '100%', label: 'Secure', icon: Shield, color: 'text-emerald-500', delay: '600' }
  ];

  // Features with icons
  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      desc: 'On orders above ₹199',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      highlight: true
    },
    {
      icon: ShieldIcon,
      title: 'Secure Payment',
      desc: '100% safe transactions',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: AwardIcon,
      title: 'Quality Merch',
      desc: 'Best products',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      highlight: true
    },
    {
      icon: ClockIcon,
      title: 'Quick Delivery',
      desc: '3-7 days across India',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: RotateCcwIcon,
      title: 'Easy Returns',
      desc: '7-day return policy',
      color: 'text-pink-600',
      bg: 'bg-pink-50'
    },
    {
      icon: UserCheckIcon,
      title: 'Fan Support',
      desc: 'TV show experts',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 Fetching home page data...');
      
      // Fetch featured products
      try {
        const featuredRes = await productAPI.getFeaturedProducts();
        if (featuredRes.success) {
          setFeaturedProducts(featuredRes.products || []);
        }
      } catch (featuredError) {
        console.error('Error fetching featured products:', featuredError);
      } finally {
        setLoading(prev => ({ ...prev, featured: false }));
      }

      // Fetch all products for other categories
      try {
        const allRes = await productAPI.getAllProducts();
        
        if (allRes.success && allRes.products) {
          const products = allRes.products;
          
          // Filter T-Shirts
          const tShirtProducts = products.filter(p => 
            p.category && (p.category.toLowerCase().includes('t-shirt') || 
            p.category.toLowerCase().includes('t shirt') ||
            p.category === 't-shirts')
          ).slice(0, 8);
          setTShirts(tShirtProducts);
          
          // Filter Photo Frames (mapped from posters category)
          const frameProducts = products.filter(p => 
            p.category && (p.category.toLowerCase().includes('frame') || 
            p.category.toLowerCase().includes('accessory') ||
            p.category === 'accessories' ||
            p.category === 'photo-frames' ||
            p.category === 'posters') // Mapping posters to photo frames
          ).slice(0, 8);
          setPhotoFrames(frameProducts);
          
          // Filter Coffee Mugs
          const mugProducts = products.filter(p => 
            p.category && (p.category.toLowerCase().includes('mug') ||
            p.category === 'mugs')
          ).slice(0, 8);
          setCoffeeMugs(mugProducts);
        }
      } catch (allError) {
        console.error('Error fetching all products:', allError);
      } finally {
        setLoading(prev => ({ 
          ...prev, 
          tshirts: false, 
          photoFrames: false, 
          coffeeMugs: false 
        }));
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      setLoading({
        featured: false,
        tshirts: false,
        photoFrames: false,
        coffeeMugs: false
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBuyNow = useCallback(async (product) => {
    console.log('Buy Now clicked for:', product.name);
    
    setProcessingBuyNow(product._id);
    
    try {
      if (product.quantity <= 0) {
        alert('Sorry, this product is out of stock!');
        return;
      }
      
      const optimizedProduct = {
        ...product,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: product.colors?.[0] || 'Default'
      };
      
      setTimeout(() => {
        buyNow(optimizedProduct, 'M', 1, optimizedProduct.selectedColor);
      }, 100);
      
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => {
        setProcessingBuyNow(null);
      }, 500);
    }
  }, [buyNow]);

  const handleAddToCart = useCallback((product) => {
    console.log('Add to Cart clicked for:', product.name);
    
    const productId = product._id;
    
    if (product.quantity <= 0) {
      alert('Sorry, this product is out of stock!');
      return;
    }
    
    const optimizedProduct = {
      ...product,
      quantity: 1
    };
    
    addToCart(optimizedProduct, 'M', 1, product.colors?.[0]);
    
    alert(`${product.name} added to cart!`);
  }, [addToCart]);

  const handleQuickView = useCallback((product) => {
    navigate(`/product/${product._id}`);
  }, [navigate]);

  const calculateDiscount = useCallback((product) => {
    const originalPrice = product.originalPrice || product.mrp || product.price;
    if (originalPrice > product.price) {
      return Math.round(((originalPrice - product.price) / originalPrice) * 100);
    }
    return product.discount || 0;
  }, []);

  const getOptimizedProduct = useCallback((product) => {
    return {
      ...product,
      rating: product.rating || 4.3,
      reviews: product.reviews || 0,
      quantity: product.quantity || product.stock || 10,
      colors: product.colors || ['Default'],
      images: product.images || [product.image || 'https://via.placeholder.com/400x400?text=Product+Image']
    };
  }, []);

  const renderSectionHeader = (title, subtitle, icon, color, link) => (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-12">
      <div>
        <div className={`inline-flex items-center gap-2 ${color} px-3 py-1.5 rounded-full mb-3`}>
          {icon}
          <span className="text-xs sm:text-sm font-bold">{title.split(' ')[0].toUpperCase()}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">{title}</h2>
        <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
      </div>
      
      {link && (
        <Link
          to={link}
          className="group inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base mt-4 lg:mt-0"
        >
          View All
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" />
        </Link>
      )}
    </div>
  );

  const renderLoadingSkeleton = (count = 4) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-64 sm:h-80 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = (message, linkText, link) => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Coming Soon!</h3>
      <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
        {message}
      </p>
      {link && (
        <Link
          to={link}
          className="inline-flex items-center gap-2 sm:gap-3 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          {linkText}
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 🎬 HERO SECTION */}
      <section 
        ref={heroRef}
        className="relative min-h-[85vh] lg:min-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden pt-12 lg:pt-16"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 lg:px-6 pt-8 lg:pt-12 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <span className="text-xs font-bold">🎬 PREMIUM QUALITY</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-bold">TRENDING 2026</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
                  <span className="block text-white mb-2">Express Your</span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TV Show Passion
                  </span>
                  <span className="block text-white mt-2">With Premium Merch</span>
                </h1>

                <p className="text-base lg:text-lg text-gray-300 mb-6 lg:mb-8 max-w-xl">
                  Premium merchandise from the world's most popular TV series. 
                  High-quality apparel, accessories, and collectibles for true fans.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8 lg:mb-10">
                  <Link
                    to="/products"
                    className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    Shop Collection
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  
                  <Link
                    to="/products?category=combos"
                    className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white hover:bg-white/20 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300"
                  >
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                    View Combos
                    <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats.slice(0, 3).map((stat, idx) => (
                    <div key={idx} className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className={`text-xl sm:text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content */}
              <div className="relative mt-8 lg:mt-0">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {featuredShows.map((show, idx) => (
                    <div
                      key={idx}
                      className={`${show.color} rounded-lg sm:rounded-xl p-2 sm:p-4 text-center cursor-default`}
                    >
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{show.icon}</div>
                      <div className="font-bold text-white text-xs sm:text-sm truncate">{show.name}</div>
                      <div className="text-[10px] sm:text-xs text-white/80">{show.tag}</div>
                    </div>
                  ))}
                </div>

                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-xl sm:shadow-2xl">
                  <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-full font-bold shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    FLASH SALE • ENDS SOON
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
                    <Link
                      to="/products?category=t-shirts"
                      className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/30 hover:border-blue-400 transition-all hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2">👕</div>
                        <div className="font-bold text-white text-sm sm:text-base">T-Shirts</div>
                        <div className="text-blue-300 text-xs sm:text-sm">From ₹99</div>
                        <div className="mt-1 text-[10px] sm:text-xs text-gray-400">Premium Cotton</div>
                      </div>
                    </Link>
                    
                    <Link
                      to="/products?category=mugs"
                      className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-500/30 hover:border-amber-400 transition-all hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2">☕</div>
                        <div className="font-bold text-white text-sm sm:text-base">Coffee Mugs</div>
                        <div className="text-amber-300 text-xs sm:text-sm">From ₹99</div>
                        <div className="mt-1 text-[10px] sm:text-xs text-gray-400">Ceramic</div>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">4.7/5 • 500+ Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-16 sm:h-20 fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* 🛍️ BROWSE COLLECTIONS SECTION - REDESIGNED LIKE REFERENCE IMAGE */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header - Clean and Minimal */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              What are you shopping for today?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Browse our complete collection of premium TV merchandise across all categories
            </p>
            
            {/* Divider Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          </div>

          {/* Categories Grid - Clean Design */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden"
                >
                  {/* Category Content */}
                  <div className="p-4 sm:p-6">
                    {/* Icon Container */}
                    <div className={`w-16 h-16 ${category.bgColor} ${category.borderColor} border-2 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={category.color}>
                        {category.icon}
                      </div>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="text-center text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {/* Product Count */}
                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        {category.count} products
                      </span>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRightIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    {/* Popular Badge */}
                    {category.popular && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Popular
                        </div>
                      </div>
                    )}
                    
                    {/* Offer Badge */}
                    {category.offer && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {category.offer}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              ))}
            </div>
            
            {/* View All Products Button */}
            <div className="text-center">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                View All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Secure Shopping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          {renderSectionHeader(
            "Featured Products",
            "Most loved merchandise by TV show fans",
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />,
            "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700",
            "/products?featured=true"
          )}

          {loading.featured ? (
            renderLoadingSkeleton(4)
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState(
              "Featured TV show merchandise being added daily. Check back soon!",
              "Browse Available Products",
              "/products"
            )
          )}
        </div>
      </section>

      {/* 👕 T-Shirts Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          {renderSectionHeader(
            "T-Shirts Collection",
            "Premium quality cotton tees from your favorite TV shows",
            <Shirt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />,
            "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700",
            "/products?category=t-shirts"
          )}

          {loading.tshirts ? (
            renderLoadingSkeleton(4)
          ) : tShirts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {tShirts.slice(0, 8).map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState(
              "No T-Shirts available yet. Check back soon for awesome TV show tees!",
              "Browse Other Products",
              "/products"
            )
          )}
        </div>
      </section>

      {/* 🖼️ Photo Frames Section (Mapped from Posters) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          {renderSectionHeader(
            "Photo Frames & Accessories",
            "Display your favorite TV moments in style",
            <Image className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />,
            "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
            "/products?category=accessories"
          )}

          {loading.photoFrames ? (
            renderLoadingSkeleton(4)
          ) : photoFrames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {photoFrames.slice(0, 8).map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState(
              "Photo frames collection coming soon! Perfect for displaying your favorite TV memories.",
              "Browse Accessories",
              "/products?category=accessories"
            )
          )}
        </div>
      </section>

      {/* ☕ Coffee Mugs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          {renderSectionHeader(
            "Coffee Mugs",
            "Start your day with your favorite TV characters",
            <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />,
            "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700",
            "/products?category=mugs"
          )}

          {loading.coffeeMugs ? (
            renderLoadingSkeleton(4)
          ) : coffeeMugs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {coffeeMugs.slice(0, 8).map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState(
              "Coffee mugs collection coming soon! Perfect for your morning brew.",
              "Browse Mugs",
              "/products?category=mugs"
            )
          )}
        </div>
      </section>

      {/* 🎯 Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Why Choose TVMerch?</h2>
            <p className="text-blue-200 max-w-2xl mx-auto text-sm sm:text-base">
              The ultimate destination for TV show merchandise
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300 ${feature.highlight ? 'border border-white/20' : ''}`}
              >
                <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl ${feature.bg} mb-3 sm:mb-4`}>
                  <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2">{feature.title}</h3>
                <p className="text-blue-200 text-sm sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📱 Mobile App Banner */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1.5 rounded-full mb-4 sm:mb-6">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-bold">MOBILE APP COMING SOON</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                Shop On The Go
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
                Download our mobile app for exclusive deals, early access to new collections, 
                and seamless shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                  <span className="text-xl sm:text-2xl">📱</span>
                  <div>
                    <div className="text-xs sm:text-sm">Coming Soon</div>
                    <div className="font-bold text-sm sm:text-base">App Store</div>
                  </div>
                </button>
                <button className="inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                  <span className="text-xl sm:text-2xl">🤖</span>
                  <div>
                    <div className="text-xs sm:text-sm">Coming Soon</div>
                    <div className="font-bold text-sm sm:text-base">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 mt-6 sm:mt-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl mb-2">🎁</div>
                      <div className="font-bold text-sm sm:text-base">Exclusive Deals</div>
                    </div>
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl mb-2">🚚</div>
                      <div className="font-bold text-sm sm:text-base">Live Tracking</div>
                    </div>
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl mb-2">🔔</div>
                      <div className="font-bold text-sm sm:text-base">Alerts</div>
                    </div>
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl mb-2">💳</div>
                      <div className="font-bold text-sm sm:text-base">Easy Payment</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎬 Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-gray-900 to-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full mb-4 sm:mb-6">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-xs sm:text-sm">JOIN 10K+ TV FANS</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Start Your TV Merch
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Collection Today
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Premium quality, official merchandise, exclusive deals. Everything a true TV fan needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <Link
                  to="/products?category=combos"
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all hover:scale-105"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                  View Combos
                  <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;