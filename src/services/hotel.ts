import { collection, addDoc, updateDoc, doc, getDocs, query, where, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firabase';
import { Hotel, GalleryImage } from '@/interface/hotels.interface';
import { v4 as uuidv4 } from 'uuid';
import { FileWithPreview } from '@/components/dashboard/hotels/file-uploader-multiple';

const HOTELS_COLLECTION = 'hotels';

/**
 * Sube un archivo a Firebase Storage
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw error;
  }
};

/**
 * Sube múltiples archivos a Firebase Storage y devuelve un array con sus URLs
 */
export const uploadGalleryImages = async (
  files: FileWithPreview[],
  hotelId: string
): Promise<GalleryImage[]> => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${hotelId}_gallery_${index}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `hotels/${hotelId}/gallery/${fileName}`;
      const url = await uploadFile(file, filePath);
      
      return {
        url,
        description: file.name
      };
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error al subir imágenes de galería:', error);
    throw error;
  }
};

/**
 * Sube el logo del hotel a Firebase Storage
 */
export const uploadHotelLogo = async (logoFile: File, hotelId: string): Promise<string> => {
  try {
    const fileName = `${hotelId}_logo_${logoFile.name.replace(/\s+/g, '_')}`;
    const filePath = `hotels/${hotelId}/logo/${fileName}`;
    return await uploadFile(logoFile, filePath);
  } catch (error) {
    console.error('Error al subir logo:', error);
    throw error;
  }
};

/**
 * Crea un nuevo hotel en Firestore
 */
export const createHotel = async (
  hotelData: Partial<Hotel>,
  galleryFiles: FileWithPreview[],
  logoFile?: File
): Promise<{ success: boolean; data?: Hotel; error?: unknown }> => {
  try {
    // Generamos un ID único para el hotel
    const hotelId = uuidv4();
    
    // Estructura base del hotel con valores por defecto
    const newHotel: Partial<Hotel> = {
      ...hotelData,
      id: hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [],
    };

    // Si hay un logo, lo subimos
    if (logoFile) {
      const logoUrl = await uploadHotelLogo(logoFile, hotelId);
      newHotel.logo = logoUrl;
    }

    // Subimos las imágenes de la galería
    if (galleryFiles.length > 0) {
      const galleryImages = await uploadGalleryImages(galleryFiles, hotelId);
      newHotel.gallery = galleryImages;
    }

    // Guardamos el hotel en Firestore
    await addDoc(collection(db, HOTELS_COLLECTION), newHotel);

    return { success: true, data: newHotel as Hotel };
  } catch (error) {
    console.error('Error al crear hotel:', error);
    return { success: false, error };
  }
};

/**
 * Actualiza un hotel existente en Firestore
 */
export const updateHotel = async (
  hotelId: string,
  hotelData: Partial<Hotel>,
  galleryFiles?: FileWithPreview[],
  logoFile?: File
): Promise<{ success: boolean; data?: Hotel; error?: unknown }> => {
  try {
    // Buscamos el hotel en Firestore
    const hotelsRef = collection(db, HOTELS_COLLECTION);
    const q = query(hotelsRef, where('id', '==', hotelId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Hotel no encontrado' };
    }

    const hotelDoc = querySnapshot.docs[0];
    const hotelRef = doc(db, HOTELS_COLLECTION, hotelDoc.id);
    
    // Preparamos los datos actualizados
    const updatedData: Partial<Hotel> = {
      ...hotelData,
      updatedAt: new Date()
    };

    // Si hay un nuevo logo, lo subimos
    if (logoFile) {
      const logoUrl = await uploadHotelLogo(logoFile, hotelId);
      updatedData.logo = logoUrl;
    }

    // Si hay nuevas imágenes de galería, las subimos
    if (galleryFiles && galleryFiles.length > 0) {
      const galleryImages = await uploadGalleryImages(galleryFiles, hotelId);
      
      // Si ya había imágenes, las añadimos a las nuevas
      if (hotelData.gallery && hotelData.gallery.length > 0) {
        updatedData.gallery = [...hotelData.gallery, ...galleryImages];
      } else {
        updatedData.gallery = galleryImages;
      }
    }

    // Actualizamos el hotel en Firestore
    await updateDoc(hotelRef, updatedData);

    // Obtenemos los datos actualizados
    const updatedHotelDoc = await getDoc(hotelRef);
    const updatedHotel = { id: hotelId, ...updatedHotelDoc.data() } as Hotel;

    return { success: true, data: updatedHotel };
  } catch (error) {
    console.error('Error al actualizar hotel:', error);
    return { success: false, error };
  }
};

/**
 * Obtiene todos los hoteles de Firestore
 */
export const getAllHotels = async (): Promise<{ success: boolean; data?: Hotel[]; error?: unknown }> => {
  try {
    const hotelsRef = collection(db, HOTELS_COLLECTION);
    const querySnapshot = await getDocs(hotelsRef);
    
    const hotels: Hotel[] = [];
    querySnapshot.forEach((doc) => {
      hotels.push({ ...doc.data() } as Hotel);
    });

    return { success: true, data: hotels };
  } catch (error) {
    console.error('Error al obtener hoteles:', error);
    return { success: false, error };
  }
};

/**
 * Obtiene un hotel por su ID
 */
export const getHotelById = async (hotelId: string): Promise<{ success: boolean; data?: Hotel; error?: unknown }> => {
  try {
    const hotelsRef = collection(db, HOTELS_COLLECTION);
    const q = query(hotelsRef, where('id', '==', hotelId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Hotel no encontrado' };
    }

    const hotelData = querySnapshot.docs[0].data() as Hotel;
    
    return { success: true, data: hotelData };
  } catch (error) {
    console.error('Error al obtener hotel:', error);
    return { success: false, error };
  }
};

/**
 * Elimina un hotel de Firestore
 */
export const deleteHotel = async (hotelId: string): Promise<{ success: boolean; error?: unknown }> => {
  try {
    const hotelsRef = collection(db, HOTELS_COLLECTION);
    const q = query(hotelsRef, where('id', '==', hotelId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Hotel no encontrado' };
    }

    const hotelDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, HOTELS_COLLECTION, hotelDoc.id));
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar hotel:', error);
    return { success: false, error };
  }
};
