'use client';
import { Avatar, Card, CardBody, Chip } from '@heroui/react';
import { MapPin, Star, Heart } from 'lucide-react';
import Image from 'next/image';
import { Hotel } from '@/interface/hotels.interface';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Crear la ubicación combinando ciudad, estado y país
  const location = `${hotel.city}, ${hotel.state}, ${hotel.country}`;

  // Obtener la URL de la primera imagen de la galería o usar logo si no hay galería
  const imageUrl =
    hotel.gallery && hotel.gallery.length > 0
      ? hotel.gallery[0].url
      : hotel.logo ||
        'https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg';

  // Determinar si el hotel está activo o inactivo
  const status = hotel.active ? 'activo' : 'inactivo';

  // Obtener el precio de la habitación singleRoom
  const singleRoomPrice = hotel.rooms.singleRoom.price;

  // Verificar si el hotel ya está en favoritos
  const isHotelFavorite = isFavorite(hotel.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación del Link padre
    e.stopPropagation();

    if (isHotelFavorite) {
      removeFavorite(hotel.id);
    } else {
      addFavorite(hotel);
    }
  };

  return (
    <Card>
      <div className="relative h-64 w-full">
        <Image src={imageUrl} alt={hotel.name} className="object-cover w-full h-full" width={500} height={500} />

        {/* Avatar superpuesto en la esquina superior derecha */}
        <div className="absolute top-3 right-3">
          <Avatar
            src={hotel.logo}
            fallback={hotel.name.substring(0, 2).toUpperCase()}
            className="w-12 h-12 text-tiny border-2 border-white"
            isBordered
            color="default"
          />
        </div>

        {/* Botón de favorito */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart className={`h-5 w-5 ${isHotelFavorite ? 'fill-black text-black' : 'text-gray-700'}`} />
        </button>
      </div>

      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold truncate">{hotel.name}</h2>
          <Chip color={status === 'activo' ? 'success' : 'danger'} variant={status === 'activo' ? 'solid' : 'bordered'}>
            {status}
          </Chip>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Mostrar rating con estrellas */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{hotel.category} Estrellas</span>
        </div>
        {/* Precio */}
        <div className="flex items-center gap-1 text-sm font-bold text-primary-600 mt-3">
          <span className="text-primary text-lg">${singleRoomPrice.toLocaleString('es')}</span>
          <span className="text-xs text-gray-500">/noche</span>
        </div>
      </CardBody>
    </Card>
  );
}
