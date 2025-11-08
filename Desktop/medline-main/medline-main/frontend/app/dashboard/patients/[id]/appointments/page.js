'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

function PatientAppointmentsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/adminlogin');
            return;
        }
        fetchPatientAppointments();
    }, [id]);

    const fetchPatientAppointments = async () => {
        try {
            const [patientRes, appointmentsRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/users/${id}/`),
                axios.get(`http://localhost:8000/api/user/${id}/appointments/`)
            ]);
            
            setPatient(patientRes.data);
            setAppointments(appointmentsRes.data);

            // Fetch prescriptions and bills for each appointment
            const prescriptionPromises = appointmentsRes.data.map(appointment =>
                axios.get(`http://localhost:8000/api/prescriptions/appointment/${appointment.id}/`)
                    .then(res => ({ appointmentId: appointment.id, ...res.data }))
                    .catch(() => null)
            );
            
            const billPromises = appointmentsRes.data.map(appointment =>
                axios.get(`http://localhost:8000/api/bills/appointment/${appointment.id}/`)
                    .then(res => ({ appointmentId: appointment.id, ...res.data }))
                    .catch(() => null)
            );

            const [prescriptionResults, billResults] = await Promise.all([
                Promise.all(prescriptionPromises),
                Promise.all(billPromises)
            ]);

            setPrescriptions(prescriptionResults.filter(p => p !== null));
            setBills(billResults.filter(b => b !== null));
        } catch (error) {
            console.error('Error fetching patient appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAppointmentPrescription = (appointmentId) => {
        return prescriptions.find(p => p.appointmentId === appointmentId);
    };

    const getAppointmentBill = (appointmentId) => {
        return bills.find(b => b.appointmentId === appointmentId);
    };

    const getAppointmentStats = () => {
        const total = appointments.length;
        const completed = appointments.filter(apt => apt.status === 'Completed').length;
        const pending = appointments.filter(apt => apt.status === 'Pending').length;
        const confirmed = appointments.filter(apt => apt.status === 'Confirmed').length;
        const totalBilled = bills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
        const totalPaid = bills.filter(bill => bill.payment_status === 'Paid').reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
        
        return { total, completed, pending, confirmed, totalBilled, totalPaid };
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

    const stats = getAppointmentStats();

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
                        <a href="/dashboard/doctors" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Doctors
                        </a>
                        <a href="/dashboard/patients" className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded-lg">
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
                                onClick={() => router.push('/dashboard/patients')}
                                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Back to Patients
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">{patient.name} - Appointments</h1>
                            <p className="text-gray-600">{patient.email} | Age: {patient.age || 'N/A'} | Location: {patient.location || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Summary Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                {patient.image ? (
                                    <img 
                                        src={`http://localhost:8000${patient.image}`} 
                                        alt={patient.name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                                <p className="text-gray-600">{patient.email}</p>
                                <p className="text-sm text-gray-500">Phone: {patient.number || 'Not provided'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                                    <p className="text-sm text-gray-500">Total Appointments</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">₹{stats.totalPaid}</p>
                                    <p className="text-sm text-gray-500">Total Paid</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                                <p className="text-2xl font-bold text-gray-900">₹{stats.totalBilled - stats.totalPaid}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
                    </div>
                    <div className="p-6">
                        {appointments.length > 0 ? (
                            <div className="space-y-6">
                                {appointments.map((appointment) => {
                                    const prescription = getAppointmentPrescription(appointment.id);
                                    const bill = getAppointmentBill(appointment.id);
                                    
                                    return (
                                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                                {/* Appointment Details */}
                                                <div className="lg:col-span-1">
                                                    <h4 className="font-semibold text-gray-900 mb-3">Appointment Details</h4>
                                                    <div className="space-y-2">
                                                        <p className="text-sm"><span className="font-medium">Date:</span> {appointment.date}</p>
                                                        <p className="text-sm"><span className="font-medium">Time:</span> {appointment.time}</p>
                                                        <p className="text-sm"><span className="font-medium">Doctor:</span> Dr. {appointment.doctor.name}</p>
                                                        <p className="text-sm"><span className="font-medium">Specialty:</span> {appointment.doctor.specialization?.name || 'General'}</p>
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

                                                {/* Symptoms */}
                                                <div className="lg:col-span-1">
                                                    <h4 className="font-semibold text-gray-900 mb-3">Symptoms</h4>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="text-sm text-gray-700">{appointment.symptoms || 'No symptoms specified'}</p>
                                                    </div>
                                                </div>

                                                {/* Prescription */}
                                                <div className="lg:col-span-1">
                                                    <h4 className="font-semibold text-gray-900 mb-3">Prescription</h4>
                                                    {prescription ? (
                                                        <div className="bg-blue-50 p-3 rounded-lg">
                                                            <p className="text-sm font-medium text-blue-900 mb-1">Medications:</p>
                                                            <p className="text-sm text-blue-800 mb-2">{prescription.medications}</p>
                                                            {prescription.instructions && (
                                                                <>
                                                                    <p className="text-sm font-medium text-blue-900 mb-1">Instructions:</p>
                                                                    <p className="text-xs text-blue-700">{prescription.instructions}</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <p className="text-sm text-gray-500 italic">No prescription issued</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bill Details */}
                                                <div className="lg:col-span-1">
                                                    <h4 className="font-semibold text-gray-900 mb-3">Bill Details</h4>
                                                    {bill ? (
                                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                                            <p className="text-sm text-yellow-900">
                                                                <span className="font-medium">Consultation:</span> ₹{bill.consultation_fee || 0}
                                                            </p>
                                                            <p className="text-sm text-yellow-900 font-semibold">
                                                                <span className="font-medium">Total:</span> ₹{bill.total_amount || 0}
                                                            </p>
                                                            {bill.notes && (
                                                                <p className="text-xs text-yellow-700 mt-1">{bill.notes}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 p-3 rounded-lg">
                                                            <p className="text-sm text-gray-500 italic">No bill generated</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Payment Status */}
                                                <div className="lg:col-span-1">
                                                    <h4 className="font-semibold text-gray-900 mb-3">Payment Status</h4>
                                                    {bill ? (
                                                        <div className="text-center">
                                                            <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                                                                bill.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                                bill.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {bill.payment_status || 'Pending'}
                                                            </span>
                                                            <p className="text-sm text-gray-600 mt-2">₹{bill.total_amount || 0}</p>
                                                            {bill.payment_status !== 'Paid' && (
                                                                <p className="text-xs text-red-600 mt-1">Outstanding</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <span className="inline-flex px-3 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                No Payment
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                                <p className="text-gray-600">This patient hasn't booked any appointments yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PatientAppointmentsPage;
