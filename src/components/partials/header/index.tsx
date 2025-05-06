'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Heart } from 'lucide-react';
import HeaderButtonAvatar from './header-button-avatar';
import { Button, useDisclosure } from '@heroui/react';
import Wrapper from '@/layouts/Wrapper';
import { useSession } from '@/hooks/useSession';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { LogoutModal } from '../Logout-modal';
import VaovaHotelsLogo from '@/assets/brand/vaova-hotels-logo';
import FavoritesDrawer from './favorites-drawer';
import { useFavorites } from '@/contexts/FavoritesContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const { isAuthenticated, clearSession } = useSession();
  const { lang } = useParams();
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { isOpen: isFavoritesOpen, onOpen: onFavoritesOpen, onOpenChange: onFavoritesOpenChange } = useDisclosure();

  const { favoritesCount } = useFavorites();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onOpen();
  };

  const confirmLogout = async () => {
    try {
      // Llamar a la función asíncrona de cierre de sesión
      const result = await clearSession();
      
      if (result.success) {
        onClose();
        router.push(`/${lang}/auth/login`);
      } else {
        console.error('Error al cerrar sesión:', result.error);
        // Cerrar el modal de todos modos para no bloquear al usuario
        onClose();
      }
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      onClose();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-white transition-shadow ${hasShadow ? 'shadow-md' : ''}`}>
        <Wrapper>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-5 space-x-4">
              <Link href={`/${lang}`}>
                <div className="flex items-center pb-2">
                  <VaovaHotelsLogo />
                </div>
              </Link>
            </div>

            <nav className="hidden items-center space-x-4 md:flex">
              {isAuthenticated ? (
                <>
                  <button onClick={onFavoritesOpen} className="rounded-full relative">
                    <Heart className="h-6 w-6 text-gray-400 hover:text-black transition-colors" />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {favoritesCount > 9 ? '9+' : favoritesCount}
                      </span>
                    )}
                  </button>

                  {!isDashboard && (
                    <Button color="primary" as={Link} href={`/${lang}/dashboard`}>
                      Dashboard
                    </Button>
                  )}
                  <HeaderButtonAvatar onLogout={handleLogout} />
                </>
              ) : (
                <>
                  <Button as={Link} href={`/${lang}/auth/login`} variant="ghost">
                    Iniciar sesión
                  </Button>
                  <Button color="primary" as={Link} href={`/${lang}/auth/register`}>
                    Registrarse
                  </Button>
                </>
              )}
            </nav>
            <div className="md:hidden flex items-center">
              {isAuthenticated && <HeaderButtonAvatar onLogout={handleLogout} />}
              <button
                className="flex items-center justify-center rounded p-2 focus:outline-none md:hidden"
                onClick={toggleMenu}
                aria-label="Abrir menú"
              >
                {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </Wrapper>
      </header>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-4 pt-14">
            {isAuthenticated ? (
              <>
                <Button
                  onPress={() => {
                    toggleMenu();
                    onFavoritesOpen();
                  }}
                  className="flex items-center justify-start gap-2"
                  variant="ghost"
                >
                  <Heart className="h-5 w-5" />
                  <span>Mis favoritos</span>
                  {favoritesCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {favoritesCount}
                    </span>
                  )}
                </Button>

                {!isDashboard && (
                  <Button color="primary" as={Link} href={`/${lang}/dashboard`} className="w-full" onPress={toggleMenu}>
                    Dashboard
                  </Button>
                )}
                <Button
                  onPress={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  variant="ghost"
                  className="flex items-center justify-start gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar sesión</span>
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} href={`/${lang}/auth/login`} className="w-full" onPress={toggleMenu}>
                  Iniciar sesión
                </Button>
                <Button as={Link} href={`/${lang}/auth/register`} className="w-full" onPress={toggleMenu}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <LogoutModal isOpen={isOpen} onClose={onClose} onConfirm={confirmLogout} />

      <FavoritesDrawer isOpen={isFavoritesOpen} onOpenChange={onFavoritesOpenChange} />
    </>
  );
}

export default Header;
