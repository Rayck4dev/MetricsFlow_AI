import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("Sua sessão não foi encontrada. Faça login novamente.");
  }

  return user;
}
