'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Avatar, Chip } from '@heroui/react';
import { Star, MapPin, Trash2 } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * FavoritesDrawer component
 * Displays a drawer containing a list of favorite hotels.
 * Allows users to view details or remove hotels from favorites.
 *
 * Props:
 * - isOpen: Determines if the drawer is open.
 * - onOpenChange: Callback to handle changes in drawer open state.
 *
 * Uses the favorites context to manage favorite hotels.
 *
 * @returns A JSX element representing the favorites drawer.
 */
const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ isOpen, onOpenChange }) => {
  const { favorites, removeFavorite } = useFavorites();
  const { lang } = useParams();

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Mis Hoteles Favoritos</h2>
              <p className="text-sm text-gray-500">
                {favorites.length} {favorites.length === 1 ? 'hotel' : 'hoteles'} guardados
              </p>
            </DrawerHeader>
            <DrawerBody>
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-gray-500 mb-2">No has agregado hoteles a favoritos</p>
                  <p className="text-sm text-gray-400">
                    Haz clic en el icono de corazón en cualquier hotel para agregarlo a tus favoritos
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((hotel) => (
                    <div key={hotel.id} className="border rounded-xl overflow-hidden flex flex-col bg-gray-50">
                      <div className="relative h-32 w-full">
                        <Image
                          src={
                            hotel.gallery && hotel.gallery.length > 0
                              ? hotel.gallery[0].url
                              : hotel.logo || '/placeholder.svg'
                          }
                          alt={hotel.name}
                          className="object-cover"
                          fill
                        />
                        <div className="absolute top-2 right-2">
                          <Avatar
                            src={hotel.logo}
                            fallback={hotel.name.substring(0, 2).toUpperCase()}
                            className="w-8 h-8 text-tiny border-2 border-white"
                            isBordered
                            color="default"
                          />
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{hotel.name}</h3>
                          <Chip
                            size="sm"
                            color={hotel.active ? 'success' : 'danger'}
                            variant={hotel.active ? 'solid' : 'bordered'}
                          >
                            {hotel.active ? 'activo' : 'inactivo'}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{`${hotel.city}, ${hotel.state}`}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{hotel.category} Estrellas</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Precio</p>
                            <p className="font-bold">${hotel.rooms.singleRoom.price.toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              isIconOnly
                              onPress={() => removeFavorite(hotel.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              as={Link}
                              href={`/${lang}/hotels/${hotel.id}`}
                              size="sm"
                              color="primary"
                              onClick={onClose}
                            >
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default FavoritesDrawer;
