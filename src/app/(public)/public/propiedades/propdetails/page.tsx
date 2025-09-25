'use client';
import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Home, 
  Bath, 
  Bed, 
  Car, 
  Wifi, 
  Coffee,
  Tv,
  Wind,
  Shield,
  Star,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Mock data - reemplazar con props reales
const mockProperty = {
  id: 1,
  nombre: "Departamento Premium Vista al Mar",
  direccion: "Av. Costanera Norte 1250, Puerto Madero, Buenos Aires",
  capacidad: 6,
  tipo: "Departamento",
  ambientes: 3,
  banios: 2,
  camas: 3,
  estado: "Disponible",
  descripcion: "Espectacular departamento de lujo con vista panorámica al río y la ciudad. Ubicado en el corazón de Puerto Madero, este moderno departamento cuenta con acabados de primera calidad, amplios ventanales que permiten el ingreso de luz natural durante todo el día, y una terraza privada perfecta para relajarse. La propiedad ha sido completamente renovada con materiales premium y diseño contemporáneo.",
  servicios: ["WiFi", "Aire Acondicionado", "Calefacción", "TV por Cable", "Cocina Equipada", "Seguridad 24hs", "Gimnasio", "Piscina", "Terraza"],
  cocheras: 2,
  ubicacionGoogle: "https://maps.google.com/embed/example"
};

const PropertyDetailView = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock images - reemplazar con imágenes reales
  const images = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", 
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
  ];

interface StatusColorMap {
    [key: string]: string;
}

const getStatusColor = (status: string): string => {
    const statusColorMap: StatusColorMap = {
        'disponible': 'bg-green-100 text-green-800 border-green-200',
        'ocupado': 'bg-red-100 text-red-800 border-red-200',
        'mantenimiento': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return statusColorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

interface Property {
    id: number;
    nombre: string;
    direccion: string;
    capacidad: number;
    tipo: string;
    ambientes: number;
    banios: number;
    camas: number;
    estado: string;
    descripcion: string;
    servicios: string[];
    cocheras: number;
    ubicacionGoogle: string;
}

interface ServiceIcons {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const getStatusIcon = (status: string): React.ReactNode => {
    switch (status.toLowerCase()) {
        case 'disponible':
            return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
        case 'ocupado':
            return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
        case 'mantenimiento':
            return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
        default:
            return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
};

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium">Volver</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Left Column - Images & Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
                <img 
                  src={images[currentImageIndex]} 
                  alt={mockProperty.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${getStatusColor(mockProperty.estado)}`}>
                  {getStatusIcon(mockProperty.estado)}
                  <span className="hidden xs:inline">{mockProperty.estado}</span>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-orange-400 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Title & Location */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {mockProperty.nombre}
                  </h1>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base lg:text-lg">{mockProperty.direccion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">4.8</span>
                  <span className="text-gray-500 text-xs sm:text-sm">(24)</span>
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Capacidad</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{mockProperty.capacidad}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Ambientes</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{mockProperty.ambientes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
                    <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Camas</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{mockProperty.camas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
                    <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Baños</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{mockProperty.banios}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Descripción</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                {mockProperty.descripcion}
              </p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Servicios Incluidos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {mockProperty.servicios.map((servicio, index) => {
                  const IconComponent = serviceIcons[servicio] || Coffee;
                  return (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg shadow-sm">
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                      </div>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{servicio}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parking Info */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-orange-50 rounded-xl">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">Estacionamiento</h3>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">{mockProperty.cocheras} cocheras incluidas</p>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Ubicación</h2>
              <div className="aspect-[16/9] bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3" />
                  <p className="font-medium text-sm sm:text-base">Mapa Interactivo</p>
                  <p className="text-xs sm:text-sm">Google Maps se cargará aquí</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
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

export default PropertyDetailView;