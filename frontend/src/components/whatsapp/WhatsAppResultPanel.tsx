"use client";

import type { ReactNode } from "react";

import {
  Bot,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";

import { getPaymentMethodLabel } from "@/constants/transaction.constants";
import type { DemoResponse } from "@/types/whatsapp";
import { formatDatePtBr, formatMoney } from "@/utils/whatsapp";

interface WhatsAppResultPanelProps {
  result: DemoResponse | null;
  canConfirm: boolean;
  confidence: number;
  confirming: boolean;
  success: string | null;
  onConfirm: () => void;
  onReset: () => void;
}

export function WhatsAppResultPanel({
  result,
  canConfirm,
  confidence,
  confirming,
  success,
  onConfirm,
  onReset,
}: WhatsAppResultPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-surface-border bg-[#061b2b]/95 shadow-[0_20px_70px_-30px_rgba(0,0,0,.65)]">
      <div className="shrink-0 border-b border-white/[0.05] px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Interpretação financeira
          </p>

          {result && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-medium text-slate-500">
                Confiança {confidence}%
              </span>

              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, confidence))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            {result ? "Movimentação identificada" : "Aguardando movimentação"}
          </p>
        </div>
      </div>

      {!result ? (
        <EmptyPanel />
      ) : (
        <FilledPanel
          result={result}
          canConfirm={canConfirm}
          confirming={confirming}
          success={success}
          onConfirm={onConfirm}
          onReset={onReset}
        />
      )}
    </section>
  );
}

function EmptyPanel() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-7 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-xl" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
          <Sparkles size={23} />
        </div>
      </div>

      <h2 className="mt-5 font-heading text-lg font-semibold text-white">
        Aguardando movimentação
      </h2>

      <p className="mt-2 max-w-xs text-[11px] leading-5 text-slate-600">
        A interpretação financeira aparecerá aqui depois que o MetricsFlow
        processar sua mensagem.
      </p>

      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-2">
        <MiniFeature icon={<Bot size={13} />} label="Interpreta" />

        <MiniFeature icon={<ShieldCheck size={13} />} label="Valida" />

        <MiniFeature icon={<CheckCircle2 size={13} />} label="Confirma" />
      </div>
    </div>
  );
}

function FilledPanel({
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
            {formatMoney(parsed.amount)}
          </p>

          <p className="mt-1 break-words text-[11px] text-slate-400">
            {parsed.description || "Descrição não informada"}
          </p>
        </div>

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

function MiniFeature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.015] px-2 py-2.5">
      <span className="text-emerald-400">{icon}</span>

      <span className="text-[8px] font-semibold text-slate-600">{label}</span>
    </div>
  );
}

function DataCard({
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
