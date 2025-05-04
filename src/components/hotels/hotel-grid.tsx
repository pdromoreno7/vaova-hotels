import HotelCard from './hotel-card';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  status: 'activo' | 'inactivo';
  imageUrl: string;
}

export default function HotelGrid() {
  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'Hotel Costa del Sol',
      location: 'Cartagena, Colombia',
      rating: 5,
      status: 'activo',
      imageUrl:
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      name: 'Grand Resort & Spa',
      location: 'Cancún, México',
      rating: 4,
      status: 'activo',
      imageUrl:
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      name: 'Sunset Beach Hotel',
      location: 'Punta Cana, República Dominicana',
      rating: 5,
      status: 'activo',
      imageUrl:
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '4',
      name: 'Ocean View Resort',
      location: 'San Juan, Puerto Rico',
      rating: 4,
      status: 'inactivo',
      imageUrl:
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '5',
      name: 'Palm Paradise Hotel',
      location: 'La Habana, Cuba',
      rating: 5,
      status: 'activo',
      imageUrl:
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '6',
      name: 'Caribbean Luxury Resort',
      location: 'Montego Bay, Jamaica',
      rating: 5,
      status: 'activo',
      imageUrl:
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Nuestros Hoteles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}
