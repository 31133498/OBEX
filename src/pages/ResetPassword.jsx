import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, Key, ExternalLink } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import authService from '../services/authService';
import environment from '../config/environment';
import environmentUtils from '../utils/environmentUtils';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenValid, setTokenValid] = useState(true);
  const [isProduction, setIsProduction] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get token from URL parameters
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setTokenValid(false);
      setMessage("Invalid reset link. Please request a new password reset.");
      setMessageType("error");
    } else {
      setToken(resetToken);
    }

    // Check if we're in production environment
    setIsProduction(environment.isProduction());
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
      setMessageType(null);
    }
  };

  const validateForm = () => {
    if (!formData.password) {
      setMessage("Please enter a new password.");
      setMessageType("error");
      return false;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      setMessage("Password must contain at least one lowercase letter.");
      setMessageType("error");
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setMessage("Password must contain at least one uppercase letter.");
      setMessageType("error");
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setMessage("Password must contain at least one number.");
      setMessageType("error");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
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
      const result = await authService.resetPassword(token, formData.password);
      
      if (result.success) {
        setMessage(result.message);
        setMessageType("success");
        
        // Clear form
        setFormData({
          password: "",
          confirmPassword: "",
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: "gray", text: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;

    const colors = ["red", "orange", "yellow", "lightgreen", "green"];
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    
    return {
      strength: Math.min(strength, 5),
      color: colors[strength - 1] || "gray",
      text: texts[strength - 1] || ""
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Environment notice for development
  const EnvironmentNotice = () => {
    if (!isProduction) return null;
    
    const devUrl = environmentUtils.getDevelopmentUrl('/reset-password', { token });
    
    return (
      <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <ExternalLink size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Production Environment</span>
        </div>
        <p className="text-xs text-blue-300 mb-3">
          You're currently using the production version. For development, you can:
        </p>
        <div className="space-y-2">
          <a 
            href={devUrl}
            className="block text-xs text-blue-300 hover:text-blue-200 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            • Open in local development (localhost:5173)
          </a>
          <p className="text-xs text-blue-300">
            • Or continue using this production version
          </p>
        </div>
      </div>
    );
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link 
              to="/forgot-password" 
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Forgot Password
            </Link>
          </div>
          
          <div className="w-full bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl shadow-red-500/30 border border-gray-700 space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <XCircle size={24} className="text-red-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-center text-red-400 mb-2 tracking-wide">
                Invalid Reset Link
              </h2>
              <p className="text-gray-400 text-sm">
                The password reset link is invalid or has expired.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <Link 
                to="/forgot-password" 
                className="inline-block w-full py-3 bg-cyan-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/40 hover:bg-cyan-500 transition-all duration-300"
              >
                Request New Reset Link
              </Link>
              
              <Link 
                to="/login" 
                className="inline-block w-full py-3 bg-gray-700 text-white font-bold text-lg rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Environment Notice */}
        <EnvironmentNotice />
        
        {/* Back to Login Link */}
        <div className="mb-6">
          <Link 
            to="/login" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl shadow-cyan-500/30 border border-gray-700 space-y-6 transform transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <Key size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-2 tracking-wide">
              Reset Password
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your new password below.
            </p>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 w-8 rounded ${
                          level <= passwordStrength.strength
                            ? `bg-${passwordStrength.color}-500`
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${
                    passwordStrength.color === "green" ? "text-green-400" :
                    passwordStrength.color === "lightgreen" ? "text-green-400" :
                    passwordStrength.color === "yellow" ? "text-yellow-400" :
                    passwordStrength.color === "orange" ? "text-orange-400" :
                    passwordStrength.color === "red" ? "text-red-400" :
                    "text-gray-400"
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
                Resetting...
              </>
            ) : (
              <>
                <Key size={20} className="mr-2" />
                Reset Password
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
              Remember your password?{" "}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
