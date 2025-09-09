'use client';

import AdminDTO  from '@/DTOs/propsDTO/AdminDto';
import { cache, useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const page = () => {
    const [propiedades, setPropiedades] = useState<AdminDTO[]>([]);

    const fetchProps = async () => {
        try {
            const response = await fetch('/api/propiedades', { 
                cache: 'no-cache', 
                credentials: 'include' 
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Datos recibidos:', data); // Para debug
            setPropiedades(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setPropiedades([]);
        }
    }
    useEffect(() => {
        fetchProps();
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-full mx-auto px-4">
            <div className="mb-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Propiedades
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Gestiona todas las propiedades del sistema
                    </p>
                </div>
                <button 
                    onClick={() => {
                        // Aquí puedes agregar la lógica para abrir modal o navegar a formulario
                        console.log('Agregar nueva propiedad');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Agregar Propiedad
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                    Dirección
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                    Capacidad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                    Ambientes
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    Baños
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    Camas
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                                    Descripción
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                    Servicios
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {propiedades.map((prop, index) => (
                                <tr key={prop.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {prop.id}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {prop.nombre}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        {prop.direccion}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {prop.capacidad}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {prop.tipo}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {prop.ambientes}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {prop.banios}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {prop.camas}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {prop.estado}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <div className="max-h-16 overflow-y-auto max-w-xs">
                                            {prop.descripcion}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        <div className="max-h-16 overflow-y-auto max-w-xs">
                                            {prop.servicios}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            Editar
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {propiedades.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay propiedades disponibles</p>
                        <p className="text-gray-400 text-sm mt-2">Agrega tu primera propiedad para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default page
