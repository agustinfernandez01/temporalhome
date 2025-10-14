'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import AdminDTO from '@/DTOs/propsDTO/AdminDto';
import ModalActions from '@/app/Modals/ModalActions';

export type Accion = 'add' | 'edit';

/** ---- PROPIEDADES DEL MODAL ---- */
function ModalPortal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[1000] bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Contenedor centrado */}
      <div
        className="fixed inset-0 z-[1001] grid place-items-center p-4"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()} // evita cerrar al click interior
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
/** ---- FIN PROPIEDADES DEL MODAL ---- */

const Page = () => {
  const [propiedades, setPropiedades] = useState<AdminDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [accion, setAccion] = useState<Accion>('add');
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<AdminDTO | null>(null);

  const handleAdd = () => {
    setOpenModal(true);
    setAccion('add');
  };

  const handleEdit = (propiedad: AdminDTO) => {
    setOpenModal(true);
    setAccion('edit');
    setPropiedadSeleccionada(propiedad);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchProps(); // Refrescar lista después de cerrar el modal
  };

  const fetchProps = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/propiedades', {
        cache: 'no-cache',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setPropiedades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setPropiedades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, []);

  // Normaliza servicios para pintar chips
  const getServicios = (value: unknown): string[] => {
    try {
      if (Array.isArray(value)) return value as string[];
      if (typeof value === 'string') {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta propiedad?')) return;
    try {
      // Optimista
      const prev = propiedades;
      setPropiedades((p) => p.filter((x) => x.id !== id));
      const res = await fetch(`/api/propiedades/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('DELETE failed');
    } catch (e) {
      console.error(e);
      // fallback: recargar lista si falló
      fetchProps();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto px-4">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Propiedades</h1>
            <p className="mt-2 text-gray-600">Gestiona todas las propiedades del sistema</p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Agregar Propiedad
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1200px] w-full table-fixed text-sm divide-y divide-gray-200">
              <colgroup>
                <col className="w-14" />
                <col className="w-56" />
                <col className="w-56" />
                <col className="w-20" />
                <col className="w-24" />
                <col className="w-20" />
                <col className="w-16" />
                <col className="w-16" />
                <col className="w-28" />
                <col className="w-64" />
                <col className="w-56" />
                <col className="w-48 md:table-column hidden" />
                <col className="w-24 md:table-column hidden" />
                <col className="w-36" />
                <col className="w-40" />
              </colgroup>

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cap.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amb.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Baños</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicios</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Ubicación Google
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Cocheras
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imágenes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {propiedades.map((prop, index) => (
                  <tr key={prop.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 text-gray-900 text-center">{prop.id}</td>

                    <td className="px-4 py-4 text-gray-900 truncate" title={prop.nombre}>{prop.nombre}</td>
                    <td className="px-4 py-4 text-gray-500 truncate" title={prop.direccion}>{prop.direccion}</td>

                    <td className="px-4 py-4 text-gray-900 text-center whitespace-nowrap">{prop.capacidad}</td>
                    <td className="px-4 py-4 text-gray-900 whitespace-nowrap capitalize">{prop.tipo}</td>
                    <td className="px-4 py-4 text-gray-900 text-center">{prop.ambientes}</td>

                    {/* OJO: unificá nombres de campo: 'banios' vs 'banos' */}
                    <td className="px-4 py-4 text-gray-900 text-center">{(prop as any).banios ?? (prop as any).banos}</td>
                    <td className="px-4 py-4 text-gray-900 text-center">{prop.camas}</td>
                    <td className="px-4 py-4 text-gray-900 capitalize">{prop.estado}</td>

                    <td className="px-4 py-4 text-gray-500 truncate" title={prop.descripcion || '-'}>
                      {prop.descripcion || '-'}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      <div className="flex flex-wrap gap-2 max-w-[220px]">
                        {getServicios((prop as any).servicios_json).map((s: string, i: number) => (
                          <span key={`${prop.id}-${s}-${i}`} className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-500 truncate hidden md:table-cell" title={prop.ubicacionGoogle}>
                      {prop.ubicacionGoogle}
                    </td>

                    <td className="px-4 py-4 text-gray-500 hidden md:table-cell text-center">
                      {prop.cocheras ?? '-'}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      {Array.isArray((prop as any).imagenes) && (prop as any).imagenes.length > 0 ? 'Imágenes disponibles' : 'Sin imágenes'}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <button
                        onClick={() => handleEdit(prop)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && propiedades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Cargando propiedades…</p>
            </div>
          )}
          {!loading && propiedades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay propiedades disponibles</p>
            </div>
          )}
        </div>

        {/* ---- Render del modal fuera del flujo (portal) ---- */}
        <ModalPortal open={openModal} onClose={handleCloseModal}>
          <ModalActions
            propiedad={propiedadSeleccionada}
            accion={accion}
            onClose={handleCloseModal}
          />
        </ModalPortal>
      </div>
    </div>
  );
};

export default Page;
