'use client';

import React from 'react';
import { useState } from 'react';
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
} from '@heroui/react';

// Definición de tipos
type Hotel = {
  id: string;
  name: string;
  location: string;
  rating: number;
  status: 'Activo' | 'En revisión';
  image: string;
};

const columns = [
  { name: 'Hotel', uid: 'name' },
  { name: 'Ubicación', uid: 'location' },
  { name: 'Calificación', uid: 'rating' },
  { name: 'Estado', uid: 'status' },
  { name: 'Acciones', uid: 'actions' },
];

const statusColorMap = {
  Activo: 'primary',
  'En revisión': 'warning',
};

export default function HotelsTable() {
  // Datos de ejemplo
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      id: '1',
      name: 'Hotel Costa Azul',
      location: 'Cartagena',
      rating: 4.8,
      status: 'Activo',
      image:
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      name: 'Gran Hotel Dorado',
      location: 'Medellín',
      rating: 4.5,
      status: 'Activo',
      image:
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      name: 'Hotel Montaña Verde',
      location: 'Bogotá',
      rating: 4.7,
      status: 'En revisión',
      image:
        'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ]);

  const renderCell = (hotel: Hotel, columnKey: string) => {
    const cellValue = hotel[columnKey as keyof Hotel];

    switch (columnKey) {
      case 'name':
        return <User avatarProps={{ radius: 'lg', src: hotel.image }} name={cellValue} />;
      case 'location':
        return (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{cellValue}</span>
          </div>
        );
      case 'rating':
        return (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{cellValue}</span>
          </div>
        );
      case 'status':
        return (
          <Chip color={statusColorMap[cellValue]} size="sm">
            {cellValue}
          </Chip>
        );
      case 'actions':
        return (
          <div className="flex gap-2">
            <Tooltip content="Editar">
              <button className="p-1.5 rounded-md hover:bg-gray-100">
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
            </Tooltip>
            <Tooltip content="Ver">
              <button className="p-1.5 rounded-md hover:bg-gray-100">
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </Tooltip>
            <Tooltip content="Eliminar">
              <button className="p-1.5 rounded-md hover:bg-gray-100">
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="w-full  mx-auto   ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Lista de Hoteles</h1>
        <Button color="primary">
          {' '}
          <Plus />
          Agregar Hotel
        </Button>
      </div>

      <Table aria-label="Tabla de hoteles">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={hotels}>
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
