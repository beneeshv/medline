from django.db import models
from decimal import Decimal
import json
from datetime import datetime, date, time

class User(models.Model):
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    location = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    description = models.TextField(blank=True)  # Optional
    image = models.ImageField(upload_to='user_images/', blank=True, null=True)  # 👈 New image field

    def __str__(self):
        return str(self.name)


class Specialization(models.Model):
    name = models.CharField(max_length=100, unique=True)  # e.g., "Cardiology", "Neurology"

    def __str__(self):
        return str(self.name)


class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True, blank=True)  # Link to specialization
    email = models.EmailField(unique=True)
    number = models.CharField(max_length=15)
    password = models.CharField(max_length=100, null=True, blank=True)  # Making password nullable initially
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='doctor_images/', blank=True, null=True)
    availability = models.TextField(blank=True, help_text="JSON format for availability.  Example: '{\"Monday\": [\"9:00\", \"10:00\", \"11:00\"], \"Tuesday\": [\"14:00\", \"15:00\"]}'") # Store availability as JSON

    def __str__(self):
        return str(self.name)
    

class TimeSlot(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='time_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    max_appointments = models.PositiveIntegerField(default=1)  # Usually 1 for exclusive slots
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('doctor', 'date', 'start_time')
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"Dr. {self.doctor.name} - {self.date} {self.start_time}-{self.end_time}"
    
    @property
    def current_bookings(self):
        # Use the related_name to access appointments
        try:
            return self.appointments.filter(status__in=['Pending', 'Confirmed']).count()
        except:
            return 0
    
    @property
    def is_slot_available(self):
        return self.is_available and self.current_bookings < self.max_appointments and self.is_within_doctor_availability()
    
    def is_within_doctor_availability(self):
        """Check if this time slot is within the doctor's defined availability."""
        # Access doctor availability using getattr to avoid attribute errors
        doctor_availability = getattr(self.doctor, 'availability', None)
        if not doctor_availability:
            return True  # If no availability is set, allow any time slot
            
        try:
            # Get the day of the week (0=Monday, 6=Sunday)
            # Convert date to datetime.date if it's not already
            try:
                # Try to get weekday directly
                day_of_week = self.date.weekday()
            except AttributeError:
                # If it's a string, convert it to date first
                if isinstance(self.date, str):
                    date_obj = datetime.strptime(self.date, '%Y-%m-%d').date()
                    day_of_week = date_obj.weekday()
                else:
                    # Assume it's already a date object
                    day_of_week = self.date.weekday()
                    
            days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            day_name = days[day_of_week]
            
            # Get doctor's availability for this day
            availability = doctor_availability
            if isinstance(availability, str):
                availability = json.loads(availability)
                
            # Handle case where availability might be None
            if availability is None:
                return True
                
            day_availability = availability.get(day_name, {})
            
            # If doctor is not available on this day, return False
            if not day_availability.get('available', False):
                return False
                
            # Convert times to minutes since midnight for comparison
            def time_to_minutes(time_str):
                if isinstance(time_str, str):
                    hours, minutes = map(int, time_str.split(':'))
                    return hours * 60 + minutes
                return time_str.hour * 60 + time_str.minute
                
            start_minutes = time_to_minutes(self.start_time)
            end_minutes = time_to_minutes(self.end_time)
            
            # Parse doctor's working hours
            work_start = day_availability.get('startTime', '09:00')
            work_end = day_availability.get('endTime', '17:00')
            work_start_min = time_to_minutes(work_start)
            work_end_min = time_to_minutes(work_end)
            
            # Parse break time if exists
            break_start = day_availability.get('breakStart', '12:00')
            break_end = day_availability.get('breakEnd', '13:00')
            break_start_min = time_to_minutes(break_start)
            break_end_min = time_to_minutes(break_end)
            
            # Check if slot is within working hours and not during break
            is_during_work = (start_minutes >= work_start_min and 
                            end_minutes <= work_end_min)
                            
            is_during_break = (start_minutes >= break_start_min and 
                             end_minutes <= break_end_min)
            
            return is_during_work and not is_during_break
            
        except (json.JSONDecodeError, KeyError, ValueError, AttributeError) as e:
            print(f"Error checking doctor availability: {e}")
            return True  # If there's an error, allow the slot but log it


class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='appointments', null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled')
    ], default='Pending')
    symptoms = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.name} with Dr. {self.doctor.name} on {self.date} at {self.time}"
    
    class Meta:
        # Prevent double booking of the same slot
        unique_together = ('time_slot', 'status')
        constraints = [
            models.UniqueConstraint(
                fields=['time_slot'],
                condition=models.Q(status__in=['Pending', 'Confirmed']),
                name='unique_active_appointment_per_slot'
            )
        ]


class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    medications = models.TextField(help_text="List of medications with dosage and instructions")
    instructions = models.TextField(help_text="General instructions for the patient")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Prescription for {self.appointment}"


class Bill(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='bill')
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True) # Set to blank=True
    payment_status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Partially Paid', 'Partially Paid'),
        ('Cancelled', 'Cancelled')
    ], default='Pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Bill for {self.appointment} - {self.total_amount}"
    
    def save(self, *args, **kwargs):
        # The total amount is now just the consultation fee
        self.total_amount = self.consultation_fee
        super().save(*args, **kwargs)


class Message(models.Model):
    sender_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='sent_messages')
    recipient_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from Dr. {self.sender_doctor.name} to {self.recipient_user.name}: {self.subject}"