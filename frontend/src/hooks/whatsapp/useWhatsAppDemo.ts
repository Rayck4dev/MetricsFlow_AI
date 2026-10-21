"use client";

import { useState } from "react";

import type { DemoResponse } from "@/types/whatsapp";
import type { ChatMessage } from "./demo-types";
import { useWhatsAppDemoActions } from "./useWhatsAppDemoActions";

export type { ChatMessage, ConfirmTransactionResponse } from "./demo-types";

export function useWhatsAppDemo() {
  const [text, setText] = useState("Gastei 120 reais de gasolina hoje no Pix");
  const [result, setResult] = useState<DemoResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      mine: false,
      text: "Olá! Sou a Metrics, a assistente financeira da MetricsFlow AI. Posso ajudar a registrar receitas e despesas do seu negócio. Vamos registrar sua próxima movimentação?",
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Porto_Velho",
      }),
      status: "read",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsed = result?.parsed ?? null;
  const canConfirm = Boolean(parsed && parsed.missingFields.length === 0);
  const confidence = parsed ? Math.round(parsed.confidence * 100) : 0;

  const actions = useWhatsAppDemoActions({
    text,
    loading,
    confirming,
    result,
    canConfirm,
    setText,
    setResult,
    setMessages,
    setLoading,
    setConfirming,
    setSuccess,
    setError,
  });

  return {
    text,
    setText,
    result,
    parsed,
    messages,
    loading,
    confirming,
    success,
    error,
    canConfirm,
    confidence,
    submitMessage: actions.submitMessage,
    confirmTransaction: actions.confirmTransaction,
    reset: actions.reset,
    useExample: actions.useExample,
    handleQuickReply: actions.handleQuickReply,
  };
}
