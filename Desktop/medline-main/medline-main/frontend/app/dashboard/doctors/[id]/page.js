'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

function DoctorDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/adminlogin');
            return;
        }
        fetchDoctorDetails();
        fetchDoctorAppointments();
    }, [id]);

    const fetchDoctorDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/doctors/${id}/`);
            setDoctor(response.data);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
        }
    };

    const fetchDoctorAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/doctor/${id}/appointments/`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested doctor could not be found.</p>
                    <button
                        onClick={() => router.push('/dashboard/doctors')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h2>
                    <nav className="space-y-2">
                        <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                            </svg>
                            Dashboard
                        </a>
                        <a href="/dashboard/doctors" className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded-lg">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Doctors
                        </a>
                        <a href="/dashboard/patients" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Patients
                        </a>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => router.push('/dashboard/doctors')}
                                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Back to Doctors
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
                            <p className="text-gray-600">{doctor.specialization?.name || 'General Practitioner'}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => router.push(`/dashboard/doctors/${id}/patients`)}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                                View Patients
                            </button>
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                Send Message
                            </button>
                            <button 
                                onClick={() => router.push(`/dashboard/doctors/${id}/edit`)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-8">
                        <div className="flex items-start space-x-6">
                            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                                {doctor.image ? (
                                    <img 
                                        src={`http://localhost:8000${doctor.image}`} 
                                        alt={doctor.name}
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dr. {doctor.name}</h2>
                                <p className="text-lg text-blue-600 mb-4">{doctor.specialization?.name || 'General Practitioner'}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                            </svg>
                                            <span>{doctor.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                            <span>{doctor.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            <span>{doctor.location || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                            </svg>
                                            <span>Experience: {doctor.experience || 'Not specified'} years</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {doctor.description && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                                        <p className="text-gray-600">{doctor.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('appointments')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'appointments'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Appointments ({appointments.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('patients')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'patients'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Patients
                            </button>
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'schedule'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Schedule
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'appointments' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
                                {appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments.map((appointment) => (
                                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{appointment.user.name}</h4>
                                                            <p className="text-sm text-gray-600">{appointment.user.email}</p>
                                                            <p className="text-sm text-gray-500">Symptoms: {appointment.symptoms || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                                                        <p className="text-sm text-gray-600">{appointment.time}</p>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                            appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
                                        <p className="text-gray-600">This doctor hasn't received any appointments yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'patients' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients</h3>
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Patient list coming soon</h3>
                                    <p className="text-gray-600">Patient management features will be available here.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schedule' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Management</h3>
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule management coming soon</h3>
                                    <p className="text-gray-600">Doctor schedule and availability management will be available here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DoctorDetailPage;
