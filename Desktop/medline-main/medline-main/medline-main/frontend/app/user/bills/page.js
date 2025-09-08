'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('Please login first');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/bills/user/${userId}/`);
        setBills(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to load bills');
        setLoading(false);
      }
    };

    fetchBills();
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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bills</h1>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
          <a href="/user/account" className="text-blue-600 hover:text-blue-800">My Account</a>
          <a href="/user/prescriptions" className="text-blue-600 hover:text-blue-800">My Prescriptions</a>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading bills...</p>
        </div>
      ) : bills.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You don't have any bills yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bills.map(bill => (
            <div key={bill.id} className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-blue-800">
                    Bill for Dr. {bill.appointment?.doctor?.name || 'Unknown'}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {bill.appointment?.date} at {bill.appointment?.time}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Payment Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(bill.payment_status)}`}>
                    {bill.payment_status}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Bill Details:</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Consultation Fee:</span>
                      <span>${bill.consultation_fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medication Charges:</span>
                      <span>${bill.medication_charges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lab Test Charges:</span>
                      <span>${bill.lab_test_charges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Charges:</span>
                      <span>${bill.other_charges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${bill.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${bill.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Amount:</span>
                      <span>${bill.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {bill.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Notes:</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      {bill.notes}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>Generated on: {formatDate(bill.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}