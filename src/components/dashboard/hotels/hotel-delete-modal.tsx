'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { deleteHotel } from '@/services/hotel';
import { toast } from 'sonner';

interface HotelDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  hotelId?: string;
  hotelName?: string;
}

export default function HotelDeleteModal({ isOpen, onClose, onSuccess, hotelId, hotelName }: HotelDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async () => {
    if (!hotelId) {
      setError('ID del hotel no proporcionado');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await deleteHotel(hotelId);

      if (result.success) {
        toast.success('Hotel eliminado exitosamente');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(`Error al eliminar el hotel: ${result.error}`);
        toast.error(`Error al eliminar el hotel: ${result.error}`);
      }
    } catch (err) {
      console.error('Error al eliminar hotel:', err);
      setError('Ocurrió un error al eliminar el hotel. Por favor, inténtalo de nuevo.');
      toast.error('Ocurrió un error al eliminar el hotel. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span>Eliminar Hotel</span>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar el hotel{' '}
              <span className="font-semibold">{hotelName || 'seleccionado'}</span>?
            </p>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer y eliminará permanentemente todos los datos asociados con este hotel.
            </p>
            {error && <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button color="danger" type="button" isLoading={isLoading} disabled={isLoading} onPress={handleDelete}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
