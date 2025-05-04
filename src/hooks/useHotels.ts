import { useQuery } from '@tanstack/react-query';
import { getHotelsByUserId, getAllHotels } from '@/services/hotel';
import { useSession } from './useSession';
import { Hotel } from '@/interface/hotels.interface';

/**
 * Hook para consultar hoteles
 * @param queryType - Tipo de consulta: 'user' para obtener hoteles del usuario actual, 'all' para todos los hoteles
 */
export const useHotels = (queryType: 'user' | 'all' = 'user') => {
  const { session, isAuthenticated } = useSession();

  const { data, isLoading, isError, error, refetch } = useQuery({
    // La clave de consulta depende del tipo de consulta
    queryKey: queryType === 'user' ? ['hotels', 'user', session?.id] : ['hotels', 'all'],
    queryFn: async () => {
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
        return result.data || [];
      }

      throw new Error((result.error as string) || 'Error al cargar hoteles');
    },
    // La consulta está habilitada según el tipo
    enabled: queryType === 'all' || (isAuthenticated && !!session?.id),
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
