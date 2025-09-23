// src/middleware.ts  (o middleware.ts en la raíz del proyecto)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Lee si existe la cookie de sesión de Supabase (sb-...-auth-token) */
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

/** Aplica headers anti-cache en la RESPUESTA */
function applyNoStore<T extends NextResponse>(res: T): T {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export function middleware(req: NextRequest) {
  // normalizo para evitar problemas con barras finales
  const pathname = req.nextUrl.pathname.replace(/\/+$/, "");

  // 1) Solo actuamos en /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLogin = pathname === "/admin/login";
  const isAuth = hasSupabaseSession(req);

  // 2) Sin sesión e intenta acceder a /admin/* (que no sea login) -> redirijo a login
  if (!isAuth && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return applyNoStore(NextResponse.redirect(url));
  }

  // 3) Con sesión e intenta ver el login -> redirijo al dashboard
  if (isAuth && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return applyNoStore(NextResponse.redirect(url));
  }

  // 4) Dejar pasar, PERO con anti-cache para que "Atrás" no muestre versión vieja
  return applyNoStore(NextResponse.next());
}

/** 5) Dónde corre el middleware */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
