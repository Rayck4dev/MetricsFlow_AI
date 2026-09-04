"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface OnboardingErrorProps {
  message: string;
}

export default function OnboardingError({ message }: OnboardingErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mb-4 overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0 text-red-400"
            />
            <p className="text-xs leading-relaxed text-red-300">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
