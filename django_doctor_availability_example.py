"""
Example script demonstrating how doctor availability and time slot generation works
in the Medline application.
"""

import json
from datetime import datetime, date, timedelta

# Example doctor availability data structure
doctor_availability_example = {
    "Monday": {
        "available": True,
        "startTime": "09:00",
        "endTime": "17:00",
        "breakStart": "12:00",
        "breakEnd": "13:00",
        "slotDuration": 30  # minutes
    },
    "Tuesday": {
        "available": True,
        "startTime": "10:00",
        "endTime": "16:00",
        "breakStart": "12:00",
        "breakEnd": "13:00",
        "slotDuration": 30
    },
    "Wednesday": {
        "available": False
    },
    "Thursday": {
        "available": True,
        "startTime": "09:00",
        "endTime": "17:00",
        "breakStart": "12:00",
        "breakEnd": "13:00",
        "slotDuration": 30
    },
    "Friday": {
        "available": True,
        "startTime": "09:00",
        "endTime": "13:00",
        "breakStart": "12:00",
        "breakEnd": "13:00",
        "slotDuration": 30
    },
    "Saturday": {
        "available": True,
        "startTime": "10:00",
        "endTime": "14:00",
        "breakStart": "12:00",
        "breakEnd": "13:00",
        "slotDuration": 30
    },
    "Sunday": {
        "available": False
    }
}

def time_to_minutes(time_str):
    """Convert time string (HH:MM) to minutes since midnight."""
    hours, minutes = map(int, time_str.split(':'))
    return hours * 60 + minutes

def generate_time_slots_for_doctor(doctor_id, availability_data, days_ahead=30, slots_per_day=10):
    """
    Generate time slots for a doctor based on their availability.
    
    Args:
        doctor_id: The ID of the doctor
        availability_data: Doctor's availability settings
        days_ahead: Number of days to generate slots for (default 30)
        slots_per_day: Maximum number of slots per day (default 10)
    
    Returns:
        List of time slot dictionaries
    """
    slots = []
    today = date.today()
    
    # Generate slots for the next 'days_ahead' days
    for i in range(days_ahead):
        current_date = today + timedelta(days=i)
        day_of_week = current_date.strftime('%A')  # Monday, Tuesday, etc.
        
        # Get availability for this day
        day_availability = availability_data.get(day_of_week, {})
        
        # Skip if doctor is not available on this day
        if not day_availability.get('available', False):
            continue
            
        # Get working hours
        start_time = day_availability.get('startTime', '09:00')
        end_time = day_availability.get('endTime', '17:00')
        break_start = day_availability.get('breakStart', '12:00')
        break_end = day_availability.get('breakEnd', '13:00')
        slot_duration = day_availability.get('slotDuration', 30)
        
        # Calculate work minutes minus break time
        start_minutes = time_to_minutes(start_time)
        end_minutes = time_to_minutes(end_time)
        break_start_minutes = time_to_minutes(break_start)
        break_end_minutes = time_to_minutes(break_end)
        
        # Total work minutes minus break time
        work_minutes = (end_minutes - start_minutes) - (break_end_minutes - break_start_minutes)
        
        # Calculate actual slot duration based on desired slots per day
        actual_slot_duration = max(15, work_minutes // slots_per_day)
        
        # Generate time slots
        current_minutes = start_minutes
        slots_created_today = 0
        
        while current_minutes < end_minutes and slots_created_today < slots_per_day:
            # Skip break time
            if break_start_minutes <= current_minutes < break_end_minutes:
                current_minutes = break_end_minutes
                continue
                
            # Calculate end time for this slot
            slot_end_minutes = min(current_minutes + actual_slot_duration, end_minutes)
            
            # Skip if this slot would be during break time
            if current_minutes < break_end_minutes and slot_end_minutes > break_start_minutes:
                current_minutes = break_end_minutes
                continue
            
            # Convert minutes back to time strings
            def minutes_to_time(minutes):
                hours = minutes // 60
                mins = minutes % 60
                return f"{hours:02d}:{mins:02d}:00"
            
            slot_start_time = minutes_to_time(current_minutes)
            slot_end_time = minutes_to_time(slot_end_minutes)
            
            # Create slot
            slot = {
                'doctor_id': doctor_id,
                'date': current_date.isoformat(),
                'start_time': slot_start_time,
                'end_time': slot_end_time,
                'is_available': True,
                'max_appointments': 1
            }
            
            slots.append(slot)
            slots_created_today += 1
            current_minutes = slot_end_minutes
    
    return slots

def main():
    """Example usage of the time slot generation system."""
    doctor_id = 1
    print("Doctor Availability System Example")
    print("=" * 40)
    
    # Print doctor's availability settings
    print("Doctor Availability Settings:")
    for day, settings in doctor_availability_example.items():
        if settings.get('available', False):
            print(f"  {day}: {settings['startTime']}-{settings['endTime']} "
                  f"(Break: {settings['breakStart']}-{settings['breakEnd']})")
        else:
            print(f"  {day}: Not available")
    
    print("\nGenerating time slots...")
    slots = generate_time_slots_for_doctor(doctor_id, doctor_availability_example)
    
    print(f"\nGenerated {len(slots)} time slots:")
    for slot in slots[:10]:  # Show first 10 slots
        print(f"  {slot['date']} {slot['start_time']}-{slot['end_time']}")
    
    if len(slots) > 10:
        print(f"  ... and {len(slots) - 10} more slots")

if __name__ == "__main__":
    main()