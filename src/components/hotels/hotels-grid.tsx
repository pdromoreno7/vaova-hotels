'use client';
import HotelCard from './hotel-card';
import { useHotels } from '@/hooks/useHotels';
import { Spinner } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HotelGrid() {
  const { lang } = useParams();
  // Usamos el hook useHotels con 'all' para obtener todos los hoteles
  const { hotels, isLoading, isError, error } = useHotels('all');
  console.log('🚀 ~ HotelGrid ~ hotels:', hotels);

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  // Mostrar mensaje de error
  if (isError) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error al cargar los hoteles: {error?.toString()}</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay hoteles
  if (hotels.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-md">
        <p>No hay hoteles disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Link key={hotel.id} href={`/${lang}/hotels/${hotel.id}`}>
            <HotelCard hotel={hotel} />
          </Link>
        ))}
      </div>
    </>
  );
}
