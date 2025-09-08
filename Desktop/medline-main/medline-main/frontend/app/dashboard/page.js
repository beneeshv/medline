'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Helper function to render a placeholder icon if the actual icon isn't available
const IconPlaceholder = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);


function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = window.location.origin + '/adminlogin';
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [dashboardRes, doctorsRes, patientsRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/dashboard/', {
                        headers: { Authorization: `Token ${token}` }
                    }),
                    axios.get('http://localhost:8000/api/doctors/'),
                    axios.get('http://localhost:8000/api/users/')
                ]);
                setDashboardData(dashboardRes.data);
                setDoctors(doctorsRes.data);
                setPatients(patientsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/adminlogin');
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        router.push('/adminlogin');
    };

    if (!dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
                    <p className="text-xl text-gray-700 font-medium">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    const cardsData = [
        {
            title: 'Total Patients',
            value: patients.length || 0,
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            ),
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            link: '/dashboard/patients'
        },
        {
            title: 'Total Doctors',
            value: doctors.length || 0,
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            ),
            color: 'bg-emerald-500',
            hoverColor: 'hover:bg-emerald-600',
            link: '/dashboard/doctors'
        },
        {
            title: 'Appointments',
            value: dashboardData?.total_appointments || 0,
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                </svg>
            ),
            color: 'bg-green-400',
            hoverColor: 'hover:bg-green-500',
            link: '/dashboard/appointments'
        },
        {
            title: 'Active Users',
            value: patients.length || 0,
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            ),
            color: 'bg-teal-500',
            hoverColor: 'hover:bg-teal-600',
            link: '/dashboard/patients'
        }
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white font-inter">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white shadow-lg flex flex-col p-4 rounded-r-lg border-r border-green-100">
                <div className="flex items-center space-x-3 mb-8 px-2">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-green-800">Apollo Admin</h2>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1">
                    <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2">Main Navigation</h3>
                    <ul>
                        <li className="mb-2">
                            <a href="/dashboard" className="flex items-center p-2 text-green-700 bg-green-100 rounded-md font-semibold">
                                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                </svg>
                                Dashboard
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/dashboard/doctors" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-green-50 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Doctors <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{doctors.length}</span>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/dashboard/patients" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-green-50 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                Patients <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">{patients.length}</span>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/dashboard/appointments" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-green-50 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                </svg>
                                Appointments
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/doctoradd" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-green-50 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Doctor
                            </a>
                        </li>
                    </ul>
                    <li className="mb-2 mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center p-2 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-150 w-full text-left"
                        >
                            <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for ArrowRightOnRectangleIcon */}
                            Logout
                        </button>
                    </li>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                {/* Top Bar of Main Content */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
                    <div className="relative">
                        <select className="appearance-none bg-white border border-green-200 text-gray-700 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <option>This week</option>
                            <option>This month</option>
                            <option>This year</option>
                        </select>
                        <IconPlaceholder className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" /> {/* Placeholder for ChevronDownIcon */}
                    </div>
                </div>

                {/* Dashboard Message / Alert */}
                {dashboardData.dashboard && (
                    <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 mb-8 rounded-md flex items-center shadow-sm">
                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-lg">
                            <span className="font-semibold">Dashboard Message:</span> {dashboardData.dashboard}
                        </p>
                    </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cardsData.map((card, index) => (
                        <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform transform hover:scale-105 duration-200 cursor-pointer`}
                            onClick={() => router.push(card.link)}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{card.title}</h3>
                                <card.icon className="h-8 w-8 opacity-75" />
                            </div>
                            <p className="text-5xl font-extrabold mb-2">{card.value}</p>
                            <div className="text-sm flex items-center opacity-80 hover:opacity-100 transition-opacity duration-200">
                                View Details
                                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Doughnut Chart Placeholder */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Doughnut Chart</h3>
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md border border-gray-200">
                            <IconPlaceholder className="h-24 w-24 text-gray-300" /> {/* Placeholder for ChartPieIcon */}
                            <p className="text-gray-400 ml-4">Chart Placeholder</p>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <p className="mb-1"><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Chrome</p>
                            <p className="mb-1"><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>IE</p>
                            <p className="mb-1"><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>FireFox</p>
                            <p className="mb-1"><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Safari</p>
                            <p><span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>Opera</p>
                            <p><span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>Navigator</p>
                        </div>
                    </div>

                    {/* Bar Chart Placeholder */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Bar Chart</h3>
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md border border-gray-200">
                            <IconPlaceholder className="h-24 w-24 text-gray-300" /> {/* Placeholder for ChartBarIcon */}
                            <p className="text-gray-400 ml-4">Chart Placeholder</p>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 flex justify-between">
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(month => (
                                <span key={month} className="text-xs">{month.substring(0, 3)}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Doctors */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Doctors</h3>
                            <button
                                onClick={() => router.push('/dashboard/doctors')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {doctors.slice(0, 5).map((doctor) => (
                                <div key={doctor.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/dashboard/doctors/${doctor.id}`)}>
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        {doctor.image ? (
                                            <img src={`http://localhost:8000${doctor.image}`} alt={doctor.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                                        <p className="text-xs text-gray-500">{doctor.specialization?.name || 'General Practitioner'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {doctors.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No doctors registered yet</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Patients */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
                            <button
                                onClick={() => router.push('/dashboard/patients')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {patients.slice(0, 5).map((patient) => (
                                <div key={patient.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        {patient.image ? (
                                            <img src={`http://localhost:8000${patient.image}`} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                                        <p className="text-xs text-gray-500">{patient.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {patients.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No patients registered yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;