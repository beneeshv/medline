// lib/models/appointment.dart
import 'package:flutter/material.dart';

class Appointment {
  final String id;
  final String patientName;
  final String phoneNumber;
  final String doctorName;
  final String specialty;
  final DateTime date;
  final TimeOfDay time;
  final String symptoms;
  final String status;

  Appointment({
    required this.id,
    required this.patientName,
    required this.phoneNumber,
    required this.doctorName,
    required this.specialty,
    required this.date,
    required this.time,
    required this.symptoms,
    required this.status,
  });

  // Convert to Map for storage
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'patientName': patientName,
      'phoneNumber': phoneNumber,
      'doctorName': doctorName,
      'specialty': specialty,
      'date': date.toIso8601String(),
      'timeHour': time.hour,
      'timeMinute': time.minute,
      'symptoms': symptoms,
      'status': status,
    };
  }

  // Create from Map
  factory Appointment.fromMap(Map<String, dynamic> map) {
    return Appointment(
      id: map['id'],
      patientName: map['patientName'],
      phoneNumber: map['phoneNumber'],
      doctorName: map['doctorName'],
      specialty: map['specialty'],
      date: DateTime.parse(map['date']),
      time: TimeOfDay(hour: map['timeHour'], minute: map['timeMinute']),
      symptoms: map['symptoms'],
      status: map['status'],
    );
  }
}
