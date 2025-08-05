"use client"; // Add this directive at the very top of the file

import React, { useState } from 'react';
// Removed: import { useRouter } from 'next/router'; // Changed import from 'next/navigation' to 'next/router'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  // Removed: const router = useRouter(); // Initialize router

  // Function to handle login (now navigates to a login page using window.location)
  const handleLogin = () => {
    console.log('Navigating to login page...');
    window.location.href = '/login'; // Navigate to the login page using direct window.location

    // Optional: You could still keep a simulated successful login if you want
    // this button to also trigger a state change AFTER navigation (e.g.,
    // if the /login page redirects back here on success).
    // For simplicity, we'll assume the /login page handles setting the login state
    // upon successful authentication and potentially redirects back or to a dashboard.
    // For this example, we'll keep the direct state change for demonstration
    // if the /login route is not fully implemented yet.
    // If '/login' is a placeholder and you want to simulate login on THIS page:
    setTimeout(() => {
      setIsLoggedIn(true);
      console.log('User logged in! (simulated after navigation to /login)');
    }, 1000);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log('User logged out!');
    // In a real application, you would clear user session data (e.g., remove token)
    // and potentially redirect to home or login page
    window.location.href = '/'; // Redirect to home page after logout using direct window.location
  };

  return (
    <main className="relative min-h-screen bg-white font-sans">
      {/* Top Bar */}
      <div className="bg-medixBlue text-white text-xs py-2 px-6 flex justify-between items-center">
        <span>Medline Healthcare Come to Expect the Best In Town</span>
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8l2-2m0 0l2-2m-2 2l-2-2M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Emergency Line -(001) 321-125-152
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Placeholder for Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-medixBlue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m0 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
            />
          </svg>
          <span className="text-gray-800 text-2xl font-bold">Medline</span>
        </div>
        <ul className="flex space-x-8 text-gray-700 font-medium items-center"> {/* Added items-center for vertical alignment */}
          <li>
            <a href="#" className="text-medixBlue border-b-2 border-medixBlue pb-1">
              HOME
            </a>
          </li>
          <li>
            <a href="/user/doctor_details" className="hover:text-medixBlue">
              DOCTOR
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-medixBlue">
              PAGES
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-medixBlue">
              GALLERY
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-medixBlue">
              BLOG
            </a>
          </li>
          <li>
            <a href="/user/appointment" className="hover:text-medixBlue">
              APPOINTMENT
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-medixBlue">
              CONTACT US
            </a>
          </li>
          {/* Conditional rendering for Login/Logout button */}
          <li className="ml-8"> {/* Add margin-left to separate from other links */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin} // This now navigates to /login
                className="bg-medixBlue hover:bg-medixDarkBlue text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[600px] flex items-center justify-start overflow-hidden">
        {/* Background Image - You'll need to find a suitable medical image or use a placeholder */}
        <img
          src="https://img.freepik.com/premium-photo/doctor-holding-heart-his-hand_218381-12069.jpg?w=2000" // Placeholder for a medical image
          alt="Doctor with tablet"
          className="absolute inset-0 w-full h-full object-cover object-right" // object-right to mimic the image
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div> {/* Gradient overlay */}

        {/* Hero Content */}
        <div className="relative z-10 text-gray-800 text-left pl-20 w-1/2">
          <h2 className="text-5xl font-extrabold mb-4 leading-tight">
            Medical Services <br />
            <span className="text-medixBlue">That you can Trust</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
          </p>
          <a
            href="/appointment"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            style={{
              position: 'absolute', // To place it at the bottom-right of the text block
              bottom: '-80px',     // Adjust as needed
              left: '0',
              marginLeft: '20px' // Offset from the left to match the image's "Make an appointment" button
            }}
          >
            Make an appointment
          </a>
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
