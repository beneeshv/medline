// lib/page/book_appointment.dart
import 'package:flutter/material.dart';
import 'package:apk/models/appointment.dart';
import 'package:apk/services/appointment_service.dart';

class BookAppointmentPage extends StatefulWidget {
  const BookAppointmentPage({super.key});

  @override
  State<BookAppointmentPage> createState() => _BookAppointmentPageState();
}

class _BookAppointmentPageState extends State<BookAppointmentPage> {
  // Form controllers and variables
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _symptomsController = TextEditingController();
  
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  String? _selectedDoctor;
  String? _selectedSpecialty;
  
  // Sample doctors data
  final Map<String, List<String>> _doctorsBySpecialty = {
    'Cardiology': ['Dr. John Smith', 'Dr. Sarah Wilson'],
    'Neurology': ['Dr. Michael Chen', 'Dr. Lisa Anderson'],
    'Pediatrics': ['Dr. David Brown', 'Dr. Emily Davis'],
    'Orthopedics': ['Dr. Robert Johnson', 'Dr. Maria Garcia'],
    'Dermatology': ['Dr. James Miller', 'Dr. Jennifer Taylor'],
  };

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _symptomsController.dispose();
    super.dispose();
  }

  // Date picker function
  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF1565C0),
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  // Time picker function
  Future<void> _selectTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: const TimeOfDay(hour: 9, minute: 0),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF1565C0),
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  // Book appointment function
  void _bookAppointment() async {
    if (_formKey.currentState!.validate()) {
      // Validate date and time selection
      if (_selectedDate == null) {
        _showSnackBar('Please select an appointment date', Colors.red);
        return;
      }
      if (_selectedTime == null) {
        _showSnackBar('Please select an appointment time', Colors.red);
        return;
      }

      // Create appointment object
      final appointment = Appointment(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        patientName: _nameController.text,
        phoneNumber: _phoneController.text,
        doctorName: _selectedDoctor!,
        specialty: _selectedSpecialty!,
        date: _selectedDate!,
        time: _selectedTime!,
        symptoms: _symptomsController.text,
        status: 'Confirmed',
      );

      // Save appointment
      await AppointmentService.addAppointment(appointment);

      // Show confirmation and navigate back
      _showAppointmentConfirmation(appointment);
    }
  }

  // Show appointment confirmation dialog
  void _showAppointmentConfirmation(Appointment appointment) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: Color(0xFF4CAF50), size: 32),
              SizedBox(width: 12),
              Text(
                'Appointment Booked!',
                style: TextStyle(
                  color: Color(0xFF4CAF50),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Your appointment has been successfully scheduled.',
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F5F5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildConfirmationRow('Patient:', appointment.patientName),
                    _buildConfirmationRow('Doctor:', appointment.doctorName),
                    _buildConfirmationRow('Specialty:', appointment.specialty),
                    _buildConfirmationRow(
                      'Date:', 
                      "${appointment.date.day}/${appointment.date.month}/${appointment.date.year}"
                    ),
                    _buildConfirmationRow(
                      'Time:', 
                      appointment.time.format(context)
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'You will receive a confirmation SMS shortly.',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop(); // Go back to home page
              },
              child: const Text(
                'OK',
                style: TextStyle(
                  color: Color(0xFF1565C0),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  // Helper method to build confirmation rows
  Widget _buildConfirmationRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Show snackbar helper
  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Book Appointment'),
        backgroundColor: const Color(0xFF1565C0),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1565C0), Color(0xFF0D47A1)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Column(
                  children: [
                    Icon(Icons.calendar_today, color: Colors.white, size: 48),
                    SizedBox(height: 16),
                    Text(
                      "Book Your Appointment",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      "Schedule your visit with our expert doctors",
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Patient Information
              const Text(
                "Patient Information",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1565C0),
                ),
              ),
              const SizedBox(height: 16),
              
              // Name Field
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: "Full Name",
                  prefixIcon: const Icon(Icons.person),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF1565C0), width: 2),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your full name';
                  }
                  return null;
                },
              ),
              
              const SizedBox(height: 16),
              
              // Phone Field
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: "Phone Number",
                  prefixIcon: const Icon(Icons.phone),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF1565C0), width: 2),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your phone number';
                  }
                  return null;
                },
              ),
              
              const SizedBox(height: 32),
              
              // Appointment Details
              const Text(
                "Appointment Details",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1565C0),
                ),
              ),
              const SizedBox(height: 16),
              
              // Specialty Dropdown
              DropdownButtonFormField<String>(
                value: _selectedSpecialty,
                decoration: InputDecoration(
                  labelText: "Select Specialty",
                  prefixIcon: const Icon(Icons.medical_services),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF1565C0), width: 2),
                  ),
                ),
                items: _doctorsBySpecialty.keys.map((String specialty) {
                  return DropdownMenuItem<String>(
                    value: specialty,
                    child: Text(specialty),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedSpecialty = newValue;
                    _selectedDoctor = null; // Reset doctor selection
                  });
                },
                validator: (value) {
                  if (value == null) {
                    return 'Please select a specialty';
                  }
                  return null;
                },
              ),
              
              const SizedBox(height: 16),
              
              // Doctor Dropdown
              DropdownButtonFormField<String>(
                value: _selectedDoctor,
                decoration: InputDecoration(
                  labelText: "Select Doctor",
                  prefixIcon: const Icon(Icons.person_outline),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF1565C0), width: 2),
                  ),
                ),
                items: _selectedSpecialty != null
                    ? _doctorsBySpecialty[_selectedSpecialty]!.map((String doctor) {
                        return DropdownMenuItem<String>(
                          value: doctor,
                          child: Text(doctor),
                        );
                      }).toList()
                    : [],
                onChanged: _selectedSpecialty != null
                    ? (String? newValue) {
                        setState(() {
                          _selectedDoctor = newValue;
                        });
                      }
                    : null,
                validator: (value) {
                  if (value == null) {
                    return 'Please select a doctor';
                  }
                  return null;
                },
              ),
              
              const SizedBox(height: 16),
              
              // Date and Time Selection
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: _selectDate,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_today, color: Color(0xFF1565C0)),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Date",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
                                  ),
                                ),
                                Text(
                                  _selectedDate != null
                                      ? "${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}"
                                      : "Select Date",
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: InkWell(
                      onTap: _selectTime,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.access_time, color: Color(0xFF1565C0)),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Time",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
                                  ),
                                ),
                                Text(
                                  _selectedTime != null
                                      ? _selectedTime!.format(context)
                                      : "Select Time",
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Symptoms Field
              TextFormField(
                controller: _symptomsController,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: "Symptoms / Reason for Visit",
                  prefixIcon: const Icon(Icons.description),
                  alignLabelWithHint: true,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF1565C0), width: 2),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please describe your symptoms or reason for visit';
                  }
                  return null;
                },
              ),
              
              const SizedBox(height: 32),
              
              // Book Appointment Button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _bookAppointment,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1565C0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    "Book Appointment",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
