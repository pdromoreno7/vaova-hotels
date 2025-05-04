'use client';
import HotelsTable from '@/components/dashboard/hotels/hotels-table';
import HotelCardsInfo from '@/components/dashboard/hotels/hotel-cards-info';
import HotelsTableFilter from '@/components/dashboard/hotels/hotels-table-filter';
import Wrapper from '@/layouts/Wrapper';
import { useSession } from '@/hooks/useSession';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

function DashboardPage() {
  const router = useRouter();
  const { lang } = useParams();

  const { session, isLoading, isAuthenticated } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${lang}/auth/login`);
    }
  }, [isLoading, isAuthenticated, lang, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, no renderizamos nada mientras se realiza la redirección
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <Wrapper className="py-10 ">
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold">Dashboard de Hoteles</h1>
          <p className="text-lg text-gray-600 font-medium">{`¡Bienvenido${
            session?.name ? `, ${session.name}!` : '!'
          }`}</p>
          <p className="text-gray-500 mt-2">Gestiona tus propiedades y convenios de manera eficiente</p>
        </div>
        <HotelCardsInfo />
        <div className="flex gap-6 mt-6">
          <div className="w-1/4">
            <HotelsTableFilter />
          </div>
          <div className="w-3/4">
            <HotelsTable />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default DashboardPage;
