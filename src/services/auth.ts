/**
 * Authentication service module
 * Handles user authentication, registration, and session management
 */
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/config/firabase';
import { createUserDocument, getUserDocument } from './user';
import { saveUserSession, clearUserSession } from '@/lib/session';
import { User } from '@/interface/user.interface';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

/**
 * Registers a new user with email and password
 * @param data - User registration data
 * @returns Promise with success status and user data or error
 */
export const registerWithEmailAndPassword = async (data: RegisterData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    const result = await createUserDocument(user.uid, {
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: '',
    });

    if (!result.success) {
      throw new Error('Error creating user document');
    }

    const userDoc = await getUserDocument(user.uid);
    if (userDoc.success && userDoc.data) {
      saveUserSession(userDoc.data);
      return { success: true, user: userDoc.data };
    }

    return { success: false, error: 'Error getting user data' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error };
  }
};

/**
 * Handles Google authentication (login/registration)
 * @returns Promise with success status and user data or error
 */
export const registerWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const existingUser = await getUserDocument(user.uid);
    if (!existingUser.success) {
      const documentResult = await createUserDocument(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        role: 'user',
        avatar: user.photoURL || '',
      });

      if (!documentResult.success) {
        throw new Error('Error creating user document');
      }
    }

    const userDoc = await getUserDocument(user.uid);
    if (userDoc.success && userDoc.data) {
      saveUserSession(userDoc.data);
      return { success: true, user: userDoc.data };
    }

    return { success: false, error: 'Error getting user data' };
  } catch (error) {
    console.error('Error with Google registration:', error);
    return { success: false, error };
  }
};

/**
 * Handles Google authentication (login)
 * @returns Promise with success status and user data or error
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDoc = await getUserDocument(user.uid);

    // Create userData object with merged data to ensure that ID always exists
    // and that all required fields of the User interface are present
    const userData: User = {
      id: user.uid,
      email: user.email || '',
      name: userDoc.success && userDoc.data?.name ? userDoc.data.name : user.displayName || '',
      role: userDoc.success && userDoc.data?.role ? userDoc.data.role : 'user',
      createdAt: userDoc.success && userDoc.data?.createdAt ? userDoc.data.createdAt : new Date(),

      ...(userDoc.success && userDoc.data ? userDoc.data : {}),
    };

    // Save user session to localStorage and state
    saveUserSession(userData);
    return { success: true, user: userData };
  } catch (error) {
    console.error('Error with Google login:', error);
    return { success: false, error };
  }
};

/**
 * Logs in a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with success status and user data or error
 */
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getUserDocument(user.uid);

    // Create userData object with merged data to ensure that ID always exists
    // and that all required fields of the User interface are present
    const userData: User = {
      id: user.uid,
      email: user.email || '',
      name: userDoc.success && userDoc.data?.name ? userDoc.data.name : user.displayName || email.split('@')[0],
      role: userDoc.success && userDoc.data?.role ? userDoc.data.role : 'user',
      createdAt: userDoc.success && userDoc.data?.createdAt ? userDoc.data.createdAt : new Date(),

      ...(userDoc.success && userDoc.data ? userDoc.data : {}),
    };

    // Save user session to sessionStorage
    saveUserSession(userData);
    return { success: true, user: userData };
  } catch (error) {
    console.error('Error logging in with email and password:', error);
    return { success: false, error };
  }
};

/**
 * Logs out the current user
 * - Signs out from Firebase Auth
 * - Clears session data from sessionStorage
 * @returns Promise with success status or error
 */
export const logout = async () => {
  try {
    // Sign out from Firebase Auth
    await signOut(auth);

    // Clear session data from sessionStorage
    clearUserSession();

    // Check if Firebase stores anything in localStorage and clean it if needed
    // Firebase typically stores auth state in indexedDB, but some configurations might use localStorage
    if (typeof window !== 'undefined') {
      const firebaseLocalStorageKeys = Object.keys(localStorage).filter(
        (key) => key.startsWith('firebase:') || key.includes('firebaseLocalStorageDb')
      );

      // Remove any Firebase-related items from localStorage if they exist
      firebaseLocalStorageKeys.forEach((key) => localStorage.removeItem(key));
    }

    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error };
  }
};
