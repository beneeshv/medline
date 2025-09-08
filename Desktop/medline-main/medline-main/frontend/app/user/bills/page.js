'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserBills() {
    const router = useRouter();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('Please login first');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/bills/user/${userId}/`);
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
        switch (status) {
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
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">My Bills</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-black mb-6">My Bills</h1>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center py-4">
                                <p className="text-black">Loading bills...</p>
                            </div>
                        ) : bills.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-black">You don't have any bills yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bills.map(bill => (
                                    <div key={bill.id} className="border rounded-lg overflow-hidden shadow-sm">
                                        <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-black">
                                                    Bill for Dr. {bill.appointment?.doctor?.name || 'Unknown'}
                                                </h3>
                                                <span className="text-sm text-black">
                                                    {bill.appointment?.date} at {bill.appointment?.time}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between mb-4 text-black">
                                                <span className="font-medium">Payment Status:</span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(bill.payment_status)}`}>
                                                    {bill.payment_status}
                                                </span>
                                            </div>

                                            <div className="border-t pt-4">
                                                <h4 className="text-sm font-semibold text-black mb-2">Bill Details:</h4>
                                                <div className="space-y-2 text-sm text-black">
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
                                                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                                        <span>Total Amount:</span>
                                                        <span>${bill.total_amount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {bill.notes && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-semibold text-black mb-1">Notes:</h4>
                                                    <div className="bg-gray-50 p-3 rounded text-sm text-black">
                                                        {bill.notes}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 text-xs text-black">
                                                <p>Generated on: {formatDate(bill.created_at)}</p>
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