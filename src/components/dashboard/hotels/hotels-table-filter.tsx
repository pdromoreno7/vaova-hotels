'use client';

import React, { useState } from 'react';
import { Card, CardBody, Select, SelectItem, Button } from '@heroui/react';
import { FilterIcon } from 'lucide-react';

// Definición de tipos para los filtros
export interface HotelFilters {
  category: string;
  status: string;
}

interface HotelsTableFilterProps {
  onFilter: (filters: HotelFilters) => void;
}

export default function HotelsTableFilter({ onFilter }: HotelsTableFilterProps) {
  // Estados para los filtros
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Función para aplicar los filtros
  const handleApplyFilters = () => {
    onFilter({
      category,
      status,
    });
  };

  // Función para restablecer los filtros
  const handleResetFilters = () => {
    setCategory('all');
    setStatus('all');
    onFilter({
      category: 'all',
      status: 'all',
    });
  };

  return (
    <Card className="p-4">
      <CardBody>
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <Select
            selectedKeys={[category]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              if (selected) setCategory(selected.toString());
            }}
          >
            <SelectItem key="all">Todas las categorías</SelectItem>
            <SelectItem key="5">5 Estrellas</SelectItem>
            <SelectItem key="4">4 Estrellas</SelectItem>
            <SelectItem key="3">3 Estrellas</SelectItem>
            <SelectItem key="2">2 Estrellas</SelectItem>
            <SelectItem key="1">1 Estrella</SelectItem>
          </Select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <Select
            selectedKeys={[status]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              if (selected) setStatus(selected.toString());
            }}
          >
            <SelectItem key="all">Todos los estados</SelectItem>
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        </div>

        <div className="flex  flex-col sm:flex-row gap-2">
          <Button
            color="primary"
            className="w-full"
            startContent={<FilterIcon size={16} />}
            onPress={handleApplyFilters}
          >
            Filtrar
          </Button>
          <Button variant="bordered" className="w-full" onPress={handleResetFilters}>
            Limpiar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
