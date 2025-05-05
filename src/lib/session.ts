import { User } from '@/interface/user.interface';

/**
 * Guarda la información del usuario en sessionStorage
 */
export const saveUserSession = (userData: User) => {
  sessionStorage.setItem('userSession', JSON.stringify(userData));
};

/**
 * Obtiene la información del usuario desde sessionStorage
 */
export const getUserSession = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userDataString = sessionStorage.getItem('userSession');
  if (!userDataString) {
    return null;
  }
  
  try {
    return JSON.parse(userDataString) as User;
  } catch (error) {
    console.error('Error parsing user session:', error);
    return null;
  }
};

/**
 * Elimina la sesión del usuario
 */
export const clearUserSession = () => {
  sessionStorage.removeItem('userSession');
};
