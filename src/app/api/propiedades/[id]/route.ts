// app/api/propiedades/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPropiedadById , deletePropiedadById } from '@/lib/Repositorys/PropiedadesRepo.server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;            // 👈 hay que await
  const n = Number(id);
  if (!Number.isFinite(n)) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  try {
    const propiedad = await getPropiedadById(n);
    if (!propiedad) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(propiedad);
  } catch (e) {
    console.error('Error fetching property:', e);
    return NextResponse.json({ error: 'Error fetching property' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const n = Number(params.id);
  if (!Number.isFinite(n)) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  try {
    const deleted = await deletePropiedadById(n);
    if (!deleted) {
      // Si no existía o no borró filas
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 204: No Content (tu front sólo chequea res.ok)
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error('Error deleting property:', e);
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 });
  }
}


// (opcional, si querés evitar caché)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
