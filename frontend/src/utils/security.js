import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to handle session timeout after inactivity
 * @param {number} timeout - Timeout in milliseconds (default: 30 minutes)
 */
export const useSessionTimeout = (timeout = 30 * 60 * 1000) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Logout user
      localStorage.clear();
      navigate('/login');
      alert('Your session has expired due to inactivity. Please login again.');
    }, timeout);
  };

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Reset timeout on any activity
    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Initial timeout
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeout]);
};

/**
 * Token refresh utility
 * Checks token expiry and refreshes if needed
 */
export const setupTokenRefresh = () => {
  // Check token every 5 minutes
  setInterval(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Decode JWT to check expiry (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();

      // If token expires in less than 10 minutes, refresh it
      if (exp - now < 10 * 60 * 1000) {
        // In a real app, call refresh token endpoint here
        console.log('Token nearing expiry, should refresh');
      }
    } catch (error) {
      console.error('Error checking token expiry:', error);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};
