import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

function getMetadataName(user: User) {
  const metadata = user.user_metadata ?? {};

  if (typeof metadata.full_name === "string") {
    return metadata.full_name.trim();
  }

  if (typeof metadata.name === "string") {
    return metadata.name.trim();
  }

  return "";
}

export async function getOrCreateProfile(user: User) {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (profile) {
    return profile;
  }

  const metadataName = getMetadataName(user);

  const fallbackName = metadataName || user.email?.split("@")[0] || "Usuário";

  const { data: createdProfile, error: createProfileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        name: fallbackName,
        email: user.email ?? null,
      },
      {
        onConflict: "id",
      },
    )
    .select("id, name, email, phone")
    .single();

  if (createProfileError) {
    throw createProfileError;
  }

  return createdProfile;
}
