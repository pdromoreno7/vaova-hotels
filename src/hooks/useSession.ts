import { useState, useEffect } from 'react';
import { User } from '@/interface/user.interface';

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
