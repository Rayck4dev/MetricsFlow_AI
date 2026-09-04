import { createClient } from "@/lib/supabase/client";

export interface SaveOnboardingData {
  goal: string;
  controlMethod: string;
  mainChallenge: string;
  selectedMetrics: string[];
  frequency: string;
}

export interface SaveOnboardingResult {
  success: boolean;
}

export async function saveOnboarding(
  userId: string,
  data: SaveOnboardingData,
): Promise<SaveOnboardingResult> {
  const supabase = createClient();

  const { error } = await supabase.from("user_onboarding").upsert(
    {
      user_id: userId,
      goal: data.goal,
      control_method: data.controlMethod,
      main_challenge: data.mainChallenge,
      selected_metrics: data.selectedMetrics,
      frequency: data.frequency,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    console.error("❌ Erro ao salvar onboarding:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Não foi possível salvar suas preferências.",
    );
  }

  return {
    success: true,
  };
}
