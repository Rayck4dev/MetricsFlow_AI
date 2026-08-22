"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface PreferenciasDangerZoneProps {
  onDeleteAccount?: () => void | Promise<void>;
}

export function PreferenciasDangerZone({
  onDeleteAccount,
}: PreferenciasDangerZoneProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setDeleting(true);

    try {
      await onDeleteAccount?.();
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-red-500/15 bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-red-500/10 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle size={16} className="text-red-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Zona de risco</h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Ações que podem afetar permanentemente sua conta.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="rounded-xl border border-red-500/10 bg-red-500/[0.035] p-4">
          <p className="text-[10px] font-bold text-red-300">
            Exclusão da conta
          </p>

          <p className="mt-1.5 text-[8px] leading-4 text-slate-600">
            A exclusão da conta removerá seus dados e o acesso ao sistema. Essa
            ação deverá ser confirmada antes de ser executada.
          </p>
        </div>

        {confirming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3"
          >
            <p className="text-[9px] font-semibold text-red-300">
              Tem certeza que deseja continuar?
            </p>

            <p className="mt-1 text-[8px] leading-4 text-slate-500">
              Esta confirmação será substituída pela validação do backend quando
              a exclusão estiver disponível.
            </p>
          </motion.div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {confirming && (
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="h-10 rounded-xl border border-surface-border bg-surface-sidebar px-4 text-[9px] font-bold text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-slate-200"
            >
              Cancelar
            </button>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            disabled={deleting}
            onClick={handleDelete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-[9px] font-bold text-red-400 transition-all hover:border-red-500/30 hover:bg-red-500/15 disabled:opacity-50"
          >
            <Trash2 size={13} />

            {deleting
              ? "Excluindo..."
              : confirming
                ? "Confirmar exclusão"
                : "Excluir minha conta"}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
