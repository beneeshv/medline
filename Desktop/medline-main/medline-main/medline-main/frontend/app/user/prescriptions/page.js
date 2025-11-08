'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('Please login first');
          setLoading(false);
          return;
        }

        // Updated endpoint to match the backend URL pattern
        const response = await axios.get(`http://localhost:8000/api/prescriptions/user/${userId}/`);
        setPrescriptions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load prescriptions. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
        <div className="space-x-4">
           <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
           <a href="/user/account" className="text-blue-600 hover:text-blue-800">My Account</a>
           <a href="/user/bills" className="text-blue-600 hover:text-blue-800">My Bills</a>
         </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading prescriptions...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You don't have any prescriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map(prescription => (
            <div key={prescription.id} className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-blue-800">
                    Appointment with Dr. {prescription.appointment?.doctor?.name || 'Unknown'}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {prescription.appointment?.date} at {prescription.appointment?.time}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Medications:</h4>
                  <div className="bg-gray-50 p-3 rounded whitespace-pre-line">
                    {prescription.medications}
                  </div>
                </div>
                
                {prescription.instructions && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Instructions:</h4>
                    <div className="bg-gray-50 p-3 rounded whitespace-pre-line">
                      {prescription.instructions}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>Prescribed on: {formatDate(prescription.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}