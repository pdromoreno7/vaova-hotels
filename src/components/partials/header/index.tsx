'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { Button, useDisclosure } from '@heroui/react';
import Wrapper from '@/layouts/Wrapper';
import { useSession } from '@/hooks/useSession';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { LogoutModal } from '../Logout-modal';
import VaovaHotelsLogo from '@/assets/brand/vaova-hotels-logo';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const { isAuthenticated, clearSession } = useSession();
  const { lang } = useParams();
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onOpen();
  };

  const confirmLogout = () => {
    clearSession();
    onClose();
    router.push(`/${lang}/auth/login`);
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
              <nav className="hidden items-center gap-2 md:flex md:gap-7"></nav>
            </div>

            <div className="flex items-center space-x-4">
              {!isDashboard && (
                <Button color="primary" as={Link} href={`/${lang}/dashboard`}>
                  Dashboard
                </Button>
              )}
              <Button isIconOnly onPress={handleLogout} variant="ghost" className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>

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
          <div className="flex flex-col space-y-4 pt-8">
            {isAuthenticated ? (
              <>
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
                >
                  <LogOut className="h-5 w-5" />
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
    </>
  );
}

export default Header;
