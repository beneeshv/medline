# Doctor Availability and Time Slot Management System

## Overview

This document explains how the doctor availability and time slot management system works in the Medline application. The system allows doctors to:

1. Set their weekly availability (which days they work and their working hours)
2. Define break times
3. Automatically generate time slots based on their availability
4. Control how many patients they can see per day

## System Components

### 1. Doctor Model

The Doctor model includes an `availability` field that stores JSON data representing the doctor's weekly schedule:

```json
{
  "Monday": {
    "available": true,
    "startTime": "09:00",
    "endTime": "17:00",
    "breakStart": "12:00",
    "breakEnd": "13:00",
    "slotDuration": 30
  },
  "Tuesday": {
    "available": true,
    "startTime": "10:00",
    "endTime": "16:00",
    "breakStart": "12:00",
    "breakEnd": "13:00",
    "slotDuration": 30
  },
  "Wednesday": {
    "available": false
  }
}
```

### 2. TimeSlot Model

The TimeSlot model represents individual time slots that patients can book:

- `doctor`: ForeignKey to Doctor
- `date`: Date of the slot
- `start_time`: Start time of the slot
- `end_time`: End time of the slot
- `is_available`: Whether the slot is available for booking
- `max_appointments`: Maximum number of appointments for this slot (usually 1)

### 3. Frontend Interface

The doctor availability page allows doctors to:

1. Set their availability for each day of the week
2. Define working hours and break times
3. Set the number of slots they want to generate per day
4. Generate time slots automatically based on their settings

## How It Works

### Setting Availability

1. Doctors log into their dashboard
2. Navigate to the "Availability" section
3. For each day of the week, they can:
   - Mark themselves as available/unavailable
   - Set start and end times
   - Define break periods
   - Set slot duration

### Generating Time Slots

1. Doctors click "Generate Slots" button
2. The system:
   - Clears any existing future slots (optional)
   - Reads the doctor's availability settings
   - Creates time slots for the next 30 days
   - Respects working hours and break times
   - Distributes slots evenly throughout the working day

### Example Workflow

1. Doctor sets Monday availability: 9:00 AM - 5:00 PM with a 1-hour break from 12:00-1:00 PM
2. Doctor sets "Slots per day" to 10
3. System calculates that with 7 working hours (8 hours minus 1-hour break), each slot should be approximately 42 minutes
4. System generates 10 slots on Monday:
   - 9:00-9:42
   - 9:42-10:24
   - 10:24-11:06
   - 11:06-11:48
   - 11:48-12:00 (before break)
   - 13:00-13:42 (after break)
   - 13:42-14:24
   - 14:24-15:06
   - 15:06-15:48
   - 15:48-16:30

## API Endpoints

### Update Doctor Availability
```
PUT /api/doctors/{doctor_id}/availability/
```

### Get Doctor Availability
```
GET /api/doctors/{doctor_id}/get-availability/
```

### Generate Time Slots
```
POST /api/doctor/{doctor_id}/generate-slots/
```

### Clear Doctor Slots
```
DELETE /api/doctor/{doctor_id}/clear-slots/
```

### Get Doctor Time Slots
```
GET /api/doctor/{doctor_id}/timeslots/
```

## Key Features

1. **Flexible Scheduling**: Doctors can set different schedules for each day
2. **Break Management**: Automatic exclusion of break times from slot generation
3. **Slot Distribution**: Even distribution of slots throughout working hours
4. **Capacity Control**: Doctors can control how many patients they see per day
5. **Bulk Generation**: Generate slots for the next 30 days with one click
6. **Easy Updates**: Doctors can modify their availability and regenerate slots

## Implementation Notes

1. The system stores availability as JSON in the Doctor model
2. Time slots are generated based on availability settings
3. The frontend provides a user-friendly interface for setting availability
4. Slot generation respects working hours and break times
5. Doctors can regenerate slots anytime their availability changes