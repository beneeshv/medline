from django.urls import path
from . import views
from .views_availability import update_doctor_availability, get_doctor_availability

# Add the generate_time_slots view import
# Note: This would need to be implemented in views_availability.py or a new views file
# For now, we'll add a placeholder comment

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('flutter-login/', views.flutter_login),
    path('api/adminlogin/', views.admin_login, name='admin_login'),
    path('api/dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('specializations/', views.get_specializations),
    path('add-doctor/', views.add_doctor),
    path('api/doctor/login/', views.doctor_login),
    path('api/doctors/', views.DoctorListAPIView.as_view(), name='doctor-list'),
    path('api/doctors/<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('api/specializations/', views.SpecializationListAPIView.as_view(), name='specialization-list'),
    path('api/users/', views.UserListAPIView.as_view(), name='user_list'),
    path('api/users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Appointment endpoints
    path('appointments/book/', views.book_appointment, name='book_appointment'),
    path('api/appointments/create/', views.book_appointment, name='create_appointment'),  # Alternative endpoint
    path('api/user/<int:user_id>/appointments/', views.get_user_appointments, name='user_appointments'),
    path('api/doctor/<int:doctor_id>/appointments/', views.get_doctor_appointments, name='doctor_appointments'),
    path('appointments/<int:appointment_id>/status/', views.update_appointment_status, name='update_appointment_status'),
    
    # Prescription endpoints
    path('api/prescriptions/create/', views.create_prescription, name='create_prescription'),
    path('api/prescriptions/appointment/<int:appointment_id>/', views.get_appointment_prescription, name='appointment_prescription'),
    path('api/prescriptions/user/<int:user_id>/', views.get_user_prescriptions, name='user_prescriptions'),
    
    # Bill endpoints
    path('api/bills/create/', views.create_bill, name='create_bill'),
    path('api/bills/appointment/<int:appointment_id>/', views.get_appointment_bill, name='appointment_bill'),
    path('api/bills/user/<int:user_id>/', views.get_user_bills, name='user_bills'),
    
    # Message endpoints
    path('api/messages/send/', views.send_message, name='send_message'),
    path('api/messages/doctor/<int:doctor_id>/', views.get_doctor_messages, name='doctor_messages'),
    path('api/messages/', views.get_messages, name='get_messages'),
    path('api/messages/<int:message_id>/read/', views.mark_message_read, name='mark_message_read'),
    
    # Razorpay Payment endpoints
    path('api/create-razorpay-order/', views.create_razorpay_order, name='create_razorpay_order'),
    path('api/verify-payment/', views.verify_payment, name='verify_payment'),
    path('api/bills/<int:bill_id>/pay/', views.pay_bill, name='pay_bill'),
    
    # TimeSlot endpoints
    path('api/timeslots/create/', views.create_time_slot, name='create_time_slot'),
    path('api/doctor/<int:doctor_id>/timeslots/', views.get_doctor_time_slots, name='doctor_time_slots'),
    path('api/doctor/<int:doctor_id>/available-slots/', views.get_available_slots, name='available_slots'),
    path('api/timeslots/<int:slot_id>/update/', views.update_time_slot, name='update_time_slot'),
    path('api/timeslots/<int:slot_id>/delete/', views.delete_time_slot, name='delete_time_slot'),
    path('api/doctor/<int:doctor_id>/clear-slots/', views.clear_doctor_slots, name='clear_doctor_slots'),
    
    # Doctor Availability endpoints
    path('api/doctors/<int:doctor_id>/availability/', update_doctor_availability, name='update_doctor_availability'),
    path('api/doctors/<int:doctor_id>/get-availability/', get_doctor_availability, name='get_doctor_availability'),
    
    # Doctor Time Slot Generation endpoint
    # Note: This endpoint needs to be implemented in views
    # path('api/doctor/<int:doctor_id>/generate-slots/', views.generate_doctor_time_slots, name='generate_doctor_time_slots'),
    
    # Disease Prediction endpoint
    path('api/disease-prediction/', views.predict_disease, name='predict_disease'),
]