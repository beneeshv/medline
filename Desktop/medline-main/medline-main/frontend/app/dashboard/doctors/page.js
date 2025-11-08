'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function AdminDoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/adminlogin');
            return;
        }
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/doctors/');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === '' || 
                               (doctor.specialization && doctor.specialization.name === selectedSpecialty);
        return matchesSearch && matchesSpecialty;
    });

    const specialties = [...new Set(doctors.map(doctor => doctor.specialization?.name).filter(Boolean))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg border-r border-green-100">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-800">Apollo Admin</h2>
                    </div>
                    <nav className="space-y-2">
                        <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-green-50">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                            </svg>
                            Dashboard
                        </a>
                        <a href="/dashboard/doctors" className="flex items-center px-4 py-2 text-green-700 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Doctors
                        </a>
                        <a href="/dashboard/patients" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-green-50">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Patients
                        </a>
                        <a href="/dashboard/appointments" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-green-50">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Appointments
                        </a>
                        <a href="/doctoradd" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-green-50">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Doctor
                        </a>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">Doctor Management</h1>
                    <p className="text-gray-600">Manage and view all registered doctors</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search doctors by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <select
                                className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                            >
                                <option value="">All Specialties</option>
                                {specialties.map(specialty => (
                                    <option key={specialty} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => router.push('/doctoradd')}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Doctor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                        {doctor.image ? (
                                            <img 
                                                src={`http://localhost:8000${doctor.image}`} 
                                                alt={doctor.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                                        <p className="text-sm text-gray-600">{doctor.specialization?.name || 'General Practitioner'}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
                                        </svg>
                                        {doctor.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        {doctor.phone || 'Not provided'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        {doctor.location || 'Not specified'}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/doctors/${doctor.id}`)}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => router.push(`/dashboard/doctors/${doctor.id}/patients`)}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                    >
                                        View Patients
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                        <p className="text-gray-600 mb-4">No doctors match your current search criteria.</p>
                        <button
                            onClick={() => router.push('/doctoradd')}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            Add First Doctor
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDoctorsPage;
