from rest_framework import serializers
from .models import User, Doctor, Specialization, Appointment, Prescription, Bill

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
        fields = ['id', 'appointment', 'appointment_id', 'consultation_fee', 'medication_charges', 
                 'lab_test_charges', 'other_charges', 'discount', 'tax', 'total_amount', 
                 'payment_status', 'notes', 'created_at', 'updated_at']