import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/config/firabase';
import { createUserDocument, getUserDocument } from './user';
import { saveUserSession } from '@/lib/session';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

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

export const registerWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verificar si el usuario ya existe
    const existingUser = await getUserDocument(user.uid);
    if (!existingUser.success) {

      // Si no existe, crear el documento
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

    // Obtener y guardar los datos del usuario
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

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDoc = await getUserDocument(user.uid);
    if (userDoc.success && userDoc.data) {
      saveUserSession(userDoc.data);
      return { success: true, user: userDoc.data };
    }

    return { success: false, error: 'User data not found' };
  } catch (error) {
    console.error('Error with Google login:', error);
    return { success: false, error };
  }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getUserDocument(user.uid);
    if (userDoc.success && userDoc.data) {
      saveUserSession(userDoc.data);
      return { success: true, user: userDoc.data };
    }

    return { success: false, error: 'User data not found' };
  } catch (error) {
    console.error('Error logging in with email and password:', error);
    return { success: false, error };
  }
};
