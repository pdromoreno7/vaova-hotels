'use client';
import HotelsTable from '@/components/dashboard/hotels/hotels-table';
import HotelCardsInfo from '@/components/dashboard/hotels/hotel-cards-info';
import HotelsTableFilter from '@/components/dashboard/hotels/hotels-table-filter';
import Wrapper from '@/layouts/Wrapper';
import { useSession } from '@/hooks/useSession';

function DashboardPage() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Unauthorized</div>;
  }
  return (
    <Wrapper className="py-10">
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
  );
}

export default DashboardPage;
