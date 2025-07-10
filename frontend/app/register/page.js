"use client"; // Required for useState/useEffect in Next.js App Router

import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    age: '',
    location: '',
    password: '',
    description: '',
    image: null
  });
  const [error, setError] = useState(''); // State for displaying errors
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [showSuccess, setShowSuccess] = useState(false); // State for success message

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setShowSuccess(false); // Clear previous success messages
    setLoading(true); // Show loading indicator

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'; // Fallback for local development
      const res = await axios.post(`${apiUrl}/register/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.status === 200 || res.status === 201) { // 200 OK or 201 Created for success
        setShowSuccess(true);
        // Optionally redirect after a short delay
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login page after successful registration
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed! Please try again.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://img.freepik.com/premium-photo/doctor-holding-heart-his-hand_218381-12069.jpg?w=2000')", // Use a similar placeholder image
        // Replace with your actual background image URL for consistency with login page
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-lg p-8 rounded-xl shadow-2xl bg-white/30 backdrop-blur-md text-center"> {/* Increased max-w-md to max-w-lg for more space */}
        <p className="text-white text-lg mb-2">Already have an account? <a href="/login" className="text-white font-bold hover:underline">Login now</a></p>
        <h2 className="text-white text-4xl font-bold mb-8">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid for two columns */}
            {/* Full Name Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                name="name"
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Mobile Number Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {/* Phone icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.67-3.67A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.18 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.11 2.4l-.52.29a2 2 0 0 0-.54 2.65 10 10 0 0 0 6.61 6.61 2 2 0 0 0 2.65-.54l.29-.52a2 2 0 0 1 2.4-1.11 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
              </span>
              <input
                name="number"
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Email Address Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {/* Mail icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
              </span>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Age Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {/* Calendar or Person icon for age */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
              </span>
              <input
                name="age"
                type="number"
                onChange={handleChange}
                placeholder="Age"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Location Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {/* Map-pin icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 12V2L8 6 12 12 16 6 12 2z"></path>
                      <circle cx="12" cy="17" r="3"></circle>
                  </svg>
              </span>
              <input
                name="location"
                onChange={handleChange}
                placeholder="Location"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500"
              />
            </div>
          </div> {/* End of grid container */}

          {/* Description Textarea (Full width) */}
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="About yourself (optional)"
            rows="3" // Adjust rows as needed
            className="w-full p-3 rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500 resize-y"
          />

          {/* Image Upload Input (Full width) */}
          <div className="relative text-left">
            <label htmlFor="image-upload" className="block text-white text-sm font-semibold mb-1 cursor-pointer">
              Upload Profile Image (optional):
            </label>
            <input
              name="image"
              id="image-upload"
              type="file"
              onChange={handleChange}
              className="w-full text-white bg-white/70 border border-white/50 rounded-full py-2 px-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-white/90 hover:bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Error and Success Messages */}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {showSuccess && (
            <p className="text-green-500 text-sm mt-2">Registration successful! Redirecting to login...</p>
          )}

          {/* Terms & Policy */}
          <p className="text-center text-sm text-white/80 mt-4">
            By registering, you agree to our <a href="#" className="font-bold hover:underline">Terms</a>, <a href="#" className="font-bold hover:underline">Data Policy</a> and <a href="#" className="font-bold hover:underline">Cookies Policy</a>.
          </p>

          {/* Login Link at bottom */}
          <div className="mt-6 p-4 bg-white/20 border border-white/30 rounded-xl text-center">
            <p className="text-white">
              Already have an account? <a href="/login" className="text-white font-bold hover:underline">Log in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
