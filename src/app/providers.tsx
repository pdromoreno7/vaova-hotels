'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

/**
 * The top-level component that wraps the entire application.
 *
 * It provides the HeroUIProvider, NextThemesProvider, and FavoritesProvider.
 * It also initializes a React Query client and wraps the app with it.
 *
 * @param children The children of the component.
 * @returns The Providers component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));

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
