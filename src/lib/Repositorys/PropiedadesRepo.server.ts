import "server-only";
import { createSupabase } from "../index.server";
import AdminDTO from "../../DTOs/propsDTO/AdminDto";
import CardDTO from '../../DTOs/propsDTO/CardDto'; // Import as a type

// Mostrar todas las propiedades
const getPropiedades = async (): Promise<AdminDTO[]> => {

    try{
        const supabase = await createSupabase();
        const { data, error } = await supabase
            .from('propiedades')
            .select('id,nombre,direccion,capacidad,tipo,ambientes,banios,camas,estado,descripcion,servicios,cocheras');
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

export { getPropiedades, postPropiedad , getPropiedadesCard };