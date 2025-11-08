from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password, check_password
import razorpay
import hashlib
import hmac
from django.conf import settings
import requests
import json

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    image = request.FILES.get('image')  # Optional

    if User.objects.filter(email=data.get('email')).exists():
        return Response({"message": "Email already registered."}, status=400)

    try:
        # Create user with hashed password
        user = User.objects.create(
            name=data.get('name'),
            number=data.get('number'),
            email=data.get('email'),
            age=data.get('age'),
            location=data.get('location'),
            password=data.get('password'),  # Store password as is, we'll compare directly
            description=data.get('description', ''),
            image=image
        )
        return Response({
            "message": "User registered successfully.",
            "email": user.email,
            "name": user.name
        }, status=201)
    except Exception as e:
        return Response({"message": f"Registration failed: {str(e)}"}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        user = User.objects.get(email=email)
        # Direct password comparison since we're storing plain text
        if user.password == password:
            return Response({
                "message": "Login successful",
                "id": user.id,  # Add the user ID to the response
                "user": user.name,
                "email": user.email,
                "redirect_url": "/"
            }, status=200)
        else:
            return Response({"message": "Invalid password"}, status=401)

    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def flutter_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"message": "Email and password required"}, status=400)

    try:
        user = User.objects.get(email=email)
        # Direct password comparison
        if user.password == password:
            return Response({
                "message": "Login success",
                "user": user.name,
                "email": user.email
            }, status=200)
        else:
            return Response({"message": "Invalid password"}, status=401)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Hardcoded admin credentials
    if username == 'beneesh' and password == '2310':
        return Response({
            "message": "Admin login successful",
            "token": "admin-token-beneesh-2310"
        }, status=200)
    else:
        return Response(
            {"error": "Invalid admin credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )



from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import Doctor  # You can remove if you don't use Doctor model
from .serializers import DoctorSerializer  # Optional

from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Doctor

def admin_dashboard_view(request):
    total_users = User.objects.count()
    total_doctors = Doctor.objects.count()

    return JsonResponse({
        "dashboard": "Admin Dashboard",
        "total_users": total_users,
        "total_doctors": total_doctors,
    })

 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Doctor, Specialization, TimeSlot
from .serializers import DoctorSerializer, SpecializationSerializer, TimeSlotSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_specializations(request):
    specializations = Specialization.objects.all()
    serializer = SpecializationSerializer(specializations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_doctor(request):
    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Doctor added successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from .models import Doctor

@api_view(['POST'])
@permission_classes([AllowAny])
def doctor_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        doctor = Doctor.objects.get(email=email)
        if doctor.password == password:  # In production, use hash check
            return Response({
                'success': True,
                'id': doctor.id,
                'name': doctor.name,
                'email': doctor.email,
                'specialization': doctor.specialization.name if doctor.specialization else None,
            })
        else:
            return Response({'success': False, 'message': 'Invalid password'}, status=401)
    except Doctor.DoesNotExist:
        return Response({'success': False, 'message': 'Doctor not found'}, status=404)
    

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, Appointment, User, Specialization
from .serializers import DoctorSerializer, AppointmentSerializer, SpecializationSerializer

class DoctorListAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)
    
from rest_framework import generics
    
class DoctorDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class SpecializationListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer

# Appointment APIs
@api_view(['POST'])
@permission_classes([AllowAny])
def book_appointment(request):
    try:
        user_id = request.data.get('user')
        doctor_id = request.data.get('doctor')
        time_slot_id = request.data.get('time_slot_id')
        date = request.data.get('date')
        time = request.data.get('time')
        symptoms = request.data.get('symptoms', '')
        
        # Validate required fields
        if not all([user_id, doctor_id]):
            return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if user and doctor exist
        try:
            user = User.objects.get(id=user_id)
            doctor = Doctor.objects.get(id=doctor_id)
        except (User.DoesNotExist, Doctor.DoesNotExist):
            return Response({"message": "User or doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        
        time_slot = None
        # If time_slot_id is provided, use slot-based booking
        if time_slot_id:
            try:
                time_slot = TimeSlot.objects.get(id=time_slot_id, doctor=doctor)
                
                # Check if slot is available
                if not time_slot.is_slot_available:
                    return Response({
                        "message": "This time slot is no longer available"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Use slot's date and time
                date = time_slot.date
                time = time_slot.start_time
                
            except TimeSlot.DoesNotExist:
                return Response({"message": "Time slot not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # For backward compatibility, allow direct date/time booking if no slot specified
        elif not all([date, time]):
            return Response({"message": "Either time_slot_id or both date and time are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Create appointment with 'Pending' status (will be confirmed after payment)
        appointment = Appointment.objects.create(
            user=user,
            doctor=doctor,
            time_slot=time_slot,
            date=date,
            time=time,
            symptoms=symptoms,
            status='Pending'
        )
        
        # Create bill with 100 rupees appointment fee
        bill = Bill.objects.create(
            appointment=appointment,
            consultation_fee=100.00,
            payment_status='Pending',
            notes='Appointment booking fee'
        )
        
        serializer = AppointmentSerializer(appointment)
        bill_serializer = BillSerializer(bill)
        
        return Response({
            "message": "Appointment created successfully. Please complete payment to confirm.",
            "appointment": serializer.data,
            "bill": bill_serializer.data,
            "payment_required": True,
            "amount": 100.00
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"message": f"Error booking appointment: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from .serializers import UserAppointmentSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_appointments(request, user_id):
    try:
        # Check if user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Get all appointments for the user
        appointments = Appointment.objects.filter(user=user).order_by('-date', '-time')
        serializer = UserAppointmentSerializer(appointments, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"message": f"Error fetching appointments: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from .serializers import DoctorAppointmentSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctor_appointments(request, doctor_id):
    try:
        # Check if doctor exists
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return Response({"message": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Get all appointments for the doctor
        appointments = Appointment.objects.filter(doctor=doctor).order_by('-date', '-time')
        serializer = DoctorAppointmentSerializer(appointments, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"message": f"Error fetching appointments: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_appointment_status(request, appointment_id):
    try:
        # Check if appointment exists
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Update status
        status_value = request.data.get('status')
        if not status_value:
            return Response({"message": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Validate status value
        valid_statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
        if status_value not in valid_statuses:
            return Response({"message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = status_value
        appointment.save()
        
        serializer = AppointmentSerializer(appointment)
        return Response({
            "message": "Appointment status updated successfully",
            "appointment": serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"message": f"Error updating appointment status: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Prescription APIs
from .serializers import PrescriptionSerializer
from .models import Prescription

@api_view(['POST'])
@permission_classes([AllowAny])
def create_prescription(request):
    try:
        appointment_id = request.data.get('appointment_id')
        medications = request.data.get('medications')
        instructions = request.data.get('instructions')
        
        # Validate required fields
        if not all([appointment_id, medications]):
            return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if appointment exists
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if prescription already exists for this appointment
        try:
            existing_prescription = Prescription.objects.get(appointment=appointment)
            # Update existing prescription instead of creating a new one
            existing_prescription.medications = medications
            existing_prescription.instructions = instructions or ''
            existing_prescription.save()
            
            serializer = PrescriptionSerializer(existing_prescription)
            return Response({
                "message": "Prescription updated successfully",
                "prescription": serializer.data
            }, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            # Create new prescription if none exists
            prescription_data = {
                'appointment_id': appointment_id,
                'medications': medications,
                'instructions': instructions or ''
            }
            
            serializer = PrescriptionSerializer(data=prescription_data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Prescription created successfully",
                    "prescription": serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({"message": f"Error creating prescription: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_appointment_prescription(request, appointment_id):
    try:
        # Check if appointment exists
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Get prescription for the appointment
        try:
            prescription = Prescription.objects.get(appointment=appointment)
            serializer = PrescriptionSerializer(prescription)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            return Response({"message": "No prescription found for this appointment"}, 
                            status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({"message": f"Error fetching prescription: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_prescriptions(request, user_id):
    try:
        # Check if user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Get all prescriptions for the user's appointments
        user_appointments = Appointment.objects.filter(user=user)
        prescriptions = Prescription.objects.filter(appointment__in=user_appointments).order_by('-created_at')
        
        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"message": f"Error fetching prescriptions: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Bill APIs
from .serializers import BillSerializer
from .models import Bill

@api_view(['POST'])
@permission_classes([AllowAny])
def create_bill(request):
    try:
        appointment_id = request.data.get('appointment_id')
        consultation_fee = request.data.get('consultation_fee', 0)
        medication_charges = request.data.get('medication_charges', 0)
        lab_test_charges = request.data.get('lab_test_charges', 0)
        other_charges = request.data.get('other_charges', 0)
        discount = request.data.get('discount', 0)
        tax = request.data.get('tax', 0)
        payment_status = request.data.get('payment_status', 'Pending')
        notes = request.data.get('notes', '')
        
        # Validate required fields
        if not appointment_id:
            return Response({"message": "Appointment ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if appointment exists
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if bill already exists for this appointment
        existing_bill = Bill.objects.filter(appointment=appointment).first()
        if existing_bill:
            # Update existing bill - only update fields that exist in the simplified model
            existing_bill.consultation_fee = consultation_fee
            existing_bill.payment_status = payment_status
            existing_bill.notes = notes
            existing_bill.save()  # total_amount will be calculated automatically in the model's save method
            
            serializer = BillSerializer(existing_bill)
            return Response({
                "message": "Bill updated successfully",
                "bill": serializer.data
            }, status=status.HTTP_200_OK)
        else:
            # Create new bill with only the fields that exist in the simplified model
            new_bill = Bill.objects.create(
                appointment=appointment,
                consultation_fee=consultation_fee,
                payment_status=payment_status,
                notes=notes
            )
            
            serializer = BillSerializer(new_bill)
            return Response({
                "message": "Bill created successfully",
                "bill": serializer.data
            }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        import traceback
        error_details = {
            "message": f"Error creating bill: {str(e)}",
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc(),
            "request_data": dict(request.data)
        }
        print(f"Bill creation error: {error_details}")  # This will show in Django console
        return Response(error_details, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_appointment_bill(request, appointment_id):
    try:
        # Check if appointment exists
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Get bill for the appointment
        try:
            bill = Bill.objects.get(appointment=appointment)
            serializer = BillSerializer(bill)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Bill.DoesNotExist:
            return Response({"message": "No bill found for this appointment"}, 
                            status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({"message": f"Error fetching bill: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_bills(request, user_id):
    try:
        # Check if user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Get all bills for the user's appointments
        user_appointments = Appointment.objects.filter(user=user)
        bills = Bill.objects.filter(appointment__in=user_appointments).order_by('-created_at')
        
        serializer = BillSerializer(bills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"message": f"Error fetching bills: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


# users/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer

class UserListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'  # Assumes the URL pattern uses 'pk' (primary key)


# Message APIs
from .models import Message
from .serializers import MessageSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    try:
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Message sent successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": f"Error sending message: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctor_messages(request, doctor_id):
    try:
        messages = Message.objects.filter(sender_doctor_id=doctor_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": f"Error fetching sent messages: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_messages(request):
    try:
        messages = Message.objects.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": f"Error fetching messages: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def mark_message_read(request, message_id):
    try:
        message = Message.objects.get(id=message_id)
        message.is_read = True
        message.save()
        return Response({"message": "Message marked as read"}, status=status.HTTP_200_OK)
    except Message.DoesNotExist:
        return Response({"message": "Message not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": f"Error updating message: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Razorpay Payment APIs
RAZORPAY_KEY_ID = 'rzp_test_X5OfG2jiWrAzSj'
RAZORPAY_KEY_SECRET = 'SsCovWWZSwB1TGd1rSoIiwF3'

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@api_view(['POST'])
@permission_classes([AllowAny])
def create_razorpay_order(request):
    try:
        amount = request.data.get('amount')  # Amount in paise
        currency = request.data.get('currency', 'INR')
        receipt = request.data.get('receipt')
        
        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create order on Razorpay
        order_data = {
            'amount': int(amount),
            'currency': currency,
            'receipt': receipt,
            'payment_capture': 1  # Auto capture payment
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return Response({
            'id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'receipt': order['receipt'],
            'status': order['status']
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Error creating Razorpay order: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment(request):
    try:
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        bill_id = request.data.get('bill_id')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, bill_id]):
            return Response({"error": "Missing required payment details"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify signature
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode('utf-8'),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != razorpay_signature:
            return Response({"error": "Invalid payment signature"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update bill payment status
        try:
            bill = Bill.objects.get(id=bill_id)
            bill.payment_status = 'Paid'
            bill.razorpay_order_id = razorpay_order_id
            bill.razorpay_payment_id = razorpay_payment_id
            bill.save()
            
            # Update appointment status to 'Confirmed' after successful payment
            appointment = bill.appointment
            appointment.status = 'Confirmed'
            appointment.save()
            
            return Response({
                "status": "success",
                "message": "Payment verified successfully. Appointment confirmed!",
                "bill_id": bill_id,
                "payment_id": razorpay_payment_id,
                "appointment_id": appointment.id,
                "appointment_status": "Confirmed"
            }, status=status.HTTP_200_OK)
            
        except Bill.DoesNotExist:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            "error": f"Error verifying payment: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def pay_bill(request, bill_id):
    """Simple bill payment endpoint for basic functionality"""
    try:
        bill = Bill.objects.get(id=bill_id)
        bill.payment_status = 'Paid'
        bill.save()
        
        return Response({
            "message": "Bill paid successfully",
            "bill_id": bill_id
        }, status=status.HTTP_200_OK)
        
    except Bill.DoesNotExist:
        return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"Error paying bill: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# TimeSlot Management APIs
@api_view(['POST'])
@permission_classes([AllowAny])
def create_time_slot(request):
    try:
        # Get the request data and make a mutable copy
        data = request.data.copy()
        
        # Log the incoming request data for debugging
        print("Incoming request data:", data)
        
        # Check for both doctor and doctor_id in the request
        doctor_id = data.get('doctor_id') or data.get('doctor')
        if not doctor_id:
            return Response({"error": "Doctor ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get the doctor
        from django.shortcuts import get_object_or_404
        try:
            doctor = get_object_or_404(Doctor, id=doctor_id)
        except Exception as e:
            return Response({"error": f"Invalid doctor ID: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Prepare the time slot data with the correct field names
        time_slot_data = {
            'doctor_id': str(doctor.id),  # Convert to string to match serializer expectations
            'date': data.get('date'),
            'start_time': data.get('start_time'),
            'end_time': data.get('end_time'),
            'is_available': data.get('is_available', True),
            'max_appointments': data.get('max_appointments', 1)
        }
        
        # Log the prepared data for debugging
        print("Prepared time slot data:", time_slot_data)
        
        # Validate the time slot data
        serializer = TimeSlotSerializer(data=time_slot_data)
        if not serializer.is_valid():
            # Log validation errors for debugging
            print("Validation errors:", serializer.errors)
            return Response({
                "error": "Invalid time slot data",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Check for overlapping slots
        from django.db.models import Q
        from datetime import datetime
        
        date_obj = datetime.strptime(time_slot_data['date'], '%Y-%m-%d').date()
        start_time = datetime.strptime(time_slot_data['start_time'], '%H:%M:%S').time()
        end_time = datetime.strptime(time_slot_data['end_time'], '%H:%M:%S').time()
        
        # Check for existing slots that overlap with the new one
        overlapping_slots = TimeSlot.objects.filter(
            doctor=doctor,
            date=date_obj,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        
        if overlapping_slots.exists():
            return Response({
                "error": "This time slot overlaps with an existing slot"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the time slot
        time_slot = serializer.save()
        
        return Response({
            "message": "Time slot created successfully",
            "time_slot": TimeSlotSerializer(time_slot).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        import traceback
        return Response({
            "error": f"Error creating time slot: {str(e)}",
            "trace": traceback.format_exc()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctor_time_slots(request, doctor_id):
    try:
        # Check if doctor exists
        from django.shortcuts import get_object_or_404
        from .models import Doctor, TimeSlot
        from datetime import date, datetime
        import json
        
        doctor = get_object_or_404(Doctor, id=doctor_id)
        
        # Get available slots for a specific doctor
        date_filter = request.query_params.get('date')
        
        # Only get future or today's slots that are available
        today = date.today()
        
        # Get all slots first
        slots = TimeSlot.objects.filter(
            doctor_id=doctor_id,
            date__gte=today,
            is_available=True
        )
        
        if date_filter:
            slots = slots.filter(date=date_filter)
        
        # Order by date and start time
        slots = slots.order_by('date', 'start_time')
        
        # Serialize the slots manually to handle any serialization errors
        serialized_slots = []
        for slot in slots:
            try:
                # Check if the slot is available by calling the property
                if hasattr(slot, 'is_slot_available'):
                    # Skip if the slot is not available
                    if not slot.is_slot_available:
                        continue
                
                # Manually create the slot data
                slot_data = {
                    'id': slot.id,
                    'doctor': slot.doctor_id,
                    'date': slot.date.isoformat(),
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M'),
                    'is_available': slot.is_available,
                    'max_appointments': slot.max_appointments,
                    'created_at': slot.created_at.isoformat() if slot.created_at else None,
                }
                serialized_slots.append(slot_data)
                
            except Exception as slot_error:
                print(f"Error processing slot {slot.id}: {str(slot_error)}")
                continue
        
        return Response(serialized_slots, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        error_msg = f"Error in get_doctor_time_slots: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return Response({
            "error": "Failed to fetch time slots. Please try again later.",
            "details": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_slots(request, doctor_id):
    try:
        from datetime import date
        
        # Get only available slots for booking (future dates only)
        today = date.today()
        
        slots = TimeSlot.objects.filter(
            doctor_id=doctor_id,
            date__gte=today,
            is_available=True
        ).order_by('date', 'start_time')
        
        # Filter to only truly available slots by calling the method
        available_slots = [slot for slot in slots if slot.is_slot_available()]
        
        serializer = TimeSlotSerializer(available_slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Error fetching available slots: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_time_slot(request, slot_id):
    try:
        time_slot = TimeSlot.objects.get(id=slot_id)
        serializer = TimeSlotSerializer(time_slot, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Time slot updated successfully",
                "time_slot": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except TimeSlot.DoesNotExist:
        return Response({"error": "Time slot not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"Error updating time slot: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_time_slot(request, slot_id):
    try:
        time_slot = TimeSlot.objects.get(id=slot_id)
        
        # Check if there are any confirmed appointments for this slot
        if time_slot.appointments.filter(status__in=['Pending', 'Confirmed']).exists():
            return Response({
                "error": "Cannot delete time slot with existing appointments"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        time_slot.delete()
        return Response({
            "message": "Time slot deleted successfully"
        }, status=status.HTTP_200_OK)
        
    except TimeSlot.DoesNotExist:
        return Response({"error": "Time slot not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"Error deleting time slot: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def clear_doctor_slots(request, doctor_id):
    try:
        from django.shortcuts import get_object_or_404
        from .models import TimeSlot, Doctor
        
        # Check if doctor exists
        doctor = get_object_or_404(Doctor, id=doctor_id)
        
        # Delete all future time slots for this doctor
        from datetime import date
        today = date.today()
        deleted_count, _ = TimeSlot.objects.filter(
            doctor=doctor,
            date__gte=today
        ).delete()
        
        return Response({
            "message": f"Successfully cleared {deleted_count} time slots for Dr. {doctor.name}",
            "deleted_count": deleted_count
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        print(f"Error in clear_doctor_slots: {str(e)}\n{traceback.format_exc()}")
        return Response({
            "error": f"Error clearing time slots: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Disease Prediction API using Google Gemini AI
@api_view(['POST'])
@permission_classes([AllowAny])
def predict_disease(request):
    """
    Predict disease based on user symptoms using Google Gemini AI
    """
    try:
        symptoms = request.data.get('symptoms')
        
        if not symptoms or not symptoms.strip():
            return Response({
                "error": "Symptoms are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(symptoms.strip()) < 10:
            return Response({
                "error": "Please provide more detailed information about your symptoms"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get Gemini API key from settings
        gemini_api_key = settings.GEMINI_API_KEY
        
        # Create the prompt for Gemini AI
        prompt = f"""You are an expert medical AI assistant specializing in disease diagnosis based on symptoms.

A patient has reported the following symptoms:
"{symptoms}"

Please provide a comprehensive medical analysis in the following format:

**POSSIBLE CONDITIONS:**
List 3-5 most likely diseases or medical conditions that match these symptoms, ordered by probability.

**SEVERITY ASSESSMENT:**
Rate the severity as: Mild / Moderate / Severe / Emergency

**DETAILED ANALYSIS:**
For each possible condition, briefly explain:
- Why this condition matches the symptoms
- Key distinguishing features
- Typical progression

**RECOMMENDED ACTIONS:**
1. Immediate steps the patient should take
2. Home care recommendations (if applicable)
3. When to seek medical attention

**WARNING SIGNS:**
List specific symptoms that would require immediate emergency care

**SPECIALIST RECOMMENDATION:**
Which type of doctor should the patient consult (e.g., General Physician, Cardiologist, etc.)

**IMPORTANT DISCLAIMER:**
This is an AI-generated analysis for informational purposes only. It is NOT a substitute for professional medical diagnosis. Always consult a qualified healthcare provider for accurate diagnosis and treatment."""
        
        # Prepare request to Gemini API (using Gemini 2.5 Flash model)
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={gemini_api_key}"
        
        request_body = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }
        
        # Make request to Gemini API
        response = requests.post(
            api_url,
            headers={'Content-Type': 'application/json'},
            data=json.dumps(request_body),
            timeout=30
        )
        
        if response.status_code != 200:
            error_data = response.json() if response.text else {}
            error_message = error_data.get('error', {}).get('message', 'Unknown error')
            
            if response.status_code == 400:
                return Response({
                    "error": f"Bad Request: {error_message}"
                }, status=status.HTTP_400_BAD_REQUEST)
            elif response.status_code == 403:
                return Response({
                    "error": "API Key Error: The API key is invalid or doesn't have permission"
                }, status=status.HTTP_403_FORBIDDEN)
            elif response.status_code == 404:
                return Response({
                    "error": "API endpoint not found. Model name may be incorrect"
                }, status=status.HTTP_404_NOT_FOUND)
            elif response.status_code == 429:
                return Response({
                    "error": "Rate limit exceeded. Please try again later"
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            else:
                return Response({
                    "error": f"Gemini API Error: {error_message}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Parse response
        response_data = response.json()
        
        if not response_data.get('candidates') or not response_data['candidates'][0].get('content'):
            return Response({
                "error": "Unable to generate prediction. Please try again."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        prediction_text = response_data['candidates'][0]['content']['parts'][0]['text']
        
        return Response({
            "success": True,
            "prediction": prediction_text,
            "symptoms": symptoms
        }, status=status.HTTP_200_OK)
        
    except requests.Timeout:
        return Response({
            "error": "Request timeout. Please try again."
        }, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.RequestException as e:
        return Response({
            "error": f"Network error: {str(e)}"
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        import traceback
        print(f"Disease prediction error: {str(e)}\n{traceback.format_exc()}")
        return Response({
            "error": f"Error predicting disease: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
