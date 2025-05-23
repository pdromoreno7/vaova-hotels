'use client';
import HotelCard from './hotel-card';
import { useHotels } from '@/hooks/useHotels';
import { Spinner } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TemplateViewAsync } from '@/components/common/template-view-async';
import HotelInputSearch from './hoter-input-search';

/**
 * HotelGrid component
 * Fetches and displays a grid of all hotels.
 * Handles loading and error states, and shows a message if no hotels are available.
 *
 * Uses the useHotels hook to retrieve hotel data.
 *
 * @returns A JSX element with a responsive grid of hotel cards.
 */
//TODO: Add Skeleton in renderLoading
export default function HotelGrid() {
  const { lang } = useParams();
  const { hotels, isLoading, isError, error, nameSearch, setNameSearch, hotelsSearch } = useHotels('all');

  return (
    <TemplateViewAsync
      isLoading={isLoading}
      isError={isError}
      data={nameSearch.length > 0 ? hotelsSearch : hotels}
      errorMessage={error?.toString()}
      emptyMessage="No hay hoteles disponibles en este momento."
      renderLoading={() => (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" />
        </div>
      )}
    >
      {(data) => (
        <>
          <div className="my-6 h-16 w-full md:w-1/2">
            <HotelInputSearch nameSearch={nameSearch} setNameSearch={setNameSearch} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((hotel) => (
              <Link key={hotel.id} href={`/${lang}/hotels/${hotel.id}`}>
                <HotelCard hotel={hotel} />
              </Link>
            ))}
          </div>
        </>
      )}
    </TemplateViewAsync>
  );
}
