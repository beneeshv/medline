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
                const response = await axios.get(`http://localhost:8000/api/doctor/${doctorId}/appointments/`);
                setAppointments(response.data || []);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to load appointments. Please try again later.');
                setAppointments([]);
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
                    {/* Changed text-gray-800 to text-black */}
                    <span className="text-xl font-bold text-black">Apollo Hospital</span>
                </div>
                <div className="flex items-center space-x-4">
                    {doctor && (
                        <div className="text-right">
                            {/* Changed text-gray-700 to text-gray-900 */}
                            <span className="block text-sm font-medium text-gray-900">Dr. {doctor.name}</span>
                            {/* Changed text-gray-500 to text-gray-900 for specialization (or kept gray for secondary info) */}
                            <span className="block text-xs text-gray-500">{doctor.specialization}</span>
                        </div>
                    )}
                    {/* Changed text-gray-700 to text-gray-900 and hover:bg-gray-300 to hover:bg-gray-400 for better contrast */}
                    <button onClick={() => { localStorage.removeItem('doctor'); router.push('/doctor/login'); }} className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            {/* Changed text-gray-600 and hover:text-gray-800 to text-gray-900/text-black for tabs */}
                            <li><Link href="/doctor/home" className="inline-block p-4 text-gray-900 hover:text-black hover:border-b-2 hover:border-black">Dashboard</Link></li>
                            {/* Current tab remains distinct color */}
                            <li><Link href="/doctor/appointments" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">Appointments</Link></li>
                            <li><Link href="/doctor/appointmentstatus" className="inline-block p-4 text-gray-900 hover:text-black hover:border-b-2 hover:border-black">Update Status</Link></li>
                            <li><Link href="/doctor/prescriptions" className="inline-block p-4 text-gray-900 hover:text-black hover:border-b-2 hover:border-black">Prescriptions & Bills</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        {/* Changed text-gray-800 to text-black for the section heading */}
                        <h2 className="text-xl font-bold text-black mb-4">Current Appointments</h2>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center py-4 text-gray-900">Loading appointments...</div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-900">You don't have any appointments yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            {/* Changed text-gray-500 to text-gray-900 for table headers */}
                                            <th className="py-3 px-4 text-left font-medium text-gray-900 uppercase tracking-wider border-b">ID</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-900 uppercase tracking-wider border-b">Patient</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-900 uppercase tracking-wider border-b">Date</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-900 uppercase tracking-wider border-b">Time</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-900 uppercase tracking-wider border-b">Symptoms</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-900 uppercase tracking-wider border-b">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {appointments.map(appointment => (
                                            <tr key={appointment.id} className="hover:bg-gray-50">
                                                {/* Text in table cells defaults to black, but explicitly setting for clarity/consistency */}
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-900">{appointment.id}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-900">{appointment.user?.name || 'Unknown'}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-900">{appointment.date}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-900">{appointment.time}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-gray-900">{appointment.symptoms}</td>
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