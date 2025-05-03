'use client';

import { useState } from 'react';
import { Input, Checkbox, Button } from '@heroui/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import GoogleLogo from '@/assets/icons/GoogleLogo';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'next/navigation';

interface IRegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterForm() {
  const { lang } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: IRegisterForm) => {
    console.log('Register data:', data);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col  w-full">
        <h2 className="mt-2 text-3xl font-bold">Registro</h2>
        <p className="mt-2 text-gray-600">Crea tu cuenta en Vaova Hotels</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{
              required: { value: true, message: 'Nombre es requerido' },
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 50, message: 'Máximo 50 caracteres' },
            }}
            render={({ field }) => (
              <Input {...field} id="name" label="Nombre" placeholder="Tu nombre" isInvalid={!!errors.name} />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: { value: true, message: 'Email es requerido' },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email no válido',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                label="Email"
                type="email"
                placeholder="email@example.com"
                isInvalid={!!errors.email}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: { value: true, message: 'Password es requerido' },
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              maxLength: { value: 20, message: 'Máximo 20 caracteres' },
              pattern: {
                value: /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-zñÑ\d@$!%*?&#.-]{8,}$/,
                message: 'Password debe tener al menos una mayúscula, una minúscula, un número y un carácter especial',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                label="Password"
                type={isVisible ? 'text' : 'password'}
                placeholder="Contraseña"
                isInvalid={!!errors.password}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                }
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox id="terms" size="sm">
              <span className="text-sm">Acepto los términos y condiciones</span>
            </Checkbox>
          </div>
        </div>

        <div className="w-full">
          <Button type="submit" color="primary" fullWidth size="lg" disabled={isSubmitting}>
            Registrarse
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O registrarse con</span>
            </div>
          </div>

          <div className="mt-6  gap-3">
            <Button
              size="lg"
              type="button"
              fullWidth
              className="flex items-center justify-center gap-2  border border-gray-300 bg-black p-3 text-white hover:bg-gray-900"
            >
              <GoogleLogo className="h-5 w-5" />
              <span>Registrarse con Google</span>
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href={`/${lang}/auth/login`} className="font-medium text-primary hover:text-primary/80">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
