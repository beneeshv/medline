from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('flutter-login/', views.flutter_login),
    path('api/adminlogin/', views.admin_login, name='admin_login'),
    path('api/dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('specializations/', views.get_specializations),
    path('add-doctor/', views.add_doctor),
    path('api/doctor/login/', views.doctor_login),
    path('api/doctors/', views.DoctorListAPIView.as_view(), name='doctor_list'),
    path('api/doctors/<int:pk>/', views.DoctorDetailView.as_view(), name='doctor_detail'),
    
    # Appointment endpoints
    path('appointments/book/', views.book_appointment, name='book_appointment'),
    path('appointments/user/<int:user_id>/', views.get_user_appointments, name='user_appointments'),
    path('appointments/doctor/<int:doctor_id>/', views.get_doctor_appointments, name='doctor_appointments'),
    path('appointments/<int:appointment_id>/status/', views.update_appointment_status, name='update_appointment_status'),
    
    # Prescription endpoints
    path('api/prescriptions/create/', views.create_prescription, name='create_prescription'),
    path('api/prescriptions/appointment/<int:appointment_id>/', views.get_appointment_prescription, name='appointment_prescription'),
    path('api/prescriptions/user/<int:user_id>/', views.get_user_prescriptions, name='user_prescriptions'),
    
    # Bill endpoints
    path('api/bills/create/', views.create_bill, name='create_bill'),
    path('api/bills/appointment/<int:appointment_id>/', views.get_appointment_bill, name='appointment_bill'),
    path('api/bills/user/<int:user_id>/', views.get_user_bills, name='user_bills'),
    path('api/users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Message endpoints
    path('api/messages/send/', views.send_message, name='send_message'),
    path('api/messages/user/<int:user_id>/', views.get_user_messages, name='user_messages'),
    path('api/messages/doctor/<int:doctor_id>/', views.get_doctor_sent_messages, name='doctor_sent_messages'),
    path('api/messages/<int:message_id>/read/', views.mark_message_read, name='mark_message_read'),
]
