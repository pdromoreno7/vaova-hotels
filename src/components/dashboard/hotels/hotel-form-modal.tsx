'use client';

import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  Spinner,
  Tooltip,
} from '@heroui/react';
import { Sparkles } from 'lucide-react';
import FileUploaderMultiple, { FileWithPreview } from './file-uploader-multiple';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Hotel, GalleryImage } from '@/interface/hotels.interface';
import { createHotel, updateHotel, getHotelById } from '@/services/hotel';
import { toast } from 'sonner';
import { useSession } from '@/hooks/useSession';
import { getDescriptionHotel } from '@/api/openAI';

/**
 * HotelFormModal is a modal that allows creating or editing a hotel.
 *
 * @param {HotelFormModalProps} props - Properties of the modal.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {function} props.onClose - Function that is called when the modal is closed.
 * @param {function} props.onSuccess - Function that is called when the hotel is created or edited successfully.
 * @param {string} props.hotelId - ID of the hotel to edit (optional).
 * @returns {JSX.Element} - The HotelFormModal component.
 */
function HotelFormModal({
  isOpen,
  onClose,
  onSuccess,
  hotelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  hotelId?: string;
}) {
  // State to manage gallery images
  const [galleryFiles, setGalleryFiles] = useState<FileWithPreview[]>([]);

  // State to store existing images (for editing)
  const [existingGallery, setExistingGallery] = useState<GalleryImage[]>([]);

  // State to manage the logo
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // State to store existing logo (for editing)
  const [existingLogo, setExistingLogo] = useState<string | null>(null);

  // State to manage loading
  const [isLoading, setIsLoading] = useState(false);

  // State to manage initial data loading (for editing)
  const [isLoadingHotel, setIsLoadingHotel] = useState(false);

  // State to manage errors
  const [error, setError] = useState<string>('');

  // State to manage description generation with AI
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);

  // Determine if we are in edit mode
  const isEditMode = !!hotelId;

  // Get user session using the hook
  const { session, isAuthenticated } = useSession();
  const { control, handleSubmit, watch, reset } = useForm<Partial<Hotel>>({
    defaultValues: {
      name: '',
      description: '',
      country: '',
      state: '',
      city: '',
      category: 3,
      rating: 4.0,
      active: true,
      rooms: {
        singleRoom: { enabled: false, available: 0, price: 0 },
        twinRoom: { enabled: false, available: 0, price: 0 },
        queenRoom: { enabled: false, available: 0, price: 0 },
      },
      gallery: [],
    },
  });

  // Watch for room checkboxes
  const watchRooms = watch('rooms');

  // Verify if required fields for description generation are complete
  const isGenerateButtonEnabled = () => {
    const formValues = watch();
    return (
      !!formValues.name && !!formValues.country && !!formValues.state && !!formValues.city && !!formValues.category
    );
  };

  // Function to generate description with AI
  const handleGenerateDescription = async () => {
    try {
      const formValues = watch();
      setIsLoadingDescription(true);

      // Build the information to send to AI
      const hotelInfo = `
        Nombre: ${formValues.name},
        País: ${formValues.country},
        Departamento: ${formValues.state},
        Municipio: ${formValues.city},
        Categoría: ${formValues.category} estrellas
      `;

      // Call the API to generate the description
      const result = await getDescriptionHotel(hotelInfo);

      // Update the description field with the result
      if (result?.recipe?.hotelDescription) {
        // Update the value in the form
        reset({
          ...formValues,
          description: result.recipe.hotelDescription,
        });

        toast.success('Descripción generada con éxito');
      }
    } catch (error) {
      console.error('Error al generar la descripción:', error);
      toast.error('No se pudo generar la descripción. Inténtalo de nuevo.');
    } finally {
      setIsLoadingDescription(false);
    }
  };

  // Load hotel data if we are in edit mode
  useEffect(() => {
    const fetchHotelData = async () => {
      if (isEditMode && hotelId && isOpen) {
        try {
          setIsLoadingHotel(true);
          const result = await getHotelById(hotelId);

          if (result.success && result.data) {
            // Reset the form with the hotel data
            reset(result.data);

            // Save existing images
            if (result.data.gallery && result.data.gallery.length > 0) {
              setExistingGallery(result.data.gallery);
            }

            // Save existing logo
            if (result.data.logo) {
              setExistingLogo(result.data.logo);
            }
          } else {
            toast.error(`Error al cargar el hotel: ${result.error}`);
            setError(`Error al cargar el hotel: ${result.error}`);
          }
        } catch (err) {
          console.error('Error al cargar hotel:', err);
          toast.error('Ocurrió un error al cargar el hotel. Por favor, inténtalo de nuevo.');
        } finally {
          setIsLoadingHotel(false);
        }
      }
    };

    fetchHotelData();
  }, [hotelId, isOpen, isEditMode, reset]);

  // Clean states when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setGalleryFiles([]);
      setExistingGallery([]);
      setLogoFile(null);
      setExistingLogo(null);
      setError('');
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: Partial<Hotel>) => {
    try {
      setIsLoading(true);
      setError('');

      // Verify if the user is authenticated
      if (!isAuthenticated || !session) {
        setError('Debes iniciar sesión para gestionar un hotel');
        toast.error('Debes iniciar sesión para gestionar un hotel');
        setIsLoading(false);
        return;
      }

      // Prepare hotel data
      const hotelData: Partial<Hotel> = {
        ...data,
      };

      // Only add createdBy for new hotels
      if (!isEditMode) {
        hotelData.createdBy = session.id;
      }

      // Include existing images from the gallery
      if (existingGallery.length > 0) {
        hotelData.gallery = existingGallery;
      }

      let result;

      if (isEditMode && hotelId) {
        // Update existing hotel
        result = await updateHotel(hotelId, hotelData, galleryFiles, logoFile || undefined);
        if (result.success) {
          toast.success('¡Hotel actualizado exitosamente!');
        }
      } else {
        // Crear nuevo hotel
        result = await createHotel(hotelData, galleryFiles, logoFile || undefined);
        if (result.success) {
          toast.success('¡Hotel creado exitosamente!');
        }
      }

      if (result.success) {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const action = isEditMode ? 'actualizar' : 'crear';
        setError(`Error al ${action} el hotel: ${result.error}`);
        toast.error(`Error al ${action} el hotel: ${result.error}`);
      }
    } catch (err) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} hotel:`, err);
      setError(`Ocurrió un error al ${isEditMode ? 'actualizar' : 'crear'} el hotel. Por favor, inténtalo de nuevo.`);
      toast.error(
        `Ocurrió un error al ${isEditMode ? 'actualizar' : 'crear'} el hotel. Por favor, inténtalo de nuevo.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span>{isEditMode ? 'Editar Hotel' : 'Nuevo Hotel'}</span>
        </ModalHeader>
        <form id="hotel-form" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="gap-4">
            <ScrollArea className="h-[calc(100vh-18rem)]">
              {isLoadingHotel ? (
                <div className="flex justify-center items-center h-40">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
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

                    <div className="space-y-2">
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Textarea
                              label="Descripción"
                              {...field}
                              placeholder="Describa el hotel"
                              className="min-h-[100px]"
                            />
                          </>
                        )}
                      />
                      <div className="flex justify-end mt-2">
                        <Tooltip content="Para activar el generar completa los campos de: Nombre del hotel, País, Departamento, Municipio, y tipo de hotel.">
                          <div>
                            <Button
                              size="sm"
                              color="secondary"
                              variant="flat"
                              startContent={<Sparkles className="h-4 w-4" />}
                              isDisabled={!isGenerateButtonEnabled()}
                              isLoading={isLoadingDescription}
                              onPress={handleGenerateDescription}
                            >
                              Generar
                            </Button>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
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
                      {logoFile && (
                        <div className="mt-2 text-sm text-gray-500">Archivo seleccionado: {logoFile.name}</div>
                      )}
                      {existingLogo && !logoFile && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Logo actual:</p>
                          <div className="relative h-16 w-40">
                            <Image
                              src={existingLogo}
                              alt="Logo actual"
                              fill
                              sizes="160px"
                              className="object-contain rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Galería de imágenes */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Galería de Imágenes</p>
                      <FileUploaderMultiple onFilesChange={setGalleryFiles} />
                      {existingGallery.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-2">Imágenes actuales:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {existingGallery.map((image, index) => (
                              <div key={index} className="relative group h-24 w-full">
                                <Image
                                  src={image.url}
                                  alt={image.description || `Imagen ${index + 1}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Show error if exists */}
                    {error && <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

                    <div>
                      <h4 className="text-base font-medium mb-4">Tipos de Habitaciones Disponibles</h4>
                      <div className="space-y-6">
                        {/*  (Single Room) */}
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

                          {/* Show fields only if enabled */}
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

                          {/* Show fields only if enabled */}
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

                        {/* One Queen Bedroom */}
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

                          {/* Show fields only if enabled */}
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
                </>
              )}
            </ScrollArea>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" form="hotel-form" isLoading={isLoading} disabled={isLoading}>
              {isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default HotelFormModal;
