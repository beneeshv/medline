"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserAppointments() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
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
        switch (status) {
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
                            <li><Link href="/" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">Home</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">Book Appointment</Link></li>
                            <li><Link href="/user/appointments" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">My Appointments</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Bills</Link></li>
                            <li><Link href="/user/account" className="inline-block p-4 text-black hover:text-black hover:border-b-2 hover:border-black">My Account</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-black mb-6">My Appointments</h1>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-4">
                                <p className="text-black">Loading appointments...</p>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-black mb-4">You don't have any appointments yet.</p>
                                <Link href="/user/appointment" className="inline-block py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                    Book an Appointment
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-black">Doctor</th>
                                            <th className="py-2 px-4 border-b text-black">Specialization</th>
                                            <th className="py-2 px-4 border-b text-black">Date</th>
                                            <th className="py-2 px-4 border-b text-black">Time</th>
                                            <th className="py-2 px-4 border-b text-black">Status</th>
                                            <th className="py-2 px-4 border-b text-black">Symptoms</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map(appointment => (
                                            <tr key={appointment.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border-b text-black">Dr. {appointment.doctor?.name || 'Unknown'}</td>
                                                <td className="py-2 px-4 border-b text-black">{appointment.doctor?.specialization?.name || 'General'}</td>
                                                <td className="py-2 px-4 border-b text-black">{appointment.date}</td>
                                                <td className="py-2 px-4 border-b text-black">{appointment.time}</td>
                                                <td className="py-2 px-4 border-b">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4 border-b text-black">{appointment.symptoms}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}