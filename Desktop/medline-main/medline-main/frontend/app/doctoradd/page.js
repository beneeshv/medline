'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Helper component for a simple icon placeholder
const IconPlaceholder = ({ className, d }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d}></path>
    </svg>
);


export default function AddDoctor() {
    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        email: "",
        number: "",
        password: "",
        description: "",
        availability: "",
        image: null,
    });

    const [specializations, setSpecializations] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const baseUrl = "http://localhost:8000";

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = window.location.origin + '/adminlogin';
            return;
        }

        const fetchSpecializations = async () => {
            try {
                const res = await axios.get(`${baseUrl}/specializations/`);
                setSpecializations(res.data);
            } catch (err) {
                console.error('Error fetching specializations:', err);
                setMessage("Error loading specializations.");
            }
        };

        fetchSpecializations();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${baseUrl}/add-doctor/`, form, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Token ${token}`
                },
            });
            setMessage("Doctor added successfully!");
            setFormData({
                name: "",
                specialization: "",
                email: "",
                number: "",
                password: "",
                description: "",
                availability: "",
                image: null,
            });
            // Optional: Redirect after success
            // router.push('/dashboard/doctors');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "An unexpected error occurred.";
            setMessage("Error adding doctor: " + errorMsg);
            console.error("Error details:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        router.push('/adminlogin');
    };


    return (
        <div className="flex min-h-screen bg-gray-100 font-inter">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white shadow-lg flex flex-col p-4 rounded-r-lg">
                <div className="flex items-center space-x-3 mb-8 px-2">
                    <IconPlaceholder className="h-8 w-8 text-blue-600" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                </div>

                <nav className="flex-1">
                    <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-2">Main Navigation</h3>
                    <ul>
                        <li className="mb-2">
                            <a href="/dashboard" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                Dashboard
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/dashboard/doctors" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                Doctors
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/dashboard/patients" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                Patients
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/dashboard/appointments" className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150">
                                <IconPlaceholder className="h-5 w-5 mr-3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                                Appointments
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="/doctoradd" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md font-semibold">
                                <IconPlaceholder className="h-5 w-5 mr-3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                Add Doctor
                            </a>
                        </li>
                    </ul>
                    <li className="mb-2 mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center p-2 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-150 w-full text-left"
                        >
                            <IconPlaceholder className="h-5 w-5 mr-3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H3a3 3 0 01-3-3v-5a3 3 0 013-3h3a3 3 0 013 3v1" />
                            Logout
                        </button>
                    </li>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add a New Doctor</h1>
                    {message && (
                        <p className={`mb-4 p-3 rounded-md text-center font-medium ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Dr. John Doe"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <select
                                id="specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((spec) => (
                                    <option key={spec.id} value={spec.id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="johndoe@example.com"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                id="number"
                                name="number"
                                type="tel"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="123-456-7890"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter a brief description of the doctor's experience..."
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability (JSON Format)</label>
                            <textarea
                                id="availability"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                placeholder='{"Monday": "9:00 AM - 5:00 PM", "Wednesday": "10:00 AM - 6:00 PM"}'
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
                                rows="2"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors duration-200"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <IconPlaceholder className="h-5 w-5 mr-2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    Add Doctor
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}