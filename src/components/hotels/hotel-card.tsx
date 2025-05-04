'use client';
import { Avatar, Card, CardBody, Chip } from '@heroui/react';

import Image from 'next/image';
import { MapPin, StarIcon } from 'lucide-react';

// Tipo para los datos del hotel
interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  status: 'activo' | 'inactivo';
  imageUrl: string;
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card>
      <div className="relative h-64 w-full">
        <Image
          src={hotel.imageUrl || '/placeholder.svg'}
          alt={hotel.name}
          className="object-cover w-full h-full"
          width={500}
          height={500}
        />
        {/* Avatar superpuesto en la esquina superior derecha */}
        <div className="absolute top-3 right-3">
          <Avatar
            src={`https://i.pravatar.cc/150?u=${hotel.id}`}
            className="w-12 h-12 text-tiny border-2 border-white"
            isBordered
            color="default"
          />
        </div>
      </div>

      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{hotel.name}</h2>
          <Chip
            color={hotel.status === 'activo' ? 'default' : 'default'}
            variant={hotel.status === 'activo' ? 'solid' : 'bordered'}
            radius="full"
            size="sm"
            className={`capitalize ${hotel.status === 'activo' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {hotel.status}
          </Chip>
        </div>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          {' '}
          <MapPin size={16} /> {hotel.location}
        </p>

        <div className="flex mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${i < hotel.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
