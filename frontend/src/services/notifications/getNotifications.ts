import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/notifications";

export async function getNotifications(): Promise<Notification[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Sua sessão não foi encontrada.");
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error(
      error.message || "Não foi possível carregar suas notificações.",
    );
  }

  return data ?? [];
}
