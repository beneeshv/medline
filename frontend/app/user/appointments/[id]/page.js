"use client";

// pages/appointments/user/[id].js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('Please login first');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/appointments/user/${userId}/`);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You don't have any appointments yet.</p>
          <a 
            href="/user/appointment" 
            className="inline-block py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Book an Appointment
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Doctor</th>
                <th className="py-2 px-4 border-b">Specialization</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">Dr. {appointment.doctor?.name || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">{appointment.doctor?.specialization?.name || 'General'}</td>
                  <td className="py-2 px-4 border-b">{appointment.date}</td>
                  <td className="py-2 px-4 border-b">{appointment.time}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{appointment.symptoms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </a>
        <div className="flex space-x-4">
          <a href="/user/account" className="text-blue-600 hover:underline">
            My Account
          </a>
          <a href="/user/prescriptions" className="text-blue-600 hover:underline">
            View Prescriptions
          </a>
          <a href="/user/bills" className="text-blue-600 hover:underline">
            View Bills
          </a>
          <a href="/user/appointment" className="text-blue-600 hover:underline">
            Book New Appointment →
          </a>
        </div>
      </div>
    </div>
  );
}
