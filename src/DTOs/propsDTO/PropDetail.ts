export default interface PropDetail {
    id: number;
    nombre: string;
    direccion: string;
    capacidad: number;
    tipo: string;
    ambientes: number;
    banios: number;
    camas: number;
    estado: string;
    descripcion: string;
    servicios_json: string[];
    cocheras: number;
    ubicacionGoogle: string;
    img : string;
}
