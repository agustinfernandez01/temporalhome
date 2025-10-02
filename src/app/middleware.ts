// middleware.ts (en la raíz)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** ¿Hay cookie de sesión de Supabase? (sb-...-auth-token) */
function hasSupabaseSession(req: NextRequest) {
  return req.cookies
    .getAll()
    .some(
      (c) =>
        c.name.startsWith("sb-") &&
        c.name.endsWith("-auth-token") &&
        !!c.value
    );
}

/** Anti-cache en la respuesta */
function noStore<T extends NextResponse>(res: T): T {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignorar assets/sistema
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Solo actuamos en /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLogin = pathname === "/admin/login";
  const isAuth = hasSupabaseSession(req);

  // ⚠️ Nunca redirigir desde /admin/login (evita loops)
  if (isLogin) {
    // Si ya querés, podés mandar al dashboard aquí SOLO si estás 100% seguro de que la sesión es válida.
    return noStore(NextResponse.next());
  }

  // Resto de /admin/* protegido
  if (!isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname); // opcional
    return noStore(NextResponse.redirect(url));
  }

  return noStore(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*"], // protege todo /admin/* (login también pasa pero sin redirección)
};
