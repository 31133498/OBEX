// Frontend Configuration for OBEX AI Security Dashboard

const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    VIDEOS: '/videos',
    VIDEO_FEED: '/video_feed',
    ALERTS: '/alerts',
    PERFORMANCE: '/performance',
    ZONES: '/zones',
    SET_ZONE: '/set_zone',
    UPLOAD_VIDEO: '/upload_video',
    SWITCH_VIDEO: '/switch_video',
    THEFT_ALERTS: '/theft_alerts',
    SUSPICIOUS_BEHAVIOR: '/suspicious_behavior',
    INTRUSION_ALERTS: '/intrusion_alerts',
    LOITERING_ALERTS: '/loitering_alerts',
    MONGO_ALERTS: '/mongo/alerts',
    MONGO_STATUS: '/mongo/status'
  },
  
  // API Authentication (optional)
  API_KEY: process.env.REACT_APP_API_KEY || null,
  
  // Polling intervals (in milliseconds)
  POLLING_INTERVALS: {
    ALERTS: 2000,
    PERFORMANCE: 5000,
    HEALTH: 10000
  },
  
  // Video settings
  VIDEO: {
    QUALITY: 70,
    REFRESH_RATE: 100
  },
  
  // Zone settings
  ZONE: {
    LOITER_THRESHOLD: 30,
    ALERT_TIMEOUT: 5
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to get API headers
export const getApiHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (config.API_KEY) {
    headers['Authorization'] = `Bearer ${config.API_KEY}`;
  }
  
  return headers;
};

export default config; 