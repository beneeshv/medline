// lib/services/appointment_service.dart
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:apk/models/appointment.dart';

class AppointmentService {
  static const String _appointmentsKey = 'appointments';

  // Add new appointment
  static Future<void> addAppointment(Appointment appointment) async {
    final prefs = await SharedPreferences.getInstance();
    final appointments = await getAppointments();
    appointments.add(appointment);
    
    final appointmentMaps = appointments.map((a) => a.toMap()).toList();
    await prefs.setString(_appointmentsKey, jsonEncode(appointmentMaps));
  }

  // Get all appointments
  static Future<List<Appointment>> getAppointments() async {
    final prefs = await SharedPreferences.getInstance();
    final appointmentsJson = prefs.getString(_appointmentsKey);
    
    if (appointmentsJson == null) {
      return [];
    }
    
    final List<dynamic> appointmentMaps = jsonDecode(appointmentsJson);
    return appointmentMaps.map((map) => Appointment.fromMap(map)).toList();
  }

  // Delete appointment
  static Future<void> deleteAppointment(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final appointments = await getAppointments();
    appointments.removeWhere((appointment) => appointment.id == id);
    
    final appointmentMaps = appointments.map((a) => a.toMap()).toList();
    await prefs.setString(_appointmentsKey, jsonEncode(appointmentMaps));
  }

  // Update appointment status
  static Future<void> updateAppointmentStatus(String id, String status) async {
    final prefs = await SharedPreferences.getInstance();
    final appointments = await getAppointments();
    
    for (int i = 0; i < appointments.length; i++) {
      if (appointments[i].id == id) {
        appointments[i] = Appointment(
          id: appointments[i].id,
          patientName: appointments[i].patientName,
          phoneNumber: appointments[i].phoneNumber,
          doctorName: appointments[i].doctorName,
          specialty: appointments[i].specialty,
          date: appointments[i].date,
          time: appointments[i].time,
          symptoms: appointments[i].symptoms,
          status: status,
        );
        break;
      }
    }
    
    final appointmentMaps = appointments.map((a) => a.toMap()).toList();
    await prefs.setString(_appointmentsKey, jsonEncode(appointmentMaps));
  }
}
