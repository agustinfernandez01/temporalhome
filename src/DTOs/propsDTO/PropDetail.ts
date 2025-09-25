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
    servicios: string[];
    cocheras: number;
    ubicacionGoogle: string;
}
