import { createSupabase } from '../../lib/index.server';

type ImagenRow = {
  id: number;
  created_at: string;
  propiedad_id: number;
  bucket: string;
  path: string;
  is_primary: boolean;
};

export const getImagenesByPropiedad = async (propiedadId: number): Promise<ImagenRow[]> => {
  const supabase = await createSupabase();
  const { data, error } = await supabase
    .from('imagenes')
    .select('*')
    .eq('propiedad_id', propiedadId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const setImagenPrincipal = async (imageId: number, propiedadId: number): Promise<void> => {
  const supabase = await createSupabase();
  // desmarcar todas
  let { error } = await supabase.from('imagenes').update({ is_primary: false }).eq('propiedad_id', propiedadId);
  if (error) throw error;
  // marcar la elegida
  ({ error } = await supabase.from('imagenes').update({ is_primary: true }).eq('id', imageId));
  if (error) throw error;
};

export const deleteImagenRow = async (imageId: number, propiedadId: number): Promise<void> => {
  const supabase = await createSupabase();
  const { error } = await supabase.from('imagenes').delete().eq('id', imageId).eq('propiedad_id', propiedadId);
  if (error) throw error;
};

// Si tu bucket es público podés derivar la URL acá mismo:
export const publicUrlFor = (bucket: string, path: string): string => {
  const supabase = (global as any).__sbPublic ??= require('@supabase/ssr')
    .createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};