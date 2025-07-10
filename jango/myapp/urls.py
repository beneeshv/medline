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
]
