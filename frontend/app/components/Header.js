"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in by looking for userId in localStorage
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    
    // Redirect to home page
    window.location.href = '/';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="apollo-gradient text-white text-xs py-2 px-6 flex justify-between items-center">
        <span>Medline - Excellence in Healthcare</span>
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Emergency Line - 1800-103-1066
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Apollo Hospital Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[var(--apollo-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <Link href="/" className="text-[var(--apollo-primary)] text-2xl font-bold">Medline Hospital</Link>
        </div>
        <ul className="flex space-x-8 text-gray-700 font-medium items-center">
          <li>
            <Link href="/" className="text-[var(--apollo-primary)] border-b-2 border-[var(--apollo-primary)] pb-1">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/user/doctor_details" className="hover:text-[var(--apollo-primary)]">
              DOCTORS
            </Link>
          </li>
          <li>
            <Link href="/user/appointment" className="hover:text-[var(--apollo-primary)]">
              APPOINTMENTS
            </Link>
          </li>
          <li>
            <Link href="/user/prescriptions" className="hover:text-[var(--apollo-primary)]">
              PRESCRIPTIONS
            </Link>
          </li>
          <li>
            <Link href="/disease-prediction" className="hover:text-[var(--apollo-primary)]">
              FIND DISEASE
            </Link>
          </li>
          <li>
            <Link href="/user/account" className="hover:text-[var(--apollo-primary)]">
              ACCOUNT
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-[var(--apollo-primary)]">
              CONTACT US
            </Link>
          </li>
          {/* Conditional rendering for Login/Logout button */}
          <li className="ml-8">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="apollo-btn-primary py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}