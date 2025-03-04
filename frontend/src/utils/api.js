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

// Request interceptor for adding authentication token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
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
          sessionStorage.removeItem('token');
          window.location.href = '/employee/login';
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
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.employee));
      
      return response.data;
    } catch (error) {
      // Rethrow to allow component to handle specific errors
      throw error;
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/employee/login';
  },

  getCurrentUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  }
};

// Inventory-related services
export const inventoryService = {
  getAllItems: () => api.get('/inventory'),
  getItemById: (id) => api.get(`/inventory/${id}`),
  createItem: (itemData) => api.post('/inventory', itemData),
  updateItem: (id, itemData) => api.put(`/inventory/${id}`, itemData),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  getLowStockItems: () => api.get('/inventory/status/low-stock')
};

export default api;