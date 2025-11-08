'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UserAccount() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please login first');
                setLoading(false);
                return;
            }

            try {
                // Fetch user data from the backend instead of localStorage
                const response = await axios.get(`http://localhost:8000/api/users/${userId}/`);
                const user = response.data;
                setUserData({
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        router.push('/login');
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-black">Apollo Hospital</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 text-black rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            <li><Link href="/" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">Home</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">Book Appointment</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">My Appointments</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Bills</Link></li>
                            <li><Link href="/user/account" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">My Account</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-black mb-6">My Account</h1>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center py-4">
                                <p className="text-black">Loading user details...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* User Profile Card */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                                    <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-black">User Profile</h2>
                                        <Link href={`/user/account/edit`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                            Edit Profile
                                        </Link>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="md:w-2/3">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-black">Name</h3>
                                                        <p className="text-lg font-medium text-black">{userData.name}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-black">Email</h3>
                                                        <p className="text-lg font-medium text-black">{userData.email}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-black">User ID</h3>
                                                        <p className="text-lg font-medium text-black">{userData.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Quick Links Section */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                                    <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                                        <h2 className="text-xl font-semibold text-black">Quick Links</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <Link href="/user/appointments" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium text-black">My Appointments</span>
                                                <span className="text-sm text-black">View your scheduled appointments</span>
                                            </Link>
                                            <Link href="/user/prescriptions" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="font-medium text-black">My Prescriptions</span>
                                                <span className="text-sm text-black">Access your medical prescriptions</span>
                                            </Link>
                                            <Link href="/user/bills" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium text-black">My Bills</span>
                                                <span className="text-sm text-black">View and manage your medical bills</span>
                                            </Link>
                                            <Link href="/user/appointment" className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium text-black">Book Appointment</span>
                                                <span className="text-sm text-black">Schedule a new appointment</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}