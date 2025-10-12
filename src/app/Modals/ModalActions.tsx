'use client';

import React, { useEffect, useState } from 'react';
import { X, Upload, MapPin, Home, Users, Bed, Bath, Grid, Trash2 } from 'lucide-react';

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
  servicios?: string[] | string | null;
  imagenes?: string[]; // URLs de imágenes existentes
} | null;

type ModalProps = {
  open: boolean;
  onClose: () => void;
  accion?: ModalMode;
  initialData?: PropInitialData;
  propiedades?: any[];
};

const ALL_SERVICIOS = [
  'WiFi', 'Aire Acondicionado', 'Calefacción', 'Cocina',
  'Lavarropas', 'TV Cable', 'Balcón', 'Terraza',
  'Piscina', 'Gimnasio', 'Parking', 'Seguridad 24hs'
];

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

  // 🆕 Estado para imágenes existentes y preview de nuevas
  const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const toLowerNoAccents = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Mapa de sinónimos -> valor canónico EXACTO de ALL_SERVICIOS
const ALIAS: Record<string, string> = {
  'wifi': 'WiFi',
  'wi-fi': 'WiFi',

  'aire acondicionado': 'Aire Acondicionado',
  'ac': 'Aire Acondicionado',

  'calefaccion': 'Calefacción',

  'cocina': 'Cocina',

  'lavarropas': 'Lavarropas',

  'tv cable': 'TV Cable',
  'tv': 'TV Cable',
  'cable': 'TV Cable',

  'balcon': 'Balcón',

  'terraza': 'Terraza',

  'piscina': 'Piscina',
  'pileta': 'Piscina',

  'gimnasio': 'Gimnasio',

  'parking': 'Parking',
  'estacionamiento': 'Parking',
  'cochera': 'Parking',
  'auto': 'Parking',

  'seguridad 24hs': 'Seguridad 24hs',
  'seguridad 24 hs': 'Seguridad 24hs',
  'seguridad': 'Seguridad 24hs',
};

// intenta devolver el valor canónico EXACTO de ALL_SERVICIOS
const canonizeServicio = (input: string): string | null => {
  const key = toLowerNoAccents(String(input).trim());

  // 1) si hay sinónimo, devolvemos su canónico
  if (ALIAS[key]) return ALIAS[key];

  // 2) si matchea exactamente alguno de ALL_SERVICIOS (case/acentos agnóstico), devolverlo
  for (const op of ALL_SERVICIOS) {
    if (toLowerNoAccents(op) === key) return op;
  }
  return null;
};

const normalizeIncomingServicios = (
  incoming: string[] | string | null | undefined
): string[] => {
  if (!incoming) return [];

  let arr: string[] = [];
  if (Array.isArray(incoming)) {
    arr = incoming.map(String);
  } else if (typeof incoming === 'string') {
    const str = incoming.trim();
    if (str === '') return [];
    // puede ser JSON o CSV
    try {
      const parsed = JSON.parse(str);
      arr = Array.isArray(parsed) ? parsed.map(String) : str.split(',').map(String);
    } catch {
      arr = str.split(',').map(String);
    }
  }

  const mapped = arr
    .map(canonizeServicio)
    .filter((v): v is string => Boolean(v));

  return Array.from(new Set(mapped)); // único y ordenado
};

  if (!open) return null;

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

      // 🆕 normalizar servicios para preselección
      setServicios(normalizeIncomingServicios(initialData.servicios));

      setImagenes(null);
      setImagenesExistentes(initialData.imagenes ?? []);
      setPreviewUrls([]);
    }
    if (accion === 'view' && initialData) {
      setImagenesExistentes(initialData.imagenes ?? []);
      // 🆕 también mostramos servicios en modo view (por si los renderizás como texto)
      setServicios(normalizeIncomingServicios(initialData.servicios));
    }
    if (accion === 'add') {
      setImagenesExistentes([]);
      setPreviewUrls([]);
      setServicios([]); // limpio selección en add
    }
  }, [accion, isEdit, initialData]);

  // 🆕 Limpiar URLs de preview cuando se desmonte o cambien archivos
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const toggleServicio = (s: string) => {
    // usar valor canónico siempre
    const canon = canonizeServicio(s);
    if (!canon) return;
    setServicios(prev =>
      prev.includes(canon) ? prev.filter(x => x !== canon) : [...prev, canon]
    );
  };

  // 🆕 Handler mejorado para preview de nuevas imágenes
  const onFilesChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    setImagenes(files);

    if (files && files.length > 0) {
      // Limpiar URLs anteriores
      previewUrls.forEach(url => URL.revokeObjectURL(url));

      // Crear nuevos previews
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviews);
    } else {
      setPreviewUrls([]);
    }
  };

  // 🆕 Eliminar imagen existente
  const removeExistingImage = (index: number) => {
    setImagenesExistentes(prev => prev.filter((_, i) => i !== index));
  };

  // 🆕 Eliminar preview de nueva imagen
  const removePreviewImage = (index: number) => {
    if (imagenes) {
      const dt = new DataTransfer();
      Array.from(imagenes).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setImagenes(dt.files.length > 0 ? dt.files : null);

      // Actualizar previews
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isView) {
      onClose();
      return;
    }

    const payload = {
      nombre, direccion, ubicacion, capacidad, estado, tipo,
      ambientes, banos, camas, descripcion, servicios,
      imagenesExistentes, // Incluir las imágenes que se mantienen
    };

    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    if (imagenes && imagenes.length > 0) {
      Array.from(imagenes).forEach((f) => formData.append('files', f));
    }

    try {
      const url = (isEdit && initialData?.id)
        ? `/api/propiedades/${initialData.id}`
        : `/api/propiedades`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(`${method} failed`);
      onClose();
    } catch (err) {
      console.error(err);
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

  // 🆕 Verificar si hay imágenes (existentes o nuevas)
  const hasImages = imagenesExistentes.length > 0 || previewUrls.length > 0;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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
                  rows={4}
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

              {/* IMAGENES - Sección mejorada con preview */}
              <div className="md:col-span-2 lg:col-span-3 space-y-4">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Upload className="w-4 h-4 text-orange-500" />
                  <span>Imágenes de la Propiedad</span>
                </label>

                {/* 🆕 Galería de imágenes existentes */}
                {imagenesExistentes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Imágenes actuales:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagenesExistentes.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-all duration-200">
                            <img
                              src={url}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {!isView && (
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600 shadow-lg"
                              aria-label="Eliminar imagen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🆕 Preview de nuevas imágenes seleccionadas */}
                {previewUrls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Nuevas imágenes a subir:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={`preview-${index}`} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-orange-300 hover:border-orange-500 transition-all duration-200">
                            <img
                              src={url}
                              alt={`Nueva imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {!isView && (
                            <button
                              type="button"
                              onClick={() => removePreviewImage(index)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600 shadow-lg"
                              aria-label="Eliminar imagen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🆕 Mensaje cuando no hay imágenes */}
                {!hasImages && (isEdit || isView) && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hay imágenes para esta propiedad</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {isEdit ? 'Puedes agregar imágenes a continuación' : 'Esta propiedad aún no tiene imágenes cargadas'}
                    </p>
                  </div>
                )}

                {/* Selector de archivos (se muestra solo en modo add/edit) */}
                {!isView && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors duration-200">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {imagenesExistentes.length > 0 ? 'Agregar más imágenes' : 'Arrastra y suelta las imágenes aquí'}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">o</p>
                    <label className="cursor-pointer inline-block">
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
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Máximo 10 imágenes - JPG, PNG</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            Todos los campos marcados son obligatorios
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            {isView ? (
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                {submitLabel}
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
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
