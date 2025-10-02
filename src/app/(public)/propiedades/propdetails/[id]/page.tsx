// app/(public)/propiedades/propdetails/[id]/page.tsx
import { notFound } from "next/navigation";
import DetailsView from "@/Views/DetailsView";
import { getPropiedadById } from "@/lib/Repositorys/PropiedadesRepo.server";

export const revalidate = 0; // evita caché en dev (opcional)
export const dynamic = "force-dynamic"; // opcional si seguís viendo caché

export default async function Page({ params }: { params: { id: string } }) {
  const n = Number(params.id);
  if (!Number.isFinite(n)) notFound();

  const propiedad = await getPropiedadById(n);
  if (!propiedad) notFound();

  return <DetailsView propiedad={propiedad} />;
}
