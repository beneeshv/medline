'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function UserAccountEdit() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/users/${userId}/`);
                const user = response.data;
                setFormData({
                    name: user.name,
                    email: user.email
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data for edit:', err);
                setError('Failed to load user data.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const userId = localStorage.getItem('userId');

        try {
            await axios.put(`http://localhost:8000/api/users/${userId}/`, formData);
            setSuccess('Profile updated successfully!');
            // Update localStorage with new data
            localStorage.setItem('userName', formData.name);
            localStorage.setItem('userEmail', formData.email);
            // Redirect back to the account page after a short delay
            setTimeout(() => {
                router.push('/user/account');
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-800">Apollo Hospital</span>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{success}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Link href="/user/account" className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}