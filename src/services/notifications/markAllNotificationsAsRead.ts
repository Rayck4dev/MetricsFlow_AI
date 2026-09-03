import { createClient } from "@/lib/supabase/client";

export async function markAllNotificationsAsRead() {
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

  const { error } = await supabase
    .from("notifications")
    .update({
      read: true,
    })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    throw new Error(
      error.message || "Não foi possível marcar as notificações como lidas.",
    );
  }
}
