import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import LogoLoader from '../LogoLoader';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });
  const location = useLocation();

  useEffect(() => {
    // Initialize auth service
    authService.init();
    
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
      setIsLoading(false);
    });

    // Check current auth state
    const checkAuth = () => {
      const isAuth = authService.checkAuth();
      if (isAuth !== authState.isAuthenticated) {
        setAuthState({
          isAuthenticated: isAuth,
          user: authService.getUser()
        });
      }
      setIsLoading(false);
    };

    checkAuth();

    return unsubscribe;
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LogoLoader />
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !authState.isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is for non-authenticated users (like login/signup) and user is authenticated
  if (!requireAuth && authState.isAuthenticated) {
    // Redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if auth requirements are met
  return children;
};

export default ProtectedRoute;
