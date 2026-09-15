"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import {
  confirmWhatsAppTransaction,
  processWhatsAppDemo,
} from "@/lib/whatsapp/whatsapp-api";

import type { DemoResponse } from "@/types/whatsapp";

interface ConfirmTransactionResponse {
  transactionId: string;
}

export function useWhatsAppDemo() {
  const [text, setText] = useState("Gastei 120 reais de gasolina hoje no Pix");

  const [result, setResult] = useState<DemoResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsed = result?.parsed ?? null;

  const canConfirm = Boolean(parsed && parsed.missingFields.length === 0);

  const confidence = parsed ? Math.round(parsed.confidence * 100) : 0;

  async function submitMessage(event?: FormEvent) {
    event?.preventDefault();

    if (loading) {
      return;
    }

    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const body = await processWhatsAppDemo(cleanText);

      setResult(body as DemoResponse);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Erro ao processar mensagem.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function confirmTransaction() {
    if (!result || !canConfirm || confirming) {
      return;
    }

    setConfirming(true);
    setError(null);
    setSuccess(null);

    try {
      const body = (await confirmWhatsAppTransaction({
        parsed: result.parsed,
        rawText: result.originalText,
      })) as ConfirmTransactionResponse;

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

  function reset() {
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function useExample(example: string) {
    setText(example);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  return {
    text,
    setText,

    result,
    parsed,

    loading,
    confirming,

    success,
    error,

    canConfirm,
    confidence,

    submitMessage,
    confirmTransaction,

    reset,
    useExample,
  };
}
