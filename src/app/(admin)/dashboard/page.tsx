"use client";

import { UserIcon, CogIcon  as SettingsIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

export default function Page() {

    const supabase = new SupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const router = useRouter();

    const botonesPorRol = {
        admin: [
            { nombre: 'Usuarios', icono: <UserIcon className="h-6 w-6" />, enlace: '/admin/usuarios' },
            { nombre: 'Configuración', icono: <SettingsIcon className="h-6 w-6" />, enlace: '/admin/configuracion' },
            { nombre: "Propiedades", icono: <BuildingOfficeIcon className="h-6 w-6" />, enlace: '/dashboard/propiedades' },
            { nombre: "Clientes" , icono: <UserGroupIcon className="h-6 w-6" />, enlace: '/admin/clientes' },
        ],
        user: [
            { nombre: "Propiedades", icono: <BuildingOfficeIcon className="h-6 w-6" />, enlace: '/admin/propiedades' },
            { nombre: "Clientes" , icono: <UserGroupIcon className="h-6 w-6" />, enlace: '/admin/clientes' }
        ],
    };
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard de Administración</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {botonesPorRol.admin.map((boton, index) => (
                        <div
                            key={index}
                            onClick={() => router.push(boton.enlace)}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-indigo-600">
                                    {boton.icono}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {boton.nombre}
                                </h3>
                            </div>
                            <p className="mt-2 text-gray-600 text-sm">
                                Gestionar {boton.nombre.toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}