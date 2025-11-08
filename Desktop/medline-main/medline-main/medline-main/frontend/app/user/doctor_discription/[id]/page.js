"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';

// --- ICONS ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/doctors/${id}/`)
        .then(res => {
          if (!res.ok) { throw new Error('Doctor not found in API. Check the ID and ensure the doctor exists.'); }
          return res.json();
        })
        .then(data => { 
          setDoctor(data);
          setError(null); // Clear previous errors on success
        })
        .catch(err => {
          console.error("Failed to fetch doctor, showing fallback data:", err);
          setError('Could not load doctor. Displaying sample data.');
          setDoctor({
              id: id,
              name: 'Dr. Sample Data',
              specialization: 'Cardiologist',
              description: 'This is sample data because the doctor could not be loaded from the API.',
              email: 'sample.doctor@example.com',
              number: '+91 98765 43210',
              image: null,
              availability: '{"Monday": ["10:00 AM", "11:00 AM"], "Wednesday": ["2:00 PM", "3:00 PM", "4:00 PM"], "Friday": ["9:00 AM"]}'
          });
        })
        .finally(() => { setLoading(false); });
    }
  }, [id]);

  let parsedAvailability = {};
  if (doctor && doctor.availability) {
    try {
      parsedAvailability = JSON.parse(doctor.availability);
    } catch (e) {
      console.error("Could not parse availability JSON:", e);
      // If parsing fails, parsedAvailability will remain an empty object, showing "Not specified"
    }
  }

  if (loading) return <div className="text-center p-10">Loading doctor details...</div>;
  if (!doctor) return <div className="text-center p-10 text-red-500">Error: {error || "Doctor data could not be loaded."}</div>;

  return (
    <main className="bg-[var(--apollo-light)] min-h-screen">
      <Header />
      <div className="apollo-section py-12">
        {error && (
          <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="max-w-4xl mx-auto apollo-card rounded-2xl p-8 mx-4 sm:mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 text-center md:text-left md:w-1/3">
              <img
                src={doctor.image ? `http://localhost:8000${doctor.image}` : `https://i.pravatar.cc/150?u=${doctor.id}`}
                alt={doctor.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-[var(--apollo-light)] shadow-md mx-auto"
              />
              <h1 className="text-3xl font-bold mt-4 text-[var(--apollo-primary)]">{doctor.name}</h1>
              <p className="text-[var(--apollo-secondary)] font-semibold text-lg">{doctor.specialization}</p>
              <div className="mt-4 space-y-2 text-left">
                  <div className="flex items-center gap-3"> <PhoneIcon /> <span className="text-[var(--apollo-text)]">{doctor.number}</span> </div>
                  <div className="flex items-center gap-3"> <EmailIcon /> <span className="text-[var(--apollo-text)]">{doctor.email}</span> </div>
              </div>
            </div>
            <div className="flex-grow md:w-2/3">
              <h2 className="text-2xl font-bold text-[var(--apollo-primary)] border-b border-[var(--apollo-light)] pb-2 mb-4">About Dr. {doctor.name.split(' ').slice(1).join(' ')}</h2>
              <p className="text-[var(--apollo-text)] leading-relaxed">{doctor.description}</p>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[var(--apollo-primary)] border-b border-[var(--apollo-light)] pb-2 mb-4">Weekly Availability</h2>
                {Object.keys(parsedAvailability).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(parsedAvailability).map(([day, times]) => (
                      <div key={day} className="grid grid-cols-3 gap-4 items-center">
                        <strong className="text-[var(--apollo-text-dark)] col-span-1">{day}:</strong>
                        <div className="col-span-2 flex flex-wrap gap-2">
                          {Array.isArray(times) && times.map((time) => (
                            <span key={time} className="bg-[var(--apollo-secondary-light)] text-[var(--apollo-secondary)] text-sm font-medium px-3 py-1 rounded-full">{time}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--apollo-text)]">Availability not specified.</p>
                )}
              </div>
              <div className="mt-8">
                <button className="w-full apollo-btn-primary font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md">
                  Make an Appointment
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/user/doctor_details" className="text-[var(--apollo-primary)] hover:underline">
              &larr; Back to all doctors
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}