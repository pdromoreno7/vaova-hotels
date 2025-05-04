'use client';
import HotelCard from './hotel-card';
import { useHotels } from '@/hooks/useHotels';
import { Spinner } from '@heroui/react';

export default function HotelGrid() {
  // Usamos el hook useHotels con 'all' para obtener todos los hoteles
  const { hotels, isLoading, isError, error } = useHotels('all');

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
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}
