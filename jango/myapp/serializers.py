from rest_framework import serializers
from .models import User, Doctor, Specialization, Appointment, Prescription, Bill, Message, TimeSlot

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    # Exclude detailed user information for doctor's view
    user = serializers.SerializerMethodField()
    doctor = DoctorSerializer(read_only=True)
    
    def get_user(self, obj):
        return {'id': obj.user.id, 'name': obj.user.name}
    
    class Meta:
        model = Appointment
        fields = '__all__'


class UserAppointmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # Exclude detailed doctor information for user's view
    doctor = serializers.SerializerMethodField()
    
    def get_doctor(self, obj):
        return {'id': obj.doctor.id, 'name': obj.doctor.name, 'specialization': obj.doctor.specialization.name if obj.doctor.specialization else None}
    
    class Meta:
        model = Appointment
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), 
        source='appointment',
        write_only=True
    )
    
    class Meta:
        model = Prescription
        fields = ['id', 'appointment', 'appointment_id', 'medications', 'instructions', 'created_at', 'updated_at']


class BillSerializer(serializers.ModelSerializer):
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), 
        source='appointment',
        write_only=True
    )
    
    class Meta:
        model = Bill
        fields = ['id', 'appointment', 'appointment_id', 'consultation_fee', 'total_amount', 
                 'payment_status', 'notes', 'created_at', 'updated_at']


class TimeSlotSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), 
        source='doctor',
        write_only=True
    )
    current_bookings = serializers.ReadOnlyField()
    is_slot_available = serializers.ReadOnlyField()
    
    class Meta:
        model = TimeSlot
        fields = ['id', 'doctor', 'doctor_id', 'date', 'start_time', 'end_time', 
                 'is_available', 'max_appointments', 'current_bookings', 'is_slot_available', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_doctor = DoctorSerializer(read_only=True)
    recipient_user = UserSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)
    sender_doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), 
        source='sender_doctor',
        write_only=True
    )
    recipient_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='recipient_user',
        write_only=True
    )
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), 
        source='appointment',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Message
        fields = ['id', 'sender_doctor', 'recipient_user', 'appointment', 'sender_doctor_id', 
                 'recipient_user_id', 'appointment_id', 'subject', 'message', 'is_read', 'created_at']