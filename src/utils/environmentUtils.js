import environment from '../config/environment';

// Utility functions for environment management
export const environmentUtils = {
  // Get the appropriate reset password URL for the current environment
  getResetPasswordUrl(token) {
    const baseUrl = environment.getCurrentFrontendUrl();
    return `${baseUrl}/reset-password?token=${token}`;
  },

  // Get the appropriate login URL for the current environment
  getLoginUrl() {
    const baseUrl = environment.getCurrentFrontendUrl();
    return `${baseUrl}/login`;
  },

  // Get the appropriate forgot password URL for the current environment
  getForgotPasswordUrl() {
    const baseUrl = environment.getCurrentFrontendUrl();
    return `${baseUrl}/forgot-password`;
  },

  // Check if we should show environment switching options
  shouldShowEnvironmentSwitch() {
    return environment.isProduction();
  },

  // Get development URL for a specific route
  getDevelopmentUrl(route, params = {}) {
    const baseUrl = environment.FRONTEND_URLS.development;
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return queryString 
      ? `${baseUrl}${route}?${queryString}`
      : `${baseUrl}${route}`;
  },

  // Get production URL for a specific route
  getProductionUrl(route, params = {}) {
    const baseUrl = environment.FRONTEND_URLS.production;
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return queryString 
      ? `${baseUrl}${route}?${queryString}`
      : `${baseUrl}${route}`;
  },

  // Get current environment info
  getEnvironmentInfo() {
    return {
      current: environment.getCurrentEnvironment(),
      isDevelopment: environment.isDevelopment(),
      isProduction: environment.isProduction(),
      frontendUrl: environment.getCurrentFrontendUrl(),
      apiUrl: environment.API_BASE_URL
    };
  }
};

export default environmentUtils;
