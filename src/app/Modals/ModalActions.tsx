'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AdminDTO from '@/DTOs/propsDTO/AdminDto';
import { Accion } from '../../app/(admin)/dashboard/propiedades/page'; // ajusta la ruta según tu estructura

type Props = {
    propiedad: AdminDTO | null;
    accion: Accion;
    onClose: () => void;
};

const serviciosEjemplo = ['WiFi', 'Piscina', 'Aire acondicionado', 'Estacionamiento', 'TV', 'Cocina', 'Lavadora', 'Gimnasio', 'Mascotas permitidas'];

const ModalActions = ({ propiedad, accion, onClose }: Props) => {
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);
    const [servicios, setServicios] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [servicioTxt, setServicioTxt] = useState('');

    const [formdata, setFormData] = useState({
        nombre: '',
        tipo: '',
        direccion: '',
        capacidad: 0,
        ambientes: 0,
        banios: 0,
        camas: 0,
        cocheras: 0,
        estado: '',
        ubicacionGoogle: '',
        descripcion: '',
        servicios: [] as string[],
        imagenes: [] as File[],
    });

    useEffect(() => {
        if (propiedad && accion === 'edit') {
            const parseServicios = (): string[] => {
                const sj = (propiedad as any).servicios_json;

                if (!sj) return [];

                // Si ya es un array, lo normalizamos a strings
                if (Array.isArray(sj)) {
                    return sj.map(String).filter(Boolean);
                }

                // Si es string, puede ser JSON o CSV
                if (typeof sj === 'string') {
                    const trimmed = sj.trim();

                    // Caso JSON: '["WiFi","Piscina"]'
                    if (trimmed.startsWith('[')) {
                        try {
                            const arr = JSON.parse(trimmed);
                            return Array.isArray(arr) ? arr.map(String).filter(Boolean) : [];
                        } catch {
                            // si falla, cae al CSV
                        }
                    }

                    // Caso CSV: 'wifi,pileta,auto'
                    return trimmed.split(',').map(s => s.trim()).filter(Boolean);
                }

                // Cualquier otro tipo: devolvemos vacío
                return [];
            };

            setFormData({
                nombre: propiedad.nombre ?? '',
                tipo: propiedad.tipo ?? '',
                direccion: propiedad.direccion ?? '',
                capacidad: propiedad.capacidad ?? 0,
                ambientes: propiedad.ambientes ?? 0,
                banios: propiedad.banios ?? 0,
                camas: propiedad.camas ?? 0,
                cocheras: propiedad.cocheras ?? 0,
                estado: propiedad.estado ?? '',
                ubicacionGoogle: propiedad.ubicacionGoogle ?? '',
                descripcion: propiedad.descripcion ?? '',
                servicios: parseServicios(),        // 👈 invocada
                imagenes: (propiedad as any).imagenes ?? [],
            });
        }
    }, [propiedad, accion]);

    return (
        <div className="flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 border-b border-indigo-700">
                <h2 className="text-xl font-semibold text-white">
                    {accion === 'add' ? 'Nueva Propiedad' : 'Editar Propiedad'}
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-indigo-100 hover:text-white transition-colors"
                    aria-label="Cerrar modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-6">
                    {/* Grid de campos principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NOMBRE */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                required
                                value={formdata.nombre}
                                onChange={(e) => setFormData({ ...formdata, nombre: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* TIPO */}
                        <div>
                            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select
                                id="tipo"
                                name="tipo"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formdata.tipo}
                                onChange={(e) => setFormData({ ...formdata, tipo: e.target.value })}
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="casa">Casa</option>
                                <option value="departamento">Departamento</option>
                                <option value="ph">PH</option>
                            </select>
                        </div>

                        {/* DIRECCIÓN */}
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección
                            </label>
                            <input
                                id="direccion"
                                type="text"
                                name="direccion"
                                value={formdata.direccion}
                                onChange={(e) => setFormData({ ...formdata, direccion: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* CAPACIDAD */}
                        <div>
                            <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">
                                Capacidad
                            </label>
                            <input
                                id="capacidad"
                                type="number"
                                name="capacidad"
                                value={formdata.capacidad}
                                onChange={(e) => setFormData({ ...formdata, capacidad: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* AMBIENTES */}
                        <div>
                            <label htmlFor="ambientes" className="block text-sm font-medium text-gray-700 mb-1">
                                Ambientes
                            </label>
                            <input
                                id="ambientes"
                                type="number"
                                name="ambientes"
                                value={formdata.ambientes}
                                onChange={(e) => setFormData({ ...formdata, ambientes: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* BAÑOS */}
                        <div>
                            <label htmlFor="banios" className="block text-sm font-medium text-gray-700 mb-1">
                                Baños
                            </label>
                            <input
                                id="banios"
                                type="number"
                                name="banios"
                                value={formdata.banios}
                                onChange={(e) => setFormData({ ...formdata, banios: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* CAMAS */}
                        <div>
                            <label htmlFor="camas" className="block text-sm font-medium text-gray-700 mb-1">
                                Camas
                            </label>
                            <input
                                id="camas"
                                type="number"
                                name="camas"
                                value={formdata.camas}
                                onChange={(e) => setFormData({ ...formdata, camas: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* COCHERAS */}
                        <div>
                            <label htmlFor="cocheras" className="block text-sm font-medium text-gray-700 mb-1">
                                Cocheras
                            </label>
                            <input
                                id="cocheras"
                                type="number"
                                name="cocheras"
                                value={formdata.cocheras}
                                onChange={(e) => setFormData({ ...formdata, cocheras: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* ESTADO */}
                        <div>
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                id="estado"
                                name="estado"
                                value={formdata.estado}
                                onChange={(e) => setFormData({ ...formdata, estado: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Seleccionar estado</option>
                                <option value="disponible">Disponible</option>
                                <option value="ocupado">Ocupado</option>
                                <option value="mantenimiento">Mantenimiento</option>
                            </select>
                        </div>

                        {/* UBICACIÓN GOOGLE */}
                        <div>
                            <label htmlFor="ubicacionGoogle" className="block text-sm font-medium text-gray-700 mb-1">
                                Ubicación Google
                            </label>
                            <input
                                id="ubicacionGoogle"
                                type="text"
                                name="ubicacionGoogle"
                                value={formdata.ubicacionGoogle}
                                onChange={(e) => setFormData({ ...formdata, ubicacionGoogle: e.target.value })}
                                placeholder="URL de Google Maps"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formdata.descripcion}
                            onChange={(e) => setFormData({ ...formdata, descripcion: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* SERVICIOS */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>

                        <div className="grid grid-cols-1 gap-4">
                            {serviciosEjemplo.map((servicio) => (
                                <label key={servicio} className="inline-flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{servicio}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Imágenes */}
                    <div>
                        <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                            Imágenes
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50">
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                            <label htmlFor="file-input" className="cursor-pointer block">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle cx={21} cy={20} r={3} stroke="currentColor" strokeWidth={2} />
                                    <path
                                        d="M6 32l9-9 6-6 18 18"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium text-indigo-600">Haz clic para subir</span> o arrastra imágenes aquí
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                            </label>
                        </div>

                        {/* Preview de imágenes seleccionadas */}
                        {imagenesPreview.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Imágenes seleccionadas ({imagenesPreview.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagenesPreview.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Eliminar imagen"
                                                aria-label="Eliminar imagen"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer con botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                        >
                            {loading ? 'Guardando...' : accion === 'add' ? 'Crear' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalActions;
