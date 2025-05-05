'use client';
import { Card, CardBody } from '@heroui/react';
import { Hotel, BarChart, Calendar, DollarSign } from 'lucide-react';

const cardData = [
  { icon: <Hotel />, label: 'Hoteles Activos', value: 24 },
  { icon: <BarChart />, label: 'Ocupación Promedio', value: '76%' },
  { icon: <Calendar />, label: 'Reservas del Mes', value: 156 },
  { icon: <DollarSign />, label: 'Ingresos Totales', value: '$45,890' },
];

export default function CardsInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cardData.map((card, index) => (
        <Card key={index} className="flex items-center p-4">
          <CardBody className="w-full">
            <div className="flex items-center gap-4">
              <div className="text-primary">{card.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-xl font-bold text-black">{card.value}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
