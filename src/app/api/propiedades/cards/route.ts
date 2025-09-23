import { NextResponse } from "next/server";
import { getPropiedadesCard } from "@/lib/Repositorys/PropiedadesRepo.server";

export async function GET(request: Request) {
    try {
        const propiedades = await getPropiedadesCard();

        if (!propiedades) {
            return NextResponse.json({ error: "No se encontraron propiedades" }, { status: 404 });
        }
        return NextResponse.json(propiedades);
    }
    catch (error) {
        console.error("Error fetching propiedades:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}