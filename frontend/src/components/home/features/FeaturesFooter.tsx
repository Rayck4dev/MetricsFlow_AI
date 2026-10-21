"use client";

import { motion, type Variants } from "framer-motion";
import { Bot, CheckCircle2, PieChart, MessageSquare } from "lucide-react";

const integrations = [
  {
    label: "WhatsApp",
    icon: MessageSquare,
    color: "text-emerald-400",
  },
  {
    label: "IA",
    icon: Bot,
    color: "text-brand-400",
  },
  {
    label: "Dashboard",
    icon: PieChart,
    color: "text-purple-400",
  },
] as const;

const footerAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.15,
    },
  },
};

export function FeaturesFooter() {
  return (
    <motion.div
      variants={footerAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
      }}
      className="
        mt-10
        flex
        flex-col
        items-center
        justify-between
        gap-4
        rounded-2xl
        border border-surface-border
        bg-surface-sidebar/50
        px-5
        py-4
        sm:flex-row
      "
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10">
          <CheckCircle2
            size={14}
            className="text-brand-400"
            aria-hidden="true"
          />
        </div>

        <span className="text-[11px] text-slate-400">
          Tudo integrado em uma única experiência.
        </span>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-600">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;

          return (
            <div key={integration.label} className="flex items-center gap-4">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-slate-700"
                />
              )}

              <span className="flex items-center gap-1.5">
                <Icon
                  size={11}
                  className={integration.color}
                  aria-hidden="true"
                />

                {integration.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
