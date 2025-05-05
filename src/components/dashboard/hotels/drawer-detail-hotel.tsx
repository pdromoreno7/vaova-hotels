'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Image,
  Tooltip,
  Card,
  CardBody,
  Chip,
} from '@heroui/react';
import { Star, MapPin, DollarSign, User, Calendar, X, MoveUpRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Hotel as HotelType, RoomInventory } from '@/interface/hotels.interface';
import { ScrollArea } from '@/components/ui/scroll-area';

// Extendemos la interfaz para campos opcionales que podríamos necesitar
interface ExtendedHotelType extends Omit<HotelType, 'createdAt'> {
  phone?: string;
  email?: string;
  website?: string;
  createdAt?:
    | {
        seconds: number;
        nanoseconds: number;
      }
    | Date;
}

interface DrawerDetailHotelProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: ExtendedHotelType | null;
}

export default function DrawerDetailHotel({ isOpen, onClose, hotel }: DrawerDetailHotelProps) {
  const { lang } = useParams();

  if (!hotel) return null;

  const location = `${hotel.city}, ${hotel.state}, ${hotel.country}`;

  return (
    <Drawer
      hideCloseButton
      classNames={{
        base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium',
      }}
      placement="right"
      size="lg"
      isOpen={isOpen}
      onOpenChange={onClose}
    >
      <DrawerContent>
        {(onModalClose) => (
          <>
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-4 py-3 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
              <Tooltip content="Cerrar">
                <Button isIconOnly className="text-default-400" size="sm" variant="light" onPress={onModalClose}>
                  <X size={20} />
                </Button>
              </Tooltip>
              <div className="w-full flex justify-start gap-2">
                <Button
                  as={Link}
                  href={`/${lang}/hotels/${hotel.id}`}
                  className="font-medium text-small text-default-500"
                  size="sm"
                  variant="light"
                  endContent={<MoveUpRight />}
                >
                  Ver página del hotel
                </Button>
              </div>
            </DrawerHeader>
            <DrawerBody className="pt-16">
              <div className="flex w-full justify-center items-center pt-4">
                <Image
                  isBlurred
                  isZoomed
                  alt={hotel.name}
                  className="aspect-video object-cover w-full hover:scale-105"
                  height={300}
                  src={hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery[0].url : hotel.logo}
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold leading-7">{hotel.name}</h1>
                  <Chip color={hotel.active ? 'success' : 'danger'} size="sm" variant="flat">
                    {hotel.active ? 'Activo' : 'Inactivo'}
                  </Chip>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-default-500">{location}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-default-500">{hotel.category} estrellas</p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {/* Galería de imágenes */}
                  {hotel.gallery && hotel.gallery.length > 0 && (
                    <div className="flex flex-col mt-4 gap-2">
                      <h2 className="text-medium font-medium">Galería de imágenes</h2>
                      <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-4 pb-4">
                          {hotel.gallery.map((image: { url: string; description?: string }, index: number) => (
                            <Image
                              key={index}
                              alt={image.description || `Imagen ${index + 1}`}
                              className="rounded-md aspect-video object-cover"
                              height={100}
                              width={200}
                              src={image.url}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Descripción */}
                  <div className="flex flex-col mt-4 gap-2">
                    <h2 className="text-medium font-medium">Descripción</h2>
                    <p className="text-small text-default-600">{hotel.description}</p>
                  </div>

                  {/* Tipos de habitaciones */}
                  {hotel.rooms && (
                    <div className="flex flex-col mt-4 gap-2">
                      <h2 className="text-medium font-medium">Tipos de habitaciones</h2>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(hotel.rooms).map(
                          ([roomType, roomInfo]: [string, RoomInventory], index: number) =>
                            roomInfo.enabled && (
                              <Card key={index} className="py-2">
                                <CardBody className="flex flex-row gap-3 py-2">
                                  <div className="flex-1">
                                    <h3 className="text-small font-medium">
                                      {roomType === 'singleRoom'
                                        ? 'Habitación Individual'
                                        : roomType === 'twinRoom'
                                        ? 'Habitación Doble'
                                        : roomType === 'queenRoom'
                                        ? 'Habitación Queen'
                                        : roomType}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                      <User className="h-3.5 w-3.5 text-gray-500" />
                                      <p className="text-xs text-default-500">Disponibles: {roomInfo.available}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                                      <p className="text-small font-medium">
                                        {roomInfo.price.toLocaleString('es-CO')} COP
                                      </p>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="flex flex-col mt-4 gap-2">
                    <h2 className="text-medium font-medium">Información adicional</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-small text-default-600">Categoría: {hotel.category} estrellas</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-500" />
                        <p className="text-small text-default-600">Calificación: {hotel.rating}/5</p>
                      </div>
                      {hotel.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <p className="text-small text-default-600">
                            Creado:{' '}
                            {typeof hotel.createdAt === 'object' && 'seconds' in hotel.createdAt
                              ? new Date(hotel.createdAt.seconds * 1000).toLocaleDateString()
                              : hotel.createdAt instanceof Date
                              ? hotel.createdAt.toLocaleDateString()
                              : 'Fecha desconocida'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
