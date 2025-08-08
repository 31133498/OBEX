import React, { useState } from "react";
import { Mail, Lock, LogIn, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from location state (for redirects from protected routes)
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (message && messageType === 'error') {
      setMessage(null);
      setMessageType(null);
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return false;
    }

    if (!formData.password) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const result = await authService.login(formData);
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        setAttempts(0); // Reset attempts on successful login

        // Redirect to the intended page or dashboard
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);

      } else {
        setMessage(result.message);
        setMessageType('error');
        setAttempts(prev => prev + 1);
        
        // Show forgot password suggestion after multiple failed attempts
        if (attempts >= 2) {
          setTimeout(() => {
            setMessage(prev => prev + " Consider using the 'Forgot Password?' link if you're having trouble.");
          }, 2000);
        }
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      setMessageType('error');
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl shadow-cyan-500/30 border border-gray-700 space-y-6 transform transition-all duration-300 hover:scale-[1.01]"
        >
          <h2 className="text-4xl font-extrabold text-center text-cyan-400 mb-8 tracking-wide">
            Welcome Back
          </h2>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/40 hover:bg-cyan-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} className="mr-2" /> Login
              </>
            )}
          </button>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center ${messageType === 'success' ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
              {messageType === 'success' ? (
                <CheckCircle size={16} className="mr-2 text-green-400" />
              ) : (
                <XCircle size={16} className="mr-2 text-red-400" />
              )}
              <span className={`text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </span>
            </div>
          )}

          {/* Additional Links */}
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/auth" className="text-cyan-400 hover:text-cyan-300 underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          {attempts > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Login attempts: {attempts}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
