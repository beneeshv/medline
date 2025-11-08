"""
Views for handling doctor availability and time slot generation in the Medline application.
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
import json
from datetime import datetime, date, timedelta

# Note: These imports would normally be from .models, but we're using a standalone file
# from .models import Doctor, TimeSlot

@csrf_exempt
@require_http_methods(["PUT"])
def update_doctor_availability(request, doctor_id):
    """
    Update a doctor's weekly availability settings.
    
    Expected JSON format:
    {
        "availability": {
            "Monday": {
                "available": true,
                "startTime": "09:00",
                "endTime": "17:00",
                "breakStart": "12:00",
                "breakEnd": "13:00",
                "slotDuration": 30
            },
            ...
        }
    }
    """
    try:
        # In a real implementation, you would use:
        # doctor = get_object_or_404(Doctor, id=doctor_id)
        # For this example, we'll simulate the doctor object
        doctor = type('Doctor', (), {'id': doctor_id, 'name': 'Dr. Smith', 'availability': ''})()
        
        try:
            data = json.loads(request.body)
            availability = data.get('availability')
            
            # Validate the availability data structure
            if not availability:
                return JsonResponse({'error': 'Availability data is required'}, status=400)
                
            # If availability is a string, try to parse it as JSON
            if isinstance(availability, str):
                try:
                    availability = json.loads(availability)
                except json.JSONDecodeError:
                    return JsonResponse({'error': 'Invalid JSON format for availability'}, status=400)
            
            # Save the availability to the doctor's record
            doctor.availability = json.dumps(availability)
            # In real implementation: doctor.save()
            
            return JsonResponse({
                'message': 'Availability updated successfully',
                'doctor_id': doctor.id,
                'availability': availability
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def get_doctor_availability(request, doctor_id):
    """
    Get a doctor's current availability settings.
    """
    try:
        # In a real implementation, you would use:
        # doctor = get_object_or_404(Doctor, id=doctor_id)
        # For this example, we'll simulate the doctor object
        doctor = type('Doctor', (), {'id': doctor_id, 'name': 'Dr. Smith', 'availability': ''})()
        
        # Return the doctor's availability, or an empty object if not set
        try:
            availability = json.loads(doctor.availability) if doctor.availability else {}
        except (json.JSONDecodeError, TypeError):
            availability = {}
        
        return JsonResponse({
            'doctor_id': doctor.id,
            'availability': availability
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def time_to_minutes(time_str):
    """Convert time string (HH:MM) to minutes since midnight."""
    if isinstance(time_str, str):
        hours, minutes = map(int, time_str.split(':'))
        return hours * 60 + minutes
    return time_str.hour * 60 + time_str.minute


def minutes_to_time(minutes):
    """Convert minutes since midnight to time string (HH:MM:SS)."""
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}:00"


@csrf_exempt
@require_http_methods(["POST"])
def generate_doctor_time_slots(request, doctor_id):
    """
    Generate time slots for a doctor based on their availability settings.
    
    Expected JSON format:
    {
        "days_ahead": 30,           # Number of days to generate slots for
        "slots_per_day": 10,        # Maximum number of slots per day
        "clear_existing": true      # Whether to clear existing slots
    }
    """
    try:
        # In a real implementation, you would use:
        # doctor = get_object_or_404(Doctor, id=doctor_id)
        # For this example, we'll simulate the doctor object
        doctor = type('Doctor', (), {
            'id': doctor_id, 
            'name': 'Dr. Smith', 
            'availability': '{"Monday": {"available": true, "startTime": "09:00", "endTime": "17:00", "breakStart": "12:00", "breakEnd": "13:00"}}'
        })()
        
        # Parse request data
        try:
            data = json.loads(request.body) if request.body else {}
        except json.JSONDecodeError:
            data = {}
            
        days_ahead = data.get('days_ahead', 30)
        slots_per_day = data.get('slots_per_day', 10)
        clear_existing = data.get('clear_existing', True)
        
        # Load doctor's availability
        try:
            availability = json.loads(doctor.availability) if doctor.availability else {}
        except (json.JSONDecodeError, TypeError):
            availability = {}
            
        if not availability:
            return JsonResponse({
                'error': 'Doctor availability not set. Please set availability first.'
            }, status=400)
        
        # In a real implementation, you would clear existing slots if requested:
        # if clear_existing:
        #     today = date.today()
        #     TimeSlot.objects.filter(
        #         doctor=doctor,
        #         date__gte=today
        #     ).delete()
        
        # Generate time slots
        slots_created = []
        today = date.today()
        
        for i in range(days_ahead):
            current_date = today + timedelta(days=i)
            day_of_week = current_date.strftime('%A')  # Monday, Tuesday, etc.
            
            # Get availability for this day
            day_availability = availability.get(day_of_week, {})
            
            # Skip if doctor is not available on this day
            if not day_availability.get('available', False):
                continue
                
            # Get working hours
            start_time = day_availability.get('startTime', '09:00')
            end_time = day_availability.get('endTime', '17:00')
            break_start = day_availability.get('breakStart', '12:00')
            break_end = day_availability.get('breakEnd', '13:00')
            
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
                
                slot_start_time = minutes_to_time(current_minutes)
                slot_end_time = minutes_to_time(slot_end_minutes)
                
                # In a real implementation, you would create slot in database:
                # slot = TimeSlot.objects.create(
                #     doctor=doctor,
                #     date=current_date,
                #     start_time=slot_start_time,
                #     end_time=slot_end_time,
                #     is_available=True,
                #     max_appointments=1
                # )
                
                # For this example, we'll simulate the slot object
                slot = type('TimeSlot', (), {
                    'id': len(slots_created) + 1,
                    'date': current_date,
                    'start_time': slot_start_time,
                    'end_time': slot_end_time,
                    'is_available': True
                })()
                
                slots_created.append({
                    'id': slot.id,
                    'date': slot.date.isoformat(),
                    'start_time': str(slot.start_time),
                    'end_time': str(slot.end_time),
                    'is_available': slot.is_available
                })
                
                slots_created_today += 1
                current_minutes = slot_end_minutes
        
        return JsonResponse({
            'message': f'Successfully generated {len(slots_created)} time slots',
            'slots_created': slots_created,
            'total_slots': len(slots_created)
        })
        
    except Exception as e:
        return JsonResponse({'error': f'Failed to generate time slots: {str(e)}'}, status=500)


@require_http_methods(["DELETE"])
def clear_doctor_slots(request, doctor_id):
    """
    Clear all future time slots for a doctor.
    """
    try:
        # In a real implementation, you would use:
        # doctor = get_object_or_404(Doctor, id=doctor_id)
        # For this example, we'll simulate the doctor object
        doctor = type('Doctor', (), {'id': doctor_id, 'name': 'Dr. Smith'})()
        
        # In a real implementation, you would delete all future time slots:
        # today = date.today()
        # deleted_count, _ = TimeSlot.objects.filter(
        #     doctor=doctor,
        #     date__gte=today
        # ).delete()
        
        # For this example, we'll simulate deletion
        deleted_count = 5  # Simulated count
        
        return JsonResponse({
            'message': f'Successfully cleared {deleted_count} time slots for Dr. {doctor.name}',
            'deleted_count': deleted_count
        })
        
    except Exception as e:
        return JsonResponse({'error': f'Error clearing time slots: {str(e)}'}, status=500)


@require_http_methods(["GET"])
def get_doctor_time_slots(request, doctor_id):
    """
    Get all time slots for a doctor.
    """
    try:
        # In a real implementation, you would use:
        # doctor = get_object_or_404(Doctor, id=doctor_id)
        # For this example, we'll simulate the doctor object
        doctor = type('Doctor', (), {'id': doctor_id, 'name': 'Dr. Smith'})()
        
        # In a real implementation, you would get all slots for this doctor:
        # slots = TimeSlot.objects.filter(doctor=doctor).order_by('date', 'start_time')
        
        # For this example, we'll simulate some slots
        slots = []
        today = date.today()
        for i in range(5):
            slot_date = today + timedelta(days=i)
            slots.append(type('TimeSlot', (), {
                'id': i + 1,
                'date': slot_date,
                'start_time': '09:00:00',
                'end_time': '09:30:00',
                'is_available': True,
                'max_appointments': 1,
                'current_bookings': 0,
                'is_slot_available': True
            })())
        
        slots_data = []
        for slot in slots:
            slots_data.append({
                'id': slot.id,
                'date': slot.date.isoformat(),
                'start_time': str(slot.start_time),
                'end_time': str(slot.end_time),
                'is_available': slot.is_available,
                'max_appointments': slot.max_appointments,
                'current_bookings': getattr(slot, 'current_bookings', 0),
                'is_slot_available': getattr(slot, 'is_slot_available', True)
            })
        
        return JsonResponse({
            'doctor_id': doctor.id,
            'doctor_name': doctor.name,
            'total_slots': len(slots_data),
            'slots': slots_data
        })
        
    except Exception as e:
        return JsonResponse({'error': f'Error fetching time slots: {str(e)}'}, status=500)