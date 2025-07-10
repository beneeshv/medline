"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    number: "",
    password: "",
    description: "",
    availability: "",
    image: null,
  });

  const [specializations, setSpecializations] = useState([]);
  const [message, setMessage] = useState("");

  const baseUrl = "http://localhost:8000"; // Base URL without trailing slash

  useEffect(() => {
    axios
      .get(`${baseUrl}/specializations/`)
      .then((res) => setSpecializations(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axios.post(`${baseUrl}/add-doctor/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Doctor added successfully!");
      // Clear form after successful submission
      setFormData({
        name: "",
        specialization: "",
        email: "",
        number: "",
        password: "",
        description: "",
        availability: "",
        image: null,
      });
    } catch (err) {
      setMessage("Error adding doctor: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Doctor</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border" />
        <select name="specialization" onChange={handleChange} className="w-full p-2 border">
          <option value="">Select Specialization</option>
          {specializations.map((spec) => (
            <option key={spec.id} value={spec.id}>{spec.name}</option>
          ))}
        </select>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" />
        <input name="number" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border"></textarea>
        <textarea name="availability" placeholder='Availability (JSON)' onChange={handleChange} className="w-full p-2 border"></textarea>
        <input type="file" name="image" onChange={handleChange} className="w-full p-2 border" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Add Doctor</button>
      </form>
    </div>
  );
}
