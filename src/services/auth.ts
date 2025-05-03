import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '@/interface/user.interface';
import { db, auth } from '@/config/firabase';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export const createUserDocument = async (userId: string, userData: Partial<User>) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar || '',
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user document:', error);
    return { success: false, error };
  }
};

export const registerWithEmailAndPassword = async (data: RegisterData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    const result = await createUserDocument(user.uid, {
      ...data,
      avatar: '',
    });

    if (!result.success) {
      throw new Error('Error creating user document');
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const documentResult = await createUserDocument(user.uid, {
      name: user.displayName || '',
      email: user.email || '',
      role: 'user',
      avatar: user.photoURL || '',
    });

    if (!documentResult.success) {
      throw new Error('Error creating user document');
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error with Google sign in:', error);
    return { success: false, error };
  }
};
