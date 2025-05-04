import { useQuery } from '@tanstack/react-query';
import { getHotelsByUserId } from '@/services/hotel';
import { useSession } from './useSession';
import { Hotel } from '@/interface/hotels.interface';

/**
 * Hook para consultar los hoteles del usuario actual
 */
export const useHotels = () => {
  const { session, isAuthenticated } = useSession();
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['hotels', session?.id],
    queryFn: async () => {
      if (!session?.id) {
        return [];
      }
      
      const result = await getHotelsByUserId(session.id);
      if (result.success) {
        return result.data || [];
      }
      
      throw new Error(result.error as string || 'Error al cargar hoteles');
    },
    // Solo ejecutar la consulta si hay una sesión activa
    enabled: isAuthenticated && !!session?.id,
  });

  return {
    hotels: (data || []) as Hotel[],
    isLoading,
    isError,
    error,
    refetch,
    isAuthenticated
  };
};
