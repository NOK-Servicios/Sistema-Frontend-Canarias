import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
  Middleware de Next.js — se ejecuta en el EDGE (antes de que
  cargue cualquier página), así que es muy rápido.

  Protege todas las rutas del dashboard y redirige
  al login si no hay token. También bloquea el acceso
  a rutas según el rol del usuario.

  IMPORTANTE: Este middleware NO puede usar localStorage
  (no hay browser acá). El token tiene que venir en una
  cookie. La cookie la seteamos en el login.
*/

// Rutas que NO necesitan autenticación
const PUBLIC_ROUTES = ["/login"];

// Rutas exclusivas por rol
// Si un rol no está en la lista de una ruta, se redirige al dashboard
const RUTAS_POR_ROL: Record<string, string[]> = {
  "/cobrador": ["cobrador"],
  "/reportes": ["gerente", "administrativo"],
  "/staff": ["gerente", "administrativo"],
  "/zonas": ["gerente", "administrativo"],
  "/caja": ["gerente", "administrativo", "cobrador"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar rutas públicas
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Leer el token de la cookie (lo seteamos en el login)
  const token = request.cookies.get("accessToken")?.value;

  // Sin token → redirigir al login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Guardamos a dónde quería ir para redirigir después del login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar restricciones por rol
  const rol = request.cookies.get("userRole")?.value;

  for (const [ruta, rolesPermitidos] of Object.entries(RUTAS_POR_ROL)) {
    if (pathname.startsWith(ruta) && rol) {
      if (!rolesPermitidos.includes(rol)) {
        // Tiene token pero no tiene el rol necesario → al dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Le dice a Next.js en qué rutas correr el middleware.
// El patrón excluye archivos estáticos, imágenes y la API de Next.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
