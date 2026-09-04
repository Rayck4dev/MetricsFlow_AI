import { motion } from "framer-motion";

interface SidebarStatusProps {
  demo: boolean;
}

export function SidebarStatus({ demo }: SidebarStatusProps) {
  return (
    <div className="border-t border-surface-border p-3">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="
          relative
          overflow-hidden
          rounded-xl
          border border-brand-500/15
          bg-gradient-to-b
          from-brand-500/[0.05]
          to-transparent
          p-3
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-4
            -top-4
            h-12 w-12
            rounded-full
            bg-brand-500/10
            blur-xl
          "
        />

        <div className="mb-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
            {demo ? "Modo demonstração" : "Sistema ativo"}
          </span>
        </div>

        <p className="text-[9.5px] font-medium leading-4 text-slate-400">
          {demo
            ? "Dados fictícios para explorar a plataforma."
            : "Sua conta está sincronizada em tempo real."}
        </p>
      </motion.div>
    </div>
  );
}
