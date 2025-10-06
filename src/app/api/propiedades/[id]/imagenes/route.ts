// app/api/propiedades/[id]/imagenes/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

import { createSupabase } from '@/lib/index.server';
import {
  getImagenesByPropiedad,
  publicUrlFor,
} from '../../../../../lib/Repositorys/imagenesRepo.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'propiedades-image';
const ROOT   = 'imagenes'; // carpeta dentro del bucket

const safeName = (s: string) => s.replace(/[^\w.\-]/g, '_');

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const propiedadId = Number(params.id);
  if (!Number.isFinite(propiedadId)) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  const rows = await getImagenesByPropiedad(propiedadId);

  // Agrego URL pública (bucket público) usando tu helper
  const withUrls = rows.map((r) => ({
    ...r,
    url: publicUrlFor(r.bucket, r.path),
  }));

  return NextResponse.json(withUrls, { status: 200 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const propiedadId = Number(params.id);
  if (!Number.isFinite(propiedadId)) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // Validaciones básicas opcionales
  const MAX = 8 * 1024 * 1024; // 8 MB
  if (file.size > MAX) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  const supabase = await createSupabase();

  // 🔴 IMPORTANTE: incluir la carpeta ROOT en el path
  const path = `${ROOT}/prop-${propiedadId}/${uuid()}-${safeName(file.name)}`;

  // 1) Subir a Storage
  const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (up.error) {
    return NextResponse.json({ error: up.error.message }, { status: 500 });
  }

  // 2) Insertar fila en DB
  const ins = await supabase
    .from('imagenes')
    .insert({
      propiedad_id: propiedadId,
      bucket: BUCKET,
      path,
      is_primary: false,
    })
    .select('id, created_at, propiedad_id, bucket, path, is_primary')
    .single();

  if (ins.error) {
    // rollback del archivo si falló DB
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: ins.error.message }, { status: 500 });
  }

  // 3) Devolver con URL pública (bucket público)
  const url = publicUrlFor(BUCKET, path);
  return NextResponse.json({ ...ins.data, url }, { status: 201 });
}
