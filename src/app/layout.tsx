'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import Header from '@/components/partials/header';
import { usePathname } from 'next/navigation';
// import ThemeSwitch from '@/components/partials/ThemeSwitch';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/auth');

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <Providers>
          {!isAuthPage && <Header />}
          {children}
          <Toaster richColors position="top-right" />
          {/* <ThemeSwitch /> */}
        </Providers>
      </body>
    </html>
  );
}
