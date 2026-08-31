"use client";

interface PerfilInfoCardProps {
  title?: string;
  description?: string;
}

export function PerfilInfoCard({
  title = "Seus dados ficam vinculados à sua conta.",
  description = "O telefone é opcional e pode ser adicionado ou alterado quando quiser.",
}: PerfilInfoCardProps) {
  return (
    <div className="rounded-xl border border-brand-500/10 bg-brand-500/[0.035] p-3.5">
      <p className="text-[9px] font-semibold text-brand-300">{title}</p>

      <p className="mt-1 text-[8px] leading-4 text-slate-600">{description}</p>
    </div>
  );
}
