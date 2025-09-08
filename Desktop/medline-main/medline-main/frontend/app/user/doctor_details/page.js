'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

// --- Helper Components & Functions ---
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

// The Doctor Card Component
const DoctorCard = ({ doctor }) => {
    const specialtyColors = getSpecialtyColors(doctor.specialization);

    return (
        <Link href={`/user/doctor_discription/${doctor.id}`} className="block h-full">
            <div className="apollo-card rounded-2xl p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer relative h-full flex flex-col">
                <div className="flex flex-col items-center flex-grow">
                    {/* Doctor Image */}
                    <img
                        src={doctor.image ? `http://localhost:8000${doctor.image}` : `https://i.pravatar.cc/150?u=${doctor.id}`}
                        alt={doctor.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm"
                    />

                    {/* Doctor Info */}
                    <h3 className="text-xl font-bold text-gray-800 mt-4">{doctor.name}</h3>
                    {doctor.description && (
                        <p className="text-gray-600 text-sm mt-1 text-center line-clamp-2">
                            {doctor.description}
                        </p>
                    )}

                    {/* Specialization Pill */}
                    <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-semibold ${specialtyColors}`}>
                        {doctor.specialization || 'General'}
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Main Page Component ---
export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

    useEffect(() => {
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
                setFilteredDoctors(doctorData);
            })
            .catch(err => {
                console.error('Error fetching doctors, falling back to dummy data:', err);
                const fallbackData = [
                    { id: 1, name: 'Dr. Topon Kumar', specialization: 'NEUROLOGIST', description: "Dr. Kumar is a leading neurologist with over 15 years of experience in treating neurological disorders." },
                    { id: 2, name: 'Dr. Albert Miles', specialization: 'CARDIOLOGIST', description: "Specializing in cardiac rhythm management and interventional cardiology." },
                    { id: 3, name: 'Dr. Null Specialization', specialization: null, description: "A highly experienced practitioner dedicated to patient care." },
                    { id: 4, name: 'Earl Hopkins', specialization: 'DERMETOLOGY', description: "Providing comprehensive care for all skin, hair, and nail conditions." },
                    { id: 5, name: 'Owen Larson', specialization: 'DERMETOLOGY', description: "Focusing on cosmetic and medical dermatology with a holistic approach." },
                    { id: 6, name: 'Teresa Schwartz', specialization: 'GYNOCOLOGY', description: "Expert in women's health, offering compassionate and personalized care for all stages of life." },
                ];
                setDoctors(fallbackData);
                setFilteredDoctors(fallbackData);
            })
            .finally(() => { setLoading(false); });
    }, []);

    // Get unique specializations for the filter dropdown
    const getUniqueSpecializations = () => {
        const specializations = doctors
            .map(doctor => {
                if (typeof doctor.specialization === 'string') {
                    return doctor.specialization;
                } else if (doctor.specialization && typeof doctor.specialization === 'object' && doctor.specialization.name) {
                    return doctor.specialization.name;
                }
                return null;
            })
            .filter(spec => spec && spec !== null && typeof spec === 'string')
            .map(spec => spec.toUpperCase());
        return [...new Set(specializations)];
    };

    // Filter doctors based on selected specialty
    const handleSpecialtyFilter = (specialty) => {
        setSelectedSpecialty(specialty);
        if (specialty === 'ALL') {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor => {
                let docSpec = null;
                if (typeof doctor.specialization === 'string') {
                    docSpec = doctor.specialization;
                } else if (doctor.specialization && typeof doctor.specialization === 'object' && doctor.specialization.name) {
                    docSpec = doctor.specialization.name;
                }
                return docSpec && docSpec.toUpperCase() === specialty;
            });
            setFilteredDoctors(filtered);
        }
    };

    return (
        <main className="bg-[var(--apollo-light)] min-h-screen">
            <Header />
            <div className="apollo-section py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Our Specialist Doctors</h1>
                    
                    {/* Specialty Filter Dropdown */}
                    {!loading && (
                        <div className="mb-8 flex justify-center">
                            <div className="w-full max-w-xs">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Specialization:
                                </label>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => handleSpecialtyFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                                >
                                    <option value="ALL">All Specializations</option>
                                    {getUniqueSpecializations().map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty.charAt(0) + specialty.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <p className="text-center text-gray-600">Loading doctors...</p>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">No doctors found for the selected specialization.</p>
                            <button
                                onClick={() => handleSpecialtyFilter('ALL')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Show All Doctors
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-center">
                                <p className="text-gray-600">
                                    Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
                                    {selectedSpecialty !== 'ALL' && ` in ${selectedSpecialty.charAt(0) + selectedSpecialty.slice(1).toLowerCase()}`}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredDoctors.map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}