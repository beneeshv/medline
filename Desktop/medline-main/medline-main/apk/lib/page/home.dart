// lib/page/home_page.dart
import 'package:flutter/material.dart';
import 'package:apk/page/login.dart'; // Keep your existing login import
import 'package:apk/page/book_appointment.dart';
import 'package:apk/page/view_appointments.dart';

class HomePage extends StatefulWidget {
  final String username;

  const HomePage({super.key, required this.username});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // Variable to control which content is currently displayed in the body
  int _selectedIndex = 0; // 0: Home, 1: Book Appointment, 2: View Appointments, 3: Doctors
  
  // Appointment booking form controllers and variables
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

  // A list of widgets to display based on the selected index
  // These are your "internal pages" within the HomePage
  List<Widget> _widgetOptions(String username) {
    return <Widget>[
      // 0: Main Home Content - Apollo Hospital Theme
      SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF1565C0), Color(0xFF0D47A1)],
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    Text(
                      "Welcome to Apollo Hospital, $username!",
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Your health is our priority. Experience world-class healthcare with compassionate care.",
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white70,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withOpacity(0.2)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.local_hospital, color: Colors.white, size: 32),
                          SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "24/7 Emergency Care",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  "Always here when you need us",
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
            
            // Quick Services Section
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Quick Services",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1565C0),
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.2,
                    children: [
                      _buildServiceCard(
                        icon: Icons.calendar_today,
                        title: "Book Appointment",
                        subtitle: "Schedule your visit",
                        color: const Color(0xFF4CAF50),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const BookAppointmentPage(),
                            ),
                          );
                        },
                      ),
                      _buildServiceCard(
                        icon: Icons.people,
                        title: "Our Doctors",
                        subtitle: "Meet our specialists",
                        color: const Color(0xFF2196F3),
                        onTap: () => _onItemTapped(3),
                      ),
                      _buildServiceCard(
                        icon: Icons.list_alt,
                        title: "My Appointments",
                        subtitle: "View scheduled visits",
                        color: const Color(0xFFFF9800),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ViewAppointmentsPage(),
                            ),
                          );
                        },
                      ),
                      _buildServiceCard(
                        icon: Icons.emergency,
                        title: "Emergency",
                        subtitle: "24/7 urgent care",
                        color: const Color(0xFFF44336),
                        onTap: () {},
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Health Tips Section
                  const Text(
                    "Health Tips",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1565C0),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFE3F2FD), Color(0xFFBBDEFB)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.lightbulb, color: Color(0xFF1565C0), size: 28),
                            SizedBox(width: 12),
                            Text(
                              "Today's Health Tip",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1565C0),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        Text(
                          "Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and boost your immune system.",
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFF424242),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      // 1: Book Appointment Content
      _buildBookAppointmentPage(),
      // 2: View Appointments Content
      const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Your Scheduled Appointments",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(
              "This will display a list of your upcoming appointments.",
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            // Example: ListView.builder to show appointment list
          ],
        ),
      ),
      // 3: Doctors Content
      const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Meet Our Doctors",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(
              "Browse our specialists and their profiles.",
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            // Example: GridView or ListView to display doctor cards
          ],
        ),
      ),
    ];
  }

  // Book Appointment Page
  Widget _buildBookAppointmentPage() {
    return SingleChildScrollView(
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
    );
  }

  // Helper method to build service cards
  Widget _buildServiceCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.1),
                color.withOpacity(0.05),
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 32),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
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
  void _bookAppointment() {
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

      // Here you would typically send the data to your backend API
      // For now, we'll just show a success message
      _showAppointmentConfirmation();
    }
  }

  // Show appointment confirmation dialog
  void _showAppointmentConfirmation() {
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
                    _buildConfirmationRow('Patient:', _nameController.text),
                    _buildConfirmationRow('Doctor:', _selectedDoctor ?? ''),
                    _buildConfirmationRow('Specialty:', _selectedSpecialty ?? ''),
                    _buildConfirmationRow(
                      'Date:', 
                      _selectedDate != null 
                        ? "${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}"
                        : ''
                    ),
                    _buildConfirmationRow(
                      'Time:', 
                      _selectedTime != null 
                        ? _selectedTime!.format(context)
                        : ''
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
                _resetForm();
                _onItemTapped(0); // Go back to home
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

  // Reset form after booking
  void _resetForm() {
    _formKey.currentState?.reset();
    _nameController.clear();
    _phoneController.clear();
    _symptomsController.clear();
    setState(() {
      _selectedDate = null;
      _selectedTime = null;
      _selectedDoctor = null;
      _selectedSpecialty = null;
    });
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

  // Function to update the selected index and rebuild the UI
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    Navigator.pop(context); // Close the drawer after selection
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Apollo Hospital"),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton(
              onPressed: () {
                // Navigate to the LoginPage
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Theme.of(context).primaryColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              child: const Text(
                "Login",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Apollo Hospital Services',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Welcome, ${widget.username}!', // Access username via widget.username
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('Home'),
              selected: _selectedIndex == 0,
              onTap: () => _onItemTapped(0),
            ),
            ListTile(
              leading: const Icon(Icons.calendar_today),
              title: const Text('Book Appointment'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const BookAppointmentPage(),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.list_alt),
              title: const Text('View Appointments'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ViewAppointmentsPage(),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.people),
              title: const Text('Our Doctors'),
              selected: _selectedIndex == 3,
              onTap: () => _onItemTapped(3),
            ),
          ],
        ),
      ),
      // The body now dynamically displays content based on _selectedIndex
      body: _widgetOptions(widget.username).elementAt(_selectedIndex),
    );
  }
}