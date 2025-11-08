"""
Views for handling doctor time slot generation in the Medline application.
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
import json
from datetime import datetime, date, timedelta
from .models import Doctor, TimeSlot

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
        doctor = get_object_or_404(Doctor, id=doctor_id)
        
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
        
        # Clear existing slots if requested
        if clear_existing:
            today = date.today()
            TimeSlot.objects.filter(
                doctor=doctor,
                date__gte=today
            ).delete()
        
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
                
                # Create slot in database
                slot = TimeSlot.objects.create(
                    doctor=doctor,
                    date=current_date,
                    start_time=slot_start_time,
                    end_time=slot_end_time,
                    is_available=True,
                    max_appointments=1
                )
                
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
        
    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'Failed to generate time slots: {str(e)}'}, status=500)