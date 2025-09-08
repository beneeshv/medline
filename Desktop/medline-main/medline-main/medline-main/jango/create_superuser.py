#!/usr/bin/env python
import os
import sys
import django
from django.contrib.auth import get_user_model

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

User = get_user_model()

# Create superuser
username = 'admin'
email = 'admin@example.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created successfully!")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Password: {password}")
else:
    print(f"Superuser '{username}' already exists!")
