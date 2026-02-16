// frontend/src/context/CartContext.jsx - UPDATED (FIXED BUY NOW REDIRECT ISSUE)
import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState('');
  const [isBuyNow, setIsBuyNow] = useState(false); // ✅ Track Buy Now mode

  // Update cart count whenever cartItems change
  useEffect(() => {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
    
    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ FIXED: Buy Now Immediately (Add to cart and go to checkout)
  const buyNow = (product, size = 'M', quantity = 1, color = '') => {
    const itemColor = color || product.colors?.[0] || '';
    
    // Clear cart and add only this product
    const newItem = {
      product,
      size,
      quantity,
      color: itemColor,
      addedAt: new Date().toISOString()
    };
    
    // ✅ CRITICAL FIX: Set Buy Now mode to true
    setIsBuyNow(true);
    
    // ✅ CRITICAL FIX: Clear cart and add only this item
    const newCart = [newItem];
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
    
    setMessage(`${quantity} × ${product.name} added! Redirecting to checkout...`);
    
    // ✅ CRITICAL FIX: Store Buy Now mode in localStorage
    localStorage.setItem('isBuyNowMode', 'true');
    
    // ✅ FIXED: Return promise for proper redirection
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
  };

  // Add item to cart with color support
  const addToCart = (product, size = 'M', quantity = 1, color = '') => {
    const itemColor = color || product.colors?.[0] || '';
    
    setCartItems(prevItems => {
      // Check if item already exists in cart (same product + same size + same color)
      const existingItemIndex = prevItems.findIndex(
        item => item.product._id === product._id && 
                item.size === size && 
                item.color === itemColor
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        // Don't exceed available stock
        if (updatedItems[existingItemIndex].quantity > product.quantity) {
          updatedItems[existingItemIndex].quantity = product.quantity;
          setMessage(`Maximum available quantity (${product.quantity}) added to cart!`);
        } else {
          setMessage(`${quantity} × ${product.name} added to cart!`);
        }
        
        return updatedItems;
      } else {
        // Add new item with color
        const newItem = {
          product,
          size,
          quantity,
          color: itemColor,
          addedAt: new Date().toISOString()
        };
        
        setMessage(`${quantity} × ${product.name} added to cart!`);
        return [...prevItems, newItem];
      }
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  // Remove item from cart - UPDATED: Handle missing color parameter
  const removeFromCart = (productId, size, color = '') => {
    console.log('Removing item:', { productId, size, color });
    
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => {
        // If color is provided, match all three
        if (color && color !== '') {
          return !(item.product._id === productId && 
                  item.size === size && 
                  item.color === color);
        } 
        // If color not provided, match only productId and size
        else {
          return !(item.product._id === productId && 
                  item.size === size);
        }
      });
      
      console.log('Items after removal:', newItems);
      return newItems;
    });
  };

  // Update item quantity - UPDATED: Handle missing color parameter
  const updateQuantity = (productId, size, newQuantity, color = '') => {
    console.log('Updating quantity:', { productId, size, color, newQuantity });
    
    if (newQuantity < 1) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        // If color is provided, match all three
        if (color && color !== '') {
          if (item.product._id === productId && 
              item.size === size && 
              item.color === color) {
            return { ...item, quantity: newQuantity };
          }
        } 
        // If color not provided, match only productId and size
        else {
          if (item.product._id === productId && item.size === size) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      });
      
      console.log('Items after quantity update:', updatedItems);
      return updatedItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
    setIsBuyNow(false); // Reset Buy Now mode
    localStorage.removeItem('isBuyNowMode');
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  // Calculate total discount
  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.mrp || item.product.price;
      const discount = originalPrice - item.product.price;
      return total + (discount * item.quantity);
    }, 0);
  };

  // Get cart item by ID, size and color
  const getCartItem = (productId, size, color = '') => {
    return cartItems.find(item => 
      item.product._id === productId && 
      item.size === size && 
      item.color === color
    );
  };

  // Check if product is in cart
  const isInCart = (productId, size, color = '') => {
    return cartItems.some(item => 
      item.product._id === productId && 
      item.size === size && 
      item.color === color
    );
  };

  // ✅ NEW: Get cart summary
  const getCartSummary = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = getTotalPrice();
    const totalDiscount = getTotalDiscount();
    const totalMRP = totalPrice + totalDiscount;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      totalMRP
    };
  };

  // ✅ FIXED: Get Buy Now status with localStorage check
  const getIsBuyNow = () => {
    const stored = localStorage.getItem('isBuyNowMode');
    return isBuyNow || stored === 'true';
  };

  // ✅ FIXED: Reset Buy Now mode after checkout
  const resetBuyNowMode = () => {
    setIsBuyNow(false);
    localStorage.removeItem('isBuyNowMode');
  };

  const cartContextValue = {
    cartItems,
    cartCount,
    message,
    addToCart,
    buyNow, // ✅ UPDATED
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalDiscount,
    getCartItem,
    isInCart,
    getCartSummary,
    getIsBuyNow,
    resetBuyNowMode
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};