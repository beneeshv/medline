'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserMessages() {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('Please login first');
                    setLoading(false);
                    return;
                }

                // First, get all messages and filter for the current user as recipient
                const response = await axios.get(`http://localhost:8000/api/messages/`);
                const userMessages = response.data.filter(msg => msg.recipient === parseInt(userId));
                setMessages(userMessages);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError('Failed to load messages');
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const markAsRead = async (messageId) => {
        try {
            await axios.patch(`http://localhost:8000/api/messages/${messageId}/read/`);
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, is_read: true } : msg
            ));
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-800">Apollo Hospital</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => { localStorage.removeItem('userId'); router.push('/login'); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            <li><Link href="/user/dashboard" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Dashboard</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Book Appointment</Link></li>
                            <li><Link href="/user/appointments" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">My Appointments</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">My Bills</Link></li>
                            <li><Link href="/user/messages" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">Messages</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Messages</h1>
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="text-center py-4">
                                <p className="text-gray-600">Loading messages...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">You don't have any messages yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map(message => (
                                    <div 
                                        key={message.id} 
                                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                            message.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                                        }`}
                                        onClick={() => !message.is_read && markAsRead(message.id)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-semibold text-gray-800">{message.subject}</h3>
                                                    {!message.is_read && (
                                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    From: Dr. {message.sender_doctor?.name}
                                                    {message.sender_doctor?.specialization && (
                                                        <span className="ml-2 text-gray-500">
                                                            ({message.sender_doctor.specialization.name})
                                                        </span>
                                                    )}
                                                </p>
                                                {message.appointment && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Related to appointment on {message.appointment.date} at {message.appointment.time}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t pt-3">
                                            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                                        </div>
                                        
                                        {!message.is_read && (
                                            <div className="mt-3 pt-3 border-t">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(message.id);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Mark as Read
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
