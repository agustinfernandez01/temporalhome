// app/api/propiedades/[id]/imagenes/[imageId]/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabase } from '@/lib/index.server';
import {
  setImagenPrincipal,
  deleteImagenRow,
} from '../../../../../../lib/Repositorys/imagenesRepo.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  const propiedadId = Number(params.id);
  const imageId = Number(params.imageId);
  if (!Number.isFinite(propiedadId) || !Number.isFinite(imageId)) {
    return NextResponse.json({ error: 'Bad ids' }, { status: 400 });
  }

  await setImagenPrincipal(imageId, propiedadId);
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  const propiedadId = Number(params.id);
  const imageId = Number(params.imageId);
  if (!Number.isFinite(propiedadId) || !Number.isFinite(imageId)) {
    return NextResponse.json({ error: 'Bad ids' }, { status: 400 });
  }

  const supabase = await createSupabase();

  // 1) Traer fila para conocer bucket y path
  const row = await supabase
    .from('imagenes')
    .select('id, bucket, path')
    .eq('id', imageId)
    .eq('propiedad_id', propiedadId)
    .single();

  if (row.error || !row.data) {
    return NextResponse.json({ error: row.error?.message || 'Not found' }, { status: 404 });
  }

  // 2) Borrar del Storage
  const del = await supabase.storage.from(row.data.bucket).remove([row.data.path]);
  if (del.error) {
    return NextResponse.json({ error: del.error.message }, { status: 500 });
  }

  // 3) Borrar la fila en DB (repo)
  await deleteImagenRow(imageId, propiedadId);

  return NextResponse.json({ ok: true }, { status: 200 });
}
