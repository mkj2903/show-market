<<<<<<< HEAD
// frontend/src/utils/api.js - COMPLETELY FIXED WITH COUPON SUPPORT
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = 'https://showmoplay-backend.vercel.app/api';

>>>>>>> 0489c86586887ac2d72ebcea4aa82b5c58a1ed6e

// ========================
// ADMIN API - COMPLETELY FIXED
// ========================
const adminApi = {
  // ✅ FIXED: Create Product
  createProduct: async (productData) => {
    try {
      console.log('API: Creating product with data:', productData);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return { success: false, message: 'Not authenticated' };
      }
      
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      console.log('API: Create product response:', data);
      
      if (!response.ok) {
        console.error('API Error:', data);
        return { 
          success: false, 
          message: data.message || `Server error: ${response.status}`,
          errors: data.errors || []
        };
      }
      
      return data;
    } catch (error) {
      console.error('Network error creating product:', error);
      return { 
        success: false, 
        message: error.message || 'Network error while creating product'
      };
    }
  },

  // ✅ FIXED: Update Product
  updateProduct: async (productId, productData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return { success: false, message: 'Not authenticated' };
      
      const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          message: data.message || `Server error: ${response.status}` 
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  },

  // Get Products with filtering
  getProducts: async (params = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated', products: [] };
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters
      if (params.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params.gender && params.gender !== 'all') queryParams.append('gender', params.gender);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.dealOfDay === 'true') queryParams.append('dealOfDay', 'true');
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const queryString = queryParams.toString();
      const response = await fetch(`${API_BASE}/admin/products?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          message: data.message || `Server error: ${response.status}`,
          products: [] 
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { 
        success: false, 
        message: error.message,
        products: [] 
      };
    }
  },

  // Delete Product
  deleteProduct: async (productId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // ✅ NEW: Copy Product
  copyProduct: async (productId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      // First get the product
      const getResponse = await fetch(`${API_BASE}/admin/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const productData = await getResponse.json();
      
      if (!productData.success) {
        return productData;
      }
      
      // Create a copy with new name
      const originalProduct = productData.product;
      const copyData = {
        ...originalProduct,
        name: `${originalProduct.name} (Copy)`,
        sku: `${originalProduct.sku}-COPY-${Date.now()}`,
        _id: undefined
      };
      
      // Create the copy
      const createResponse = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(copyData)
      });
      
      return await createResponse.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // ✅ NEW: Coupon Management
  getAllCoupons: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated', coupons: [] };
    
    try {
      const response = await fetch(`${API_BASE}/admin/coupons`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message,
        coupons: [] 
      };
    }
  },

  getCouponStats: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated', stats: [] };
    
    try {
      const response = await fetch(`${API_BASE}/admin/coupons/stats/usage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message,
        stats: [] 
      };
    }
  },

  createCoupon: async (couponData) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/coupons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(couponData)
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  updateCoupon: async (couponId, couponData) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/coupons/${couponId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(couponData)
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  deleteCoupon: async (couponId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // Admin login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Network error during login' 
      };
    }
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch dashboard data',
        stats: {
          totalOrders: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalUsers: 0,
          pendingOrders: 0,
          completedOrders: 0,
          lowStockProducts: 0,
          upiOrders: 0,
          codOrders: 0
        },
        recentOrders: [],
        salesData: []
      };
    }
  },

  // Orders management
  getOrders: async (params = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated', orders: [] };
    
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/admin/orders?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message,
        orders: [] 
      };
    }
  },

  // ✅ FIXED: Update order status
  updateOrderStatus: async (orderId, data) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // ✅ FIXED: Verify payment (for UPI orders only)
  verifyPayment: async (orderId, data) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/verify-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // ✅ NEW: Collect COD payment
  collectCODPayment: async (orderId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/collect-cod`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // Users management
  getUsers: async (params = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated', users: [] };
    
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/admin/users?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message,
        users: [] 
      };
    }
  },

  // Reviews management
  getReviews: async (params = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated', reviews: [] };
    
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/admin/reviews?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message,
        reviews: [] 
      };
    }
  },

  updateReviewStatus: async (reviewId, status) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // Email testing
  testEmail: async (email) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/email/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // Get email configuration
  getEmailConfig: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/email/config`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // ✅ FIXED: Get single order details
  getOrderDetails: async (orderId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return { success: false, message: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }
};

// ========================
// COUPON API
// ========================
const couponAPI = {
  // Validate coupon
  validateCoupon: async (code, orderAmount) => {
    try {
      const response = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          orderAmount: orderAmount
        }),
      });
      
      return await response.json();
    } catch (error) {
      return { 
        valid: false, 
        message: 'Failed to validate coupon. Please try again.' 
      };
    }
  }
};

// ========================
// PRODUCTS API
// ========================
const productAPI = {
  getAllProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch products',
        products: [] 
      };
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${API_BASE}/products/featured`);
      
      if (!response.ok) {
        // Fallback to getting all products and filtering featured
        const allResponse = await fetch(`${API_BASE}/products`);
        const allData = await allResponse.json();
        
        if (allData.success) {
          const featured = allData.products.filter(p => p.featured).slice(0, 8) || 
                          allData.products.slice(0, 8);
          return { 
            success: true, 
            products: featured,
            message: 'Using fallback method'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch featured products',
        products: [] 
      };
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { 
            success: false, 
            message: 'Product not found' 
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch product' 
      };
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE}/products/category/${category}`);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      // Fallback
      const allResponse = await fetch(`${API_BASE}/products`);
      const allData = await allResponse.json();
      
      if (allData.success && allData.products) {
        const filtered = allData.products.filter(p => 
          p.category?.toLowerCase() === category.toLowerCase()
        );
        return {
          success: true,
          products: filtered,
          count: filtered.length,
          message: 'Filtered client-side'
        };
      }
      
      throw new Error('Failed to fetch products by category');
      
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return { 
        success: false, 
        message: error.message,
        products: [] 
      };
    }
  }
};

// ========================
// ORDERS API - COMPLETELY FIXED WITH ENHANCED ERROR HANDLING
// ========================
const orderAPI = {
  // ✅ FIXED: Create order with enhanced error handling
  createOrder: async (orderData) => {
    try {
      console.log('API: Creating order with data:', orderData);
      
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      // Parse response
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return { 
          success: false, 
          message: 'Invalid response from server' 
        };
      }
      
      console.log('API: Order response:', responseData);
      
      if (!response.ok) {
        return { 
          success: false, 
          message: responseData.message || `Failed to create order: ${response.status}`,
          errors: responseData.errors || []
        };
      }
      
      return responseData;
    } catch (error) {
      console.error('Network error creating order:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to create order. Please check your internet connection and try again.'
      };
    }
  },

  // ✅ FIXED: Get user orders by email
  getUserOrdersByEmail: async (email) => {
    try {
      if (!email || email.trim() === '') {
        return { 
          success: false, 
          message: 'Email is required',
          orders: [] 
        };
      }

      const cleanEmail = email.toLowerCase().trim();
      const response = await fetch(
        `${API_BASE}/orders/user/${encodeURIComponent(cleanEmail)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      return { 
        success: false, 
        message: 'Failed to fetch user orders',
        orders: [] 
      };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { 
        success: false, 
        message: error.message,
        orders: [] 
      };
    }
  },

  // ✅ FIXED: Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}`);
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  },

  // ✅ FIXED: Track order with enhanced error handling
  trackOrder: async (orderId, email) => {
    try {
      if (!orderId || orderId.trim() === '') {
        return { 
          success: false, 
          message: 'Order ID is required' 
        };
      }

      if (!email || email.trim() === '') {
        return { 
          success: false, 
          message: 'Email is required for tracking' 
        };
      }

      console.log(`API: Tracking order ${orderId} for email ${email}`);
      
      const response = await fetch(
        `${API_BASE}/orders/track/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(email.trim())}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.message || `Failed to track order: ${response.status}` 
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error tracking order:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to track order. Please try again.'
      };
    }
  },

  // ✅ NEW: Get all orders (for admin, use adminApi.getOrders instead)
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }
};

// ========================
// AUTH API
// ========================
const authAPI = {
  googleLogin: async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getUserByEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE}/auth/user/${encodeURIComponent(email)}`);
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// ========================
// UTILITY FUNCTIONS
// ========================
const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return { 
      success: true, 
      message: 'Backend is running',
      data 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Backend server is not running',
      error: error.message 
    };
  }
};

const checkAdminAuth = () => {
  const token = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');
  
  if (!token || !adminUser) {
    return { 
      authenticated: false,
      message: 'Not authenticated'
    };
  }
  
  try {
    const user = JSON.parse(adminUser);
    return {
      authenticated: true,
      user,
      token
    };
  } catch (error) {
    return {
      authenticated: false,
      message: 'Invalid admin data'
    };
  }
};

const clearAdminSession = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  return { success: true, message: 'Session cleared' };
};

// ========================
// CALCULATION FUNCTIONS for COD/UPI
// ========================
const calculateOrderSummary = (subtotal, paymentMethod) => {
  const delivery = subtotal >= 199 ? 0 : 9;
  let discount = 0;
  let handlingCharge = 0;
  
  if (paymentMethod === 'upi') {
    discount = 10;
    handlingCharge = 0;
  } else if (paymentMethod === 'cod') {
    discount = 0;
    handlingCharge = 9;
  }
  
  const total = subtotal + delivery + handlingCharge - discount;
  
  return {
    subtotal,
    delivery,
    discount,
    handlingCharge,
    total
  };
};

// ========================
// EXPORTS
// ========================
export { 
  authAPI, 
  productAPI, 
  orderAPI, 
  adminApi,
  couponAPI,
  checkBackendStatus,
  checkAdminAuth,
  clearAdminSession,
  calculateOrderSummary
};

// Convenience exports
export const createOrder = orderAPI.createOrder;
export const getFeaturedProducts = productAPI.getFeaturedProducts;
export const getUserOrdersByEmail = orderAPI.getUserOrdersByEmail;
export const trackOrder = orderAPI.trackOrder;
export const adminLogin = adminApi.login;
export const adminGetProducts = adminApi.getProducts;
export const adminCreateProduct = adminApi.createProduct;
export const adminUpdateProduct = adminApi.updateProduct;
export const adminDeleteProduct = adminApi.deleteProduct;
export const adminGetDashboardStats = adminApi.getDashboardStats;
export const adminGetOrderDetails = adminApi.getOrderDetails;
export const adminUpdateOrderStatus = adminApi.updateOrderStatus;
export const adminVerifyPayment = adminApi.verifyPayment;
export const validateCoupon = couponAPI.validateCoupon;

export default {
  auth: authAPI,
  products: productAPI,
  orders: orderAPI,
  admin: adminApi,
  coupons: couponAPI,
  utils: {
    checkBackendStatus,
    checkAdminAuth,
    clearAdminSession,
    calculateOrderSummary
  }
};
