/**
 * User service module
 * Handles user profile data operations
 */
import { db } from '@/config/firabase';
import { User } from '@/interface/user.interface';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Fetches user document from Firestore
 * @param userId - ID of the user to fetch
 * @returns Promise with success status and user data or error
 */
export const getUserDocument = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const docData = userDoc.data() as User;
      // Usa el spread primero y luego el id explícito para que este último tenga prioridad
      return { success: true, data: { ...docData, id: userId } };
    }
    return { success: false, error: 'User document not found' };
  } catch (error) {
    console.error('Error fetching user document:', error);
    return { success: false, error };
  }
};

/**
 * Creates a new user document in Firestore
 * @param userId - ID of the user to create
 * @param userData - User data to create
 * @returns Promise with success status or error
 */
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
