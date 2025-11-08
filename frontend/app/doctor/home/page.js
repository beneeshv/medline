'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorHome() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('doctor');
    if (stored) {
      setDoctor(JSON.parse(stored));
    } else {
      router.push('/doctor/login');
    }
  }, [router]);

  if (!doctor) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

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
              <li><Link href="/doctor/dashboard" className="inline-block p-4 font-semibold text-teal-600 border-b-2 border-teal-600">Dashboard</Link></li>
              <li><Link href="/doctor/availability" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">My Availability</Link></li>
             
              <li><Link href="/doctor/appointments" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Appointments</Link></li>
              <li><Link href="/doctor/prescriptions" className="inline-block p-4 text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-800">Prescriptions</Link></li>
            </ul>
          </nav>

          {/* Page Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome, Dr. {doctor.name}</h1>
            <p className="text-gray-600"><strong>Email:</strong> {doctor.email}</p>
            <p className="text-gray-600"><strong>Specialization:</strong> {doctor.specialization || 'Not set'}</p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Doctor Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/doctor/appointments" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold p-6 rounded-lg shadow flex flex-col items-center justify-center transition-colors">
                  <span className="text-lg">Appointments</span>
                  <span className="text-sm text-blue-600 mt-1">View & manage appointments</span>
                </Link>
                <Link href="/doctor/appointmentstatus" className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold p-6 rounded-lg shadow flex flex-col items-center justify-center transition-colors">
                  <span className="text-lg">Update Status</span>
                  <span className="text-sm text-green-600 mt-1">Change appointment status</span>
                </Link>
                <Link href="/doctor/prescriptions" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold p-6 rounded-lg shadow flex flex-col items-center justify-center transition-colors">
                  <span className="text-lg">Prescriptions & Bills</span>
                  <span className="text-sm text-purple-600 mt-1">Send prescriptions and bills</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}