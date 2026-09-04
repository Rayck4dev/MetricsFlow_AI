import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Erro ao trocar código OAuth:", exchangeError);

    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Erro ao recuperar usuário OAuth:", userError);

    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Erro ao verificar perfil:", profileError);

    return NextResponse.redirect(new URL("/login?error=profile", request.url));
  }

  if (!profile) {
    const metadata = user.user_metadata ?? {};

    const name =
      typeof metadata.full_name === "string" && metadata.full_name.trim()
        ? metadata.full_name.trim()
        : typeof metadata.name === "string" && metadata.name.trim()
          ? metadata.name.trim()
          : user.email?.split("@")[0] || "Usuário";

    const { error: createProfileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name,
        email: user.email ?? null,
      });

    if (createProfileError) {
      console.error("Erro ao criar perfil OAuth:", createProfileError);

      return NextResponse.redirect(
        new URL("/login?error=profile", request.url),
      );
    }
  }

  const { data: membership, error: membershipError } = await supabase
    .from("company_members")
    .select("company_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    console.error("Erro ao verificar vínculo com empresa:", membershipError);

    return NextResponse.redirect(new URL("/login?error=company", request.url));
  }

  if (membership) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(
    new URL("/onboarding?source=google", request.url),
  );
}
