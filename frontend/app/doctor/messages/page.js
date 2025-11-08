'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorMessages() {
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState('');
    const [messageForm, setMessageForm] = useState({
        recipient_user_id: '',
        appointment_id: '',
        subject: '',
        message: ''
    });
    const [sentMessages, setSentMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedDoctor = localStorage.getItem('doctor');
        if (!storedDoctor) {
            router.push('/doctor/login');
            return;
        }

        const doctorData = JSON.parse(storedDoctor);
        setDoctor(doctorData);
        fetchDoctorAppointments(doctorData.id);
        fetchSentMessages(doctorData.id);
    }, [router]);

    const fetchDoctorAppointments = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/appointments/doctor/${doctorId}/`);
            setAppointments(response.data || []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

    const fetchSentMessages = async (doctorId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/messages/doctor/${doctorId}/`);
            setSentMessages(response.data || []);
        } catch (err) {
            console.error('Error fetching sent messages:', err);
        }
    };

    const handleAppointmentSelect = (e) => {
        const appointmentId = e.target.value;
        setSelectedAppointment(appointmentId);
        
        if (appointmentId) {
            const appointment = appointments.find(app => app.id == appointmentId);
            if (appointment) {
                setMessageForm(prev => ({
                    ...prev,
                    recipient_user_id: appointment.user.id,
                    appointment_id: appointmentId
                }));
            }
        } else {
            setMessageForm(prev => ({
                ...prev,
                recipient_user_id: '',
                appointment_id: ''
            }));
        }
    };

    const handleInputChange = (e) => {
        setMessageForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!doctor) {
                throw new Error('Doctor information not found');
            }

            const messageData = {
                sender_doctor_id: doctor.id,
                recipient_user_id: parseInt(messageForm.recipient_user_id),
                appointment_id: messageForm.appointment_id ? parseInt(messageForm.appointment_id) : null,
                subject: messageForm.subject,
                message: messageForm.message
            };

            await axios.post('http://localhost:8000/api/messages/send/', messageData);
            setSuccess('Message sent successfully!');
            
            // Reset form
            setMessageForm({
                recipient_user_id: '',
                appointment_id: '',
                subject: '',
                message: ''
            });
            setSelectedAppointment('');
            
            // Refresh sent messages
            fetchSentMessages(doctor.id);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
            console.error('Error sending message:', err);
        } finally {
            setLoading(false);
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
                    {doctor && (
                        <div className="text-right">
                            <span className="block text-sm font-medium text-gray-700">Dr. {doctor.name}</span>
                            <span className="block text-xs text-gray-500">{doctor.specialization}</span>
                        </div>
                    )}
                    <button onClick={() => { localStorage.removeItem('doctor'); router.push('/doctor/login'); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex">
                            <li><Link href="/doctor/home" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Dashboard</Link></li>
                            <li><Link href="/doctor/appointments" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Appointments</Link></li>
                            <li><Link href="/doctor/appointmentstatus" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Update Status</Link></li>
                            <li><Link href="/doctor/prescriptions" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Prescriptions & Bills</Link></li>
                            <li><Link href="/doctor/messages" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">Messages</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Send Message to Patient</h2>
                        
                        {/* Send Message Form */}
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Compose New Message</h3>
                            
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

                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Patient (from your appointments):
                                    </label>
                                    <select
                                        value={selectedAppointment}
                                        onChange={handleAppointmentSelect}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    >
                                        <option value="">Select an appointment</option>
                                        {appointments.map(appointment => (
                                            <option key={appointment.id} value={appointment.id}>
                                                {appointment.user?.name} - {appointment.date} at {appointment.time}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={messageForm.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="Enter message subject"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
                                    <textarea
                                        name="message"
                                        value={messageForm.message}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="Enter your message to the patient"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        {/* Sent Messages */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sent Messages</h3>
                            {sentMessages.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600">No messages sent yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sentMessages.map(message => (
                                        <div key={message.id} className="border rounded-lg p-4 bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{message.subject}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        To: {message.recipient_user?.name}
                                                        {message.appointment && (
                                                            <span> (Appointment: {message.appointment.date})</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                                                    <div className="mt-1">
                                                        <span className={`px-2 py-1 rounded text-xs ${message.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {message.is_read ? 'Read' : 'Unread'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm">{message.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
