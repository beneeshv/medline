from django.db import models

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