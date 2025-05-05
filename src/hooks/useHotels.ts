import { useQuery } from '@tanstack/react-query';
import { getHotelsByUserId, getAllHotels, getHotelById } from '@/services/hotel';
import { useSession } from './useSession';
import { Hotel } from '@/interface/hotels.interface';

/**
 * Hook para consultar hoteles
 * @param queryType - Tipo de consulta: 'user' para hoteles del usuario actual, 'all' para todos los hoteles, 'single' para un hotel específico
 * @param hotelId - ID del hotel cuando queryType es 'single'
 */
export const useHotels = (queryType: 'user' | 'all' | 'single' = 'user', hotelId?: string) => {
  const { session, isAuthenticated } = useSession();

  const { data, isLoading, isError, error, refetch } = useQuery({
    // La clave de consulta depende del tipo de consulta
    queryKey:
      queryType === 'user'
        ? ['hotels', 'user', session?.id]
        : queryType === 'single'
        ? ['hotel', hotelId]
        : ['hotels', 'all'],
    queryFn: async () => {
      // Para consulta de hotel individual
      if (queryType === 'single') {
        if (!hotelId) {
          throw new Error('Se requiere un ID de hotel para consultar un hotel específico');
        }
        const result = await getHotelById(hotelId);
        if (result.success) {
          return result.data ? [result.data] : [];
        }
        throw new Error((result.error as string) || 'Error al cargar el hotel');
      }

      // Si buscamos hoteles del usuario pero no hay sesión, devolver array vacío
      if (queryType === 'user' && !session?.id) {
        return [];
      }

      let result;
      if (queryType === 'user') {
        // Obtener hoteles del usuario
        result = await getHotelsByUserId(session!.id);
      } else {
        // Obtener todos los hoteles
        result = await getAllHotels();
      }

      if (result.success) {
        let hotels = result.data || [];
        
        // Solo para la consulta de todos los hoteles, organizamos por prioridad
        if (queryType === 'all') {
          // Separamos los hoteles en dos grupos
          const hotelsWithImages = hotels.filter((hotel) => hotel.gallery && hotel.gallery.length > 0);
          const hotelsWithoutImages = hotels.filter((hotel) => !hotel.gallery || hotel.gallery.length === 0);
          
          // Ordenamos la lista para mostrar primero los hoteles con imágenes
          hotels = [...hotelsWithImages, ...hotelsWithoutImages];
        }
        
        return hotels;
      }

      throw new Error((result.error as string) || 'Error al cargar hoteles');
    },
    // La consulta está habilitada según el tipo
    enabled: queryType === 'all' || queryType === 'single' || (isAuthenticated && !!session?.id),
  });

  return {
    hotels: (data || []) as Hotel[],
    isLoading,
    isError,
    error,
    refetch,
    isAuthenticated,
  };
};
