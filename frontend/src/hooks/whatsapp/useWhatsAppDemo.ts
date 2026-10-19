"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import {
  confirmWhatsAppTransaction,
  processWhatsAppDemo,
} from "@/lib/whatsapp/whatsapp-api";

import type { DemoResponse } from "@/types/whatsapp";

export interface ChatMessage {
  id: string | number;
  mine: boolean;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  buttons?: string[];
}

interface ConfirmTransactionResponse {
  transactionId: string;
}

export function useWhatsAppDemo() {
  const [text, setText] = useState("Gastei 120 reais de gasolina hoje no Pix");
  const [result, setResult] = useState<DemoResponse | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      mine: false,
      text: "Olá! 👋 Sou a Metrics, a assistente financeira da MetricsFlow AI. Posso ajudar a registrar receitas e despesas do seu negócio. Vamos registrar sua próxima movimentação?",
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

  function getLocalTime(): string {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Porto_Velho",
    });
  }

  async function submitMessage(
    event?: FormEvent,
    overrideText?: string,
  ): Promise<void> {
    event?.preventDefault();

    const cleanText = (overrideText ?? text).trim();

    if (loading || !cleanText) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      mine: true,
      text: cleanText,
      time: getLocalTime(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);

    if (overrideText === undefined) {
      setText("");
    }

    try {
      const body = (await processWhatsAppDemo(cleanText)) as DemoResponse;

      setResult(body);

      const responseText =
        body.message ||
        body.confirmation ||
        (body.parsed?.missingFields?.length
          ? `Entendi! Para continuar, preciso de mais algumas informações: ${body.parsed.missingFields.join(", ")}.`
          : body.ok
            ? "Movimentação identificada. Confira os dados antes de confirmar."
            : "Não consegui processar a movimentação. Tente descrever o valor e o motivo.");

      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        mine: false,
        text: responseText,
        time: getLocalTime(),
        status: "read",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (cause) {
      const errorMessage =
        cause instanceof Error ? cause.message : "Erro ao processar mensagem.";

      setError(errorMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          mine: false,
          text: `Não foi possível processar a mensagem: ${errorMessage}`,
          time: getLocalTime(),
          status: "read",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function confirmTransaction(): Promise<void> {
    if (!result || !canConfirm || confirming) {
      return;
    }

    setConfirming(true);
    setError(null);
    setSuccess(null);

    try {
      await confirmWhatsAppTransaction({
        parsed: result.parsed,
        rawText: result.originalText,
      });

      const successText =
        "Movimentação registrada com sucesso na MetricsFlow AI! ✅";

      setSuccess(successText);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-success`,
          mine: false,
          text: successText,
          time: getLocalTime(),
          status: "read",
        },
      ]);

      setResult(null);
    } catch (cause) {
      const errorMessage =
        cause instanceof Error
          ? cause.message
          : "Erro ao registrar movimentação.";

      setError(errorMessage);
    } finally {
      setConfirming(false);
    }
  }

  function reset(): void {
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function useExample(example: string): void {
    setText(example);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function handleQuickReply(replyText: string): void {
    const userActionMessage: ChatMessage = {
      id: `${Date.now()}-user-action`,
      mine: true,
      text: replyText,
      time: getLocalTime(),
      status: "sent",
    };
    setMessages((prev) => [...prev, userActionMessage]);

    if (replyText === "Confirmar") {
      void confirmTransaction();
      return;
    }

    if (replyText === "Cancelar") {
      reset();

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-cancel`,
          mine: false,
          text: "Operação cancelada. Como posso ajudar?",
          time: getLocalTime(),
          status: "read",
        },
      ]);

      return;
    }

    void submitMessage(undefined, replyText);
  }

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
    submitMessage,
    confirmTransaction,
    reset,
    useExample,
    handleQuickReply,
  };
}
