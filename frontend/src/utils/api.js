// src/utils/api.js
import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Use localStorage consistently for token storage
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Set user info
const setUserInfo = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Request interceptor for adding authentication token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          removeToken();
          setUserInfo(null);
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Not Found: The requested resource does not exist');
          break;
        case 500:
          console.error('Server Error: Please try again later');
          break;
        default:
          console.error('An unexpected error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request', error.message);
    }

    return Promise.reject(error);
  }
);

// Authentication-related services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/employees/login', { email, password });
      
      // Store token and user info
      setToken(response.data.token);
      setUserInfo(response.data.employee);
      
      return response.data;
    } catch (error) {
      // Rethrow to allow component to handle specific errors
      throw error;
    }
  },

  logout: () => {
    removeToken();
    setUserInfo(null);
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!getToken();
  }
};

// Inventory-related services
export const inventoryService = {
  getAllItems: (config) => api.get('/inventory', config),
  getItemById: (id) => api.get(`/inventory/${id}`),
  createItem: (itemData) => api.post('/inventory', itemData),
  updateItem: (id, itemData) => api.put(`/inventory/${id}`, itemData),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  getLowStockItems: () => api.get('/inventory/status/low-stock')
};

export default api;