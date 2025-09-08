'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserPrescriptions() {
    const router = useRouter();
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
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-black">Apollo Hospital</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => { localStorage.removeItem('userId'); router.push('/login'); }} className="px-4 py-2 bg-gray-200 text-black rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            <li><Link href="/user/dashboard" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">Dashboard</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">Book Appointment</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Bills</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-black mb-6">My Prescriptions</h1>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center py-4">
                                <p className="text-black">Loading prescriptions...</p>
                            </div>
                        ) : prescriptions.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-black">You don't have any prescriptions yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {prescriptions.map(prescription => (
                                    <div key={prescription.id} className="border rounded-lg overflow-hidden shadow-sm">
                                        <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-black">
                                                    Appointment with Dr. {prescription.appointment?.doctor?.name || 'Unknown'}
                                                </h3>
                                                <span className="text-sm text-black">
                                                    {prescription.appointment?.date} at {prescription.appointment?.time}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-black mb-1">Medications:</h4>
                                                <div className="bg-gray-50 p-3 rounded text-sm text-black whitespace-pre-line">
                                                    {prescription.medications}
                                                </div>
                                            </div>

                                            {prescription.instructions && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-black mb-1">Instructions:</h4>
                                                    <div className="bg-gray-50 p-3 rounded text-sm text-black whitespace-pre-line">
                                                        {prescription.instructions}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 text-xs text-black">
                                                <p>Prescribed on: {formatDate(prescription.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}