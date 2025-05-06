'use client';
import { useHotels } from '@/hooks/useHotels';
import { Button, Card, CardBody, DatePicker, Spinner, Select, SelectItem, Avatar, Image } from '@heroui/react';
import { DollarSign, MapPin, Star, User } from 'lucide-react';

import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { TemplateViewAsync } from '../common/template-view-async';

interface HotelDetailProps {
  hotelId: string;
}

/**
 * HotelDetail component
 * Shows detailed information about a specific hotel, including gallery, amenities, description, and contact info.
 * Allows users to interact with the hotel, such as adding to favorites or booking.
 *
 * Props:
 * - hotelId: The unique identifier of the hotel to display details for.
 *
 * @returns A JSX element with the full hotel details view.
 */
//TODO: Add Skeleton in renderLoading
export default function HotelDetail({ hotelId }: HotelDetailProps) {
  const { hotels, isLoading, isError } = useHotels('single', hotelId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [guests, setGuests] = useState<string>('2');

  return (
    <TemplateViewAsync
      isLoading={isLoading}
      isError={isError}
      data={hotels}
      isEmpty={(data) => !data || data.length === 0}
      errorMessage="No se pudo cargar la información del hotel. Por favor, intenta más tarde."
      renderLoading={() => (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      )}
    >
      {(hotels) => {
        const hotel = hotels[0];
        const mainImage =
          selectedImage ||
          (hotel.gallery?.length > 0
            ? hotel.gallery[0].url
            : 'https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg');

        const location = `${hotel.city}, ${hotel.state}, ${hotel.country}`;

        return (
          <div className="space-y-8">
            {/* Gallery */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative h-96 rounded-xl overflow-hidden">
                <Image isBlurred src={mainImage} alt={hotel.name} className="object-cover w-full h-full " />
              </div>
              <ScrollArea className="w-full md:w-[372px]">
                <div className="grid grid-cols-2 gap-2  ">
                  {hotel.gallery?.map((image, index) => (
                    <div
                      key={index}
                      className={` overflow-hidden cursor-pointer `}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Image
                        isBlurred
                        isZoomed
                        src={image.url}
                        alt={image.description || `Imagen ${index + 1} de ${hotel.name}`}
                        className="object-cover h-44"
                      />
                    </div>
                  ))}
                  {hotel.gallery?.length === 0 && (
                    <div className="relative h-44 rounded-lg overflow-hidden">
                      <Image src={hotel.logo} alt={hotel.name} className="object-contain" />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Main information section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left column: Title and description */}
              <div className="flex-1">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h1 className="text-3xl font-bold">{hotel.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mt-2">
                    <MapPin size={16} /> {location}
                    <Avatar
                      src={hotel.logo}
                      fallback={hotel.name.substring(0, 2).toUpperCase()}
                      className="border-2 ml-1 border-gray-200"
                    />
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < hotel.category ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500">{hotel.category} estrellas</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                <p className="text-gray-600">{hotel.description}</p>
              </div>

              {/* Right column: Price and rooms */}
              <div>
                {/* Available rooms */}
                <Card className="w-full md:w-[372px]">
                  <CardBody>
                    <h2 className="text-xl font-bold mb-4">Habitaciones disponibles</h2>
                    <div className="space-y-4">
                      {hotel.rooms.singleRoom.enabled && (
                        <div className="flex justify-between items-center p-4 border rounded-lg gap-2">
                          <div>
                            <h3 className="  font-semibold">Habitación Individual</h3>
                            <p className="text-sm text-gray-500">Disponibles: {hotel.rooms.singleRoom.available}</p>
                            <div className="font-semibold text-green-600">
                              <DollarSign className="inline-block h-4 w-4" />
                              {hotel.rooms.singleRoom.price.toLocaleString('es')}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <Button color="primary" size="sm">
                              Reservar
                            </Button>
                          </div>
                        </div>
                      )}

                      {hotel.rooms.twinRoom.enabled && (
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Habitación Doble</h3>
                            <p className="text-sm text-gray-500">Disponibles: {hotel.rooms.twinRoom.available}</p>
                            <div className="font-semibold text-green-600">
                              <DollarSign className="inline-block h-4 w-4" />
                              {hotel.rooms.twinRoom.price.toLocaleString('es')}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <Button color="primary" size="sm">
                              Reservar
                            </Button>
                          </div>
                        </div>
                      )}

                      {hotel.rooms.queenRoom.enabled && (
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Suite</h3>
                            <p className="text-sm text-gray-500">Disponibles: {hotel.rooms.queenRoom.available}</p>
                            <div className="font-semibold text-green-600">
                              <DollarSign className="inline-block h-4 w-4" />
                              {hotel.rooms.queenRoom.price.toLocaleString('es')}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <Button color="primary" size="sm">
                              Reservar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Reservation form */}
            <div className="bg-white shadow-md rounded-xl p-6 mt-8">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold">Reservar tu estancia</h2>
                <p className="text-gray-500 mt-1">Selecciona fechas y huéspedes para ver disponibilidad</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Fechas de estancia</label>
                  <DatePicker className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Huéspedes</label>
                  <Select
                    className="w-full"
                    selectedKeys={[guests]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0];
                      if (key) setGuests(key.toString());
                    }}
                    startContent={<User size={16} className="text-gray-500" />}
                    variant="bordered"
                    aria-label="Selecciona el número de huéspedes"
                  >
                    <SelectItem key="1">1 adulto</SelectItem>
                    <SelectItem key="2">2 adultos</SelectItem>
                    <SelectItem key="3">3 adultos</SelectItem>
                    <SelectItem key="4">4 adultos</SelectItem>
                    <SelectItem key="5">5 adultos</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Desde</p>
                  <p className="text-2xl font-bold">
                    {hotel.rooms.singleRoom.price.toLocaleString('es')}$
                    <span className="text-sm font-normal text-gray-500"> / noche</span>
                  </p>
                </div>
                <Button color="primary" size="lg" className="px-8">
                  Buscar disponibilidad
                </Button>
              </div>
            </div>
          </div>
        );
      }}
    </TemplateViewAsync>
  );
}
