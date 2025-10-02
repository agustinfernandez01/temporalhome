'use client';
import React, { useState } from 'react';
import {
  MapPin, Users, Home, Bath, Bed, Car, Wifi, Coffee, Tv, Wind,
  Shield, Star, ArrowLeft, Share2, Heart, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import type PropDetail from '@/DTOs/propsDTO/PropDetail'; // usa alias absoluto

type Props = { propiedad: PropDetail };

const DetailsView = ({ propiedad }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Normalizo imágenes: puede venir string o string[]
  const images: string[] = Array.isArray(propiedad.img)
    ? propiedad.img.filter(Boolean)
    : propiedad.img ? [propiedad.img] : [];

  const currentImg = images[currentImageIndex] ?? '';

  const serviceIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'WiFi': Wifi,
    'Aire Acondicionado': Wind,
    'Calefacción': Coffee,
    'TV por Cable': Tv,
    'Cocina Equipada': Coffee,
    'Seguridad 24hs': Shield,
    'Gimnasio': Users,
    'Piscina': Users,
    'Terraza': Home
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    const map: Record<string, string> = {
      disponible: 'bg-green-100 text-green-800 border-green-200',
      ocupado: 'bg-red-100 text-red-800 border-red-200',
      mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return map[status.toLowerCase()] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status?: string) => {
    const s = (status ?? '').toLowerCase();
    if (s === 'disponible') return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (s === 'ocupado') return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (s === 'mantenimiento') return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors" onClick={() => history.back()}>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium">Volver</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Gallery */}
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl bg-gray-100">
                {currentImg ? (
                  <img src={currentImg} alt={propiedad.nombre ?? 'Propiedad'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-500">Sin imagen</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {images.length > 0 && (
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-orange-400 shadow-md' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Título y ubicación */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {propiedad.nombre ?? 'Propiedad'}
                  </h1>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base lg:text-lg">{propiedad.direccion ?? 'Dirección no disponible'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">4.8</span>
                  <span className="text-gray-500 text-xs sm:text-sm">(24)</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Stat icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />} label="Capacidad" value={propiedad.capacidad ?? '-'} />
              <Stat icon={<Home className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />} label="Ambientes" value={propiedad.ambientes ?? '-'} />
              <Stat icon={<Bed className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />} label="Camas" value={propiedad.camas ?? '-'} />
              <Stat icon={<Bath className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />} label="Baños" value={propiedad.banios ?? '-'} />
            </div>

            {/* Descripción */}
            <Section title="Descripción">
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                {propiedad.descripcion ?? 'Sin descripción'}
              </p>
            </Section>

            {/* Servicios */}
            <Section title="Servicios Incluidos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {(propiedad.servicios_json ?? []).map((servicio, i) => {
                  const Icon = serviceIcons[servicio] ?? Coffee;
                  return (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg shadow-sm">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                      </div>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{servicio}</span>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Estacionamiento */}
            <Section>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-orange-50 rounded-xl">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">Estacionamiento</h3>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                    {propiedad.cocheras ?? 0} cocheras incluidas
                  </p>
                </div>
              </div>
            </Section>

            {/* Ubicación (placeholder) */}
            <Section title="Ubicación">
              <div className="aspect-[16/9] bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3" />
                  <p className="font-medium text-sm sm:text-base">Mapa Interactivo</p>
                  <p className="text-xs sm:text-sm">Google Maps se cargará aquí</p>
                </div>
              </div>
            </Section>
          </div>

          {/* Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden sticky top-20 sm:top-24">
              <div className="p-4 sm:p-6 lg:p-8">
                <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base">
                  Reservar Ahora
                </button>
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                  No se realizará el cobro por el momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">{icon}</div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{label}</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
      {title && <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{title}</h2>}
      {children}
    </div>
  );
}

export default DetailsView;
