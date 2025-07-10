'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DoctorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/doctor/login/', formData);
      if (res.data.success) {
        localStorage.setItem('doctor', JSON.stringify(res.data));
        router.push('/doctor/home');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Doctor Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border mb-2"
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-2"
        onChange={e => setFormData({ ...formData, password: e.target.value })}
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2">Login</button>
    </div>
  );
}
