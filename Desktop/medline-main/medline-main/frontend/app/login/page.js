"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback for local development
      const res = await axios.post(`${apiUrl}/login/`, formData);

      if (res.status === 200) {
        // Store user data in localStorage for session management
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', res.data.user);
        localStorage.setItem('userEmail', res.data.email);
        
        setShowSuccess(true);
        // Simulate a delay before redirecting to allow success message to be seen
        setTimeout(() => {
          router.push(res.data.redirect_url || '/'); // Use Next.js router for navigation
        }, 1500);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found. Please check your email or register a new account.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/hospital-building-modern-parking-lot_1127-3822.jpg?w=800&q=80')", // Optimized image size
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-teal-600/40 to-teal-700/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-xl shadow-2xl bg-white/30 backdrop-blur-md text-center">
        <div className="mb-6">
          <h1 className="text-white text-5xl font-bold">Apollo Hospital</h1>
          <p className="text-white text-lg mt-2">Patient Login</p>
        </div>
        <h2 className="text-white text-3xl font-bold mb-8">Login</h2>

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
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500"
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
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </div>
            ) : 'Login'}
          </button>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-md" role="alert">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          {showSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4 rounded-md" role="alert">
              <p className="font-medium">Success</p>
              <p>Login successful! Redirecting...</p>
            </div>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-white text-sm mt-4">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-teal-600 rounded mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-white hover:underline">
              Forgot password?
            </a>
          </div>
          
          {/* Doctor Login Link */}
          <div className="mt-6 p-4 bg-teal-600/30 border border-teal-200/30 rounded-xl text-center">
            <p className="text-white">
              <a href="/doctor/login" className="text-white font-bold hover:underline">
                Login as Doctor
              </a>
            </p>
          </div>
          
          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-white">Don't have an account? <a href="/register" className="text-white font-bold hover:underline">Register now</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
