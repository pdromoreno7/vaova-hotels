'use client';

import { useState } from 'react';
import { Input, Checkbox, Button } from '@heroui/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import GoogleLogo from '@/assets/icons/GoogleLogo';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { loginWithEmailAndPassword, loginWithGoogle } from '@/services/auth';
import { toast } from 'sonner';

interface ILoginForm {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { lang } = useParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast.success('Inicio de sesión con Google exitoso');

        router.push(`/${lang}/dashboard`);
      } else {
        toast.error('Error al iniciar sesión con Google');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión con Google');
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const onSubmit = async (data: ILoginForm) => {
    try {
      const result = await loginWithEmailAndPassword(data.email, data.password);
      if (result.success) {
        toast.success('Inicio de sesión exitoso');
        console.log('Usuario inició sesión:', result.user);
        // La sesión ya se guarda en sessionStorage en loginWithEmailAndPassword
        router.push(`/${lang}/dashboard`);
      } else {
        toast.error('Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col  w-full">
        <h2 className="mt-2 text-3xl font-bold">Hola 👋</h2>
        <p className="mt-2 text-gray-600">Bienvenido a Vaova Hotels</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
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
            <Checkbox id="remember-me" size="sm">
              <span className="text-sm">Recordarme</span>
            </Checkbox>
          </div>

          <div className="text-sm">
            <Link href="#" className="text-gray-600 hover:text-gray-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <div className="w-full">
          <Button type="submit" color="primary" fullWidth size="lg" disabled={isSubmitting}>
            Iniciar sesión
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O iniciar con</span>
            </div>
          </div>

          <div className="mt-6  gap-3">
            <Button
              size="lg"
              type="button"
              fullWidth
              className="flex items-center justify-center gap-2  border border-gray-300 bg-black p-3 text-white hover:bg-gray-900"
              onClick={handleGoogleLogin}
            >
              <GoogleLogo className="h-5 w-5" />
              <span>Iniciar con Google</span>
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          No tienes una cuenta?{' '}
          <Link href={`/${lang}/auth/register`} className="font-medium text-primary hover:text-primary/80">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
