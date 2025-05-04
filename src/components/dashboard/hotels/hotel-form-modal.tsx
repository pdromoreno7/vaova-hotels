'use client';

import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
} from '@heroui/react';
import FileUploaderMultiple, { FileWithPreview } from './file-uploader-multiple';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Hotel } from '@/interface/hotels.interface';
import { createHotel } from '@/services/hotel';
import { toast } from 'sonner';
import { useSession } from '@/hooks/useSession';

function HotelFormModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  // Estado para manejar las imágenes de la galería
  const [galleryFiles, setGalleryFiles] = useState<FileWithPreview[]>([]);

  // Estado para manejar el logo
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Estado para manejar la carga
  const [isLoading, setIsLoading] = useState(false);

  // Estado para manejar errores
  const [error, setError] = useState<string>('');

  // Obtener la sesión del usuario usando el hook
  const { session, isAuthenticated } = useSession();
  const { control, handleSubmit, watch } = useForm<Partial<Hotel>>({
    defaultValues: {
      name: '',
      description: '',
      country: '',
      state: '',
      city: '',
      category: 3,
      rating: 4.0,
      // logo se establece después de subir el archivo
      active: true,
      rooms: {
        singleRoom: { enabled: false, available: 0, price: 0 },
        twinRoom: { enabled: false, available: 0, price: 0 },
        queenRoom: { enabled: false, available: 0, price: 0 },
      },
      gallery: [],
    },
  });

  // Watch para los checkboxes de habitaciones
  const watchRooms = watch('rooms');

  const onSubmit = async (data: Partial<Hotel>) => {
    try {
      setIsLoading(true);
      setError('');

      // Verificar si el usuario está autenticado
      if (!isAuthenticated || !session) {
        setError('Debes iniciar sesión para crear un hotel');
        toast.error('Debes iniciar sesión para crear un hotel');
        setIsLoading(false);
        return;
      }

      // Asignar el ID del usuario como creador
      const hotelData = {
        ...data,
        createdBy: session.id,
      };

      // Crear el hotel en Firebase
      const result = await createHotel(hotelData, galleryFiles, logoFile || undefined);

      if (result.success) {
        toast.success('¡Hotel creado exitosamente!');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(`Error al crear el hotel: ${result.error}`);
        toast.error(`Error al crear el hotel: ${result.error}`);
      }
    } catch (err) {
      console.error('Error al crear hotel:', err);
      setError('Ocurrió un error al crear el hotel. Por favor, inténtalo de nuevo.');
      toast.error('Ocurrió un error al crear el hotel. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span>Nuevo Hotel</span>
        </ModalHeader>
        <form id="hotel-form" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="gap-4">
            <ScrollArea className="h-[calc(100vh-18rem)]">
              <p className="text-sm text-gray-600 mb-4">
                Complete la información del perfil del hotel. Haga clic en guardar cuando termine.
              </p>

              <div className="space-y-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input label="Nombre del Hotel" {...field} placeholder="Ingrese el nombre del hotel" />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Descripción"
                      {...field}
                      placeholder="Describa el hotel"
                      className="min-h-[100px]"
                    />
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => <Input label="País" {...field} placeholder="País" />}
                  />
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => <Input label="Departamento" {...field} placeholder="Departamento" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input label="Municipio o Localidad" {...field} placeholder="Municipio o localidad" />
                    )}
                  />
                  <Controller
                    name="category"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <Select
                        label="Tipo de Hotel"
                        placeholder="Seleccione el tipo"
                        selectedKeys={value ? [value.toString()] : []}
                        onSelectionChange={(keys) => onChange(Number([...keys][0]))}
                        {...field}
                      >
                        <SelectItem key="3">3 Estrellas</SelectItem>
                        <SelectItem key="4">4 Estrellas</SelectItem>
                        <SelectItem key="5">5 Estrellas</SelectItem>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <Select
                        label="Calificación"
                        placeholder="Seleccione la calificación"
                        selectedKeys={value ? [value.toString()] : []}
                        onSelectionChange={(keys) => onChange(Number([...keys][0]))}
                        {...field}
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating.toString()}>{rating.toFixed(1)}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    name="active"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <Select
                        label="Estado"
                        placeholder="Seleccione el estado"
                        selectedKeys={value ? [value.toString()] : []}
                        onSelectionChange={(keys) => onChange([...keys][0] === 'true')}
                        {...field}
                      >
                        <SelectItem key="true">Activo</SelectItem>
                        <SelectItem key="false">Inactivo</SelectItem>
                      </Select>
                    )}
                  />
                </div>
                {/* Logo del hotel */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Logo del Hotel</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  {logoFile && <div className="mt-2 text-sm text-gray-500">Archivo seleccionado: {logoFile.name}</div>}
                </div>

                {/* Galería de imágenes */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Galería de Imágenes</p>
                  <FileUploaderMultiple onFilesChange={setGalleryFiles} />
                </div>

                {/* Mostrar error si existe */}
                {error && <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

                <div>
                  <h4 className="text-base font-medium mb-4">Tipos de Habitaciones Disponibles</h4>
                  <div className="space-y-6">
                    {/* Habitación Sencilla (Single Room) */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Controller
                        name="rooms.singleRoom.enabled"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                          <Checkbox
                            {...field}
                            isSelected={value}
                            onValueChange={(isSelected) => onChange(isSelected)}
                            size="md"
                          >
                            <span className="font-medium">Habitación Sencilla (Single Room)</span>
                          </Checkbox>
                        )}
                      />

                      {/* Mostrar campos solo si está habilitado */}
                      <div
                        className={`mt-4 grid grid-cols-2 gap-4 ${
                          !watchRooms?.singleRoom?.enabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <Controller
                          name="rooms.singleRoom.available"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              label="Cantidad disponible"
                              placeholder="0"
                              value={value?.toString()}
                              onChange={(e) => onChange(Number(e.target.value))}
                              isDisabled={!control._formValues.rooms?.singleRoom?.enabled}
                            />
                          )}
                        />
                        <Controller
                          name="rooms.singleRoom.price"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              label="Precio por noche"
                              placeholder="0"
                              startContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-small text-default-400">$</span>
                                </div>
                              }
                              value={value?.toString()}
                              onChange={(e) => onChange(Number(e.target.value))}
                              isDisabled={!control._formValues.rooms?.singleRoom?.enabled}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Habitación con dos camas (Two Twin Bedroom) */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Controller
                        name="rooms.twinRoom.enabled"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                          <Checkbox
                            {...field}
                            isSelected={value}
                            onValueChange={(isSelected) => onChange(isSelected)}
                            size="md"
                          >
                            <span className="font-medium">Habitación con dos camas (Two Twin Bedroom)</span>
                          </Checkbox>
                        )}
                      />

                      {/* Mostrar campos solo si está habilitado */}
                      <div
                        className={`mt-4 grid grid-cols-2 gap-4 ${
                          !watchRooms?.twinRoom?.enabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <Controller
                          name="rooms.twinRoom.available"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              label="Cantidad disponible"
                              placeholder="0"
                              value={value?.toString()}
                              onChange={(e) => onChange(Number(e.target.value))}
                              isDisabled={!control._formValues.rooms?.twinRoom?.enabled}
                            />
                          )}
                        />
                        <Controller
                          name="rooms.twinRoom.price"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              label="Precio por noche"
                              placeholder="0"
                              startContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-small text-default-400">$</span>
                                </div>
                              }
                              value={value?.toString()}
                              onChange={(e) => onChange(Number(e.target.value))}
                              isDisabled={!control._formValues.rooms?.twinRoom?.enabled}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Un dormitorio de matrimonio (One Queen Bedroom) */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Controller
                        name="rooms.queenRoom.enabled"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                          <Checkbox
                            {...field}
                            isSelected={value}
                            onValueChange={(isSelected) => onChange(isSelected)}
                            size="md"
                          >
                            <span className="font-medium">Un dormitorio de matrimonio (One Queen Bedroom)</span>
                          </Checkbox>
                        )}
                      />

                      {/* Mostrar campos solo si está habilitado */}
                      <div
                        className={`mt-4 grid grid-cols-2 gap-4 ${
                          !watchRooms?.queenRoom?.enabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <Controller
                          name="rooms.queenRoom.available"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              label="Cantidad disponible"
                              placeholder="0"
                              value={value?.toString()}
                              onChange={(e) => onChange(Number(e.target.value))}
                              isDisabled={!control._formValues.rooms?.queenRoom?.enabled}
                            />
                          )}
                        />
                        <Controller
                          name="rooms.queenRoom.price"
                          control={control}
                          render={({ field: { value, onChange, ...field } }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              label="Precio por noche"
                              placeholder="0"
                              startContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-small text-default-400">$</span>
                                </div>
                              }
                              value={value?.toString()}
                              onChange={(e) => onChange(Number(e.target.value))}
                              isDisabled={!control._formValues.rooms?.queenRoom?.enabled}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="ghost" onPress={onClose} isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" form="hotel-form" isLoading={isLoading} isDisabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default HotelFormModal;
