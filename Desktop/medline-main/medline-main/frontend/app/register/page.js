"use client"; // Required for useState/useEffect in Next.js App Router

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    age: '',
    location: '',
    password: '',
    confirmPassword: '',
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
    
    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Validate mobile number format
    if (!/^\d{10}$/.test(formData.number)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true); // Show loading indicator

    const data = new FormData();
    // Only append fields that are in the API model
    for (let key in formData) {
      if (key !== 'confirmPassword') { // Skip confirmPassword as it's not needed in the backend
        data.append(key, formData[key]);
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback for local development
      const res = await axios.post(`${apiUrl}/register/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.status === 200 || res.status === 201) { // 200 OK or 201 Created for success
        setShowSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/login'); // Use Next.js router for navigation
        }, 1500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || "Registration failed! Please try again.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/hospital-building-modern-parking-lot_1127-3822.jpg?w=2000')", // Apollo Hospital themed background
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-teal-600/40 to-teal-700/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-lg p-8 rounded-xl shadow-2xl bg-white/30 backdrop-blur-md text-center">
        <div className="mb-6">
          <h1 className="text-white text-5xl font-bold">Apollo Hospital</h1>
          <p className="text-white text-lg mt-2">Create your patient account</p>
        </div>
        <h2 className="text-white text-3xl font-bold mb-8">Register</h2>

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
                placeholder="Password (min. 6 characters)"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            
            {/* Confirm Password Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500"
              />
            </div>
          </div> {/* End of grid container */}

          {/* Description Textarea (Full width) */}
          <div className="relative">
            <label htmlFor="description" className="block text-white text-sm font-semibold mb-1">
              Medical History (optional):
            </label>
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              placeholder="Any medical conditions, allergies, or previous treatments"
              rows="3"
              className="w-full p-3 rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500 resize-y"
            />
          </div>

          {/* Image Upload Input (Full width) */}
          <div className="relative text-left">
            <label htmlFor="image-upload" className="block text-white text-sm font-semibold mb-1 cursor-pointer">
              Upload Profile Image (optional):
            </label>
            <input
              name="image"
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-white bg-white/70 border border-white/50 rounded-full py-2 px-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          {/* Register Button */}
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
                Registering...
              </div>
            ) : 'Register'}
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
              <p>Registration successful! Redirecting to login...</p>
            </div>
          )}

          {/* Terms & Policy */}
          <p className="text-center text-sm text-white/80 mt-4">
            By registering, you agree to Apollo Hospital's <a href="#" className="font-bold hover:underline">Terms of Service</a>, <a href="#" className="font-bold hover:underline">Privacy Policy</a> and <a href="#" className="font-bold hover:underline">Patient Data Policy</a>.
          </p>

          {/* Login Link at bottom */}
          <div className="mt-6 p-4 bg-teal-600/30 border border-teal-200/30 rounded-xl text-center">
            <p className="text-white">
              Already have an account? <a href="/login" className="text-white font-bold hover:underline">Log in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
