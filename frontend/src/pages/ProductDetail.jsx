import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  Star, 
  Heart, 
  Check, 
  ArrowLeft,
  Share2,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Tag,
  Users,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productAPI } from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        const response = await productAPI.getProductById(id);
        
        if (response.success && response.product) {
          setProduct(response.product);
          
          // Set initial size if product has sizes
          if (response.product.sizes && response.product.sizes.length > 0) {
            setSelectedSize(response.product.sizes[0]);
          }
          
          // Set initial color if product has colors
          if (response.product.colors && response.product.colors.length > 0) {
            setSelectedColor(response.product.colors[0]);
          }
          
          if (response.product.images && response.product.images.length > 0) {
            setSelectedImage(0);
          }
        } else {
          console.error('Product not found:', response);
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const shouldShowSizes = () => {
    return product && (product.category === 't-shirts' || product.category === 'hoodies');
  };

  const shouldShowColors = () => {
    return product && (product.category === 't-shirts' || product.category === 'hoodies' || product.category === 'accessories');
  };

  const handleAddToCart = () => {
    if (!product || product.quantity === 0) return;
    
    setAddingToCart(true);
    addToCart(product, selectedSize, quantity, selectedColor);
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

  // ✅ FIXED: Handle Buy Now with immediate redirect
  const handleBuyNow = async () => {
    if (!product || product.quantity === 0) return;
    
    try {
      // Add item to cart and wait for completion
      await buyNow(product, selectedSize, quantity, selectedColor);
      
      // ✅ IMMEDIATELY navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error in Buy Now:', error);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on TV Merchandise Store!`,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareModal(false);
  };

  const handleImageZoom = (e) => {
    if (!imageZoom) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      't-shirts': 'T-Shirt',
      'mugs': 'Coffee Mug',
      'accessories': 'Accessory',
      'combos': 'Combo Pack',
      'hoodies': 'Hoodie',
      'caps': 'Cap',
      'posters': 'Poster'
    };
    return categoryMap[category] || category;
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-20"></div>
          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-purple-600"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.mrp && product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const rating = 4.5;
  const reviewCount = 128;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/products" className="text-gray-700 hover:text-blue-600">Products</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <Link
            to="/products"
            className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isWishlisted 
                  ? 'bg-red-50 text-red-500 border border-red-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            <div 
              className={`relative rounded-3xl overflow-hidden border-2 border-gray-100 bg-white shadow-xl ${imageZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onMouseEnter={() => setImageZoom(true)}
              onMouseLeave={() => setImageZoom(false)}
              onMouseMove={handleImageZoom}
              onClick={() => setImageZoom(!imageZoom)}
            >
              <img
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/800x800'}
                alt={product.name}
                className="w-full h-auto transition-transform duration-300"
                style={{
                  transform: imageZoom ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
              
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
              
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                    {discount}% OFF
                  </div>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-purple-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">Above ₹199</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">7-Day Returns</p>
                    <p className="text-sm text-gray-600">Quality Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
                <Sparkles className="w-4 h-4" />
                {getCategoryDisplayName(product.category)}
              </span>
              
              {product.tvShow && (
                <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                  From: {product.tvShow}
                </span>
              )}
              
              {product.quantity > 0 ? (
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                  Out of Stock
                </span>
              )}
            </div>
            
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= Math.floor(rating) 
                          ? 'text-yellow-400 fill-current' 
                          : star === Math.ceil(rating) && rating % 1 !== 0
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  <span className="font-bold text-gray-900">{rating}</span> • {reviewCount} Reviews
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
                
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">₹{product.mrp}</span>
                    <span className="text-lg font-bold text-red-600">
                      Save ₹{product.mrp - product.price}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">500+ fans have this product</span>
              </div>
            </div>
            
            {/* Size Selection - Only for T-Shirts and Hoodies */}
            {shouldShowSizes() && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
                  <span className="text-sm text-gray-500">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${
                        selectedSize === size 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 transform scale-105' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Color Selection - Only for T-Shirts, Hoodies and Accessories */}
            {shouldShowColors() && product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${
                        selectedColor === color 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 transform scale-105' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Quantity</h3>
              <div className="flex items-center">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    −
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                  </div>
                  <button
                    onClick={increaseQuantity}
                    disabled={product.quantity && quantity >= product.quantity}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                
                <div className="ml-4 text-sm text-gray-600">
                  <p>{product.quantity ? `${product.quantity} items left` : 'In stock'}</p>
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Usually ships within 24 hours
                  </p>
                </div>
              </div>
            </div>
            
            {/* ✅ UPDATED: Action Buttons with Buy Now as primary - MOVED UP */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Buy Now Button - Primary Action */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.quantity === 0}
                  className={`flex-1 group ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl blur opacity-70 group-hover:opacity-100 animate-gradient-x"></div>
                    <div className={`relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 ${
                      product.quantity === 0 ? 'bg-gray-300' : ''
                    }`}>
                      <Zap className="w-6 h-6" />
                      ⚡ Buy Now
                    </div>
                  </div>
                </button>
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0 || addingToCart}
                  className={`flex-1 group ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300 ${
                      addingToCart ? 'animate-gradient-x' : ''
                    }`}></div>
                    <div className={`relative py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 ${
                      addingToCart 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : product.quantity === 0
                        ? 'bg-gray-300 text-gray-500'
                        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white'
                    }`}>
                      {addingToCart ? (
                        <>
                          <Check className="w-6 h-6" />
                          Added to Cart!
                        </>
                      ) : product.quantity === 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <ShoppingCart className="w-6 h-6" />
                          Add to Cart • ₹{product.price * quantity}
                        </>
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className={`w-16 flex items-center justify-center rounded-2xl border-2 transition-all ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              {/* Stock Status */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="text-green-500 mr-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Available in stock</p>
                    <p className="text-sm text-gray-600">Usually ships within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ✅ MOVED: Product Description BELOW Action Buttons */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Product Details
                </h4>
                {product.details && product.details.length > 0 ? (
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <span className="ml-2 font-medium">{product.material || 'Cotton'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Care:</span>
                      <span className="ml-2 font-medium">Machine Wash</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Shipping Info
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Truck className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Free shipping on orders above ₹199</span>
                  </li>
                  <li className="flex items-start">
                    <Package className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Delivery within 3-7 business days</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>7 days return policy</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {product.quantity}+
                </div>
                <div className="text-sm text-gray-600">In Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {reviewCount}
                </div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {discount}%
                </div>
                <div className="text-sm text-gray-600">Discount</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Share2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share this product</h3>
              <p className="text-gray-600 mb-6">Copy the link to share with friends</p>
              
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold"
                >
                  Copy
                </button>
              </div>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
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
      `}</style>
    </div>
  );
};

export default ProductDetail;