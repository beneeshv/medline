// app/page.js
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link'; // 1. IMPORT THE LINK COMPONENT

// --- Helper Components & Functions ---
// ... (Helper functions getSpecialtyColors and StarIcon remain the same)
const getSpecialtyColors = (specialty) => {
  if (!specialty || typeof specialty !== 'string') { return 'bg-gray-100 text-gray-800'; }
  const s = specialty.toUpperCase();
  switch (s) {
    case 'NEUROLOGIST': return 'bg-blue-100 text-blue-800';
    case 'CARDIOLOGIST': return 'bg-pink-100 text-pink-800';
    case 'DERMETOLOGY': return 'bg-indigo-100 text-indigo-800';
    case 'GYNOCOLOGY': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-500">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.681 3.468 3.82.556c.734.107 1.03.998.494 1.512l-2.764 2.693.654 3.805c.124.723-.635 1.282-1.288.943L10 15.347l-3.419 1.798c-.653.34-1.412-.22-1.288-.943l.654-3.805-2.764-2.693c-.536-.514-.24-1.405.494-1.512l3.82-.556L9.132 2.884z" clipRule="evenodd" />
    </svg>
);


// The Doctor Card Component
const DoctorCard = ({ doctor }) => {
  const specialtyColors = getSpecialtyColors(doctor.specialization);

  return (
    // THE ONLY CHANGE IS IN THE `href` ATTRIBUTE BELOW
    <Link href={`/user/doctor_discription/${doctor.id}`} className="block h-full">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer relative h-full flex flex-col">
            {/* Rating Badge */}
            <div className="absolute top-4 left-4 flex items-center bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-sm font-semibold">
                <StarIcon />
                <span className="ml-1">{doctor.rating || '4.5'}</span>
            </div>

            <div className="flex flex-col items-center pt-8 flex-grow">
                {/* Doctor Image */}
                <img
                    src={doctor.image ? `http://localhost:8000${doctor.image}` : `https://i.pravatar.cc/150?u=${doctor.id}`}
                    alt={doctor.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm"
                />

                {/* Doctor Info */}
                <h3 className="text-xl font-bold text-gray-800 mt-4">{doctor.name}</h3>
                <p className="text-gray-500 text-sm mt-1 text-center">{doctor.address || "1288 Natalie Brook Apt. 966"}</p>

                {/* Specialization Pill */}
                <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-semibold ${specialtyColors}`}>
                    {doctor.specialization || 'General'}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-5"></div>

            {/* Actions */}
            <div className="flex justify-around items-center text-gray-600">
                <div className="flex items-center space-x-2 text-sm">
                    <span>Availability</span>
                </div>
                <div className="border-l border-gray-200 h-6"></div> {/* Vertical separator */}
                <div className="flex items-center space-x-2 text-sm">
                    <span>Make a call</span>
                </div>
            </div>
        </div>
    </Link>
  );
};


// --- Main Page Component ---
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... Fetch logic remains the same
    fetch('http://localhost:8000/api/doctors/')
      .then(res => {
        if (!res.ok) { throw new Error('Network response was not ok'); }
        return res.json();
      })
      .then(data => {
        let doctorData = [];
        if (Array.isArray(data)) { doctorData = data; } 
        else if (data && Array.isArray(data.doctors)) { doctorData = data.doctors; }
        setDoctors(doctorData);
      })
      .catch(err => {
        console.error('Error fetching doctors, falling back to dummy data:', err);
        setDoctors([
            {id: 1, name: 'Dr. Topon Kumar', specialization: 'NEUROLOGIST', rating: 4.5},
            {id: 2, name: 'Dr. Albert Miles', specialization: 'CARDIOLOGIST', rating: 5.0},
            {id: 3, name: 'Dr. Null Specialization', specialization: null, rating: 4.8},
            {id: 4, name: 'Earl Hopkins', specialization: 'DERMETOLOGY', rating: 4.5},
            {id: 5, name: 'Owen Larson', specialization: 'DERMETOLOGY', rating: 4.5},
            {id: 6, name: 'Teresa Schwartz', specialization: 'GYNOCOLOGY', rating: 4.5},
        ]);
      })
      .finally(() => { setLoading(false); });
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Specialist Doctors</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {doctors.map((doctor) => ( <DoctorCard key={doctor.id} doctor={doctor} /> ))}
          </div>
        )}
      </div>
    </main>
  );
}