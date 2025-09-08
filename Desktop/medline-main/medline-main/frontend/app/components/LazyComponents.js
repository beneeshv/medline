'use client';

import { lazy, Suspense } from 'react';

// Lazy load heavy components
export const LazyDoctorPrescriptions = lazy(() => import('../doctor/prescriptions/page'));
export const LazyDashboard = lazy(() => import('../dashboard/page'));
export const LazyUserProfile = lazy(() => import('../user/profile/page'));

// Loading component for better UX
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    <span className="ml-3 text-teal-600">Loading...</span>
  </div>
);

// Wrapper component for lazy loading with error boundary
export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);
