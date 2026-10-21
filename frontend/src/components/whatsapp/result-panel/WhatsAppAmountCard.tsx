"use client";

import { CircleDollarSign } from "lucide-react";
import { formatMoney } from "@/utils/whatsapp";

interface WhatsAppAmountCardProps {
  isIncome: boolean;
  amount: number | null;
  description: string | null;
}

export function WhatsAppAmountCard({
  isIncome,
  amount,
  description,
}: WhatsAppAmountCardProps) {
  return (
    <div
      className={`rounded-[20px] border p-4 ${
        isIncome
          ? "border-emerald-400/10 bg-emerald-400/[0.045]"
          : "border-orange-400/10 bg-orange-400/[0.045]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isIncome
                ? "bg-emerald-400/10 text-emerald-300"
                : "bg-orange-400/10 text-orange-300"
            }`}
          >
            <CircleDollarSign size={17} />
          </div>

          <span
            className={`text-[11px] font-semibold ${
              isIncome ? "text-emerald-300" : "text-orange-300"
            }`}
          >
            {isIncome ? "Receita identificada" : "Despesa identificada"}
          </span>
        </div>

        <span className="rounded-lg border border-white/[0.04] bg-black/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-slate-500">
          {isIncome ? "Entrada" : "Saída"}
        </span>
      </div>

      <p className="mt-3 font-heading text-[28px] font-bold tracking-tight text-white">
        {formatMoney(amount)}
      </p>

      <p className="mt-1 break-words text-[11px] text-slate-400">
        {description || "Descrição não informada"}
      </p>
    </div>
  );
}
