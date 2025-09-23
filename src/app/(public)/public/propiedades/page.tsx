'use client';
import React, { useState } from 'react';

// Interfaces TypeScript
interface PropertyService {
  icon: string;
  name: string;
}

interface PropertyData {
  id: string;
  nombre: string;
  direccion: string;
  capacidad: number;
  tipo: string;
  ambientes: number;
  baños: number;
  camas: number;
  estado: 'Disponible' | 'Ocupado' | 'Mantenimiento';
  descripcion: string;
  servicios: PropertyService[];
  cocheras: number;
}

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

interface ServiceItemProps {
  service: PropertyService;
}

interface DetailItemProps {
  label: string;
  value: string | number;
  isStatus?: boolean;
}

// Componentes
const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-xl text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="bg-[#FF5733] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <span className="text-[#FF5733] text-xl">{service.icon}</span>
    <span className="font-medium text-gray-700">{service.name}</span>
  </div>
);

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isStatus = false }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className={`font-semibold ${isStatus ? 'text-[#FF5733]' : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

const PropertySection: React.FC = () => {
  // Estado para manejar los datos de la propiedad
  const [propertyData] = useState<PropertyData>({
    id: "PROP-001",
    nombre: "Casa Moderna en Barrio Norte",
    direccion: "Av. Libertador 1234, San Miguel de Tucumán",
    capacidad: 6,
    tipo: "Casa",
    ambientes: 4,
    baños: 2,
    camas: 3,
    estado: "Disponible",
    descripcion: "Hermosa casa moderna ubicada en el corazón de Barrio Norte. Esta propiedad cuenta con amplios espacios, excelente iluminación natural y acabados de primera calidad. Perfecta para familias que buscan comodidad y estilo en una ubicación privilegiada.",
    servicios: [
      { icon: "💡", name: "Luz" },
      { icon: "💧", name: "Agua" },
      { icon: "🔥", name: "Gas" },
      { icon: "📡", name: "Internet" },
      { icon: "📺", name: "Cable" },
      { icon: "❄️", name: "Aire Acondicionado" },
      { icon: "🔒", name: "Seguridad" },
      { icon: "🏊‍♀️", name: "Piscina" }
    ],
    cocheras: 1
  });

  // Estado para manejar modales o acciones
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  // Handlers
  const handleContactClick = (): void => {
    setShowContactModal(true);
    setTimeout(() => {
      setShowContactModal(false);
      alert('¡Gracias por tu interés! Te contactaremos pronto.');
    }, 1500);
  };

  const handleScheduleVisit = (): void => {
    alert('Funcionalidad de agendar visita en desarrollo');
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: PropertyData['estado']): string => {
    switch (status) {
      case 'Disponible':
        return 'text-green-600 bg-green-100';
      case 'Ocupado':
        return 'text-red-600 bg-red-100';
      case 'Mantenimiento':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Property Hero */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-8">
          {/* Property Image */}
          <div className="relative h-96 bg-gradient-to-br from-[#FF5733] to-[#FF8C69] flex items-center justify-center">
            <div className="absolute top-6 right-6">
              <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(propertyData.estado)}`}>
                {propertyData.estado}
              </span>
            </div>
            <div className="text-white text-xl font-medium z-10">
              📸 Imagen de la propiedad
            </div>
            {/* Texture overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 0), radial-gradient(circle at 75% 75%, white 2px, transparent 0)',
                backgroundSize: '50px 50px'
              }}
            />
          </div>
          
          {/* Property Content */}
          <div className="p-8">
            {/* Property Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-sans">
                {propertyData.nombre}
              </h1>
              <div className="flex items-center text-gray-600 text-lg">
                <span className="mr-2">📍</span>
                <span>{propertyData.direccion}</span>
              </div>
            </div>

            {/* Highlight Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <StatCard
                icon="👥"
                value={propertyData.capacidad}
                label="Capacidad"
              />
              <StatCard
                icon="🏠"
                value={propertyData.ambientes}
                label="Ambientes"
              />
              <StatCard
                icon="🛏️"
                value={propertyData.camas}
                label="Camas"
              />
              <StatCard
                icon="🚿"
                value={propertyData.baños}
                label="Baños"
              />
              <StatCard
                icon="🚗"
                value={propertyData.cocheras}
                label="Cochera"
              />
            </div>

            {/* Property Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[#FF5733]">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h3>
                <div className="space-y-1">
                  <DetailItem label="ID" value={propertyData.id} />
                  <DetailItem label="Tipo" value={propertyData.tipo} />
                  <DetailItem label="Estado" value={propertyData.estado} isStatus />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h3>
          <p className="text-gray-700 leading-relaxed mb-8 text-lg">
            {propertyData.descripcion}
          </p>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Servicios Incluidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyData.servicios.map((service, index) => (
              <ServiceItem key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#FF5733] to-[#FF8C69] text-white p-8 rounded-xl text-center relative overflow-hidden shadow-lg">
          {/* Loading overlay cuando se está contactando */}
          {showContactModal && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
              <div className="bg-white text-[#FF5733] p-6 rounded-lg shadow-xl">
                <div className="animate-spin w-8 h-8 border-4 border-[#FF5733] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="font-semibold">Procesando...</p>
              </div>
            </div>
          )}
          
          <h3 className="text-2xl font-bold mb-3">¿Te interesa esta propiedad?</h3>
          <p className="mb-8 opacity-90 text-lg">Contacta con nosotros para más información o para agendar una visita</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContactClick}
              disabled={showContactModal}
              className="bg-white text-[#FF5733] px-8 py-4 rounded-lg font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📞 Contactar Ahora
            </button>
            <button
              onClick={handleScheduleVisit}
              className="bg-white text-[#FF5733] px-8 py-4 rounded-lg font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              📅 Agendar Visita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySection;