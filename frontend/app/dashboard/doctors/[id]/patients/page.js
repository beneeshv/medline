'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

function DoctorPatientsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/adminlogin');
            return;
        }
        fetchDoctorData();
    }, [id]);

    const fetchDoctorData = async () => {
        try {
            const [doctorRes, appointmentsRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/doctors/${id}/`),
                axios.get(`http://localhost:8000/api/doctor/${id}/appointments/`)
            ]);
            
            setDoctor(doctorRes.data);
            setAppointments(appointmentsRes.data);
            
            // Extract unique patients from appointments
            const uniquePatients = appointmentsRes.data.reduce((acc, appointment) => {
                if (!acc.find(p => p.id === appointment.user.id)) {
                    acc.push(appointment.user);
                }
                return acc;
            }, []);
            setPatients(uniquePatients);

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
            console.error('Error fetching doctor data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPatientAppointments = (patientId) => {
        return appointments.filter(apt => apt.user.id === patientId);
    };

    const getAppointmentPrescription = (appointmentId) => {
        return prescriptions.find(p => p.appointmentId === appointmentId);
    };

    const getAppointmentBill = (appointmentId) => {
        return bills.find(b => b.appointmentId === appointmentId);
    };

    const getPatientStats = (patientId) => {
        const patientAppointments = getPatientAppointments(patientId);
        const totalAppointments = patientAppointments.length;
        const completedAppointments = patientAppointments.filter(apt => apt.status === 'Completed').length;
        const totalBills = patientAppointments.map(apt => getAppointmentBill(apt.id)).filter(Boolean);
        const totalAmount = totalBills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
        const paidAmount = totalBills.filter(bill => bill.payment_status === 'Paid').reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
        
        return {
            totalAppointments,
            completedAppointments,
            totalAmount,
            paidAmount,
            pendingAmount: totalAmount - paidAmount
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
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
                                onClick={() => router.push(`/dashboard/doctors/${id}`)}
                                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Back to Doctor Details
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor?.name} - Patient Management</h1>
                            <p className="text-gray-600">{doctor?.specialization?.name || 'General Practitioner'}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Prescriptions</p>
                                <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
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
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">₹{bills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patients List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Patient Details</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {patients.map((patient) => {
                                const patientStats = getPatientStats(patient.id);
                                const patientAppointments = getPatientAppointments(patient.id);
                                
                                return (
                                    <div key={patient.id} className="border border-gray-200 rounded-lg p-6">
                                        {/* Patient Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    {patient.image ? (
                                                        <img 
                                                            src={`http://localhost:8000${patient.image}`} 
                                                            alt={patient.name}
                                                            className="w-16 h-16 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-semibold text-gray-900">{patient.name}</h4>
                                                    <p className="text-gray-600">{patient.email}</p>
                                                    <p className="text-sm text-gray-500">Age: {patient.age || 'N/A'} | Location: {patient.location || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="text-center">
                                                        <p className="font-semibold text-blue-600">{patientStats.totalAppointments}</p>
                                                        <p className="text-gray-500">Appointments</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-semibold text-green-600">₹{patientStats.paidAmount}</p>
                                                        <p className="text-gray-500">Paid</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Patient Appointments */}
                                        <div className="space-y-4">
                                            <h5 className="font-medium text-gray-900">Appointment History</h5>
                                            {patientAppointments.map((appointment) => {
                                                const prescription = getAppointmentPrescription(appointment.id);
                                                const bill = getAppointmentBill(appointment.id);
                                                
                                                return (
                                                    <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                                            {/* Appointment Info */}
                                                            <div>
                                                                <h6 className="font-medium text-gray-900 mb-2">Appointment</h6>
                                                                <p className="text-sm text-gray-600">Date: {appointment.date}</p>
                                                                <p className="text-sm text-gray-600">Time: {appointment.time}</p>
                                                                <p className="text-sm text-gray-600">Symptoms: {appointment.symptoms || 'Not specified'}</p>
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                                                                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                                    appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {appointment.status}
                                                                </span>
                                                            </div>

                                                            {/* Prescription */}
                                                            <div>
                                                                <h6 className="font-medium text-gray-900 mb-2">Prescription</h6>
                                                                {prescription ? (
                                                                    <div>
                                                                        <p className="text-sm text-gray-600 mb-1">Medications:</p>
                                                                        <p className="text-sm text-gray-800 bg-white p-2 rounded border">{prescription.medications}</p>
                                                                        {prescription.instructions && (
                                                                            <p className="text-xs text-gray-500 mt-1">Instructions: {prescription.instructions}</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500 italic">No prescription available</p>
                                                                )}
                                                            </div>

                                                            {/* Bill */}
                                                            <div>
                                                                <h6 className="font-medium text-gray-900 mb-2">Bill</h6>
                                                                {bill ? (
                                                                    <div>
                                                                        <p className="text-sm text-gray-600">Consultation: ₹{bill.consultation_fee || 0}</p>
                                                                        <p className="text-sm text-gray-600">Total: ₹{bill.total_amount || 0}</p>
                                                                        {bill.notes && (
                                                                            <p className="text-xs text-gray-500">Notes: {bill.notes}</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500 italic">No bill generated</p>
                                                                )}
                                                            </div>

                                                            {/* Payment Status */}
                                                            <div>
                                                                <h6 className="font-medium text-gray-900 mb-2">Payment</h6>
                                                                {bill ? (
                                                                    <div>
                                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                            bill.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                                            bill.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-red-100 text-red-800'
                                                                        }`}>
                                                                            {bill.payment_status || 'Pending'}
                                                                        </span>
                                                                        <p className="text-sm text-gray-600 mt-1">Amount: ₹{bill.total_amount || 0}</p>
                                                                    </div>
                                                                ) : (
                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                        No Payment
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Patient Summary */}
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                <div className="text-center">
                                                    <p className="font-semibold text-gray-900">{patientStats.totalAppointments}</p>
                                                    <p className="text-gray-500">Total Appointments</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-blue-600">₹{patientStats.totalAmount}</p>
                                                    <p className="text-gray-500">Total Amount</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-green-600">₹{patientStats.paidAmount}</p>
                                                    <p className="text-gray-500">Paid Amount</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-red-600">₹{patientStats.pendingAmount}</p>
                                                    <p className="text-gray-500">Pending Amount</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {patients.length === 0 && (
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
                                <p className="text-gray-600">This doctor hasn't seen any patients yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DoctorPatientsPage;
