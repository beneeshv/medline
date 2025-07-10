'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  }, []);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {doctor.name}</h1>
      <p><strong>Email:</strong> {doctor.email}</p>
      <p><strong>Specialization:</strong> {doctor.specialization || 'Not set'}</p>
    </div>
  );
}
