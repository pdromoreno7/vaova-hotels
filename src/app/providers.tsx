'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  // Crear una instancia de QueryClient para cada sesión del cliente
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // No consultar cuando la ventana recupera el foco
            staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar los datos obsoletos
            retry: 1, // Solo intentar una vez si falla
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <FavoritesProvider>{children}</FavoritesProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
