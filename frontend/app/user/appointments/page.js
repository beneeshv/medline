// pages/appointments/user/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserAppointments() {
  const { id } = useRouter().query;
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8000/appointments/user/${id}/`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div>
      <h2>User Appointments</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            Doctor: {app.doctor}, Date: {app.date}, Time: {app.time}, Status: {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
