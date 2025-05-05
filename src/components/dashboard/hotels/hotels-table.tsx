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

// Usamos colores de HeroUI directamente en los componentes

export default function HotelsTable() {
  // Usar el hook personalizado para obtener los hoteles del usuario
  const { hotels, isLoading, isError, error, refetch } = useHotels();

  // Estado para los filtros de la tabla
  const [filters, setFilters] = useState<HotelFilters>({
    category: 'all',
    status: 'all',
  });

  // Filtrar hoteles basados en los filtros seleccionados
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // Filtrar por categoría
      if (filters.category !== 'all' && hotel.category.toString() !== filters.category) {
        return false;
      }

      // Filtrar por estado
      if (filters.status !== 'all' && hotel.active.toString() !== filters.status) {
        return false;
      }

      return true;
    });
  }, [hotels, filters]);

  // Hook para manejar el modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook para manejar el modal de edición
  const [editHotelId, setEditHotelId] = useState<string | null>(null);

  // Estado para manejar el modal de eliminación
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    hotelId: undefined as string | undefined,
    hotelName: undefined as string | undefined,
  });

  // Función para actualizar los hoteles después de crear o editar uno
  const handleHotelCreated = () => {
    refetch();
  };

  // Función para abrir el modal de edición
  const handleEditHotel = (hotelId: string) => {
    setEditHotelId(hotelId);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditHotelId(null);
  };

  // Función para abrir el modal de eliminación
  const handleDeleteHotel = (hotel: HotelType) => {
    setDeleteModalState({
      isOpen: true,
      hotelId: hotel.id,
      hotelName: hotel.name,
    });
  };

  // Función para cerrar el modal de eliminación
  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      hotelId: undefined,
      hotelName: undefined,
    });
  };

  return (
    <div className="flex gap-6 mt-6">
      <div className="w-1/4">
        <HotelsTableFilter onFilter={setFilters} />
      </div>
      <div className="w-3/4">
        <div className="shadow-md rounded-xl bg-white p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Hoteles</h2>
            <Button color="primary" onPress={() => setIsModalOpen(true)} endContent={<Plus size={16} />}>
              Nuevo Hotel
            </Button>
          </div>

          {/* Componente de filtro */}

          {/* Mostrar cargador mientras se obtienen los datos */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Spinner size="lg" />
            </div>
          )}

          {/* Mostrar mensaje de error si hay algún problema */}
          {isError && (
            <div className="text-center py-10 text-red-500">
              Error al cargar los hoteles: {error instanceof Error ? error.message : 'Error desconocido'}
            </div>
          )}

          {/* Mostrar mensaje si no hay hoteles */}
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
                          <Button isIconOnly size="sm" variant="light" onPress={() => console.log('Ver', hotel.id)}>
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
          )}
          {/* Modal para crear un nuevo hotel */}
          <HotelFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleHotelCreated} />

          {/* Modal para editar un hotel existente */}
          <HotelFormModal
            isOpen={!!editHotelId}
            onClose={handleCloseEditModal}
            onSuccess={handleHotelCreated}
            hotelId={editHotelId || undefined}
          />

          {/* Modal para eliminar un hotel */}
          <HotelDeleteModal
            isOpen={deleteModalState.isOpen}
            onClose={handleCloseDeleteModal}
            onSuccess={handleHotelCreated}
            hotelId={deleteModalState.hotelId}
            hotelName={deleteModalState.hotelName}
          />
        </div>
      </div>
    </div>
  );
}
