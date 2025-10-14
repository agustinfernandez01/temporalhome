import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

type Uploaded = { path: string; publicUrl: string };

export async function uploadPropImages(
  files: FileList | File[],
  propId: number,
  bucket = 'propiedades'
): Promise<Uploaded[]> {
  const arr = Array.from(files);
  const out: Uploaded[] = [];

  for (const file of arr) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const name = slugify(file.name.replace(/\.[^/.]+$/, ''));
    const filename = `${uuid()}-${name}.${ext}`;

    // 👉 ESTE ES EL PATH
    const path = `${propId}/${filename}`;

    const { error } = await supabase.storage.from(`${bucket}.imagenes`).upload(path, file, {
      cacheControl: '3600',
      upsert: false,            // evita sobreescribir
      contentType: file.type || undefined,
    });
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    out.push({ path, publicUrl: data.publicUrl });
  }

  return out;
}

export async function deletePropImage(path: string, bucket = 'propiedades'): Promise<boolean | void> {
  const { error } = await supabase.storage.from(`${bucket}.imagenes`).remove([path]);
  if (error) throw error;

  return true;
}
