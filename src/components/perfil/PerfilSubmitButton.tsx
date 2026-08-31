"use client";

import { Check, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

interface PerfilSubmitButtonProps {
  saving: boolean;
  saved: boolean;
}

export function PerfilSubmitButton({
  saving,
  saved,
}: PerfilSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={saving}
      whileHover={{
        y: -1,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="
        inline-flex h-10
        items-center justify-center gap-2
        rounded-xl
        bg-brand-600
        px-5
        text-[10px] font-bold
        text-white
        shadow-lg shadow-brand-600/10
        transition-colors
        hover:bg-brand-500
        disabled:pointer-events-none
        disabled:opacity-60
      "
    >
      {saving ? (
        <Loader2
          size={13}
          className="animate-spin"
        />
      ) : saved ? (
        <Check size={13} />
      ) : (
        <Save size={13} />
      )}

      {saving
        ? "Salvando..."
        : saved
          ? "Alterações salvas"
          : "Salvar alterações"}
    </motion.button>
  );
}