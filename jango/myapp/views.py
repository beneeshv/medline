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
    if username == 'admin' and password == 'admin123':
        return Response({
            "message": "Admin login successful",
            "token": "dummy-token-for-testing"
        })
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
