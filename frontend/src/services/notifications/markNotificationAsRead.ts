import { createClient } from "@/lib/supabase/client";

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({
      read: true,
    })
    .eq("id", notificationId);

  if (error) {
    throw new Error(
      error.message || "Não foi possível marcar a notificação como lida.",
    );
  }
}
