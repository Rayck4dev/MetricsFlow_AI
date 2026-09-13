"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import {
  AudioLines,
  Bot,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileAudio,
  MessageSquareText,
  Mic,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  User,
  X,
} from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { getPaymentMethodLabel } from "@/constants/transaction.constants";
import { useUser } from "@/contexts/UserContext";
import type { ParsedFinancialMessage } from "@/types/message";

interface DemoResponse {
  ok: boolean;
  source: "text" | "audio";
  transcription: string | null;
  originalText: string;
  parsed: ParsedFinancialMessage;
  confirmation: string | null;
  mode: "openai" | "local-fallback";
}

function money(value: number | null) {
  if (value == null) return "Não informado";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function datePtBr(value: string | null) {
  if (!value) return "Não informada";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "Não informada";
  }

  return `${day}/${month}/${year}`;
}

const EXAMPLES = [
  {
    label: "Venda",
    text: "Recebi 850 reais de uma venda hoje por Pix",
  },
  {
    label: "Combustível",
    text: "Gastei 120 reais de gasolina hoje no Pix",
  },
  {
    label: "Internet",
    text: "Paguei 89 reais de internet hoje",
  },
];

export default function WhatsAppPage() {
  const { user, loading: userLoading } = useUser();

  const [text, setText] = useState("Gastei 120 reais de gasolina hoje no Pix");

  const [audio, setAudio] = useState<File | null>(null);
  const [result, setResult] = useState<DemoResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsed = result?.parsed ?? null;

  const canConfirm = Boolean(parsed && parsed.missingFields.length === 0);

  const confidence = useMemo(() => {
    if (!parsed) return 0;

    return Math.round(parsed.confidence * 100);
  }, [parsed]);

  const isIncome = parsed?.type === "income";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (loading || userLoading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      let response: Response;

      if (audio) {
        const form = new FormData();

        form.append("audio", audio);

        response = await fetch("/api/whatsapp/demo", {
          method: "POST",
          body: form,
        });
      } else {
        response = await fetch("/api/whatsapp/demo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
          }),
        });
      }

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Não foi possível processar a mensagem.");
      }

      setResult(body as DemoResponse);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Erro ao processar mensagem.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!result || !canConfirm || confirming) return;

    setConfirming(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/whatsapp/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parsed: result.parsed,
          rawText: result.originalText,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.error || "Não foi possível registrar a movimentação.",
        );
      }

      setSuccess(
        `Movimentação registrada com sucesso. ID: ${body.transactionId}`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Erro ao registrar movimentação.",
      );
    } finally {
      setConfirming(false);
    }
  }

  function handleAudioChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setAudio(file);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function removeAudio() {
    setAudio(null);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function reset() {
    setAudio(null);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function useExample(example: string) {
    setAudio(null);
    setText(example);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-surface-main text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar userName={user?.name} companyName={user?.companyName} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1480px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <header className="mb-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    WhatsApp + IA
                  </div>

                  <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Assistente financeiro
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Converse naturalmente sobre suas movimentações. O
                    MetricsFlow interpreta a mensagem, valida os dados e pede
                    sua confirmação antes de registrar.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge label="IA online" ready />

                  <StatusBadge label="Validação ativa" ready />

                  <StatusBadge label="Supabase" ready />
                </div>
              </div>
            </header>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
              <section className="overflow-hidden rounded-[28px] border border-surface-border bg-surface-panel shadow-2xl shadow-black/10">
                <div className="flex items-center justify-between border-b border-surface-border bg-surface-panel/90 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <MessageSquareText size={21} />

                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-panel bg-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        MetricsFlow
                      </p>

                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        <span className="text-xs text-slate-500">
                          Assistente financeiro
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={reset}
                    title="Nova conversa"
                    className="rounded-xl border border-surface-border p-2.5 text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                <div className="relative min-h-[500px] bg-gradient-to-b from-surface-main/80 to-surface-main/40 px-4 py-5 sm:px-6">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex min-h-[460px] flex-col">
                    <div className="mb-5 flex justify-center">
                      <span className="rounded-full border border-surface-border bg-surface-panel/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        Hoje
                      </span>
                    </div>

                    {!result ? (
                      <div className="flex flex-1 flex-col">
                        <div className="mb-4 flex items-end gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                            <Bot size={15} />
                          </div>

                          <div className="max-w-[82%] rounded-2xl rounded-bl-md border border-surface-border bg-surface-panel px-4 py-3 shadow-sm">
                            <p className="text-sm leading-6 text-slate-300">
                              Olá! 👋
                              <br />
                              Me envie uma venda ou despesa e eu organizo os
                              dados para você.
                            </p>

                            <p className="mt-2 text-[10px] text-slate-600">
                              MetricsFlow • agora
                            </p>
                          </div>
                        </div>

                        {!audio && text.trim() && (
                          <div className="mb-5 flex justify-end">
                            <div className="max-w-[82%] rounded-2xl rounded-br-md bg-emerald-500 px-4 py-3 text-slate-950 shadow-lg shadow-emerald-500/10">
                              <p className="text-sm font-medium leading-6">
                                {text}
                              </p>

                              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-950/60">
                                agora
                                <Check size={12} />
                              </div>
                            </div>
                          </div>
                        )}

                        {audio && (
                          <div className="mb-5 flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-emerald-500 px-4 py-3 text-slate-950">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
                                  <Mic size={17} />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[220px] truncate text-sm font-semibold">
                                    {audio.name}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-emerald-950/60">
                                    Mensagem de áudio
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-auto">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                            Experimente
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {EXAMPLES.map((example) => (
                              <button
                                key={example.label}
                                type="button"
                                onClick={() => useExample(example.text)}
                                className="rounded-xl border border-surface-border bg-surface-panel/80 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-emerald-500/20 hover:bg-emerald-500/[0.05] hover:text-emerald-300"
                              >
                                {example.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 flex-col">
                        <div className="mb-4 flex justify-end">
                          <div className="max-w-[82%] rounded-2xl rounded-br-md bg-emerald-500 px-4 py-3 text-slate-950 shadow-lg shadow-emerald-500/10">
                            <p className="text-sm font-medium leading-6">
                              {result.source === "audio"
                                ? "🎙 Mensagem de áudio enviada"
                                : result.originalText}
                            </p>

                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-950/60">
                              agora
                              <Check size={12} />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                            <Bot size={15} />
                          </div>

                          <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-surface-border bg-surface-panel px-4 py-4 shadow-sm">
                            <div className="mb-3 flex items-center gap-2">
                              <Sparkles
                                size={14}
                                className="text-emerald-400"
                              />

                              <span className="text-xs font-semibold text-emerald-300">
                                MetricsFlow
                              </span>
                            </div>

                            {result.transcription && (
                              <div className="mb-3 rounded-xl border border-violet-500/15 bg-violet-500/[0.06] p-3">
                                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-300">
                                  <AudioLines size={12} />
                                  Transcrição
                                </div>

                                <p className="text-xs leading-5 text-slate-400">
                                  {result.transcription}
                                </p>
                              </div>
                            )}

                            <p className="text-sm leading-6 text-slate-300">
                              {result.confirmation ||
                                "Identifiquei uma movimentação financeira. Confira os dados ao lado antes de registrar."}
                            </p>

                            <p className="mt-2 text-[10px] text-slate-600">
                              agora
                            </p>
                          </div>
                        </div>

                        {loading && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                            <RefreshCw size={13} className="animate-spin" />
                            Processando mensagem...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-surface-border bg-surface-panel px-4 py-4 sm:px-5">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex items-end gap-2">
                      <label
                        className={`flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-2xl border transition ${
                          audio
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-surface-border bg-surface-main/60 text-slate-500 hover:border-emerald-500/20 hover:text-emerald-400"
                        }`}
                        title="Enviar áudio"
                      >
                        <FileAudio size={19} />

                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioChange}
                          className="hidden"
                        />
                      </label>

                      <div className="relative flex-1">
                        <textarea
                          value={text}
                          onChange={(event) => {
                            setText(event.target.value);

                            if (audio) {
                              setAudio(null);
                            }
                          }}
                          disabled={Boolean(audio)}
                          rows={1}
                          placeholder="Digite uma movimentação..."
                          className="min-h-[50px] w-full resize-none rounded-2xl border border-surface-border bg-surface-main/70 px-4 py-[14px] pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        {audio && (
                          <button
                            type="button"
                            onClick={removeAudio}
                            title="Remover áudio"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={
                          loading || userLoading || (!audio && !text.trim())
                        }
                        title="Enviar mensagem"
                        className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {loading ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <p className="text-[10px] text-slate-600">
                        Texto ou áudio
                      </p>

                      <p className="flex items-center gap-1 text-[10px] text-slate-600">
                        <ShieldCheck size={11} />
                        Confirmação antes do registro
                      </p>
                    </div>
                  </form>

                  {error && (
                    <div className="mt-3 flex gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] p-3.5 text-sm text-rose-200">
                      <TriangleAlert size={17} className="mt-0.5 shrink-0" />

                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="mt-3 flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3.5 text-sm text-emerald-200">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

                      <span>{success}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-[28px] border border-surface-border bg-surface-panel shadow-2xl shadow-black/10">
                {!result ? (
                  <div className="flex min-h-[650px] flex-col">
                    <div className="border-b border-surface-border px-5 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            Painel financeiro
                          </p>

                          <h2 className="mt-1 font-heading text-lg font-semibold text-white">
                            Aguardando movimentação
                          </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <CircleDollarSign size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
                      <div className="relative mb-6">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-400">
                          <Sparkles size={30} />
                        </div>

                        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-surface-border bg-surface-panel text-slate-500">
                          <MessageSquareText size={13} />
                        </div>
                      </div>

                      <h3 className="font-heading text-base font-semibold text-white">
                        Sua próxima mensagem aparece aqui
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        Depois que a IA interpretar sua mensagem, os dados
                        financeiros serão apresentados para conferência antes do
                        registro.
                      </p>

                      <div className="mt-7 grid w-full max-w-md grid-cols-3 gap-2">
                        <MiniFeature
                          icon={<Bot size={15} />}
                          label="Interpreta"
                        />

                        <MiniFeature
                          icon={<ShieldCheck size={15} />}
                          label="Valida"
                        />

                        <MiniFeature
                          icon={<CheckCircle2 size={15} />}
                          label="Confirma"
                        />
                      </div>
                    </div>

                    <div className="border-t border-surface-border px-5 py-4">
                      <p className="text-center text-[10px] leading-5 text-slate-600">
                        A inteligência interpreta a mensagem.
                        <br />O servidor continua responsável pela validação e
                        gravação.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="border-b border-surface-border px-5 py-5 sm:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                isIncome
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-orange-500/10 text-orange-400"
                              }`}
                            >
                              <CircleDollarSign size={16} />
                            </span>

                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                              Interpretação financeira
                            </p>
                          </div>

                          <h2 className="mt-3 font-heading text-lg font-semibold text-white">
                            Movimentação identificada
                          </h2>
                        </div>

                        <div
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                            confidence >= 80
                              ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300"
                              : "border-amber-500/20 bg-amber-500/[0.07] text-amber-300"
                          }`}
                        >
                          {confidence}% confiança
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 px-5 py-5 sm:px-6">
                      <div
                        className={`relative overflow-hidden rounded-3xl border p-5 ${
                          isIncome
                            ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.10] to-transparent"
                            : "border-orange-500/20 bg-gradient-to-br from-orange-500/[0.09] to-transparent"
                        }`}
                      >
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl" />

                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold ${
                                isIncome
                                  ? "text-emerald-300"
                                  : "text-orange-300"
                              }`}
                            >
                              {isIncome
                                ? "Receita identificada"
                                : "Despesa identificada"}
                            </span>

                            <span
                              className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${
                                isIncome
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : "bg-orange-500/10 text-orange-300"
                              }`}
                            >
                              {isIncome ? "Entrada" : "Saída"}
                            </span>
                          </div>

                          <p className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {money(parsed?.amount ?? null)}
                          </p>

                          <p className="mt-2 max-w-[90%] truncate text-sm text-slate-400">
                            {parsed?.description || "Descrição não informada"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Dados identificados
                        </p>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <DataCard
                            label="Categoria"
                            value={parsed?.categoryName ?? "Não identificada"}
                          />

                          <DataCard
                            label="Pagamento"
                            value={
                              parsed?.paymentMethod
                                ? getPaymentMethodLabel(parsed.paymentMethod)
                                : "Não informado"
                            }
                          />

                          <DataCard
                            label="Data"
                            value={datePtBr(parsed?.transactionDate ?? null)}
                          />

                          <DataCard
                            label="Tipo"
                            value={
                              parsed?.type === "income"
                                ? "Receita"
                                : parsed?.type === "expense"
                                  ? "Despesa"
                                  : "Não identificado"
                            }
                          />
                        </div>
                      </div>

                      <div
                        className={`rounded-2xl border p-4 ${
                          canConfirm
                            ? "border-emerald-500/15 bg-emerald-500/[0.05]"
                            : "border-amber-500/15 bg-amber-500/[0.05]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              canConfirm
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {canConfirm ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <TriangleAlert size={16} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-white">
                                {canConfirm
                                  ? "Tudo pronto para confirmar"
                                  : "Precisamos de mais informações"}
                              </p>

                              <span
                                className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
                                  canConfirm
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-amber-500/10 text-amber-300"
                                }`}
                              >
                                {canConfirm ? "Validado" : "Pendente"}
                              </span>
                            </div>

                            {canConfirm ? (
                              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                Os campos obrigatórios foram identificados. A IA
                                não grava diretamente no banco.
                              </p>
                            ) : (
                              <div>
                                <p className="mt-1.5 text-xs text-slate-500">
                                  Ainda faltam:
                                </p>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {parsed?.missingFields.map((field) => (
                                    <span
                                      key={field}
                                      className="rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-300"
                                    >
                                      {field}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Próxima ação
                        </p>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={
                              !canConfirm || confirming || Boolean(success)
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {confirming ? (
                              <RefreshCw size={17} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={17} />
                            )}

                            {confirming
                              ? "Registrando..."
                              : "Confirmar lançamento"}
                          </button>

                          <button
                            type="button"
                            onClick={reset}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-surface-border bg-surface-main/30 px-4 py-3.5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                          >
                            <X size={16} />
                            Cancelar
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                          <ShieldCheck size={16} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-blue-200">
                            IA interpreta ≠ IA autoriza
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            A confirmação passa novamente pela validação do
                            servidor antes de criar a movimentação.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 border-t border-surface-border pt-4">
                        <Bot size={12} className="text-slate-600" />

                        <p className="text-[9px] uppercase tracking-[0.14em] text-slate-600">
                          Parser:{" "}
                          {result.mode === "openai"
                            ? "OpenAI Structured Output"
                            : "Fallback local de demonstração"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-panel/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />

                <p className="text-[11px] text-slate-500">
                  Nenhuma movimentação é registrada sem confirmação.
                </p>
              </div>

              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-700">
                MetricsFlow AI • V2
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-panel/70 px-3 py-2 text-xs font-medium text-slate-400">
      <span className="relative flex h-1.5 w-1.5">
        {ready && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
        )}

        <span
          className={`relative h-1.5 w-1.5 rounded-full ${
            ready ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
      </span>

      {label}
    </div>
  );
}

function MiniFeature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-surface-border bg-surface-panel/50 px-3 py-3">
      <span className="text-emerald-400">{icon}</span>

      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
    </div>
  );
}

function DataCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-2xl border border-surface-border bg-surface-main/40 p-4 transition hover:border-surface-border/80 hover:bg-surface-main/60">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}
