import { useQuery } from '@tanstack/react-query';
import { getHotelsByUserId, getAllHotels, getHotelById } from '@/services/hotel';
import { useSession } from './useSession';
import { Hotel } from '@/interface/hotels.interface';

/**
 * Custom hook for fetching hotels data
 * @param queryType - Query type: 'user' for current user's hotels, 'all' for all hotels, 'single' for specific hotel
 * @param hotelId - Hotel ID when queryType is 'single'
 */
export const useHotels = (queryType: 'user' | 'all' | 'single' = 'user', hotelId?: string) => {
  const { session, isAuthenticated } = useSession();

  const { data, isLoading, isError, error, refetch } = useQuery({
    // The query key depends on the query type
    queryKey:
      queryType === 'user'
        ? ['hotels', 'user', session?.id]
        : queryType === 'single'
        ? ['hotel', hotelId]
        : ['hotels', 'all'],
    queryFn: async () => {
      // Handle single hotel query
      if (queryType === 'single') {
        if (!hotelId) {
          throw new Error('Hotel ID is required to fetch a specific hotel');
        }
        const result = await getHotelById(hotelId);
        if (result.success) {
          return result.data ? [result.data] : [];
        }
        throw new Error((result.error as string) || 'Error fetching hotel');
      }

      // Return empty array if querying user hotels without session
      if (queryType === 'user' && !session?.id) {
        return [];
      }

      let result;
      if (queryType === 'user') {
        // Get user's hotels
        result = await getHotelsByUserId(session!.id);
      } else {
        // Get all hotels
        result = await getAllHotels();
      }

      if (result.success) {
        let hotels = result.data || [];

        if (queryType === 'all') {
          const hotelsWithImages = hotels.filter((hotel) => hotel.gallery && hotel.gallery.length > 0);
          const hotelsWithoutImages = hotels.filter((hotel) => !hotel.gallery || hotel.gallery.length === 0);

          hotels = [...hotelsWithImages, ...hotelsWithoutImages];
        }

        return hotels;
      }

      throw new Error((result.error as string) || 'Error fetching hotels');
    },
    // The query is enabled based on the query type
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
