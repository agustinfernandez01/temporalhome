import { NextResponse } from "next/server";
import { getPropiedadesCardList } from "@/lib/Repositorys/PropiedadesRepo.server";

export async function GET(request: Request) {

    try {
        const propiedades = await getPropiedadesCardList();
        return NextResponse.json(propiedades, { status: 200 });
    } catch (error) {
        console.error("Error fetching property cards:", error);
        return NextResponse.json({ error: "Error fetching property cards" }, { status: 500 });
    }
}
