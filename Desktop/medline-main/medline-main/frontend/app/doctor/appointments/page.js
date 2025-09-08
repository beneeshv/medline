"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorAppointments() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const storedDoctor = localStorage.getItem('doctor');
        if (!storedDoctor) {
            router.push('/doctor/login');
            return;
        }

        const doctorData = JSON.parse(storedDoctor);
        setDoctor(doctorData);
        const doctorId = doctorData.id;

        const fetchAppointments = async () => {
            try {
                if (!doctorId) {
                    setError('Doctor ID not found. Please log in again.');
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`http://localhost:8000/appointments/doctor/${doctorId}/`);
                setAppointments(response.data || []);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to load appointments. Please try again later.');
                // Fallback to sample data for demonstration
                setAppointments([
                    { id: 1, user: { name: 'John Doe' }, date: '2025-09-15', time: '10:00 AM', status: 'Pending', symptoms: 'Fever, headache' },
                    { id: 2, user: { name: 'Jane Smith' }, date: '2025-09-16', time: '11:30 AM', status: 'Confirmed', symptoms: 'Cough, sore throat' },
                    { id: 3, user: { name: 'Robert Johnson' }, date: '2025-09-17', time: '2:00 PM', status: 'Completed', symptoms: 'Back pain' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [router]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
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
                    <span className="text-xl font-bold text-gray-800">Apollo Hospital</span>
                </div>
                <div className="flex items-center space-x-4">
                    {doctor && (
                        <div className="text-right">
                            <span className="block text-sm font-medium text-gray-700">Dr. {doctor.name}</span>
                            <span className="block text-xs text-gray-500">{doctor.specialization}</span>
                        </div>
                    )}
                    <button onClick={() => { localStorage.removeItem('doctor'); router.push('/doctor/login'); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            <li><Link href="/doctor/dashboard" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Dashboard</Link></li>
                            <li><Link href="/doctor/appointments" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">Appointments</Link></li>
                            <li><Link href="/doctor/appointmentstatus" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Update Status</Link></li>
                            <li><Link href="/doctor/prescriptions" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Prescriptions & Bills</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Current Appointments</h2>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center py-4 text-gray-600">Loading appointments...</div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-600">You don't have any appointments yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border-b">ID</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Patient</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Date</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Time</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Symptoms</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {appointments.map(appointment => (
                                            <tr key={appointment.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 whitespace-nowrap">{appointment.id}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{appointment.user?.name || 'Unknown'}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{appointment.date}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{appointment.time}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{appointment.symptoms}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
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