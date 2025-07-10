"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // State for displaying errors
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [showSuccess, setShowSuccess] = useState(false); // State for success message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setShowSuccess(false); // Clear previous success messages
    setLoading(true); // Show loading indicator

    try {
      // Ensure NEXT_PUBLIC_API_URL is defined and accessible
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'; // Fallback for local development
      const res = await axios.post(`${apiUrl}/login/`, formData);

      if (res.status === 200) {
        setShowSuccess(true);
        // Simulate a delay before redirecting to allow success message to be seen
        setTimeout(() => {
          window.location.href = res.data.redirect_url || '/'; // Redirect using window.location.href
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://img.freepik.com/premium-photo/doctor-holding-heart-his-hand_218381-12069.jpg?w=2000')", // Placeholder image
        // You would replace the placeholder with the actual mountain/sky image URL if you have one
        // For example: backgroundImage: "url('/path/to/your/mountain-sky-bg.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-xl shadow-2xl bg-white/30 backdrop-blur-md text-center">
        {/* Changed "Have an account?" to prompt for registration */}
        <p className="text-white text-lg mb-2">Don't have an account? <a href="/register" className="text-white font-bold hover:underline">Register now</a></p>
        <h2 className="text-white text-4xl font-bold mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {/* User icon (Lucide React or FontAwesome would be better) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Username" /* Changed placeholder to "Username" to match image */
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {/* Lock icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-white/90 hover:bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>

          {/* Error and Success Messages */}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {showSuccess && (
            <p className="text-green-500 text-sm mt-2">Login successful! Redirecting...</p>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-white text-sm mt-4">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-blue-600 rounded mr-2" />
              Remember Me
            </label>
            <a href="/doctor/login" className="text-white hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
