// src/app/(admin)/admin/layout.tsx  (SERVER)
import { redirect } from "next/navigation";
import { createSupabase } from "@/lib/index.server";
import { RoleProvider, Rol } from "../../../Components/Providers/role-context";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabase();

  // 1) Usuario logueado
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect("/admin/login");

  // 2) Rol desde tu tabla
  const { data: row } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", auth.user.id)
    .maybeSingle();

  const rol = (row?.rol ?? "user") as Rol;

  // 3) Devolver JSX y exponer rol vía Context
  return <RoleProvider value={rol}>{children}</RoleProvider>;
}
