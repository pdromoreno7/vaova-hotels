import HotelsTable from '@/components/dashboard/hotels/hotels-table';
import HotelCardsInfo from '@/components/dashboard/hotels/hotel-cards-info';
import HotelsTableFilter from '@/components/dashboard/hotels/hotels-table-filter';
import Wrapper from '@/layouts/Wrapper';

function DashboardPage() {
  return (
    <Wrapper className="py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard de Hoteles</h1>
        <p className="text-gray-600">Gestiona tus propiedades y convenios</p>
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
