import React, { useState } from "react";
import { Mail, ShieldCheck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const navigate = useNavigate(); // 👈 Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const res = await authAPI.verifyEmail(formData);

      setMessage(res.data.message || "Email verified successfully!");
      setMessageType("success");

      // Optionally clear form
      setFormData({ email: "", code: "" });

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2 seconds
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl shadow-cyan-500/30 border border-gray-700 space-y-6 transform transition-all duration-300 hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-6 tracking-wide">
          Verify Your Email
        </h2>

        {/* Email Field */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* OTP Field */}
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="code"
            placeholder="Enter the 6-digit code"
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-cyan-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/40 hover:bg-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm mt-4 flex items-center justify-center ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {messageType === "success" ? (
              <ShieldCheck size={16} className="mr-2" />
            ) : (
              <XCircle size={16} className="mr-2" />
            )}
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default VerifyEmail;
