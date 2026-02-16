import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const discount = product.mrp && product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAdding(true);
    
    const size = product.category === 't-shirts' ? 'M' : 'One Size';
    
    addToCart(product, size, 1);
    
    setTimeout(() => {
      setAdding(false);
    }, 500);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x300'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {discount}% OFF
            </div>
          )}
          {product.quantity < 10 && product.quantity > 0 && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Low Stock
            </div>
          )}
          {product.quantity === 0 && (
            <div className="absolute top-3 right-3 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Out of Stock
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100 pb-4">
            <button 
              onClick={handleAddToCart}
              disabled={product.quantity === 0 || adding}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {product.category === 't-shirts' ? 'T-Shirt' : product.category === 'mugs' ? 'Mug' : 'Accessory'}
            </span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.5</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                ₹{product.price || 0}
              </p>
              {product.mrp && product.mrp > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  ₹{product.mrp}
                </p>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.quantity === 0 || adding}
              className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${product.quantity === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : adding ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              title={product.quantity === 0 ? 'Out of stock' : 'Add to cart'}
            >
              {adding ? (
                'Added!'
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;