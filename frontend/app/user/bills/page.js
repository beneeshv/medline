'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PaymentButton from '../../components/PaymentButton';

export default function UserBills() {
    const router = useRouter();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [paymentError, setPaymentError] = useState('');

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

    const handlePaymentSuccess = (billId, paymentResponse) => {
        // Update the bill status to paid
        setBills(prevBills => prevBills.map(bill =>
            bill.id === billId ? { ...bill, payment_status: 'Paid' } : bill
        ));
        
        // Show success message
        setSuccessMessage('Payment completed successfully! Your bill has been paid.');
        setPaymentError('');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
        
        console.log('Payment successful:', paymentResponse);
    };

    const handlePaymentError = (errorMessage) => {
        setPaymentError(`Payment failed: ${errorMessage}`);
        setSuccessMessage('');
        
        // Clear error message after 5 seconds
        setTimeout(() => {
            setPaymentError('');
        }, 5000);
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
                            <li><Link href="/" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">Home</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">Book Appointment</Link></li>
                            <li><Link href="/user/appointments" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">My Appointments</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">My Bills</Link></li>
                            <li><Link href="/user/account" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Account</Link></li>
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
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p>{successMessage}</p>
                                </div>
                            </div>
                        )}
                        {paymentError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p>{paymentError}</p>
                                </div>
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
                                                        <span>₹{Number(bill.consultation_fee || 0).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                                        <span>Total Amount:</span>
                                                        <span>₹{Number(bill.total_amount || 0).toFixed(2)}</span>
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

                                            <div className="mt-4">
                                                {bill.payment_status !== 'Paid' ? (
                                                    <PaymentButton
                                                        bill={bill}
                                                        onPaymentSuccess={handlePaymentSuccess}
                                                        onPaymentError={handlePaymentError}
                                                    />
                                                ) : (
                                                    <div className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-semibold text-center">
                                                        ✓ Payment Completed
                                                    </div>
                                                )}
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