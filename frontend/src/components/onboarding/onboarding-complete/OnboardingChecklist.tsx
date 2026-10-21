import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

const checklistVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const checklistItem: Variants = {
  hidden: {
    opacity: 0,
    x: -6,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.22,
      ease: "easeOut",
    },
  },
};

export function OnboardingChecklist({ items }: { items: string[] }) {
  return <motion.div
        variants={checklistVariants}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-lg grid-cols-1 gap-1.5 rounded-xl border border-surface-border bg-surface-panel/70 p-3 sm:grid-cols-2"
      >
        {items.map((checkItem, index) => (
          <motion.div
            key={index}
            variants={checklistItem}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <Check size={11} strokeWidth={3} />
            </div>

            <span className="text-[10px] leading-snug text-slate-300">
              {checkItem}
            </span>
          </motion.div>
        ))}
      </motion.div>;
}
