// frontend/src/pages/TVShow.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, Package, Tv, Home } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const TVShow = () => {
  const { showName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(null);

  // TV Show information mapping
  const showsData = {
    'breaking-bad': {
      name: 'Breaking Bad',
      description: 'Official merchandise from the iconic TV series Breaking Bad. Get your Heisenberg gear now!',
      icon: '⚗️',
      color: 'from-yellow-500 to-amber-600',
      categories: ['t-shirts', 'mugs', 'hoodies', 'posters']
    },
    'stranger-things': {
      name: 'Stranger Things',
      description: 'Upside Down merchandise from the hit Netflix series Stranger Things.',
      icon: '👾',
      color: 'from-purple-500 to-pink-600',
      categories: ['t-shirts', 'accessories', 'hoodies', 'posters']
    },
    'game-of-thrones': {
      name: 'Game of Thrones',
      description: 'Official Game of Thrones merchandise. Winter is coming!',
      icon: '🐉',
      color: 'from-red-500 to-red-700',
      categories: ['t-shirts', 'mugs', 'hoodies', 'caps']
    },
    'friends': {
      name: 'Friends',
      description: 'Central Perk and Friends merchandise for true fans of the classic sitcom.',
      icon: '☕',
      color: 'from-blue-500 to-cyan-500',
      categories: ['t-shirts', 'mugs', 'accessories', 'posters']
    },
    'the-office': {
      name: 'The Office',
      description: "Dunder Mifflin merchandise from America's favorite workplace comedy.",
      icon: '📄',
      color: 'from-green-500 to-emerald-600',
      categories: ['t-shirts', 'mugs', 'accessories']
    },
    'money-heist': {
      name: 'Money Heist',
      description: 'La Casa de Papel merchandise. Bella ciao!',
      icon: '🎭',
      color: 'from-red-600 to-red-800',
      categories: ['t-shirts', 'masks', 'accessories']
    }
  };

  useEffect(() => {
    const fetchShowProducts = async () => {
      setLoading(true);
      try {
        const showData = showsData[showName];
        if (showData) {
          setShowInfo(showData);
          
          // In real implementation, you would call an API like:
          // const response = await productAPI.getProductsByTVShow(showName);
          // setProducts(response.products);
          
          // For now, show all products (you'll need to update backend)
          const response = await productAPI.getAllProducts();
          if (response.success) {
            setProducts(response.products.slice(0, 12));
          }
        }
      } catch (error) {
        console.error('Error fetching show products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowProducts();
  }, [showName]);

  if (!showInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Tv className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Show Not Found</h1>
          <p className="text-gray-600 mb-6">The TV show you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${showInfo.color} text-white`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{showInfo.icon}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{showInfo.name}</h1>
                  <p className="text-white/80 mt-2">{showInfo.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-6">
                {showInfo.categories.map((category, idx) => (
                  <Link
                    key={idx}
                    to={`/products?category=${category}&tvShow=${showName}`}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">{products.length}+</div>
                <div className="text-white/80">Products Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{showInfo.name} Merchandise</h2>
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ShoppingBag className="w-4 h-4" />
              View All Products
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="animate-pulse bg-gray-200 rounded-2xl h-80"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Check back soon for {showInfo.name} merchandise!</p>
            <Link to="/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShow;