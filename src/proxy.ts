import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/demo"];
const AUTH_ROUTES = ["/login", "/cadastro"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔥 PROXY INTERCEPTOU:", pathname);

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    console.log("📍 Sistema - passando");
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👤 Usuário autenticado?", !!user, user?.email || "");

  if (user && AUTH_ROUTES.includes(pathname)) {
    console.log(
      "🔄 Usuário autenticado tentando acessar",
      pathname,
      "→ redirecionando para /dashboard",
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (PUBLIC_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) {
    console.log("🟢 Rota pública/auth - permitindo:", pathname);
    return response;
  }

  if (!user) {
    console.log(
      "🔒 NÃO AUTENTICADO em rota protegida:",
      pathname,
      "→ redirecionando para /login",
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Usuário autenticado - permitindo:", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
