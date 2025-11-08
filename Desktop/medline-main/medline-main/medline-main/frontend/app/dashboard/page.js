'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
// Removed useRouter import from 'next/navigation'

// Removed direct import of Heroicons components
// Instead, we'll assume Heroicons are loaded via a CDN in the HTML wrapper
// For demonstration, we'll use inline SVGs or simple placeholders where icons were used.
// If this were a full Next.js app, you would ensure @heroicons/react is installed.

// Helper function to render a placeholder icon if the actual icon isn't available
const IconPlaceholder = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);


function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = window.location.origin + '/adminlogin';
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/dashboard/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                window.location.href = window.location.origin + '/adminlogin';
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = window.location.origin + '/adminlogin';
    };

    if (!dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                    <p className="text-xl text-gray-700 font-medium">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Mock data for the cards to align with the image's layout
    const cardsData = [
        {
            title: 'New Orders',
            value: dashboardData.total_users || 0,
            // Using a simple SVG for placeholder icon
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16l4 4m0 0l-4-4m4 4L17 16"></path>
                </svg>
            ),
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600'
        },
        {
            title: 'Bounce Rate',
            value: '53%',
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8L11 17m-5 2a2 2 0 11-4 0 2 2 0 014 0zM16 21a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            ),
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600'
        },
        {
            title: 'User Registrations',
            value: dashboardData.total_doctors || 0,
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-2v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2H3m18 0h-3M10 12a2 2 0 100-4 2 2 0 000 4zm-4 8h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            ),
            color: 'bg-yellow-500',
            hoverColor: 'hover:bg-yellow-600'
        },
        {
            title: 'Unique Visitor',
            value: '65',
            icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354c.33-.33.66-.554 1-.685C13.682 3.102 14.487 3 15.293 3c1.531 0 3.07.394 4.393 1.185C20.916 5.09 22 6.513 22 8.25c0 1.51-.762 2.94-2.093 3.935-1.33.996-3.05 1.57-4.77 1.57h-1.5c-.33 0-.66-.11-.91-.32l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0l.707.707M7 17l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414l.707-.707"></path>
                </svg>
            ),
            color: 'bg-red-500',
            hoverColor: 'hover:bg-red-600'
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 font-inter">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white shadow-lg flex flex-col p-4 rounded-r-lg">
                <div className="flex items-center space-x-3 mb-8 px-2">
                    <IconPlaceholder className="h-8 w-8 text-blue-600" /> {/* Placeholder for HomeIcon */}
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1">
                    <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2">Main Navigation</h3>
                    <ul>
                        <li className="mb-2">
                            <a href="/doctoradd" className="flex items-center p-2 text-gray-700 rounded-md bg-blue-100 text-blue-700 font-semibold">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for HomeIcon */}
                                add doctor <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">14</span>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for DocumentTextIcon */}
                                Forms
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for CubeTransparentIcon */}
                                UI Elements
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for TableCellsIcon */}
                                Tables
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for PresentationChartBarIcon */}
                                Presentations
                            </a>
                        </li>
                    </ul>

                    {/* User Area */}
                    <h3 className="text-xs uppercase text-gray-500 font-semibold mt-6 mb-3 px-2">User Area</h3>
                    <ul>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for UserCircleIcon */}
                                Profile <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">3</span>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.499.09.679-.217.679-.481 0-.237-.008-.862-.013-1.705-2.782.602-3.369-1.34-3.369-1.34-.454-1.158-1.11-1.464-1.11-1.464-.908-.618.069-.606.069-.606 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.089 2.91.833.091-.647.351-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.93 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.025A9.28 9.28 0 0112 6.865c.85.004 1.7.114 2.504.337 1.909-1.293 2.747-1.025 2.747-1.025.546 1.379.202 2.398.099 2.65.64.698 1.028 1.591 1.028 2.682 0 3.829-2.339 4.673-4.566 4.92-.359.31-.678.744-.678 1.193 0 .862.008 1.574.008 1.791 0 .265.172.578.688.48C19.14 20.198 22 16.442 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                Github
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.195 5.688c-.688.306-1.428.512-2.207.606.79-.472 1.397-1.22 1.688-2.118-.739.438-1.56.758-2.434.932-.697-.743-1.693-1.207-2.795-1.207-2.116 0-3.834 1.718-3.834 3.834 0 .3.033.59.096.868-3.188-.16-6.002-1.684-7.89-4.002-.33.567-.518 1.226-.518 1.938 0 1.328.675 2.503 1.693 3.193-.627-.02-1.217-.193-1.73-.478v.048c0 1.86 1.32 3.408 3.064 3.754-.32.087-.658.134-1.008.134-.246 0-.485-.024-.718-.068.487 1.522 1.897 2.632 3.57 2.663-1.314 1.03-2.97 1.648-4.77 1.648-.31 0-.616-.018-.916-.053 1.705 1.092 3.726 1.732 5.906 1.732 7.08 0 10.94-5.86 10.94-10.94 0-.167-.004-.334-.01-.502.75-.54 1.397-1.213 1.91-1.98z" /></svg>
                                Twitter
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.505 1.492-3.893 3.776-3.893 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                                Facebook
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for Cog6ToothIcon */}
                                Settings
                            </a>
                        </li>
                        <li className="mb-2 mt-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center p-2 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-150 w-full text-left"
                            >
                                <IconPlaceholder className="h-5 w-5 mr-3" /> {/* Placeholder for ArrowRightOnRectangleIcon */}
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                {/* Top Bar of Main Content */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-200">
                            <IconPlaceholder className="h-5 w-5 mr-2" /> Share {/* Placeholder for ShareIcon */}
                        </button>
                        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors duration-200">
                            <IconPlaceholder className="h-5 w-5 mr-2" /> Export {/* Placeholder for ArrowDownTrayIcon */}
                        </button>
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option>This week</option>
                                <option>This month</option>
                                <option>This year</option>
                            </select>
                            <IconPlaceholder className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" /> {/* Placeholder for ChevronDownIcon */}
                        </div>
                    </div>
                </div>

                {/* Dashboard Message / Alert */}
                {dashboardData.dashboard && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-8 rounded-md flex items-center shadow-sm">
                        <IconPlaceholder className="h-6 w-6 text-blue-500 mr-3" /> {/* Placeholder for InformationCircleIcon */}
                        <p className="text-lg">
                            <span className="font-semibold">Dashboard Message:</span> {dashboardData.dashboard}
                        </p>
                    </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cardsData.map((card, index) => (
                        <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform transform hover:scale-105 duration-200`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{card.title}</h3>
                                <card.icon className="h-8 w-8 opacity-75" />
                            </div>
                            <p className="text-5xl font-extrabold mb-2">{card.value}</p>
                            <a href="#" className="text-sm flex items-center opacity-80 hover:opacity-100 transition-opacity duration-200">
                                More info <IconPlaceholder className="h-4 w-4 ml-1" /> {/* Placeholder for ArrowRightOnRectangleIcon */}
                            </a>
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

                {/* Doctors List Section (retained from previous design, adjusted for new aesthetics) */}
                {dashboardData.doctors && Array.isArray(dashboardData.doctors) && dashboardData.doctors.length > 0 && (
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Registered Doctors</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Specialty
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboardData.doctors.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {doctor.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {doctor.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {doctor.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {doctor.specialty || 'General Practitioner'} {/* Placeholder */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active {/* Placeholder */}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {dashboardData.doctors && Array.isArray(dashboardData.doctors) && dashboardData.doctors.length === 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center text-gray-600 italic">
                        <IconPlaceholder className="h-6 w-6 mr-2 text-gray-400" /> No doctors found in the system. {/* Placeholder for InformationCircleIcon */}
                    </div>
                )}
            </main>
        </div>
    );
}

export default DashboardPage;
