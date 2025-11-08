// lib/main.dart
import 'package:flutter/material.dart';
 // Corrected import path
import 'package:apk/page/home.dart'; // Corrected import path

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Login App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity, // Ensures good visual density across platforms
      ),
      // Initially, the app will open to the HomePage
      home: const HomePage(username: "Guest"), // Pass a default username for the initial view
    );
  }
}