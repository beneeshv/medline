"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpdateStatus() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null); // Use doctor object for consistency
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ appointmentId: '', status: '' });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // For the form button
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Consistent check for doctor info from localStorage
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    } else {
      router.push('/doctor/login');
      return;
    }

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const doctorId = JSON.parse(storedDoctor)?.id;
        if (!doctorId) {
          setError('Doctor ID not found. Please log in again.');
          setLoading(false);
          router.push('/doctor/login');
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/doctor/${doctorId}/appointments/`);
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]); // Removed 'success' dependency to prevent re-fetching on local state change

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      await axios.patch(`http://localhost:8000/appointments/${form.appointmentId}/status/`, {
        status: form.status
      });
      setSuccess('Appointment status updated successfully!');
      // Refresh the list to show the updated status
      const updatedAppointments = appointments.map(app => 
        app.id.toString() === form.appointmentId ? { ...app, status: form.status } : app
      );
      setAppointments(updatedAppointments);
      setForm({ appointmentId: '', status: '' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating appointment status');
      console.error(err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

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
          {/* Page Header */}
          <div className="bg-teal-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Update Appointment Status</h2>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-teal-100 px-6 py-3 flex space-x-6 border-b border-teal-200">
            <Link href="/doctor/home" className="text-teal-800 hover:text-teal-600 font-medium">Dashboard</Link>
            <Link href="/doctor/appointments" className="text-teal-800 hover:text-teal-600 font-medium">Appointments</Link>
            <Link href="/doctor/appointmentstatus" className="text-teal-900 font-bold border-b-2 border-teal-600">Update Status</Link>
            <Link href="/doctor/prescriptions" className="text-teal-800 hover:text-teal-600 font-medium">Prescriptions & Bills</Link>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                <p className="font-medium">Success</p>
                <p>{success}</p>
              </div>
            )}

            {/* Appointments Table */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Appointments</h3>
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p className="text-gray-600">No appointments found.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {appointments.map(appointment => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">{appointment.user?.name || 'Unknown'}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">{appointment.date} at {appointment.time}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Update Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-t pt-6">Update Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="appointmentId">Select Appointment</label>
                  <select
                    id="appointmentId"
                    name="appointmentId"
                    value={form.appointmentId}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select an ID</option>
                    {appointments.map(appointment => (
                      <option key={appointment.id} value={appointment.id}>
                        ID: {appointment.id} - {appointment.user?.name} ({appointment.date})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">New Status</label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center disabled:opacity-50"
                >
                  {submitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {submitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}