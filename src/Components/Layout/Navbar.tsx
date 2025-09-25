'use client';
import { Home, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const NAV_H = 80; // px (h-20)

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);

  // Cambia estilos al scrollear
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll a secciones con offset (no queda tapado por el nav)
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const navH = headerRef.current?.offsetHeight ?? NAV_H;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 h-20 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Home className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Temporal Home
              </h1>
            </div>

            {/* Desktop */}
            <nav className="hidden md:flex space-x-12">
              <a
                href="#propiedades"
                onClick={(e) => handleAnchorClick(e, 'propiedades')}
                className="relative text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 group"
              >
                Propiedades
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
              <a
                href="#contacto"
                onClick={(e) => handleAnchorClick(e, 'contacto')}
                className="relative text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 group"
              >
                Contacto
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
              <a
                href="#nosotros"
                onClick={(e) => handleAnchorClick(e, 'nosotros')}
                className="relative text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 group"
              >
                Porque elegirnos
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
              <a
                href="#nosotros"
                onClick={(e) => handleAnchorClick(e, 'nosotros')}
                className="relative text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 group"
              >
                Nosotros
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
            </nav>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden text-gray-700 hover:text-orange-600 transition-colors duration-300"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200">
            <nav className="px-4 pt-4 pb-6 space-y-4">
              <a
                href="#propiedades"
                onClick={(e) => handleAnchorClick(e, 'propiedades')}
                className="block py-2 text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300"
              >
                Propiedades
              </a>
              <a
                href="#nosotros"
                onClick={(e) => handleAnchorClick(e, 'nosotros')}
                className="block py-2 text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300"
              >
                Nosotros
              </a>
              <a
                href="#contacto"
                onClick={(e) => handleAnchorClick(e, 'contacto')}
                className="block py-2 text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300"
              >
                Contacto
              </a>
              <button
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/reservar');
                }}
              >
                Reservar Ahora
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer: evita que el contenido quede debajo del nav fijo */}
      <div className="h-20" aria-hidden />
    </div>
  );
}
