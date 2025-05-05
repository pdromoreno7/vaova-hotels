'use client';
import { Avatar, Card, CardBody, Chip } from '@heroui/react';

import Image from 'next/image';
import { MapPin, StarIcon, DollarSign } from 'lucide-react';
import { Hotel } from '@/interface/hotels.interface';

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  // Crear la ubicación combinando ciudad, estado y país
  const location = `${hotel.city}, ${hotel.state}, ${hotel.country}`;

  // Obtener la URL de la primera imagen de la galería o usar logo si no hay galería
  const imageUrl = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery[0].url : hotel.logo || '/placeholder.svg';

  // Determinar si el hotel está activo o inactivo
  const status = hotel.active ? 'activo' : 'inactivo';

  // Obtener el precio de la habitación singleRoom
  const singleRoomPrice = hotel.rooms.singleRoom.price;

  return (
    <Card className="h-[450px]">
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
      </div>

      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{hotel.name}</h2>
          <Chip
            color={status === 'activo' ? 'success' : 'danger'}
            variant={status === 'activo' ? 'solid' : 'bordered'}
            radius="full"
            size="sm"
            className="capitalize"
          >
            {status}
          </Chip>
        </div>

        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <MapPin size={16} /> {location}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex">
            {/* Mostrar estrellas según la categoría del hotel (3, 4 o 5) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${i < hotel.category ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>

          {/* Precio de habitación singleRoom */}
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <DollarSign size={16} />
            <span>{singleRoomPrice.toLocaleString('es-CO')}</span>
            <span className="text-xs text-gray-500">/noche</span>
          </div>
        </div>

        {/* Descripción corta */}
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{hotel.description.slice(0, 30) + '... '}</p>
      </CardBody>
    </Card>
  );
}
