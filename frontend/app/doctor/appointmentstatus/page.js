// pages/appointments/update-status.js
import { useState } from 'react';
import axios from 'axios';

export default function UpdateStatus() {
  const [form, setForm] = useState({ appointmentId: '', status: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.patch(`http://localhost:8000/appointments/${form.appointmentId}/status/`, {
        status: form.status
      });
      alert(res.data.message);
    } catch (err) {
      alert('Error updating status');
      console.error(err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="appointmentId" placeholder="Appointment ID" onChange={handleChange} required />
      <select name="status" onChange={handleChange} required>
        <option value="">Select Status</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Update Status</button>
    </form>
  );
}
