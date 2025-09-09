import { getPropiedades , postPropiedad } from "@/lib/Repositorys/PropiedadesRepo.server";
import { NextResponse } from "next/server";

async function GET() : Promise<Response> {
    try{
        const propiedades = await getPropiedades();
        return NextResponse.json( propiedades, {status: 200} );
    }
    catch(error){
        console.error("Error fetching properties:", error);
        return NextResponse.json({ error: "Error fetching properties" }, { status: 500 } );
    }
}

async function POST(request : Request) : Promise<Response> {
    try{
        const body = await request.json();
        const success = await postPropiedad(body);
        return NextResponse.json({ success }, { status: success ? 201 : 400 });
    }
    catch(error){
        console.error("Error posting property:", error);
        return NextResponse.json({ error: "Error posting property" }, { status: 500 });
    }
}

export { GET , POST };