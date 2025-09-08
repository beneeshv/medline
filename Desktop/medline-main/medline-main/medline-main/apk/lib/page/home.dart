// lib/page/home_page.dart
import 'package:flutter/material.dart';
import 'package:apk/page/login.dart'; // Keep your existing login import

class HomePage extends StatefulWidget {
  final String username;

  const HomePage({super.key, required this.username});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // Variable to control which content is currently displayed in the body
  int _selectedIndex = 0; // 0: Home, 1: Book Appointment, 2: View Appointments, 3: Doctors

  // A list of widgets to display based on the selected index
  // These are your "internal pages" within the HomePage
  List<Widget> _widgetOptions(String username) {
    return <Widget>[
      // 0: Main Home Content
      Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "hello da karadi punda , ${username}!",
              style: const TextStyle(fontSize: 50, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            const Text(
              "Your .",
              style: TextStyle(fontSize: 18, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            Image.network(
              'https://via.placeholder.com/200', // Placeholder image, replace with a relevant hospital image
              height: 150,
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                Scaffold.of(context).openDrawer(); // Open the drawer programmatically
              },
              icon: const Icon(Icons.menu),
              label: const Text("Explore Services"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                textStyle: const TextStyle(fontSize: 18),
              ),
            ),
          ],
        ),
      ),
      // 1: Book Appointment Content
      const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Book Your Appointment",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(
              "Use this section to schedule your visit.",
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            // You can add your appointment booking form elements here
            // Example: TextField for date, time, doctor selection etc.
          ],
        ),
      ),
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
              selected: _selectedIndex == 1,
              onTap: () => _onItemTapped(1),
            ),
            ListTile(
              leading: const Icon(Icons.list_alt),
              title: const Text('View Appointments'),
              selected: _selectedIndex == 2,
              onTap: () => _onItemTapped(2),
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