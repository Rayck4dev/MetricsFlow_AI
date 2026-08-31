import { createClient } from "@/lib/supabase/client";

export async function updatePassword(password: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message || "Não foi possível alterar a senha.");
  }
}

export async function signOutOtherSessions(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut({
    scope: "others",
  });

  if (error) {
    throw new Error(
      error.message || "Não foi possível encerrar as outras sessões.",
    );
  }
}
