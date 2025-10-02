'use client';
import React from 'react'
import CardList from '@/Components/Cards/CardList'
import { useEffect, useState } from 'react'
import CardListDto from '@/DTOs/propsDTO/CardListDto';

const page = () => {
  const [cards, setCards] = useState<CardListDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/propiedades/cards/cardslist');
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Responsive */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Encuentra tu Próximo Hogar
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Descubre nuestra selección exclusiva de propiedades premium.
              <span className="hidden sm:inline"> Desde apartamentos modernos hasta espacios únicos,</span>
              <span className="hidden md:inline"> encuentra el lugar perfecto que se adapte a tu estilo de vida.</span>
            </p>
            
            {/* Features - Adaptable layout */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="whitespace-nowrap">Ubicaciones premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="whitespace-nowrap">Verificado y seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="whitespace-nowrap">Reserva inmediata</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Counter - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex-1">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-48"></div>
              </div>
            ) : (
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                {cards.length} {cards.length === 1 ? 'Propiedad Disponible' : 'Propiedades Disponibles'}
              </h2>
            )}
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              <span className="sm:hidden">Toca para ver detalles</span>
              <span className="hidden sm:inline">Haz clic en cualquier propiedad para ver más detalles</span>
            </p>
          </div>
        </div>
      </div>

      {/* Properties List - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-12">
        {loading ? (
          // Loading skeleton - Responsive
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
                <div className="flex flex-col sm:flex-row h-64 sm:h-56 md:h-64 lg:h-72">
                  <div className="w-full sm:w-60 md:w-80 lg:w-96 bg-gray-300 h-40 sm:h-full"></div>
                  <div className="flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                      <div className="h-8 sm:h-10 md:h-12 bg-gray-300 rounded w-16 sm:w-20"></div>
                      <div className="h-8 sm:h-10 md:h-12 bg-gray-300 rounded w-16 sm:w-20"></div>
                      <div className="h-8 sm:h-10 md:h-12 bg-gray-300 rounded w-16 sm:w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cards.length > 0 ? (
          <div className="flex flex-col items-start space-y-4 sm:space-y-6 md:space-y-8">
            {cards.map((card, id) => (
              <div 
                key={id} 
                className="transform hover:scale-[1.005] sm:hover:scale-[1.01] transition-transform duration-200 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl"
              >
                <CardList {...card} />
              </div>
            ))}
          </div>
        ) : (
          // Empty state - Responsive
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="max-w-xs sm:max-w-md mx-auto">
              <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 mb-2">
                No hay propiedades disponibles
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Actualmente no tenemos propiedades que mostrar.
                <span className="hidden sm:inline"><br /></span>
                <span className="sm:hidden"> </span>
                Vuelve a intentarlo más tarde.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional bottom padding for mobile navigation */}
      <div className="h-16 sm:h-0"></div>
    </div>
  )
}

export default page