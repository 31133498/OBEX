// Environment configuration
const environment = {
  // API Configuration
  API_BASE_URL: 'https://primus-lite.onrender.com/api',
  
  // Frontend URLs for different environments
  FRONTEND_URLS: {
    development: 'http://localhost:5173', // Vite dev server
    production: 'https://primus-lite.vercel.app',
    staging: 'https://primus-lite-staging.vercel.app' // if you have staging
  },
  
  // Current environment detection
  getCurrentEnvironment() {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
      } else if (hostname.includes('vercel.app')) {
        return 'production';
      }
    }
    return 'development'; // default
  },
  
  // Get current frontend URL
  getCurrentFrontendUrl() {
    const env = this.getCurrentEnvironment();
    return this.FRONTEND_URLS[env] || this.FRONTEND_URLS.development;
  },
  
  // Check if we're in development
  isDevelopment() {
    return this.getCurrentEnvironment() === 'development';
  },
  
  // Check if we're in production
  isProduction() {
    return this.getCurrentEnvironment() === 'production';
  }
};

export default environment;
