import { useState, useEffect } from 'react';
import { User } from '@/interface/user.interface';

/**
 * Custom hook for managing user session state.
 *
 * This hook provides access to the current user session stored in sessionStorage.
 * It also offers utilities to clear the session and check authentication status.
 *
 * @returns {Object} The session state and utilities:
 * - session: The current user session object or null if not authenticated.
 * - isLoading: Boolean indicating if the session loading is in progress.
 * - clearSession: Function to clear the current session.
 * - isAuthenticated: Boolean indicating if the user is authenticated.
 */
export const useSession = () => {
  const [session, setSession] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionData = sessionStorage.getItem('userSession');
        if (sessionData) {
          setSession(JSON.parse(sessionData));
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const clearSession = () => {
    sessionStorage.removeItem('userSession');
    setSession(null);
  };

  return {
    session,
    isLoading,
    clearSession,
    isAuthenticated: !!session,
  };
};
