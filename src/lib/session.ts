import { User } from '@/interface/user.interface';

/**
 * Session management utilities
 * Handles storing and retrieving user session data in sessionStorage
 */

/**
 * Saves user data to sessionStorage
 * @param userData - User object containing session information
 * @returns void
 */
export const saveUserSession = (userData: User) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('userSession', JSON.stringify(userData));
  }
};

/**
 * Retrieves user session data from sessionStorage
 * @returns User object if found, null otherwise
 * @throws Error if JSON parsing fails (logged to console)
 */
// export const getUserSession = (): User | null => {
//   if (typeof window === 'undefined') {
//     return null;
//   }

//   const userDataString = sessionStorage.getItem('userSession');
//   if (!userDataString) {
//     return null;
//   }

//   try {
//     return JSON.parse(userDataString) as User;
//   } catch (error) {
//     console.error('Error parsing user session:', error);
//     return null;
//   }
// };

/**
 * Deletes user session data from sessionStorage
 * @returns void
 */
export const clearUserSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('userSession');
  }
};
