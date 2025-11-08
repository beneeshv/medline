'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

function PatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/adminlogin');
            return;
        }
        fetchPatientDetails();
        fetchPatientAppointments();
    }, [id]);

    const fetchPatientDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/users/${id}/`);
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    const fetchPatientAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/${id}/appointments/`);
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

    if (!patient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
                    <button
                        onClick={() => router.push('/dashboard/patients')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Patients
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
                            Dashboard
                        </a>
                        <a href="/dashboard/doctors" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                            Doctors
                        </a>
                        <a href="/dashboard/patients" className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded-lg">
                            Patients
                        </a>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/patients')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to Patients
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                    <p className="text-gray-600">Patient Details & Medical History</p>
                </div>

                {/* Patient Profile */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-8">
                        <div className="flex items-start space-x-6">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                                {patient.image ? (
                                    <img 
                                        src={`http://localhost:8000${patient.image}`} 
                                        alt={patient.name}
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{patient.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <span className="font-medium w-20">Email:</span>
                                            <span>{patient.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="font-medium w-20">Phone:</span>
                                            <span>{patient.number || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="font-medium w-20">Age:</span>
                                            <span>{patient.age || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <span className="font-medium w-20">Location:</span>
                                            <span>{patient.location || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="font-medium w-20">Status:</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                                        </div>
                                    </div>
                                </div>
                                {patient.description && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                                        <p className="text-gray-600">{patient.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Appointments ({appointments.length})</h3>
                    </div>
                    <div className="p-6">
                        {appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Dr. {appointment.doctor.name}</h4>
                                                <p className="text-sm text-gray-600">{appointment.doctor.specialization?.name || 'General'}</p>
                                                <p className="text-sm text-gray-500 mt-1">Symptoms: {appointment.symptoms || 'Not specified'}</p>
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
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
                                <p className="text-gray-600">This patient hasn't booked any appointments yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PatientDetailPage;
