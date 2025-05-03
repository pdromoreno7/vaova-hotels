'use client';

import { useForm, Controller } from 'react-hook-form';
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
import FileUploaderMultiple from './file-uploader-multiple';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HotelFormData {
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  category: string;
  rating: string;
  logo: string;
  roomTypes: {
    singleRoom: { available: boolean; price: number };
    twinRoom: { available: boolean; price: number };
    queenRoom: { available: boolean; price: number };
  };
}

function HotelFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { control, handleSubmit } = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      description: '',
      country: '',
      state: '',
      city: '',
      category: '3',
      rating: '4.0',
      logo: '',
      roomTypes: {
        singleRoom: { available: false, price: 0 },
        twinRoom: { available: false, price: 0 },
        queenRoom: { available: false, price: 0 },
      },
    },
  });

  const onSubmit = (data: HotelFormData) => {
    console.log('Hotel data:', data);
    onClose();
  };

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Nuevo Hotel</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    name="logo"
                    control={control}
                    render={({ field }) => <Input label="Logo del Hotel" {...field} placeholder="URL del Logo" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select label="Tipo de Hotel" placeholder="Seleccione el tipo" {...field}>
                        <SelectItem key="3" value="3">
                          3 Estrellas
                        </SelectItem>
                        <SelectItem key="4" value="4">
                          4 Estrellas
                        </SelectItem>
                        <SelectItem key="5" value="5">
                          5 Estrellas
                        </SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Select label="Calificación" placeholder="Seleccione la calificación" {...field}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating.toFixed(1)}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
                <FileUploaderMultiple />

                <div>
                  <h4 className="text-base font-medium mb-4">Tipos de Habitaciones Disponibles</h4>
                  <div className="flex flex-col gap-4">
                    <Controller
                      name="roomTypes.singleRoom.available"
                      control={control}
                      render={({ field: { value, ...field } }) => (
                        <Checkbox
                          {...field}
                          isSelected={value}
                          onValueChange={(isSelected) => field.onChange(isSelected)}
                          size="md"
                        >
                          Habitación Sencilla (Single Room)
                        </Checkbox>
                      )}
                    />
                    <Controller
                      name="roomTypes.twinRoom.available"
                      control={control}
                      render={({ field: { value, ...field } }) => (
                        <Checkbox
                          {...field}
                          isSelected={value}
                          onValueChange={(isSelected) => field.onChange(isSelected)}
                          size="md"
                        >
                          Habitación con dos camas (Two Twin Bedroom)
                        </Checkbox>
                      )}
                    />
                    <Controller
                      name="roomTypes.queenRoom.available"
                      control={control}
                      render={({ field: { value, ...field } }) => (
                        <Checkbox
                          {...field}
                          isSelected={value}
                          onValueChange={(isSelected) => field.onChange(isSelected)}
                          size="md"
                        >
                          Un dormitorio de matrimonio (One Queen Bedroom)
                        </Checkbox>
                      )}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </ModalBody>
          <ModalFooter className="flex gap-4">
            <Button color="danger" variant="flat" onPress={onClose}>
              Cerrar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default HotelFormModal;
