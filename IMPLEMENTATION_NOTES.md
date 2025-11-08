# Doctor Availability and Time Slot System Implementation Notes

## Overview

This document provides implementation notes for the doctor availability and time slot management system in the Medline application.

## Current Implementation Status

The system has the following components already implemented:

1. **Doctor Model** - Contains an `availability` field to store JSON data
2. **TimeSlot Model** - Represents individual time slots for appointments
3. **Basic API Endpoints** - For updating and retrieving doctor availability
4. **Frontend Interface** - React component for managing availability

## Required Enhancements

### 1. Time Slot Generation Endpoint

Need to add a new API endpoint to generate time slots based on doctor availability:

```
POST /api/doctor/{doctor_id}/generate-slots/
```

This endpoint should:
- Accept parameters for days ahead and slots per day
- Clear existing slots if requested
- Generate new slots based on doctor's availability settings
- Respect working hours and break times

### 2. Update TimeSlot Model

The TimeSlot model should be enhanced to properly check doctor availability:

```python
def is_within_doctor_availability(self):
    """Check if this time slot is within the doctor's defined availability."""
    if not self.doctor.availability:
        return True
        
    try:
        # Parse doctor's availability
        availability = json.loads(self.doctor.availability) if isinstance(self.doctor.availability, str) else self.doctor.availability
        
        # Get day of week
        day_name = self.date.strftime('%A')
        day_availability = availability.get(day_name, {})
        
        # Check if doctor is available on this day
        if not day_availability.get('available', False):
            return False
            
        # Check if slot time is within working hours
        # ... implementation details
        
        return True
    except:
        return True
```

### 3. Frontend Integration

The frontend React component needs to:
- Allow doctors to set slots per day
- Provide a "Generate Slots" button
- Display generated time slots
- Show upcoming appointments

## Data Flow

1. Doctor sets weekly availability in frontend
2. Availability data is saved to Doctor.availability as JSON
3. Doctor clicks "Generate Slots"
4. Backend generates time slots for next 30 days
5. Slots are saved to TimeSlot model
6. Patients can book available slots

## Key Features to Implement

1. **Slot Generation Algorithm**
   - Distribute slots evenly throughout working hours
   - Respect break times
   - Limit slots per day based on doctor preference

2. **Availability Validation**
   - Ensure slots are only created during available hours
   - Prevent booking during break times
   - Handle edge cases (short working days, etc.)

3. **Capacity Management**
   - Allow doctors to set max patients per day
   - Track current bookings per slot
   - Prevent overbooking

## API Endpoints Needed

1. `POST /api/doctor/{doctor_id}/generate-slots/` - Generate time slots
2. `DELETE /api/doctor/{doctor_id}/clear-slots/` - Clear existing slots
3. `GET /api/doctor/{doctor_id}/slots-summary/` - Get slot statistics

## Database Considerations

1. Add indexes on TimeSlot.date and TimeSlot.doctor for performance
2. Consider archiving old slots to keep database size manageable
3. Add constraints to prevent double booking

## Error Handling

1. Handle malformed availability JSON
2. Handle database errors during slot generation
3. Provide meaningful error messages to frontend
4. Implement proper logging for debugging

## Testing Requirements

1. Test slot generation with various availability patterns
2. Test edge cases (no availability, full days, etc.)
3. Test break time handling
4. Test slot capacity limits
5. Test concurrent booking scenarios