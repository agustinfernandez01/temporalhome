"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, MapPin, Calendar, Users, Star, ArrowRight, Shield, Award, Clock, Phone, Mail, Facebook, Instagram, Twitter, Search, Play, ChevronDown } from 'lucide-react';
import CardPropiedad from '@/Components/Cards/CardPropiedad';
import { useRouter } from 'next/navigation';
import CardDto from '@/DTOs/propsDTO/CardDto';

const TemporalHomeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cards, setCards] = useState<CardDto[]>([]);
  const router = useRouter();

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/propiedades/cards');
      const data = await response.json();
      if (!data) {
        console.log("No se encontraron propiedades");
      }
      return data;
    }
    catch (error) {
      console.error("Error fetching cards:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const cards = await fetchCards();
      setCards(cards);
    };
    fetchData();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  // Contenido eslogans
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop",
      title: "Tu hogar temporal perfecto",
      subtitle: "Encuentra el alojamiento ideal para tu próxima aventura"
    },
    {
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop",
      title: "Experiencias inolvidables",
      subtitle: "Propiedades únicas en las mejores ubicaciones"
    },
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop",
      title: "Comodidad garantizada",
      subtitle: "Cada detalle pensado para tu máximo confort"
    }
  ];


  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Slider */}
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <img
                  src={slide.image}
                  alt="Hero background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/30 to-gray-900/70"></div>
              </div>
            ))}
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-orange-600/20 rounded-full blur-xl animate-pulse delay-500"></div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
            <div
              className="transform transition-all duration-1000"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                {heroSlides[currentSlide].title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Search Bar */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 mb-10 shadow-2xl border border-white/20 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none">
                      <option value="">¿Dónde te quedás?</option>
                      <option value="san-miguel">San Miguel de Tucumán</option>
                      <option value="yerba-buena">Yerba Buena</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <select className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none">
                      <option value="">Huéspedes</option>
                      <option value="1">1 huésped</option>
                      <option value="2">2 huéspedes</option>
                      <option value="3">3 huéspedes</option>
                      <option value="4">4+ huéspedes</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <button className="w-full md:w-auto mt-6 px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg font-medium text-lg">
                  <Search className="w-6 h-6" />
                  <span>Buscar Propiedades</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg font-medium text-lg"
                  onClick={() => router.push('/propiedades')}>
                  <span>Explorar Propiedades</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 font-medium text-lg">
                  <Play className="w-5 h-5" />
                  <span>Ver Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-orange-500 shadow-lg' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </section>

        {/* Properties Section */}
        <section id="propiedades" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Propiedades destacadas en <span className="text-orange-500">Tucuman</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubre nuestra selección de alojamientos premium, cuidadosamente elegidos para ofrecerte la mejor experiencia de estadía
              </p>
            </div>

            {/*CARDS*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {cards && cards.length > 0 ? (
                cards.map((card) => (
                  <CardPropiedad key={card.id} {...card} />

                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No hay propiedades disponibles.</p>
              )}
            </div>

            <div className="text-center">
              <button className="px-10 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 font-medium text-lg shadow-md"
                onClick={() => router.push('/propiedades')}>
                Ver Todas las Propiedades
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="nosotros" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  ¿Por qué elegir <span className="text-orange-500">Temporal Home</span>?
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Somos más que una plataforma de alquileres temporales. Creamos experiencias memorables
                  conectando viajeros con espacios únicos que se sienten como un verdadero hogar.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Seguridad Garantizada</h3>
                      <p className="text-gray-600">Verificamos cada propiedad y propietario para tu tranquilidad total.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Calidad Premium</h3>
                      <p className="text-gray-600">Solo trabajamos con las mejores propiedades en ubicaciones privilegiadas.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Soporte 24/7</h3>
                      <p className="text-gray-600">Nuestro equipo está disponible las 24 horas para ayudarte.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
                  alt="Sobre nosotros"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-400/20 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Propiedades</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Huéspedes Felices</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
                <div className="text-gray-600 font-medium">Ciudades</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">4.9</div>
                <div className="text-gray-600 font-medium">Rating Promedio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}


        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              ¿Listo para tu próxima aventura?
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-90">
              Únete a miles de viajeros que ya confían en Temporal Home para sus estadías perfectas
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-4 bg-white text-orange-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg"
                onClick={() => router.push('/propiedades')}>
                Comenzar Ahora
              </button>
              <button className="px-12 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-105 text-lg font-medium">
                Saber Más
              </button>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default TemporalHomeLanding;