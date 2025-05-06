'use client';
import HotelCard from './hotel-card';
import { useHotels } from '@/hooks/useHotels';
import { Spinner } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

/**
 * HotelGrid component
 * Fetches and displays a grid of all hotels.
 * Handles loading and error states, and shows a message if no hotels are available.
 *
 * Uses the useHotels hook to retrieve hotel data.
 *
 * @returns A JSX element with a responsive grid of hotel cards.
 */

//TODO: Add AsyncStateRenderer
export default function HotelGrid() {
  const { lang } = useParams();
  const { hotels, isLoading, isError, error } = useHotels('all');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error al cargar los hoteles: {error?.toString()}</p>
      </div>
    );
  }

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
