import HotelGrid from '@/components/hotels/hotel-grid';
import Wrapper from '@/layouts/Wrapper';

function HomePage() {
  return (
    <Wrapper>
      <div className="my-6 space-y-1">
        <h1 className="text-2xl font-bold mb-6">Nuestros Hoteles</h1>
        <HotelGrid />
      </div>
    </Wrapper>
  );
}

export default HomePage;
