"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ open, onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] md:hidden"
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <X size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <MenuIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function MenuIcon() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="h-px w-5 bg-white" />
      <span className="h-px w-3.5 self-end bg-white/70" />
      <span className="h-px w-5 bg-white" />
    </div>
  );
}
