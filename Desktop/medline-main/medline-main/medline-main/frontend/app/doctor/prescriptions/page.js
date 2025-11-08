'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function DoctorPrescriptions() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [medications, setMedications] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // --- STATE SIMPLIFIED FOR BILL ---
  const [consultationFee, setConsultationFee] = useState(0);
  const [notes, setNotes] = useState('');
  // --- REMOVED: medicationCharges, labTestCharges, otherCharges, discount, tax ---

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('prescription');

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    } else {
      router.push('/doctor/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const doctorId = JSON.parse(storedDoctor)?.id;
        if (!doctorId) {
          setError('Doctor ID not found. Please log in again.');
          setLoading(false);
          router.push('/doctor/login');
          return;
        }

        const response = await axios.get(`http://localhost:8000/appointments/doctor/${doctorId}/`);
        const completedAppointments = response.data.filter(app => app.status === 'Completed');
        setAppointments(completedAppointments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
        // Example data for testing
        setAppointments([
          { id: '1', user: { name: 'John Doe', id: '101' }, date: '2025-09-03', time: '10:00 AM', status: 'Completed' },
          { id: '2', user: { name: 'Jane Smith', id: '102' }, date: '2025-09-04', time: '11:30 AM', status: 'Completed' }
        ]);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  const handlePrescriptionSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!selectedAppointment || !medications) {
      setError('Please select an appointment and enter medications.');
      setSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/prescriptions/create/', {
        appointment_id: selectedAppointment,
        medications,
        instructions
      });
      setSuccess('Prescription sent successfully!');
      setMedications('');
      setInstructions('');
    } catch (err) {
      console.error('Error sending prescription:', err);
      setError('Failed to send prescription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedAppointment, medications, instructions]);

  const handleBillSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!selectedAppointment) {
      setError('Please select an appointment');
      setSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/bills/create/', {
        appointment_id: selectedAppointment,
        consultation_fee: consultationFee,
        notes
      });
      setSuccess('Bill sent successfully!');
      
      setConsultationFee(0);
      setNotes('');
    } catch (err) {
      console.error('Error sending bill:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || `Failed to send bill: ${JSON.stringify(err.response?.data) || err.message}`);
    } finally {
      setSubmitting(false);
    }
  }, [selectedAppointment, consultationFee, notes]);

  // Memoize selected appointment details to prevent unnecessary re-renders
  const selectedAppointmentDetails = useMemo(() => {
    return appointments.find(a => a.id.toString() === selectedAppointment);
  }, [appointments, selectedAppointment]);

  // Memoize appointment options to prevent unnecessary re-renders
  const appointmentOptions = useMemo(() => {
    return appointments.map(appointment => (
      <option key={appointment.id} value={appointment.id}>
        {appointment.user?.name || 'Unknown'} - {appointment.date} {appointment.time}
      </option>
    ));
  }, [appointments]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="bg-teal-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Apollo Hospital</h1>
          {doctor && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Dr. {doctor.name}</p>
                <p className="text-sm opacity-80">{doctor.specialization || 'Specialist'}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('doctor');
                  router.push('/doctor/login');
                }}
                className="bg-teal-800 hover:bg-teal-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Prescriptions & Bills</h2>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-teal-100 px-6 py-3 flex space-x-6 border-b border-teal-200">
            <Link href="/doctor/home" className="text-teal-800 hover:text-teal-600 font-medium">Dashboard</Link>
            <Link href="/doctor/appointments" className="text-teal-800 hover:text-teal-600 font-medium">Appointments</Link>
            <Link href="/doctor/appointmentstatus" className="text-teal-800 hover:text-teal-600 font-medium">Update Status</Link>
            <Link href="/doctor/prescriptions" className="text-teal-900 font-bold border-b-2 border-teal-600">Prescriptions & Bills</Link>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-medium">Success</p>
                <p>{success}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 mb-2">No completed appointments found</p>
                <p className="text-gray-500 text-sm">You need completed appointments to create prescriptions or bills</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="appointment">Select Appointment</label>
                  <select
                    id="appointment"
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={selectedAppointment}
                    onChange={(e) => setSelectedAppointment(e.target.value)}
                  >
                    <option value="">Select an appointment</option>
                    {appointmentOptions}
                  </select>
                </div>

                <div className="mb-6">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`py-3 px-6 font-medium transition-colors ${activeTab === 'prescription' ? 'border-b-2 border-teal-500 text-teal-700' : 'text-gray-500 hover:text-teal-600'}`}
                      onClick={() => setActiveTab('prescription')}
                    >
                      Prescription
                    </button>
                    <button
                      className={`py-3 px-6 font-medium transition-colors ${activeTab === 'bill' ? 'border-b-2 border-teal-500 text-teal-700' : 'text-gray-500 hover:text-teal-600'}`}
                      onClick={() => setActiveTab('bill')}
                    >
                      Bill
                    </button>
                  </div>
                </div>
                
                {selectedAppointment && selectedAppointmentDetails && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Patient Information</h3>
                    <div className="text-sm">
                      <p><span className="font-medium">Name:</span> {selectedAppointmentDetails.user?.name || 'Unknown'}</p>
                      <p><span className="font-medium">Appointment Date:</span> {selectedAppointmentDetails.date}</p>
                      <p><span className="font-medium">Appointment Time:</span> {selectedAppointmentDetails.time}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'prescription' ? (
                  <form onSubmit={handlePrescriptionSubmit} className="bg-white rounded-lg p-6 border border-gray-100">
                    {/* ... Prescription form remains the same ... */}
                    <div className="mb-5">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="medications">Medications *</label>
                      <textarea id="medications" className="w-full bg-white border border-gray-300 rounded-md py-3 px-4" rows="4" placeholder="e.g., Paracetamol 500mg - 1 tablet every 6 hours" value={medications} onChange={(e) => setMedications(e.target.value)} required ></textarea>
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructions">Instructions</label>
                      <textarea id="instructions" className="w-full bg-white border border-gray-300 rounded-md py-3 px-4" rows="3" placeholder="e.g., Take after meals, Avoid alcohol" value={instructions} onChange={(e) => setInstructions(e.target.value)} ></textarea>
                    </div>
                    <div className="flex items-center justify-end">
                      <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md" disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Prescription'}
                      </button>
                    </div>
                  </form>
                ) : (
                  // --- BILL FORM SIMPLIFIED ---
                  <form onSubmit={handleBillSubmit} className="bg-white rounded-lg p-6 border border-gray-100">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="consultationFee">Consultation Fee (₹)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          id="consultationFee"
                          type="number" min="0"
                          className="w-full bg-white border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    {/* --- ALL OTHER CHARGE INPUTS REMOVED --- */}
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows="3"
                        placeholder="Additional notes about the bill"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {/* --- TOTAL CALCULATION SIMPLIFIED --- */}
                      <div className="text-xl font-bold text-teal-800 mb-4 sm:mb-0">
                        Total: ₹{consultationFee.toFixed(2)}
                      </div>
                      <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
                        disabled={submitting}
                      >
                         {submitting ? 'Sending...' : 'Send Bill'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}