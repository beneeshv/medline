"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
// Assuming PaymentButton is available in the components folder structure relative to the final deployment path
import PaymentButton from '../../components/PaymentButton';
import { format } from 'date-fns';

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
    const [showPayment, setShowPayment] = useState(false);
    const [appointmentBill, setAppointmentBill] = useState(null);
    const [appointmentData, setAppointmentData] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [doctorAvailability, setDoctorAvailability] = useState({});
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // --- Utility Functions ---

    const getUniqueDates = (slots) => {
        // Ensure slots is an array before mapping
        if (!Array.isArray(slots)) return [];
        return [...new Set(slots.map(slot => slot.date))].sort();
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        // Pad minutes with a leading zero if needed
        const displayMinutes = minutes.padStart(2, '0');
        return `${displayHour}:${displayMinutes} ${ampm}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // --- Data Fetching and Initialization ---

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        const doctorName = searchParams.get('doctorName');
        
        if (doctorId && doctorName) {
            setPreSelectedDoctor({ id: doctorId, name: decodeURIComponent(doctorName) });
        }
        const fetchDoctors = async () => {
            try {
                setLoadingDoctors(true);
                const response = await axios.get('http://localhost:8000/api/doctors/');
                const doctorsWithSlots = await Promise.all(
                    response.data.map(async doctor => {
                        try {
                            // Get doctor's availability settings
                            const availabilityResponse = await axios.get(
                                `http://localhost:8000/api/doctors/${doctor.id}/get-availability/`
                            );
                            
                            // Get available time slots
                            const slotsResponse = await axios.get(
                                `http://localhost:8000/api/doctor/${doctor.id}/timeslots/`
                            );

                            // Parse availability data
                            let availability = {};
                            try {
                                availability = availabilityResponse.data.availability || {};
                            } catch (e) {
                                console.error('Error parsing availability:', e);
                                availability = {};
                            }

                            const slots = slotsResponse.data || [];
                            console.log(`Doctor ${doctor.name} (ID: ${doctor.id}) has ${slots.length} slots`);

                            return {
                                ...doctor,
                                availability: availability,
                                availableSlots: slots,
                                nextAvailable: slots.length > 0 ? slots[0]?.date : 'No availability'
                            };
                        } catch (error) {
                            console.error(`Error fetching data for doctor ${doctor.id}:`, error);
                            return { 
                                ...doctor, 
                                availableSlots: [], 
                                nextAvailable: 'Error loading availability',
                                availability: {}
                            };
                        }
                    })
                );
                setDoctors(doctorsWithSlots);
                
                // If there's a pre-selected doctor, set it up
                const doctor = doctorsWithSlots.find(d => d.id.toString() === doctorId);
                if (doctor) {
                    handleDoctorSelect(doctor);
                }
            } catch (err) {
                console.error("Doctor fetch error:", err);
                setError("Failed to load doctors. Please try again.");
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();

        // Get user ID directly from localStorage (simulating basic auth flow)
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
                // Redirect user to login page
                // setTimeout(() => router.push('/login'), 2000);
            }
        } else {
            setError("Please login first to book an appointment");
            // Redirect user to login page
            // setTimeout(() => router.push('/login'), 2000);
        }
    }, [router, searchParams]);

    // Filter slots by selected date
    useEffect(() => {
        if (selectedDate && availableSlots.length > 0) {
            const filtered = availableSlots.filter(slot => slot.date === selectedDate);
            setFilteredSlots(filtered);
            setSelectedSlot(null); // Reset slot selection when date changes
        } else {
            setFilteredSlots([]);
        }
    }, [selectedDate, availableSlots]);


    // --- Handlers ---
    
    const handleDoctorSelect = async (doctor) => {
        try {
            setSelectedDoctor(doctor);
            // Update form with doctor ID
            setForm(prevForm => ({ ...prevForm, doctor: doctor.id, date: '', time: '' })); 
            setDoctorAvailability(doctor.availability || {});
            
            // Fetch fresh slots data when doctor is selected
            setLoadingSlots(true);
            const slotsResponse = await axios.get(
                `http://localhost:8000/api/doctor/${doctor.id}/timeslots/`
            );
            
            const slots = slotsResponse.data || [];
            console.log(`Fetched ${slots.length} slots for doctor ${doctor.name}`);
            setAvailableSlots(slots);
            
            if (slots.length > 0) {
                const firstDate = slots[0].date;
                console.log(`Setting first available date: ${firstDate}`);
                setSelectedDate(firstDate);
                const filtered = slots.filter(slot => slot.date === firstDate);
                console.log(`Filtered ${filtered.length} slots for date ${firstDate}`);
                setFilteredSlots(filtered);
            } else {
                console.log('No slots available for this doctor');
                setSelectedDate('');
                setFilteredSlots([]);
            }
            
            setSelectedSlot(null);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setError('Failed to load time slots. Please try again.');
            setAvailableSlots([]);
            setFilteredSlots([]);
            setSelectedDate('');
            setSelectedSlot(null);
        } finally {
            setLoadingSlots(false);
        }
    };
    
    // ⭐ NEW HANDLER DEFINITION
    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        // Update form state with the slot's date and time
        setForm(prevForm => ({
            ...prevForm,
            date: slot.date,
            time: slot.start_time,
        }));
    };
    
    // ⭐ NEW HANDLER DEFINITION
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Determine which form data to use: manual or slot selection
        let submissionData = { ...form };
        
        // Validation check for selected slot method
        if (selectedDoctor) {
            if (!selectedSlot) {
                setError("Please select a date and a time slot.");
                setLoading(false);
                return;
            }
            // If using slot selection, the form state should already be updated by handleSlotSelect
        } else if (!form.date || !form.time || !form.doctor || !form.user) {
             // Validation check for manual entry method
             setError("Please ensure all fields (Doctor, Date, Time, Symptoms) are filled correctly.");
             setLoading(false);
             return;
        }

        try {
            // API call to create the appointment
            const appointmentResponse = await axios.post(
                'http://localhost:8000/api/appointments/create/', 
                submissionData
            );
            
            console.log('Appointment response:', appointmentResponse.data);
            
            // The backend now returns appointment and bill together
            const { appointment, bill, payment_required, amount } = appointmentResponse.data;

            if (payment_required) {
                setAppointmentData(appointment);
                setAppointmentBill(bill);
                setShowPayment(true); // Move to payment screen
            } else {
                // If no payment required, mark as success
                setSuccess(true);
            }

        } catch (err) {
            console.error('Appointment submission error:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.detail || err.response?.data?.message || "Failed to book appointment. Please check your inputs and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setSuccess(true);
        setShowPayment(false);
        setAppointmentBill(null);
        setAppointmentData(null);
        // Reset form state (keep user ID)
        setForm(prevForm => ({
            user: prevForm.user,
            doctor: '',
            date: '',
            time: '',
            symptoms: ''
        }));
        setSelectedSlot(null);
        setSelectedDate('');
        setAvailableSlots([]);
        setFilteredSlots([]);
        setSelectedDoctor(null);
        setError(''); // Clear any previous error

        // Redirect to appointments page after 2 seconds
        setTimeout(() => {
            router.push('/user/appointments');
        }, 2000);
    };

    const handlePaymentError = (errorMessage) => {
        setError(`Payment failed: ${errorMessage}. Please try again.`);
    };

    // --- Rendering ---
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-teal-700">Apollo Health</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => { localStorage.removeItem('userId'); router.push('/login'); }} 
                        className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto mt-8 p-4 max-w-4xl">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Navigation Tabs */}
                    <nav className="border-b border-gray-200">
                        <ul className="flex flex-wrap text-sm font-medium">
                            <li><Link href="/" className="inline-block p-4 text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 transition-colors">Home</Link></li>
                            <li><Link href="/user/symptom-checker" className="inline-block p-4 text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 transition-colors">🔍 Symptom Checker</Link></li>
                            <li><Link href="/user/appointment" className="inline-block p-4 font-bold text-teal-600 border-b-2 border-teal-600">Book Appointment</Link></li>
                            <li><Link href="/user/appointments" className="inline-block p-4 text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 transition-colors">My Appointments</Link></li>
                            <li><Link href="/user/prescriptions" className="inline-block p-4 text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 transition-colors">My Prescriptions</Link></li>
                            <li><Link href="/user/bills" className="inline-block p-4 text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 transition-colors">My Bills</Link></li>
                            <li><Link href="/user/account" className="inline-block p-4 text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 transition-colors">My Account</Link></li>
                        </ul>
                    </nav>

                    {/* Page Content */}
                    <div className="p-8">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Book an Appointment</h1>
                        
                        {/* Error Messages */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm" role="alert">
                                <p className="font-semibold">Error:</p>
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {preSelectedDoctor && !selectedDoctor && (
                            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4 shadow-sm" role="alert">
                                <p>Booking appointment with <strong>{preSelectedDoctor.name}</strong></p>
                            </div>
                        )}

                        {/* --- Main Conditional Area: Show Payment or Booking Form --- */}
                        {showPayment && appointmentBill ? (
                            // --- Payment UI ---
                            <div className="bg-white p-6 rounded-lg shadow-xl border border-teal-200">
                                <h2 className="text-2xl font-bold text-teal-700 mb-4">Complete Payment</h2>
                                <div className="mb-6 space-y-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    <p><strong>Doctor:</strong> Dr. {appointmentData?.doctor?.name}</p>
                                    <p><strong>Date:</strong> {appointmentData?.date}</p>
                                    <p><strong>Time:</strong> {appointmentData?.time ? formatTime(appointmentData.time) : 'N/A'}</p>
                                    <p className="text-lg font-bold text-red-600">
                                        Amount Due: ₹{appointmentBill?.total_amount}
                                    </p>
                                </div>
                                <PaymentButton 
                                    bill={appointmentBill}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                />
                                <button
                                    onClick={() => {
                                        setShowPayment(false);
                                        setAppointmentBill(null);
                                        setAppointmentData(null);
                                    }}
                                    className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        ) : (
                            // --- Booking Form UI ---
                            <form onSubmit={handleSubmit}> 
                                {/* Doctor Selection */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Select a Doctor</h2>
                                    {loadingDoctors ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {doctors.map(doctor => (
                                                <div 
                                                    key={doctor.id}
                                                    onClick={() => handleDoctorSelect(doctor)}
                                                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-md ${selectedDoctor?.id === doctor.id ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500' : 'border-gray-200 hover:border-teal-300 hover:shadow-lg'}`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                                                                {doctor.name.charAt(0)}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-base font-bold text-gray-900 truncate">
                                                                Dr. {doctor.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {doctor.specialization}
                                                            </p>
                                                            <p className="text-xs text-teal-500 font-medium">
                                                                {doctor.availableSlots?.length > 0 
                                                                    ? `${doctor.availableSlots.length} slots available` 
                                                                    : 'No availability'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {success && (
                                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-4 shadow-md animate-pulse" role="alert">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="font-bold text-lg">Payment Successful! 🎉</p>
                                        </div>
                                        <p className="text-sm">Your appointment has been confirmed.</p>
                                        <p className="text-sm mt-1">Redirecting to "My Appointments" page...</p>
                                    </div>
                                )}

                                {/* Selected Doctor Details & Availability */}
                                {selectedDoctor && (
                                    <>
                                        <div className="mb-8 p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
                                            <h3 className="text-xl font-bold text-teal-700 mb-2">
                                                Selected: Dr. {selectedDoctor.name}
                                            </h3>
                                            <p className="text-gray-600 mb-2">{selectedDoctor.specialization}</p>
                                            <p className="text-sm text-gray-500">
                                                {selectedDoctor.availableSlots?.length > 0 
                                                    ? `Next available on: ${format(new Date(selectedDoctor.nextAvailable), 'PPPP')}`
                                                    : 'No upcoming availability'}
                                            </p>
                                        </div>
                                        
                                        {/* Doctor Availability Preview */}
                                        {doctorAvailability && Object.keys(doctorAvailability).length > 0 && (
                                            <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Doctor's Standard Availability</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-xs">
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                        <div key={day} className={`p-2 rounded-lg text-center ${
                                                            doctorAvailability[day]?.available 
                                                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                                                : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                            <div className="font-bold">{day.substring(0, 3)}</div>
                                                            {doctorAvailability[day]?.available && doctorAvailability[day]?.startTime ? (
                                                                <div>
                                                                    {formatTime(doctorAvailability[day].startTime)} - {formatTime(doctorAvailability[day].endTime)}
                                                                </div>
                                                            ) : (
                                                                <div>Unavailable</div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* --- Date and Time Slot Selection --- */}
                                {selectedDoctor && (
                                    <div className="mb-8 p-0">
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Select Date & Time</h2>
                                        
                                        {/* Date Picker */}
                                        <div className="space-y-2 mb-6">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                                Select Date
                                            </label>
                                            <select
                                                id="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg shadow-sm"
                                                required
                                                disabled={loadingSlots}
                                            >
                                                <option value="" disabled>Choose a date</option>
                                                {availableSlots.length > 0 ? (
                                                    getUniqueDates(availableSlots).map(date => (
                                                        <option key={date} value={date}>
                                                            {format(new Date(date), 'PPPP')}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">No future dates available</option>
                                                )}
                                            </select>
                                        </div>

                                        {/* Time Slots */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Available Time Slots for {selectedDate ? format(new Date(selectedDate), 'PPP') : 'selected date'}
                                            </label>
                                            
                                        {loadingSlots ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                                <p className="mt-2 text-gray-600">Loading available time slots...</p>
                                            </div>
                                        ) : filteredSlots.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {filteredSlots.map((slot, index) => (
                                                    <button
                                                        type="button" // Use type="button" to prevent form submission
                                                        key={index}
                                                        onClick={() => handleSlotSelect(slot)}
                                                        className={`p-3 border rounded-lg text-center transition-colors ${
                                                            selectedSlot?.id === slot.id
                                                                ? 'bg-teal-600 text-white border-teal-600 shadow-lg'
                                                                : 'border-gray-200 bg-white hover:border-teal-500 hover:bg-teal-50'
                                                        }`}
                                                    >
                                                        <div className="font-medium">{formatTime(slot.start_time)}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-gray-500">
                                                <p>No time slots available for the selected date.</p>
                                                <p className="text-sm mt-1">Please try another date or contact the doctor.</p>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                )}

                                {/* Fallback date/time inputs (only shown if no doctor is selected or to manually override) */}
                                {!selectedDoctor && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 border rounded-xl bg-yellow-50">
                                        <h2 className="text-lg font-semibold col-span-full text-gray-800">Or Manually Enter Appointment Details (Not Recommended if Slots Available):</h2>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-black">Date:</label>
                                            <input
                                                name="date"
                                                type="date"
                                                value={form.date}
                                                onChange={handleChange}
                                                required={!selectedDoctor}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-black">Time:</label>
                                            <input
                                                name="time"
                                                type="time"
                                                value={form.time}
                                                onChange={handleChange}
                                                required={!selectedDoctor}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Symptoms Input */}
                                <div className="space-y-2 mt-6">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Describe Symptoms</h2>
                                    <label className="block text-sm font-medium text-gray-700">Symptoms:</label>
                                    <textarea
                                        name="symptoms"
                                        placeholder="Describe your symptoms or reason for visit briefly (e.g., Severe cough for 3 days, follow-up on fever)."
                                        onChange={handleChange}
                                        value={form.symptoms}
                                        required
                                        className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 h-24 text-black resize-none"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors transform hover:scale-[1.01]"
                                        disabled={loading || (selectedDoctor && !selectedSlot)}
                                    >
                                        {loading ? 'Processing...' : (selectedDoctor && !selectedSlot ? 'Select a Time Slot to Book' : 'Confirm and Book Appointment')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}