// pages/appointments/doctor/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DoctorAppointments() {
  const { id } = useRouter().query;
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8000/appointments/doctor/${id}/`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div>
      <h2>Doctor Appointments</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            User: {app.user}, Date: {app.date}, Time: {app.time}, Status: {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
