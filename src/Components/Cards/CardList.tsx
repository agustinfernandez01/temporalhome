'use client';
import { Users, Home, Car } from 'lucide-react';
import CardListDto from '../../DTOs/propsDTO/CardListDto';

const CardList: React.FC<CardListDto> = (props) => {
  return (
    <article className="w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        {/* Layout responsive: vertical en móvil, horizontal en desktop */}
        <div className="flex flex-col sm:flex-row h-auto sm:h-64 md:h-72 lg:h-80">
          {/* Imagen responsive */}
          <div className="relative w-full sm:w-64 md:w-80 lg:w-96 xl:w-[420px] h-48 sm:h-full flex-shrink-0">
            <img
              src={props.img ?? 'https://via.placeholder.com/420x320?text=No+Image'}
              alt={props.nombre}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback responsive */}
            <div className="hidden absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 items-center justify-center">
              <div className="text-white/90 text-center px-4">
                <Home className="mx-auto mb-2 sm:mb-3 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
                <p className="text-sm sm:text-base font-medium">Sin imagen disponible</p>
              </div>
            </div>
            {/* Overlay responsive */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
            
            {/* Badge responsive */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <span className="sm:hidden">★</span>
              <span className="hidden sm:inline">Destacado</span>
            </div>
          </div>

          {/* Contenido responsive */}
          <div className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/30">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {props.nombre}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                {props.descripcion}
              </p>
            </div>

            {/* Stats responsive */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
                <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg sm:rounded-xl shadow-sm mx-auto sm:mx-0 flex-shrink-0">
                  <Car className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-orange-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium hidden sm:block">Cocheras</p>
                  <p className="text-xs sm:text-sm md:text-lg font-bold text-gray-900">
                    {props.cocheras}
                  </p>
                  <p className="text-xs text-gray-500 sm:hidden">Cocheras</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
                <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl shadow-sm mx-auto sm:mx-0 flex-shrink-0">
                  <Users className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium hidden sm:block">Capacidad</p>
                  <p className="text-xs sm:text-sm md:text-lg font-bold text-gray-900">
                    {props.capacidad}
                  </p>
                  <p className="text-xs text-gray-500 sm:hidden">Personas</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
                <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl shadow-sm mx-auto sm:mx-0 flex-shrink-0">
                  <Home className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium hidden sm:block">Ambientes</p>
                  <p className="text-xs sm:text-sm md:text-lg font-bold text-gray-900">
                    {props.ambientes}
                  </p>
                  <p className="text-xs text-gray-500 sm:hidden">Ambientes</p>
                </div>
              </div>
            </div>

            {/* Botones responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium sm:font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-95 sm:hover:scale-105">
                Ver Detalles
              </button>
              <button 
              className="flex-1 border border-gray-200 sm:border-2 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium sm:font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 sm:hover:scale-105"
              onClick={() => {}}>
              Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardList;