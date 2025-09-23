'use client';
import CardDto from '@/DTOs/propsDTO/CardDto';
import React, { useState } from 'react';
import { MapPin, Bed, Bath, Car } from 'lucide-react';


const CardPropiedad: React.FC<CardDto> = ({id, titulo, ubicacion, tipo, camas, img, banios, cocheras}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div 
        className={`bg-white rounded-2xl shadow-xl overflow-hidden w-96 transition-all duration-300 ease-out ${
          isHovered ? 'transform -translate-y-2 shadow-2xl' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Imagen y badge */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={img ? img : 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={titulo}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />

          {/* Badge de tipo */}
          <div className="absolute bottom-4 left-4 bg-gray-800/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
            {tipo}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Título */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {titulo}
          </h3>
          
          {/* Ubicación */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-2 text-orange-500" />
            <span className="text-sm">{ubicacion}</span>
          </div>

          {/* Características */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bed size={18} className="text-orange-500" />
              </div>
              <div className="text-sm font-semibold text-gray-800">{camas}</div>
              <div className="text-xs text-gray-500">Dormitorios</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bath size={18} className="text-orange-500" />
              </div>
              <div className="text-sm font-semibold text-gray-800">{banios}</div>
              <div className="text-xs text-gray-500">Baños</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Car size={18} className="text-orange-500" />
              </div>
              <div className="text-sm font-semibold text-gray-800">{cocheras}</div>
              <div className="text-xs text-gray-500">Cochera</div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 shadow-md hover:shadow-lg">
              Ver Detalles
            </button>
            <button className="flex-1 border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 py-3 px-4 rounded-xl font-semibold transition-colors duration-200">
              Contactar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPropiedad;