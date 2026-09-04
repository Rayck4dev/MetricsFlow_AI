import { createClient } from "@/lib/supabase/client";

export interface UpdateUserPreferencesData {
  theme?: "dark" | "light" | "system";
  email_notifications?: boolean;
  transaction_notifications?: boolean;
  whatsapp_notifications?: boolean;
  default_period?: string;
  currency?: string;
}

export async function updateUserPreferences(
  preferences: UpdateUserPreferencesData,
) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("❌ Erro ao obter usuário:", userError);
    throw userError;
  }

  if (!user) {
    throw new Error("Sua sessão não foi encontrada. Faça login novamente.");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error("A sessão de autenticação não está disponível.");
  }

  const payload = {
    user_id: user.id,
    ...preferences,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(payload, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao atualizar preferências:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      userId: user.id,
    });

    throw new Error(
      error.message || "Não foi possível salvar suas preferências.",
    );
  }
}
