"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BookAppointment() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({
        user: '',
        doctor: '',
        date: '',
        time: '',
        symptoms: ''
    });

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [preSelectedDoctor, setPreSelectedDoctor] = useState(null);

    useEffect(() => {
        // Check for pre-selected doctor from URL parameters
        const doctorId = searchParams.get('doctorId');
        const doctorName = searchParams.get('doctorName');
        
        if (doctorId && doctorName) {
            setPreSelectedDoctor({ id: doctorId, name: decodeURIComponent(doctorName) });
        }

        // Fetch doctors from the API
        axios.get('http://localhost:8000/api/doctors/')
            .then(res => {
                setDoctors(res.data);
                // If there's a pre-selected doctor, set it in the form
                if (doctorId) {
                    setForm(prev => ({ ...prev, doctor: doctorId }));
                }
            })
            .catch(err => {
                console.error("Doctor fetch error:", err);
                setError("Failed to load doctors. Please try again.");
            });

        // Get user ID directly from localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const userIdNum = parseInt(userId);
                if (isNaN(userIdNum)) {
                    throw new Error("Invalid user ID");
                }
                setForm(prev => ({ ...prev, user: userIdNum }));
            } catch (err) {
                console.error("Error parsing user ID:", err);
                setError("There was a problem with your login. Please log in again.");
                setTimeout(() => router.push('/login'), 2000);
            }
        } else {
            setError("Please login first to book an appointment");
            setTimeout(() => router.push('/login'), 2000);
        }
    }, [router, searchParams]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            if (!form.user) {
                throw new Error("User ID is missing. Please log in again.");
            }

            const formData = {
                ...form,
                user: parseInt(form.user)
            };

            if (isNaN(formData.user)) {
                throw new Error("Invalid user ID. Please log in again.");
            }

            const res = await axios.post('http://localhost:8000/appointments/book/', formData);
            setSuccess(true);
            setForm({
                user: form.user,
                doctor: '',
                date: '',
                time: '',
                symptoms: ''
            });
            alert(res.data.message);
        } catch (err) {
            if (err.message.includes("User ID")) {
                setError(err.message);
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(err.response?.data?.message || 'Error booking appointment. Please try again.');
                console.error(err.response?.data || err.message);
            }
        } finally {
            setLoading(false);
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
                    {/* Navigation Tabs (simplified for user view) */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            <li><Link href="/user/dashboard" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">Dashboard</Link></li>
                            <li><Link href="/user/appointments" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">Book Appointment</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-black hover:text-gray-800 hover:border-b-2 hover:border-black">My Appointments</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-black mb-6">Book an Appointment</h1>
                        {preSelectedDoctor && (
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>Booking appointment with <strong>{preSelectedDoctor.name}</strong></p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>Appointment booked successfully!</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Doctor:</label>
                                <select
                                    name="doctor"
                                    value={form.doctor}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            Dr. {doc.name} ({doc.specialization?.name || 'General'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Date:</label>
                                <input
                                    name="date"
                                    type="date"
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Time:</label>
                                <input
                                    name="time"
                                    type="time"
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Symptoms:</label>
                                <textarea
                                    name="symptoms"
                                    placeholder="Describe your symptoms or reason for visit"
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32 text-black"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    {loading ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}