'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Icons as SVG components
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export default function DoctorAvailability() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [totalSlots, setTotalSlots] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slotsPerDay, setSlotsPerDay] = useState(10);

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      const doctorData = JSON.parse(storedDoctor);
      setDoctor(doctorData);
      fetchDoctorAvailability(doctorData.id);
    } else {
      router.push('/doctor/login');
    }
  }, [router]);

  const fetchDoctorAvailability = async (doctorId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/doctors/${doctorId}/`);
      const doctorData = response.data;
      
      console.log('Doctor data from API:', doctorData);
      
      if (doctorData.availability) {
        try {
          let parsedAvailability;
          
          if (typeof doctorData.availability === 'string') {
            try {
              const cleanAvailability = doctorData.availability
                .trim()
                .replace(/[\x00-\x1F\x7F-\x9F]/g, '');
                
              parsedAvailability = JSON.parse(cleanAvailability);
              console.log('Successfully parsed availability:', parsedAvailability);
            } catch (parseError) {
              console.warn('Failed to parse availability as JSON, treating as string', parseError);
              try {
                const fixedJson = doctorData.availability
                  .replace(/([{\s,])(\w+)\s*:/g, '$1"$2":')
                  .replace(/'/g, '"');
                parsedAvailability = JSON.parse(fixedJson);
                console.log('Successfully parsed after fixing JSON format:', parsedAvailability);
              } catch (secondParseError) {
                console.error('Second attempt to parse failed, using default:', secondParseError);
                throw new Error('Invalid JSON format');
              }
            }
          } else if (typeof doctorData.availability === 'object') {
            parsedAvailability = doctorData.availability;
          }
          
          if (parsedAvailability && typeof parsedAvailability === 'object' && 
              Object.keys(parsedAvailability).length > 0) {
            const validatedAvailability = {};
            daysOfWeek.forEach(day => {
              validatedAvailability[day] = {
                available: parsedAvailability[day]?.available || false,
                startTime: parsedAvailability[day]?.startTime || '09:00',
                endTime: parsedAvailability[day]?.endTime || '17:00',
                breakStart: parsedAvailability[day]?.breakStart || '12:00',
                breakEnd: parsedAvailability[day]?.breakEnd || '13:00',
                slotDuration: parsedAvailability[day]?.slotDuration || 30
              };
            });
            
            setAvailability(validatedAvailability);
            console.log('Set validated availability:', validatedAvailability);
          } else {
            console.warn('Parsed availability is empty or invalid, using default');
            initializeDefaultAvailability();
          }
        } catch (error) {
          console.error('Error processing availability:', error);
          console.log('Raw availability data:', doctorData.availability);
          toast.error('Error loading availability settings. Using default settings.');
          initializeDefaultAvailability();
        }
      } else {
        console.log('No availability data found, initializing default');
        initializeDefaultAvailability();
      }
      
      await fetchDoctorSlots(doctorId);
      
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      toast.error('Failed to load availability data. Using default settings.');
      initializeDefaultAvailability();
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDoctorSlots = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/doctor/${doctorId}/timeslots/`);
      setGeneratedSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load time slots');
    }
  };

  const initializeDefaultAvailability = () => {
    const defaultAvailability = {};
    daysOfWeek.forEach(day => {
      defaultAvailability[day] = {
        available: false,
        startTime: '09:00',
        endTime: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        slotDuration: 30
      };
    });
    setAvailability(defaultAvailability);
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === 'available' ? !prev[day].available : value
      }
    }));
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:8000/api/doctors/${doctor.id}/availability/`,
        { 
          availability: JSON.stringify(availability)
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const updatedDoctor = { 
        ...doctor, 
        availability: availability,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('doctor', JSON.stringify(updatedDoctor));
      setDoctor(updatedDoctor);
      
      toast.success('Availability saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error(error.response?.data?.error || 'Failed to save availability');
    } finally {
      setLoading(false);
    }
  };
  
  const clearAllSlots = async () => {
    if (!doctor?.id) {
      toast.error('Doctor information not available');
      return false;
    }
    
    try {
      const response = await axios.delete(`http://localhost:8000/api/doctor/${doctor.id}/clear-slots/`, {
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 200) {
        setGeneratedSlots([]);
        toast.success('All time slots cleared successfully');
        return true;
      } else {
        throw new Error(response.data?.error || 'Failed to clear slots');
      }
    } catch (error) {
      console.error('Error clearing slots:', error);
      toast.error(error.message || 'Failed to clear existing slots');
      return false;
    }
  };

  const handleGenerateSlots = async () => {
    if (!window.confirm('This will clear all existing time slots and generate new ones based on current availability. Continue?')) {
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const hasAvailableDays = Object.values(availability).some(day => day.available);
      if (!hasAvailableDays) {
        setError('Please set your availability for at least one day before generating slots.');
        toast.error('No available days found. Please set your availability first.');
        setIsEditing(true);
        return;
      }
      
      const cleared = await clearAllSlots();
      if (!cleared) {
        throw new Error('Failed to clear existing slots');
      }
      
      await generateTimeSlots(availability);
      
      await fetchDoctorSlots(doctor.id);
      
      toast.success('Time slots generated successfully!');
    } catch (error) {
      console.error('Error in handleGenerateSlots:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate time slots';
      setError(`Error: ${errorMessage}`);
      toast.error(`Failed to generate time slots: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTimeSlots = async (availability) => {
    const calculateWorkMinutes = (startTime, endTime, breakStart, breakEnd) => {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const [breakStartH, breakStartM] = breakStart.split(':').map(Number);
      const [breakEndH, breakEndM] = breakEnd.split(':').map(Number);
      
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const breakStartMinutes = breakStartH * 60 + breakStartM;
      const breakEndMinutes = breakEndH * 60 + breakEndM;
      
      return (endMinutes - startMinutes) - (breakEndMinutes - breakStartMinutes);
    };
    
    const slotsCreated = [];
    const today = new Date();
    
    try {
      console.log('Starting to generate time slots...');
      
      console.log('Starting to generate slots for the next 30 days...');
      
      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];
        
        const dayAvailability = availability[dayOfWeek];
        console.log(`Processing ${dayOfWeek} (${currentDate.toDateString()}):`, dayAvailability);
        
        if (dayAvailability?.available) {
          try {
            const startTime = dayAvailability.startTime || '09:00';
            const endTime = dayAvailability.endTime || '17:00';
            const breakStart = dayAvailability.breakStart || '12:00';
            const breakEnd = dayAvailability.breakEnd || '13:00';
            
            const workMinutes = calculateWorkMinutes(startTime, endTime, breakStart, breakEnd);
            const slotDuration = Math.max(15, Math.floor(workMinutes / slotsPerDay));
            
            console.log(`Creating ${slotsPerDay} slots for ${dayOfWeek} (${currentDate.toDateString()}) from ${startTime} to ${endTime}`);
            console.log(`Work minutes: ${workMinutes}, Slot duration: ${slotDuration} minutes`);
            
            let [currentHour, currentMinute] = startTime.split(':').map(Number);
            let slotsCreatedToday = 0;
            
            while (slotsCreatedToday < slotsPerDay) {
              const slotStart = new Date(currentDate);
              slotStart.setHours(currentHour, currentMinute, 0, 0);
              
              const slotEnd = new Date(slotStart);
              slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
              
              if (breakStart && breakEnd) {
                const [breakStartHour, breakStartMinute] = breakStart.split(':').map(Number);
                const [breakEndHour, breakEndMinute] = breakEnd.split(':').map(Number);
                
                const slotStartMinutes = currentHour * 60 + currentMinute;
                const breakStartMinutes = breakStartHour * 60 + breakStartMinute;
                const breakEndMinutes = breakEndHour * 60 + breakEndMinute;
                
                if (slotStartMinutes >= breakStartMinutes && slotStartMinutes < breakEndMinutes) {
                  console.log(`Skipping break time: ${currentHour}:${currentMinute.toString().padStart(2, '0')} - ${breakEndHour}:${breakEndMinute.toString().padStart(2, '0')}`);
                  [currentHour, currentMinute] = [breakEndHour, breakEndMinute];
                  currentHour += Math.floor(currentMinute / 60);
                  currentMinute = currentMinute % 60;
                  continue;
                }
              }

              const formatTime = (hours, minutes) => {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
              };
              
              const slotData = {
                doctor: doctor.id,
                date: currentDate.toISOString().split('T')[0],
                start_time: formatTime(currentHour, currentMinute),
                end_time: formatTime(slotEnd.getHours(), slotEnd.getMinutes()),
                max_appointments: 1,
                is_available: true
              };
              
              console.log('Sending slot data:', JSON.stringify(slotData, null, 2));

              try {
                const response = await axios.post('http://localhost:8000/api/timeslots/create/', slotData, {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                });
                console.log('Slot created:', response.data);
                slotsCreated.push(response.data);
              } catch (slotError) {
                console.error('Error creating slot:', slotError);
                if (slotError.response) {
                  console.error('Error response data:', slotError.response.data);
                  console.error('Error status:', slotError.response.status);
                  console.error('Request data:', slotError.config?.data);
                }
              }

              currentMinute += slotDuration;
              if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
              }
              slotsCreatedToday++;
            }
          } catch (dayError) {
            console.error(`Error processing ${dayOfWeek}:`, dayError);
          }
        }
      }
      
      console.log(`Successfully created ${slotsCreated.length} time slots`);
      return slotsCreated;
    } catch (error) {
      console.error('Error in generateTimeSlots:', error);
      throw error;
    }
  };

  if (loading && !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black flex items-center gap-3">
                <CalendarIcon />
                Availability Management
              </h1>
              <p className="text-black mt-1">Configure your schedule and generate appointment slots</p>
            </div>
            <Link 
              href="/doctor/home" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-black rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow"
            >
              <ArrowLeftIcon />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <SparklesIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Slot Generation Settings</h2>
              <p className="text-sm text-black">Configure how many appointments you want per day</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <label htmlFor="slotsPerDay" className="text-black font-medium flex items-center gap-2">
              <ClockIcon />
              Slots per day:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="slotsPerDay"
                min="1"
                max="48"
                value={slotsPerDay}
                onChange={(e) => setSlotsPerDay(parseInt(e.target.value) || 1)}
                className="border-2 border-gray-300 rounded-xl px-4 py-2 w-24 text-center font-semibold focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
              <span className="text-sm text-black bg-gray-100 px-3 py-1 rounded-lg">
                Recommended: 10-20
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                isEditing 
                  ? 'bg-gray-200 text-black hover:bg-gray-300' 
                  : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600'
              }`}
            >
              <EditIcon />
              {isEditing ? 'Cancel Editing' : 'Edit Availability'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Weekly Availability Section */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarIcon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Weekly Schedule</h2>
                  <p className="text-sm text-black">Set your availability for each day</p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={handleSaveAvailability}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <CheckCircleIcon />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
            
            <form onSubmit={handleSaveAvailability} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {daysOfWeek.map((day) => (
                  <div 
                    key={day} 
                    className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                      availability[day]?.available 
                        ? 'border-teal-300 bg-gradient-to-br from-teal-50 to-blue-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50'
                    } ${isEditing ? 'hover:shadow-md' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={availability[day]?.available || false}
                          onChange={() => handleAvailabilityChange(day, 'available')}
                          className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 focus:ring-2"
                          disabled={!isEditing}
                        />
                        <span className={`font-bold text-lg text-black`}>
                          {day}
                        </span>
                      </label>
                      {availability[day]?.available && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    {availability[day]?.available && (
                      <div className="space-y-3 mt-4 pl-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-black mb-1.5">Start Time</label>
                            <input
                              type="time"
                              value={availability[day].startTime || '09:00'}
                              onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-gray-100 font-medium"
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-black mb-1.5">End Time</label>
                            <input
                              type="time"
                              value={availability[day].endTime || '17:00'}
                              onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-gray-100 font-medium"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        
                        <div className="border-t-2 border-dashed border-gray-300 pt-3">
                          <p className="text-xs font-semibold text-black mb-2">Break Time</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-black mb-1.5">Break Start</label>
                              <input
                                type="time"
                                value={availability[day].breakStart || '12:00'}
                                onChange={(e) => handleAvailabilityChange(day, 'breakStart', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-gray-100 font-medium"
                                disabled={!isEditing}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-black mb-1.5">Break End</label>
                              <input
                                type="time"
                                value={availability[day].breakEnd || '13:00'}
                                onChange={(e) => handleAvailabilityChange(day, 'breakEnd', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-gray-100 font-medium"
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-black rounded-xl hover:bg-gray-100 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <CheckCircleIcon />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Time Slots Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Time Slots</h2>
                  <p className="text-sm text-black">Generated appointment slots</p>
                </div>
              </div>
              
              <button
                onClick={handleGenerateSlots}
                disabled={isGenerating || loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <SparklesIcon />
                {isGenerating ? 'Generating Slots...' : 'Generate Slots'}
              </button>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black uppercase tracking-wide">
                  Upcoming Slots
                </h3>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
                  {generatedSlots.length} Total
                </span>
              </div>
              
              {generatedSlots.length > 0 ? (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {generatedSlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className={`p-4 border-2 rounded-xl text-sm transition-all duration-200 hover:shadow-md ${
                        slot.is_available 
                          ? 'bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 hover:border-teal-300' 
                          : 'bg-gray-50 border-gray-300 text-gray-500 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-black mb-1">
                            {new Date(slot.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-black">
                            <ClockIcon />
                            <span className="font-medium">
                              {slot.start_time?.substring(0, 5)} - {slot.end_time?.substring(0, 5)}
                            </span>
                          </div>
                        </div>
                        {slot.is_available ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            Booked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                  <p className="text-black font-semibold mb-1">No time slots generated yet</p>
                  <p className="text-sm text-black">Set your availability and click 'Generate Slots'</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-200 rounded-lg mt-0.5">
                  <svg className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-900 mb-1">Important Note</h3>
                  <p className="text-sm text-amber-800">
                    Clicking 'Generate Slots' will clear all existing time slots and create new ones for the next 30 days based on your current availability settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
}