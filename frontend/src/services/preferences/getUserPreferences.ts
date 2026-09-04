import { createClient } from "@/lib/supabase/client";

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  email_notifications: boolean;
  transaction_notifications: boolean;
  whatsapp_notifications: boolean;
  default_period: string;
  currency: string;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Sua sessão não foi encontrada. Faça login novamente.");
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select(
      `
        theme,
        email_notifications,
        transaction_notifications,
        whatsapp_notifications,
        default_period,
        currency
      `,
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("❌ Erro ao buscar preferências:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Não foi possível carregar suas preferências.",
    );
  }

  return {
    theme:
      data?.theme === "light" || data?.theme === "system" ? data.theme : "dark",

    email_notifications: data?.email_notifications ?? true,

    transaction_notifications: data?.transaction_notifications ?? true,

    whatsapp_notifications: data?.whatsapp_notifications ?? true,

    default_period: data?.default_period ?? "month",

    currency: data?.currency ?? "BRL",
  };
}
