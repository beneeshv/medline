from django.db import models
from decimal import Decimal

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
        return self.name


class Specialization(models.Model):
    name = models.CharField(max_length=100, unique=True)  # e.g., "Cardiology", "Neurology"

    def __str__(self):
        return self.name


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
        return self.name
    

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
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
