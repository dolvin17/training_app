// src/proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(req: NextRequest) {
  // 1. Creamos una respuesta base
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Inicializamos el cliente de Supabase con manejo de cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          req.cookies.set({ name, value: '', ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 3. Obtenemos la sesión (esto refresca el token automáticamente si es necesario)
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/registro';
  const isHomePage = req.nextUrl.pathname === '/';
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  // --- LÓGICA DE REDIRECCIÓN ---

  // A. Si NO hay sesión y el usuario intenta entrar a la Home o al Dashboard: Mándalo al Login
  if (!session && (isHomePage || isDashboard)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // B. Si SÍ hay sesión y el usuario intenta ir al Login o Registro: Mándalo a la Home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// 4. Especificar qué rutas debe interceptar Next.js
export const config = {
  // Protegemos la raíz, el dashboard y las páginas de auth
  matcher: ['/', '/dashboard/:path*', '/login', '/registro'],
};