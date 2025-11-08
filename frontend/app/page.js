"use client"; // Add this directive at the very top of the file

import React from 'react';
import Header from './components/Header';

export default function Home() {

  return (
    <main className="relative min-h-screen bg-white font-sans">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[600px] flex items-center justify-start overflow-hidden">
        {/* Background Image - Medline themed */}
        <img
          src="https://img.freepik.com/free-photo/hospital-building-modern-parking-lot_1127-3822.jpg?w=2000" // Medline themed image
          alt="Medline Building"
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--apollo-primary)]/90 via-[var(--apollo-primary)]/70 to-transparent"></div> {/* Medline gradient overlay */}

        {/* Hero Content */}
        <div className="relative z-10 text-white text-left pl-20 w-1/2">
          <h2 className="text-5xl font-extrabold mb-4 leading-tight">
            World-Class <br />
            <span className="text-[var(--apollo-light)]">Healthcare Services</span>
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Medline is committed to providing exceptional healthcare services with cutting-edge technology and compassionate care for all patients.
          </p>
          <a
            href="/user/appointment"
            className="apollo-btn-primary py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block"
          >
            Book an Appointment
          </a>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-6 bg-[var(--apollo-light)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--apollo-primary)]">Why Choose Medline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="apollo-card p-6">
              <div className="w-16 h-16 rounded-full bg-[var(--apollo-primary)]/10 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--apollo-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Expert Doctors</h3>
              <p className="text-gray-600 text-center">Our team of highly qualified and experienced medical professionals are dedicated to your health.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="apollo-card p-6">
              <div className="w-16 h-16 rounded-full bg-[var(--apollo-primary)]/10 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--apollo-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Advanced Technology</h3>
              <p className="text-gray-600 text-center">State-of-the-art medical equipment and facilities to provide the best diagnosis and treatment.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="apollo-card p-6">
              <div className="w-16 h-16 rounded-full bg-[var(--apollo-primary)]/10 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--apollo-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Patient-Centered Care</h3>
              <p className="text-gray-600 text-center">We prioritize your comfort and well-being with compassionate and personalized care.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for additional sections if any */}
      {/* <div className="py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-800">More Content Here</h2>
        <p className="mt-4 text-gray-600">This is where other sections of the website would go.</p>
      </div> */}
    </main>
  );
}
