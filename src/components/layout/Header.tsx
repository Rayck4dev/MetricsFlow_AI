"use client";

import { Bell, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-surface-sidebar border-b border-surface-border px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-white font-heading">
          Visão Geral de Desempenho
        </h2>
        <span className="bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
          <Sparkles size={12} /> IA Ativa
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white bg-surface-panel border border-surface-border rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="w-2 h-2 bg-brand-500 rounded-full absolute top-1.5 right-1.5" />
        </button>

        <div className="flex items-center gap-3 border-l border-surface-border pl-4">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            ME
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">Sua Empresa MEI</p>
            <p className="text-slate-400">Plano Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
}
