from myapp.models import Doctor, Specialization
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

# Create specializations
specializations = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics'
]

for spec_name in specializations:
    Specialization.objects.get_or_create(name=spec_name)

# Get specialization objects
s1 = Specialization.objects.get(name='Cardiology')
s2 = Specialization.objects.get(name='Neurology')
s3 = Specialization.objects.get(name='Pediatrics')
s4 = Specialization.objects.get(name='Orthopedics')

# Create doctors
doctors_data = [
    {
        'name': 'Dr. John Smith',
        'specialization': s1,
        'email': 'john.smith@apollo.com',
        'number': '+91 98765 43210',
        'description': 'Experienced cardiologist with 15 years of practice',
        'availability': '{"Monday": ["9:00 AM", "10:00 AM", "11:00 AM"], "Wednesday": ["2:00 PM", "3:00 PM", "4:00 PM"]}'
    },
    {
        'name': 'Dr. Sarah Johnson',
        'specialization': s2,
        'email': 'sarah.johnson@apollo.com',
        'number': '+91 87654 32109',
        'description': 'Specialist in neurological disorders',
        'availability': '{"Tuesday": ["10:00 AM", "11:00 AM"], "Thursday": ["3:00 PM", "4:00 PM"]}'
    },
    {
        'name': 'Dr. Michael Chen',
        'specialization': s3,
        'email': 'michael.chen@apollo.com',
        'number': '+91 76543 21098',
        'description': 'Caring pediatrician for children of all ages',
        'availability': '{"Monday": ["9:00 AM", "10:00 AM"], "Friday": ["2:00 PM", "3:00 PM"]}'
    },
    {
        'name': 'Dr. Priya Sharma',
        'specialization': s4,
        'email': 'priya.sharma@apollo.com',
        'number': '+91 65432 10987',
        'description': 'Orthopedic surgeon specializing in sports injuries',
        'availability': '{"Wednesday": ["9:00 AM", "10:00 AM"], "Friday": ["1:00 PM", "2:00 PM"]}'
    }
]

# Create doctor objects
for doctor_data in doctors_data:
    # Check if doctor with this email already exists
    if not Doctor.objects.filter(email=doctor_data['email']).exists():
        Doctor.objects.create(**doctor_data)
        print(f"Created doctor: {doctor_data['name']}")
    else:
        print(f"Doctor with email {doctor_data['email']} already exists")

print("\nAll doctors created successfully!")
print(f"Total doctors in database: {Doctor.objects.count()}")