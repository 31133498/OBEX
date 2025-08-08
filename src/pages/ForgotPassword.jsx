import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        // Show success message but also provide helpful information
        setMessage("If an account with this email exists, a reset link has been sent. Please check your email (including spam folder).");
        setMessageType("success");
        
        // Clear form on success
        setEmail("");
        
        // Don't auto-redirect, let user read the message
        // setTimeout(() => {
        //   navigate("/login");
        // }, 3000);
        
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
      setMessageType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
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
              <Mail size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-2 tracking-wide">
              Forgot Password?
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
                autoComplete="email"
              />
              <Mail size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                Sending...
              </>
            ) : (
              <>
                <Mail size={20} className="mr-2" />
                Send Reset Link
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
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/auth" className="text-cyan-400 hover:text-cyan-300 underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Helpful Information */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h3 className="text-sm font-medium text-cyan-400 mb-2">💡 Helpful Tips:</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Check your spam/junk folder if you don't see the email</li>
              <li>• Make sure you're using the email address you registered with</li>
              <li>• The reset link expires after 24 hours for security</li>
              <li>• If you still don't receive an email, try again in a few minutes</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
