import "server-only";
import { createSupabase } from "../index.server";
import AdminDTO from "../../DTOs/propsDTO/AdminDto";
import CardDTO from '../../DTOs/propsDTO/CardDto'; // Import as a type
import CardListDto from "../../DTOs/propsDTO/CardListDto";
import PropDetail from "@/DTOs/propsDTO/PropDetail";


// Mostrar todas las propiedades 
const getPropiedades = async (): Promise<AdminDTO[]> => {

    try{
        const supabase = await createSupabase();
        const { data, error } = await supabase
            .from('propiedades')
            .select('id,nombre,direccion,capacidad,tipo,ambientes,banios,camas,estado,descripcion,servicios,cocheras,ubicacionGoogle');
        if (error) {
            console.error("Error fetching properties:", error);
            return [];
        }
        return data ?? [];
    }
    catch(error){
        console.error("Error fetching properties:", error);
        return [];
    }
}

// Mostrar una propiedad por ID

const getPropiedadById = async (id: number): Promise<PropDetail | null> => {
  try {
    const supabase = await createSupabase();
    const { data, error } = await supabase
      .from('propiedades')
      .select('id,nombre,direccion,capacidad,tipo,ambientes,banios,camas,estado,descripcion,servicios_json,cocheras,ubicacionGoogle,img')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const raw: any = data;

    const servicios_json =
      Array.isArray(raw.servicios_json) ? raw.servicios_json
      : typeof raw.servicios_json === "string" ? safeParseArray(raw.servicios_json) ?? []
      : [];

    const img =
      Array.isArray(raw.img) ? raw.img
      : typeof raw.img === "string"
        ? (safeParseArray(raw.img) ?? raw.img) // si es JSON array → array; si es URL simple → string
        : raw.img ?? null;

    return { ...raw, servicios_json, img } as PropDetail;
  } catch {
    return null;
  }
};

function safeParseArray(v: string): string[] | null {
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : null; }
  catch { return null; }
}

// Insertar una propiedad 
const postPropiedad = async (propiedad : AdminDTO) : Promise<boolean> => {
    try {
        const supabase = await createSupabase();
        const { data , error } = await supabase
        .from('propiedades')
        .insert(propiedad);
        
        if(error) {
            console.error("Error inserting property:", error);
            return false;
        }
        return true;
    }
    catch(error){
        console.error("Error posting property:", error);
        return false;
    }

};


const getPropiedadesCard = async (): Promise<CardDTO[]> => {
    const supabase = await createSupabase();

    try {
        const { data, error } = await supabase
            .from('propiedades')
            .select('id, titulo: nombre, ubicacion: direccion, tipo, camas, img, banios, cocheras');

            if (error) {
                console.error("Error fetching property cards:", error);
                return [];
            }

            return data as CardDTO[];
        } catch (error) {
            console.error("Error fetching property cards:", error);
            return [];
        }
    }   

const getPropiedadesCardList = async (): Promise<CardListDto[]> => {
    const supabase = await createSupabase();

    try {
        const { data, error } = await supabase
            .from('propiedades')
            .select('id, nombre, ubicacion, descripcion, img, cocheras, capacidad, ambientes');

        if (error) {
            console.error("Error fetching property cards:", error);
            return [];
        }

        return data as CardListDto[];
    } catch (error) {
        console.error("Error fetching property cards:", error);
        return [];
    }
}

export { getPropiedades, postPropiedad , getPropiedadesCard , getPropiedadesCardList , getPropiedadById };