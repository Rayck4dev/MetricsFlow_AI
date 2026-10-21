"use client";

import type { ReactNode } from "react";
import {
  Bot,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  CalendarDays,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { getPaymentMethodLabel } from "@/constants/transaction.constants";
import { WhatsAppAmountCard } from "./WhatsAppAmountCard";
import type { DemoResponse } from "@/types/whatsapp";
import { formatDatePtBr } from "@/utils/whatsapp";

export function FilledPanel({
  result,
  canConfirm,
  confirming,
  success,
  onConfirm,
  onReset,
}: {
  result: DemoResponse;
  canConfirm: boolean;
  confirming: boolean;
  success: string | null;
  onConfirm: () => void;
  onReset: () => void;
}) {
  const parsed = result.parsed;
  const isIncome = parsed.type === "income";

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div className="space-y-3.5">
        <WhatsAppAmountCard
          isIncome={isIncome}
          amount={parsed.amount}
          description={parsed.description}
        />

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-600">
              Dados identificados
            </p>

            <span className="text-[8px] text-slate-700">4 campos</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <DataCard
              icon={<CircleDollarSign size={13} />}
              label="Categoria"
              value={parsed.categoryName ?? "Não identificada"}
            />

            <DataCard
              icon={<CreditCard size={13} />}
              label="Pagamento"
              value={
                parsed.paymentMethod
                  ? getPaymentMethodLabel(parsed.paymentMethod)
                  : "Não informado"
              }
            />

            <DataCard
              icon={<CalendarDays size={13} />}
              label="Data"
              value={formatDatePtBr(parsed.transactionDate)}
            />

            <DataCard
              icon={<Bot size={13} />}
              label="Tipo"
              value={
                parsed.type === "income"
                  ? "Receita"
                  : parsed.type === "expense"
                    ? "Despesa"
                    : "Não identificado"
              }
            />
          </div>
        </div>

        <div
          className={`rounded-[18px] border p-3.5 ${
            canConfirm
              ? "border-emerald-400/10 bg-emerald-400/[0.04]"
              : "border-amber-400/10 bg-amber-400/[0.04]"
          }`}
        >
          <div className="flex gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                canConfirm
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-amber-400/10 text-amber-300"
              }`}
            >
              {canConfirm ? (
                <CheckCircle2 size={15} />
              ) : (
                <TriangleAlert size={15} />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white">
                {canConfirm
                  ? "Tudo pronto para confirmar"
                  : "Precisamos de mais informações"}
              </p>

              {canConfirm ? (
                <p className="mt-1 text-[9px] leading-4 text-slate-600">
                  Tudo certo! Você pode confirmar o lançamento.
                </p>
              ) : (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {parsed.missingFields.map((field) => (
                    <span
                      key={field}
                      className="rounded-md bg-amber-400/10 px-1.5 py-1 text-[8px] font-semibold text-amber-300"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm || confirming || Boolean(success)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 px-4 py-3.5 text-[11px] font-bold text-[#031118] shadow-[0_12px_35px_-15px_rgba(52,211,153,.7)] transition hover:from-emerald-300 hover:to-emerald-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <CheckCircle2 size={14} />

          {confirming ? "Registrando..." : "Confirmar lançamento"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-transparent px-4 py-3 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.025] hover:text-white"
        >
          <X size={13} />
          Corrigir informações
        </button>

        <div className="flex items-start gap-2 border-t border-white/[0.04] pt-3">
          <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-400" />

          <p className="text-[9px] leading-4 text-slate-700">
            A IA interpreta. A validação e o registro continuam sob
            responsabilidade do servidor.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DataCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#071f31]/60 p-3">
      <div className="flex items-center gap-1.5 text-slate-600">
        <span className="text-emerald-400/80">{icon}</span>

        <p className="text-[7px] font-bold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <p className="mt-1.5 break-words text-[10px] font-semibold text-slate-300">
        {value}
      </p>
    </div>
  );
}
