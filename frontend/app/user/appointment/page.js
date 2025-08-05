"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookAppointment() {
  const [form, setForm] = useState({
    user: '',
    doctor: '',
    date: '',
    time: '',
    description: ''
  });

  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch users
    axios.get('http://localhost:8000/api/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.error("User fetch error:", err));

    // Fetch doctors
    axios.get('http://localhost:8000/api/doctors/get/')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Doctor fetch error:", err));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/appointments/book/', form);
      alert(res.data.message);
    } catch (err) {
      alert('Error booking appointment');
      console.error(err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>User:</label>
      <select name="user" onChange={handleChange} required>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <label>Doctor:</label>
      <select name="doctor" onChange={handleChange} required>
        <option value="">Select Doctor</option>
        {doctors.map(doc => (
          <option key={doc.id} value={doc.id}>
            Dr. {doc.name} ({doc.specialization?.name || 'General'})
          </option>
        ))}
      </select>

      <label>Date:</label>
      <input name="date" type="date" onChange={handleChange} required />

      <label>Time:</label>
      <input name="time" type="time" onChange={handleChange} required />

      <label>Description:</label>
      <textarea name="description" placeholder="Symptoms / reason" onChange={handleChange}></textarea>

      <button type="submit">Book Appointment</button>
    </form>
  );
}
