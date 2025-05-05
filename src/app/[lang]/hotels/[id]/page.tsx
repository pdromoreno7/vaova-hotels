'use client';
import HotelDetail from '@/components/hotels/hotel-detail';
import Wrapper from '@/layouts/Wrapper';
import { useParams } from 'next/navigation';

export default function HotelDetailPage() {
  // Obtener el ID del hotel de los parámetros de la URL
  const params = useParams();
  const hotelId = params.id as string;
  
  return (
    <Wrapper>
      <div className="py-8">
        <HotelDetail hotelId={hotelId} />
      </div>
    </Wrapper>
  );
}