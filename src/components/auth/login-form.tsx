'use client';

import { useState } from 'react';
import { Input, Checkbox, Button } from '@heroui/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import GoogleLogo from '@/assets/icons/GoogleLogo';
import Link from 'next/link';

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col  w-full">
        <h2 className="mt-2 text-3xl font-bold">Hola 👋</h2>
        <p className="mt-2 text-gray-600">Bienvenido a Vaova Hotels</p>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <Input id="email" type="email" placeholder="email@example.com" />

          <Input
            id="password"
            type={isVisible ? 'text' : 'password'}
            placeholder="Enter your password"
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
          <Button type="submit" color="primary" fullWidth size="lg">
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
          <Link href="#" className="font-medium text-primary hover:text-primary/80">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
