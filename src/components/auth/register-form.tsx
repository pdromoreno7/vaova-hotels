'use client';

import { useState } from 'react';
import { Input, Button, Select, SelectItem } from '@heroui/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import GoogleLogo from '@/assets/icons/GoogleLogo';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { registerWithEmailAndPassword, signInWithGoogle } from '@/services/auth';
import { toast } from 'sonner';

interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export default function RegisterForm() {
  const { lang } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: IRegisterForm) => {
    try {
      setLoading(true);
      const result = await registerWithEmailAndPassword(data);
      if (result.success) {
        toast.success('Usuario registrado exitosamente');
        console.log('Usuario registrado exitosamente:', result.user);
      } else {
        toast.error('Error al registrar usuario');
        console.error('Error al registrar usuario:', result.error);
      }
    } catch (error) {
      toast.error('Error en el registro');
      console.error('Error en el registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      if (result.success) {
        toast.success('Usuario registrado con Google exitosamente');
        console.log('Usuario registrado con Google exitosamente:', result.user);
      } else {
        toast.error('Error al registrar con Google');
        console.error('Error al registrar con Google:', result.error);
      }
    } catch (error) {
      toast.error('Error en el registro con Google');
      console.error('Error en el registro con Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col w-full">
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
                  <button type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                label="Rol"
                placeholder="Selecciona un rol"
                className="w-full"
                isInvalid={!!errors.role}
              >
                <SelectItem key="user">Usuario</SelectItem>
                <SelectItem key="admin">Administrador</SelectItem>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" color="primary" isLoading={loading} size="lg">
            Registrarse
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O continuar con</span>
            </div>
          </div>
          <Button
            type="button"
            onPress={handleGoogleSignIn}
            isLoading={loading}
            fullWidth
            className="flex items-center justify-center gap-2  border border-gray-300 bg-black p-3 text-white hover:bg-gray-900"
            size="lg"
          >
            <GoogleLogo className="h-5 w-5" />
            <span>Iniciar con Google</span>
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link href={`/${lang}/auth/login`} className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
