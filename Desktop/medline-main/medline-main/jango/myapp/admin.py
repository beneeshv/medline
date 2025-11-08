from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User,Doctor,Specialization,Appointment

admin.site.register(User)
admin.site.register(Doctor)
admin.site.register(Specialization)
admin.site.register(Appointment)