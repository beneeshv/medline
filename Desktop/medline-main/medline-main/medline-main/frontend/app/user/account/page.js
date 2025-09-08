'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UserAccount() {
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId || !userName || !userEmail) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    setUserData({
      id: userId,
      name: userName,
      email: userEmail
    });
    setLoading(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
          <a href="/user/prescriptions" className="text-blue-600 hover:text-blue-800">My Prescriptions</a>
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
          <p className="text-gray-600">Loading user details...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-blue-800">User Profile</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="text-lg font-medium">{userData.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-lg font-medium">{userData.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                      <p className="text-lg font-medium">{userData.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-blue-800">Quick Links</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/user/appointments" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">My Appointments</span>
                  <span className="text-sm text-gray-600">View your scheduled appointments</span>
                </Link>
                
                <Link href="/user/prescriptions" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">My Prescriptions</span>
                  <span className="text-sm text-gray-600">Access your medical prescriptions</span>
                </Link>
                
                <Link href="/user/bills" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">My Bills</span>
                  <span className="text-sm text-gray-600">View and manage your medical bills</span>
                </Link>
                
                <Link href="/user/appointment" className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Book Appointment</span>
                  <span className="text-sm text-gray-600">Schedule a new appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}