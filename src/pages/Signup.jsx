import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Add Link here
import { authAPI } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);
    setShowResend(false);

    try {
      const res = await authAPI.signup(formData);
      setMessage(res.data.message || "Account created successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 2000);

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setMessage(msg);
      setMessageType("error");

      if (msg.toLowerCase().includes("already")) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await authAPI.resendCode({
        email: formData.email,
      });
      setMessage(res.data.message || "Verification code resent!");
      setMessageType("success");
      setShowResend(false);

      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to resend verification code."
      );
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl shadow-cyan-500/30 border border-gray-700 space-y-6"
      >
        <h2 className="text-4xl font-extrabold text-center text-cyan-400 mb-8 tracking-wide">
          Create Account
        </h2>

        {/* Full Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Input */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-cyan-600 text-white font-bold text-lg rounded-lg hover:bg-cyan-500 transition duration-300"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Message Display */}
        {message && (
          <p
            className={`text-center text-sm mt-2 flex items-center justify-center ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle size={16} className="mr-2" />
            ) : (
              <XCircle size={16} className="mr-2" />
            )}
            {message}
          </p>
        )}

        {/* Resend Code */}
        {showResend && (
          <button
            type="button"
            onClick={handleResendCode}
            className="mt-2 w-full py-2 text-sm bg-gray-700 hover:bg-gray-600 text-cyan-300 rounded-md flex items-center justify-center transition-all"
          >
            <Send size={16} className="mr-2" /> Resend Verification Code
          </button>
        )}

        {/* Login Link */}
        <div className="text-center pt-2">
          <span className="text-gray-400">Already have an account? </span>
          <Link
            to="/login"
            className="text-cyan-400 font-semibold hover:underline hover:text-cyan-300 transition duration-200"
          >
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
