import axios from 'axios';
import environment from '../config/environment';

// Base URL for the API
const API_BASE_URL = environment.API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('primusLiteToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('primusLiteToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Authentication APIs
export const authAPI = {
  // Register new user
  signup: (userData) => api.post('/users/signup', userData),
  
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Verify email
  verifyEmail: (data) => api.post('/users/verify-email', data),
  
  // Resend verification code
  resendCode: (email) => api.post('/users/resend-code', { email }),
  
  // Get user profile
  getProfile: () => api.get('/users/'),
  
  // Update user profile
  updateProfile: (userData) => api.post('/users/update', userData),
  
  // Forgot password
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, newPassword) => api.post('/users/reset-password', { 
    token, 
    new_password: newPassword 
  }),
};

// Camera Management APIs
export const cameraAPI = {
  // Add new camera
  addCamera: (cameraData) => api.post('/cameras/add', cameraData),
  
  // Get all cameras
  getAllCameras: () => api.get('/cameras/'),
  
  // Get single camera
  getCamera: (id) => api.post(`/cameras/${id}`),
  
  // Update camera
  updateCamera: (id, cameraData) => api.put(`/cameras/${id}`, cameraData),
  
  // Delete camera
  deleteCamera: (id) => api.delete(`/cameras/${id}`),
};

// History/Events API (if available)
export const historyAPI = {
  // Get events/history
  getEvents: () => api.get('/history/'),
  
  // Add event
  addEvent: (eventData) => api.post('/history/', eventData),
};

// Settings API (if available)
export const settingsAPI = {
  // Get notification settings
  getNotificationSettings: () => api.get('/notifications/settings'),
  
  // Update notification settings
  updateNotificationSettings: (settings) => api.put('/notifications/settings', settings),
};

export default api;
