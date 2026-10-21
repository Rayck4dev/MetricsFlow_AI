"use client";

import { ArrowRight } from "lucide-react";

export function Metric({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel p-3">
      <div className="flex items-center justify-between">
        <p className="text-[7px] text-slate-500">{label}</p>

        <span className="text-slate-600">{icon}</span>
      </div>

      <p className={`mt-1.5 text-[11px] font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

export function TrendingUpIcon() {
  return <ArrowRight size={11} className="-rotate-45" />;
}
