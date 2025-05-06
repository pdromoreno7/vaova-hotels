'use client';

import React from 'react';
import { useState, useMemo } from 'react';
import { MapPin, Star, Edit2, Eye, Trash2, Plus } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  Spinner,
} from '@heroui/react';
import HotelFormModal from './hotel-form-modal';
import HotelDeleteModal from './hotel-delete-modal';
import HotelsTableFilter, { HotelFilters } from './hotels-table-filter';
import { useHotels } from '@/hooks/useHotels';
import { Hotel as HotelType } from '@/interface/hotels.interface';
import DrawerDetailHotel from './drawer-detail-hotel';

// We use HeroUI colors directly in components

/**
 * Component that displays a table with the list of user's hotels.
 * It includes features to filter hotels by category and status,
 * as well as to create, edit and delete hotels.
 *
 * @returns A JSX component that represents the hotels table.
 */
export default function HotelsTable() {
  // Use the custom hook to get the user's hotels
  const { hotels, isLoading, isError, error, refetch } = useHotels();

  // State for table filters
  const [filters, setFilters] = useState<HotelFilters>({
    category: 'all',
    status: 'all',
  });

  // State for the hotel details drawer
  const [detailDrawerState, setDetailDrawerState] = useState({
    isOpen: false,
    hotel: null as HotelType | null,
  });

  // Filter hotels based on selected filters
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // Filter by category
      if (filters.category !== 'all' && hotel.category.toString() !== filters.category) {
        return false;
      }

      // Filter by status
      if (filters.status !== 'all' && hotel.active.toString() !== filters.status) {
        return false;
      }

      return true;
    });
  }, [hotels, filters]);

  // State for the create hotel modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the edit hotel modal
  const [editHotelId, setEditHotelId] = useState<string | null>(null);

  // State for the delete hotel modal
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    hotelId: undefined as string | undefined,
    hotelName: undefined as string | undefined,
  });

  // Function to update hotels after creating or editing one
  const handleHotelCreated = () => {
    refetch();
  };

  // Function to open the edit hotel modal
  const handleEditHotel = (hotelId: string) => {
    setEditHotelId(hotelId);
  };

  // Function to close the edit hotel modal
  const handleCloseEditModal = () => {
    setEditHotelId(null);
  };

  // Function to open the delete hotel modal
  const handleDeleteHotel = (hotel: HotelType) => {
    setDeleteModalState({
      isOpen: true,
      hotelId: hotel.id,
      hotelName: hotel.name,
    });
  };

  // Function to close the delete hotel modal
  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      hotelId: undefined,
      hotelName: undefined,
    });
  };

  const TableHotelsComponent = () => {
    return (
      <div className="shadow-md rounded-xl bg-white p-4 min-h-[35vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Hoteles</h2>
          <Button color="primary" onPress={() => setIsModalOpen(true)} endContent={<Plus size={16} />}>
            Nuevo Hotel
          </Button>
        </div>

        {/* Filter component */}

        {/* Show loader while loading data */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Spinner size="lg" />
          </div>
        )}

        {/* Show error message if there is a problem */}
        {isError && (
          <div className="text-center py-10 text-red-500">
            Error al cargar los hoteles: {error instanceof Error ? error.message : 'Error desconocido'}
          </div>
        )}

        {/* Show message if there are no hotels */}
        {!isLoading && !isError && hotels.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No has creado ningún hotel todavía. ¡Crea tu primer hotel con el botón &quot;Nuevo Hotel&quot;!
          </div>
        )}

        {!isLoading && !isError && hotels.length > 0 && filteredHotels.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No se encontraron hoteles con los filtros seleccionados.
          </div>
        )}

        {!isLoading && !isError && filteredHotels.length > 0 && (
          <div>
            <Table aria-label="Tabla de hoteles">
              <TableHeader>
                <TableColumn>Hotel</TableColumn>
                <TableColumn>Ubicación</TableColumn>
                <TableColumn>Categoría</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn align="center">Acciones</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((hotel: HotelType) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <User
                        name={hotel.name}
                        avatarProps={{
                          src: hotel.logo || 'https://via.placeholder.com/150',
                          radius: 'lg',
                        }}
                        description={hotel.description ? hotel.description.substring(0, 30) + '...' : 'Hotel & Resort'}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2" size={16} />
                        {`${hotel.city || ''}, ${hotel.state || ''}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="text-amber-500 mr-1" size={16} />
                        {hotel.category || '-'} estrellas
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color={hotel.active ? 'success' : 'danger'} size="sm" variant="flat">
                        {hotel.active ? 'Activo' : 'Inactivo'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Tooltip content="Ver detalles">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setDetailDrawerState({ isOpen: true, hotel })}
                          >
                            <Eye size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Editar">
                          <Button isIconOnly size="sm" variant="light" onPress={() => handleEditHotel(hotel.id)}>
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Eliminar" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleDeleteHotel(hotel)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-6 mt-6 md:flex-row flex-col">
      <div className="md:w-1/4 w-full">
        <HotelsTableFilter onFilter={setFilters} />
      </div>
      <div className="md:w-3/4 w-full">
        <TableHotelsComponent />

        {/* Modal to create a new hotel */}
        <HotelFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleHotelCreated} />

        {/* Modal to edit an existing hotel */}
        <HotelFormModal
          isOpen={!!editHotelId}
          onClose={handleCloseEditModal}
          onSuccess={handleHotelCreated}
          hotelId={editHotelId || undefined}
        />

        {/* Modal to delete a hotel */}
        <HotelDeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={handleCloseDeleteModal}
          onSuccess={handleHotelCreated}
          hotelId={deleteModalState.hotelId}
          hotelName={deleteModalState.hotelName}
        />

        {/* Drawer to view hotel details */}
        <DrawerDetailHotel
          isOpen={detailDrawerState.isOpen}
          onClose={() => setDetailDrawerState({ isOpen: false, hotel: null })}
          hotel={detailDrawerState.hotel}
        />
      </div>
    </div>
  );
}
