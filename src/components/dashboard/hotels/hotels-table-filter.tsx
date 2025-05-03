'use client';

import React, { useState } from 'react';
import { Card, CardBody, Select, SelectItem } from '@heroui/react';

export default function HotelsTableFilter() {
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  return (
    <Card className="p-4">
      <CardBody>
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <Select value={location} onChange={(e) => setLocation(e.target.value)}>
            <SelectItem key="all" value="all">Todas las ubicaciones</SelectItem>
            <SelectItem key="cartagena" value="cartagena">Cartagena</SelectItem>
            <SelectItem key="medellin" value="medellin">Medellín</SelectItem>
            <SelectItem key="bogota" value="bogota">Bogotá</SelectItem>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <SelectItem key="all" value="all">Todas las categorías</SelectItem>
            <SelectItem key="5stars" value="5stars">5 Estrellas</SelectItem>
            <SelectItem key="4stars" value="4stars">4 Estrellas</SelectItem>
            <SelectItem key="3stars" value="3stars">3 Estrellas</SelectItem>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <SelectItem key="all" value="all">Todos los estados</SelectItem>
            <SelectItem key="active" value="active">Activo</SelectItem>
            <SelectItem key="review" value="review">En revisión</SelectItem>
          </Select>
        </div>
      </CardBody>
    </Card>
  );
}
