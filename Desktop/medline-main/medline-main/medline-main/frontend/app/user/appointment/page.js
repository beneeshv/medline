"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function BookAppointment() {
  const router = useRouter();
  const [form, setForm] = useState({
    user: '',
    doctor: '',
    date: '',
    time: '',
    symptoms: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch doctors from the API
    axios.get('http://localhost:8000/api/doctors/')
      .then(res => setDoctors(res.data))
      .catch(err => {
        console.error("Doctor fetch error:", err);
        setError("Failed to load doctors. Please try again.");
      });

    // Get user ID directly from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        // Try to parse the userId as a number
        const userIdNum = parseInt(userId);
        if (isNaN(userIdNum)) {
          throw new Error("Invalid user ID");
        }
        setForm(prev => ({ ...prev, user: userIdNum }));
      } catch (err) {
        console.error("Error parsing user ID:", err);
        setError("There was a problem with your login. Please log in again.");
        // Redirect to login page after a short delay
        setTimeout(() => router.push('/login'), 2000);
      }
    } else {
      setError("Please login first to book an appointment");
      // Redirect to login page after a short delay
      setTimeout(() => router.push('/login'), 2000);
    }
  }, [router]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Check if user ID exists and is valid
      if (!form.user) {
        throw new Error("User ID is missing. Please log in again.");
      }
      
      // Ensure user ID is a number before sending
      const formData = {
        ...form,
        user: parseInt(form.user)
      };
      
      if (isNaN(formData.user)) {
        throw new Error("Invalid user ID. Please log in again.");
      }
      
      const res = await axios.post('http://localhost:8000/appointments/book/', formData);
      setSuccess(true);
      setForm({
        user: form.user, // Keep the user ID
        doctor: '',
        date: '',
        time: '',
        symptoms: ''
      });
      alert(res.data.message);
    } catch (err) {
      if (err.message.includes("User ID")) {
        setError(err.message);
        // Redirect to login page after a short delay
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Error booking appointment. Please try again.');
        console.error(err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>Appointment booked successfully!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Doctor:</label>
          <select 
            name="doctor" 
            onChange={handleChange} 
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.name} ({doc.specialization?.name || 'General'})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date:</label>
          <input 
            name="date" 
            type="date" 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time:</label>
          <input 
            name="time" 
            type="time" 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Symptoms:</label>
          <textarea 
            name="symptoms" 
            placeholder="Describe your symptoms or reason for visit" 
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32"
          ></textarea>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 flex justify-between">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </a>
        <div className="flex space-x-4">
          <a href="/user/account" className="text-blue-600 hover:underline">
            My Account
          </a>
          <a href="/user/appointments" className="text-blue-600 hover:underline">
            My Appointments
          </a>
        </div>
      </div>
    </div>
  );
}
