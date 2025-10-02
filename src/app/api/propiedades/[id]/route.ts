// app/api/propiedades/[id]/route.ts
import { getPropiedadById } from "@/lib/Repositorys/PropiedadesRepo.server";
import { NextResponse } from "next/server";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  // si tu PK es numérica
  const n = Number(id);
  if (!Number.isFinite(n)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  try {
    const propiedad = await getPropiedadById(n);
    if (!propiedad) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(propiedad);
  } catch (e) {
    console.error("Error fetching property:", e);
    return NextResponse.json({ error: "Error fetching property" }, { status: 500 });
  }
}
