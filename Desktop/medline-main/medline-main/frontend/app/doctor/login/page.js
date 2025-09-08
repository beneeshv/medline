'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function DoctorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:8000/api/doctor/login/', formData);
      if (res.data.success) {
        // Store both doctor object and doctorId separately for easier access
        localStorage.setItem('doctor', JSON.stringify(res.data));
        localStorage.setItem('doctorId', res.data.id);
        router.push('/doctor/home');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/medical-banner-with-doctor-wearing-coat_23-2149611228.jpg?w=2000')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 via-teal-500/30 to-teal-600/30 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-xl shadow-2xl bg-white/30 backdrop-blur-md text-center">
        <h2 className="text-teal-900 text-4xl font-bold mb-6">Apollo Hospital</h2>
        <h3 className="text-white text-2xl font-bold mb-8">Doctor Login</h3>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500"
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              suppressHydrationWarning={true}
            />
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 placeholder-gray-500"
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              suppressHydrationWarning={true}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            suppressHydrationWarning={true}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-white hover:underline">
              Back to Patient Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}