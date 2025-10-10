'use client';

import React, { useEffect, useState } from 'react';
import { X, Upload, MapPin, Home, Users, Bed, Bath, Grid } from 'lucide-react';
import AdminDTO  from '../../DTOs/propsDTO/AdminDto';

type ModalMode = 'add' | 'edit' | 'view';

type PropInitialData = {
  id?: number;
  nombre?: string;
  direccion?: string;
  ubicacion?: string;
  capacidad?: number;
  estado?: string;
  tipo?: string;
  ambientes?: string;
  banos?: number;
  camas?: number;
  descripcion?: string;
  servicios?: string[];
  // podrías agregar acá imágenes existentes si las renderizas en otro bloque
} | null;

type ModalProps = {
  open: boolean;
  onClose: () => void;
  accion?: ModalMode;
  initialData?: PropInitialData;
  // 👇 agregado para compatibilidad con la llamada del padre
  propiedades?: AdminDTO[];
};

const ALL_SERVICIOS = [
  'WiFi', 'Aire Acondicionado', 'Calefacción', 'Cocina',
  'Lavarropas', 'TV Cable', 'Balcón', 'Terraza',
  'Piscina', 'Gimnasio', 'Parking', 'Seguridad 24hs'
];

// ✅ unificadas las props en un solo objeto (sin quitar lógica/estética)
const ModalActions = ({ open, onClose, accion = 'add', initialData = null, propiedades }: ModalProps) => {
  const isView = accion === 'view';
  const isEdit = accion === 'edit';

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [capacidad, setCapacidad] = useState(1);
  const [estado, setEstado] = useState('');
  const [tipo, setTipo] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [banos, setBanos] = useState(1);
  const [camas, setCamas] = useState(1);
  const [descripcion, setDescripcion] = useState('');
  const [servicios, setServicios] = useState<string[]>([]);
  const [imagenes, setImagenes] = useState<FileList | null>(null);

  // Guard de render (no cambia estética: simplemente no renderiza cerrado)
  if (!open) return null;

  // Prefill para edición, limpieza para alta
  useEffect(() => {
    if (isEdit && initialData) {
      setNombre(initialData.nombre ?? '');
      setDireccion(initialData.direccion ?? '');
      setUbicacion(initialData.ubicacion ?? '');
      setCapacidad(initialData.capacidad ?? 1);
      setEstado(initialData.estado ?? '');
      setTipo(initialData.tipo ?? '');
      setAmbientes(initialData.ambientes ?? '');
      setBanos(initialData.banos ?? 1);
      setCamas(initialData.camas ?? 1);
      setDescripcion(initialData.descripcion ?? '');
      setServicios(initialData.servicios ?? []);
      setImagenes(null);
    }
    if (accion === 'add') {
      // si quisieras limpiar explícitamente al abrir en modo add, podrías hacerlo aquí
      // mantengo así para no interferir con lógicas externas
    }
  }, [accion, isEdit, initialData]);

  // Toggle de servicios sin cambiar el markup
  const toggleServicio = (s: string) => {
    setServicios((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  // Handler de archivos (mantengo tu UI; solo leo el FileList)
  const onFilesChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setImagenes(e.target.files);
  };

  // Envío según modo (POST alta / PUT edición). No toco tu UI; solo lógica.
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isView) {
      onClose();
      return;
    }

    const payload = {
      nombre, direccion, ubicacion, capacidad, estado, tipo,
      ambientes, banos, camas, descripcion, servicios,
    };

    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    if (imagenes && imagenes.length > 0) {
      Array.from(imagenes).forEach((f) => formData.append('files', f));
    }

    try {
      const url = isEdit && initialData?.id
        ? `/api/propiedades/${initialData.id}`
        : `/api/propiedades`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(`${method} failed`);
      onClose();
    } catch (err) {
      console.error(err);
      // acá podrías mostrar un toast o mensaje; no toco la UI existente
    }
  };

  const titulo =
    accion === 'add' ? 'Agregar Nueva Propiedad'
      : accion === 'edit' ? 'Editar Propiedad'
        : 'Ver Propiedad';

  const submitLabel =
    accion === 'add' ? 'Agregar Propiedad'
      : accion === 'edit' ? 'Guardar Cambios'
        : 'Cerrar';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={onClose}   // 👈 backdrop cierra (no modificado)
      aria-modal="true"
      role="dialog"
    >
      <form
        onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al clickear contenido
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >

        {/* Header (estética intacta) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}  // 👈 X cierra (igual que antes)
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content (misma estructura/clases; solo agrego value/onChange/disabled) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* NOMBRE */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Home className="w-4 h-4 text-orange-500" />
                  <span>Nombre de la Propiedad</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Loft Moderno Palermo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* DIRECCION */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Dirección</span>
                </label>
                <input
                  type="text"
                  placeholder="Av. Santa Fe 1234"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* UBICACION */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Ubicación</span>
                </label>
                <input
                  type="text"
                  placeholder="Palermo, Buenos Aires"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* ESTADO */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Grid className="w-4 h-4 text-orange-500" />
                  <span>Estado</span>
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">En mantenimiento</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>

              {/* TIPO */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Home className="w-4 h-4 text-orange-500" />
                  <span>Tipo de Propiedad</span>
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                  <option value="loft">Loft</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              {/* CAPACIDAD */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>Capacidad (personas)</span>
                </label>
                <input
                  type="number"
                  placeholder="4"
                  min={1}
                  max={20}
                  value={capacidad}
                  onChange={(e) => setCapacidad(Number(e.target.value || 1))}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* AMBIENTES */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Grid className="w-4 h-4 text-orange-500" />
                  <span>Ambientes</span>
                </label>
                <select
                  value={ambientes}
                  onChange={(e) => setAmbientes(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Cantidad de ambientes</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* BAÑOS */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Bath className="w-4 h-4 text-orange-500" />
                  <span>Baños</span>
                </label>
                <input
                  type="number"
                  placeholder="2"
                  min={1}
                  max={10}
                  value={banos}
                  onChange={(e) => setBanos(Number(e.target.value || 1))}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* CAMAS */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Bed className="w-4 h-4 text-orange-500" />
                  <span>Camas</span>
                </label>
                <input
                  type="number"
                  placeholder="2"
                  min={1}
                  max={10}
                  value={camas}
                  onChange={(e) => setCamas(Number(e.target.value || 1))}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duración-200"
                />
              </div>

              {/* DESCRIPCION */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Grid className="w-4 h-4 text-orange-500" />
                  <span>Descripción</span>
                </label>
                <textarea
                  placeholder="Describe las características principales de la propiedad, ubicación, comodidades especiales..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={isView}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* SERVICIOS */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Grid className="w-4 h-4 text-orange-500" />
                  <span>Servicios</span>
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    {ALL_SERVICIOS.map((servicio) => (
                      <label key={servicio} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={servicios.includes(servicio)}
                          onChange={() => toggleServicio(servicio)}
                          disabled={isView}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{servicio}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* IMAGENES */}
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Upload className="w-4 h-4 text-orange-500" />
                  <span>Imágenes de la Propiedad</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors duration-200">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra y suelta las imágenes aquí</p>
                  <p className="text-sm text-gray-400 mb-4">o</p>
                  <div className="cursor-pointer">
                    <span className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 inline-block">
                      Seleccionar Archivos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={onFilesChange}
                      disabled={isView}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Máximo 10 imágenes - JPG, PNG</p>
                  {/* (opcional) preview simple: <p className="text-xs mt-1">{imagenes?.length || 0} seleccionadas</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (estética intacta; botón dinámico por modo) */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            Todos los campos marcados son obligatorios
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}  // 👈 “Cancelar” cierra
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duración-200 font-medium"
            >
              Cancelar
            </button>
            {isView ? (
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duración-200 transform hover:scale-105 shadow-lg font-medium"
              >
                {submitLabel}
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duración-200 transform hover:scale-105 shadow-lg font-medium"
              >
                {submitLabel}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModalActions;
