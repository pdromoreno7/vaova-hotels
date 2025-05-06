/**
 * Authentication service module
 * Handles user authentication, registration, and session management
 */
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/config/firabase';
import { createUserDocument, getUserDocument } from './user';
import { saveUserSession } from '@/lib/session';
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

    // Crear objeto userData con datos fusionados para asegurar que ID siempre existe
    // y que todos los campos requeridos por la interfaz User estén presentes
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

    // Crear objeto userData con datos fusionados para asegurar que ID siempre existe
    // y que todos los campos requeridos por la interfaz User estén presentes
    const userData: User = {
      id: user.uid,
      email: user.email || '',
      name: userDoc.success && userDoc.data?.name ? userDoc.data.name : user.displayName || email.split('@')[0],
      role: userDoc.success && userDoc.data?.role ? userDoc.data.role : 'user',
      createdAt: userDoc.success && userDoc.data?.createdAt ? userDoc.data.createdAt : new Date(),
      // Otros campos opcionales
      ...(userDoc.success && userDoc.data ? userDoc.data : {}),
    };

    // Save user session to localStorage and state
    saveUserSession(userData);
    return { success: true, user: userData };
  } catch (error) {
    console.error('Error logging in with email and password:', error);
    return { success: false, error };
  }
};
