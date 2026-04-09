'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if the current device is mobile based on screen width
 * @param {number} breakpoint - The width threshold to consider a device mobile (default: 768px)
 * @returns {boolean} - True if the device is mobile, false otherwise
 */
export function useMobile(breakpoint = 992) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') return;

    // Function to update state based on window width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
