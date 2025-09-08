from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password, check_password

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
from .models import Doctor, Specialization
from .serializers import DoctorSerializer, SpecializationSerializer

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
        date = request.data.get('date')
        time = request.data.get('time')
        symptoms = request.data.get('symptoms', '')
        
        # Validate required fields
        if not all([user_id, doctor_id, date, time]):
            return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if user and doctor exist
        try:
            user = User.objects.get(id=user_id)
            doctor = Doctor.objects.get(id=doctor_id)
        except (User.DoesNotExist, Doctor.DoesNotExist):
            return Response({"message": "User or doctor not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Create appointment
        appointment = Appointment.objects.create(
            user=user,
            doctor=doctor,
            date=date,
            time=time,
            symptoms=symptoms,
            status='Pending'
        )
        
        serializer = AppointmentSerializer(appointment)
        return Response({
            "message": "Appointment booked successfully",
            "appointment": serializer.data
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
        
        # Create prescription
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
def get_user_messages(request, user_id):
    try:
        messages = Message.objects.filter(recipient_user_id=user_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": f"Error fetching messages: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctor_sent_messages(request, doctor_id):
    try:
        messages = Message.objects.filter(sender_doctor_id=doctor_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": f"Error fetching sent messages: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
