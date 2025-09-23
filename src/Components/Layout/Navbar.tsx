'use client';
import React from 'react'
import { Home, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

  return (
    <div>
         <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Temporal Home
              </h1>
            </div>
            
            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-12">
              <a href="#propiedades" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg relative group">
                Propiedades
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg relative group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#nosotros" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg relative group">
                Porque elegirnos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#nosotros" className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg relative group">
                Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-orange-600 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200">
            <nav className="px-4 pt-4 pb-6 space-y-4">
              <a href="#propiedades" className="block text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg py-2">
                Propiedades
              </a>
              <a href="#nosotros" className="block text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg py-2">
                Nosotros
              </a>
              <a href="#contacto" className="block text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg py-2">
                Contacto
              </a>
              <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium">
                Reservar Ahora
              </button>
            </nav>
          </div>
        )}
      </header>
    </div>
  )
}

export default Navbar
