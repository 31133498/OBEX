import { authAPI } from './api';

// Authentication state management
class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.tokenRefreshTimer = null;
    this.listeners = [];
  }

  // Initialize auth state from localStorage
  init() {
    const token = localStorage.getItem('primusLiteToken');
    const userData = localStorage.getItem('primusLiteUser');
    
    if (token && userData) {
      try {
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
        this.setupTokenRefresh();
        this.notifyListeners();
      } catch (error) {
        this.logout();
      }
    }
  }

  // Subscribe to auth state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state changes
  notifyListeners() {
    this.listeners.forEach(listener => listener({
      isAuthenticated: this.isAuthenticated,
      user: this.user
    }));
  }

  // Enhanced login with better error handling
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.token) {
        this.setToken(response.data.token);
        this.setUser(response.data.user || { email: credentials.email });
        this.setupTokenRefresh();
        this.notifyListeners();
        
        return {
          success: true,
          message: response.data.message || 'Login successful!',
          user: response.data.user
        };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      const errorMessage = this.getErrorMessage(error, 'login');
      return {
        success: false,
        message: errorMessage,
        code: error.response?.status
      };
    }
  }

  // Enhanced signup with validation
  async signup(userData) {
    try {
      // Client-side validation
      const validation = this.validateSignupData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message,
          field: validation.field
        };
      }

      const response = await authAPI.signup(userData);
      
      return {
        success: true,
        message: response.data.message || 'Account created successfully!',
        email: userData.email
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error, 'signup');
      return {
        success: false,
        message: errorMessage,
        code: error.response?.status
      };
    }
  }

  // Enhanced email verification
  async verifyEmail(verificationData) {
    try {
      const response = await authAPI.verifyEmail(verificationData);
      
      return {
        success: true,
        message: response.data.message || 'Email verified successfully!'
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error, 'verification');
      return {
        success: false,
        message: errorMessage,
        code: error.response?.status
      };
    }
  }

  // Enhanced resend code
  async resendCode(email) {
    try {
      const response = await authAPI.resendCode({ email });
      
      return {
        success: true,
        message: response.data.message || 'Verification code resent!'
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error, 'resend');
      return {
        success: false,
        message: errorMessage,
        code: error.response?.status
      };
    }
  }

  // Enhanced forgot password
  async forgotPassword(email) {
    try {
      // Email validation
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      const response = await authAPI.forgotPassword(email);
      
      return {
        success: true,
        message: response.data.message || 'Reset link sent successfully!'
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error, 'forgot-password');
      return {
        success: false,
        message: errorMessage,
        code: error.response?.status
      };
    }
  }

  // Enhanced reset password
  async resetPassword(token, newPassword) {
    try {
      // Password validation
      const passwordValidation = this.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: passwordValidation.message
        };
      }

      const response = await authAPI.resetPassword(token, newPassword);
      
      return {
        success: true,
        message: response.data.message || 'Password reset successfully!'
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error, 'reset-password');
      return {
        success: false,
        message: errorMessage,
        code: error.response?.status
      };
    }
  }

  // Logout with cleanup
  logout() {
    localStorage.removeItem('primusLiteToken');
    localStorage.removeItem('primusLiteUser');
    this.isAuthenticated = false;
    this.user = null;
    
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
    
    this.notifyListeners();
  }

  // Check if user is authenticated
  checkAuth() {
    const token = localStorage.getItem('primusLiteToken');
    if (!token) {
      this.logout();
      return false;
    }
    return true;
  }

  // Setup token refresh (if needed)
  setupTokenRefresh() {
    // Clear existing timer
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    
    // Set up refresh timer (refresh 5 minutes before expiry)
    // This is a placeholder - implement based on your token expiry logic
    // this.tokenRefreshTimer = setTimeout(() => {
    //   this.refreshToken();
    // }, (tokenExpiryTime - 5 * 60 * 1000));
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await authAPI.getProfile();
      this.setUser(response.data);
      this.notifyListeners();
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout();
      }
      return {
        success: false,
        message: this.getErrorMessage(error, 'profile')
      };
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await authAPI.updateProfile(userData);
      this.setUser(response.data);
      this.notifyListeners();
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully!',
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: this.getErrorMessage(error, 'profile-update')
      };
    }
  }

  // Helper methods
  setToken(token) {
    localStorage.setItem('primusLiteToken', token);
  }

  setUser(user) {
    this.user = user;
    this.isAuthenticated = true;
    localStorage.setItem('primusLiteUser', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('primusLiteToken');
  }

  getUser() {
    return this.user;
  }

  // Validation methods
  validateSignupData(data) {
    if (!data.full_name || data.full_name.trim().length < 2) {
      return {
        isValid: false,
        message: 'Full name must be at least 2 characters long',
        field: 'full_name'
      };
    }

    if (!this.isValidEmail(data.email)) {
      return {
        isValid: false,
        message: 'Please enter a valid email address',
        field: 'email'
      };
    }

    if (!data.phone || data.phone.trim().length < 10) {
      return {
        isValid: false,
        message: 'Please enter a valid phone number',
        field: 'phone'
      };
    }

    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return {
        isValid: false,
        message: passwordValidation.message,
        field: 'password'
      };
    }

    return { isValid: true };
  }

  validatePassword(password) {
    if (!password || password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }

    return { isValid: true };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enhanced error message handling
  getErrorMessage(error, context) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Server-provided messages
    if (serverMessage) {
      return serverMessage;
    }

    // Network errors
    if (!error.response) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Status-based messages
    switch (status) {
      case 400:
        return this.get400Message(context);
      case 401:
        return this.get401Message(context);
      case 403:
        return 'Access denied. Please check your permissions.';
      case 404:
        return this.get404Message(context);
      case 409:
        return this.get409Message(context);
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  get400Message(context) {
    switch (context) {
      case 'login':
        return 'Invalid email or password. Please check your credentials.';
      case 'signup':
        return 'Invalid registration data. Please check your information.';
      case 'verification':
        return 'Invalid verification code. Please check and try again.';
      default:
        return 'Invalid request. Please check your input.';
    }
  }

  get401Message(context) {
    switch (context) {
      case 'login':
        return 'Invalid email or password. Please check your credentials.';
      case 'profile':
        return 'Session expired. Please log in again.';
      default:
        return 'Authentication required. Please log in.';
    }
  }

  get404Message(context) {
    switch (context) {
      case 'verification':
        return 'Verification code not found. Please request a new one.';
      case 'reset-password':
        return 'Reset link expired or invalid. Please request a new one.';
      default:
        return 'Resource not found.';
    }
  }

  get409Message(context) {
    switch (context) {
      case 'signup':
        return 'An account with this email already exists. Please log in or use a different email.';
      default:
        return 'Resource already exists.';
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
