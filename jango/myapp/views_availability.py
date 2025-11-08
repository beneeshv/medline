from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Doctor

@csrf_exempt
@require_http_methods(["PUT"])
def update_doctor_availability(request, doctor_id):
    try:
        doctor = Doctor.objects.get(id=doctor_id)
        
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
            
            # Save the availability to the doctor's record as JSON string
            doctor.availability = json.dumps(availability)
            doctor.save()
            
            return JsonResponse({
                'message': 'Availability updated successfully',
                'doctor_id': doctor.id,
                'availability': availability
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            
    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_doctor_availability(request, doctor_id):
    try:
        doctor = Doctor.objects.get(id=doctor_id)
        
        # Return the doctor's availability, or an empty object if not set
        try:
            availability = json.loads(doctor.availability) if doctor.availability else {}
        except (json.JSONDecodeError, TypeError):
            availability = {}
        
        return JsonResponse({
            'doctor_id': doctor.id,
            'availability': availability
        })
        
    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)