'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load performance
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
          }
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime, 'ms');
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime, 'ms');
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] });

      // Monitor cumulative layout shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('CLS:', clsValue);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        observer.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
