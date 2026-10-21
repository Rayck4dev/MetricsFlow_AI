import type { FormEvent } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
  confirmWhatsAppTransaction,
  processWhatsAppDemo,
} from "@/lib/whatsapp/whatsapp-api";
import type { DemoResponse } from "@/types/whatsapp";

import type { ChatMessage } from "./demo-types";

interface UseWhatsAppDemoActionsOptions {
  text: string;
  loading: boolean;
  confirming: boolean;
  result: DemoResponse | null;
  canConfirm: boolean;
  setText: Dispatch<SetStateAction<string>>;
  setResult: Dispatch<SetStateAction<DemoResponse | null>>;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setConfirming: Dispatch<SetStateAction<boolean>>;
  setSuccess: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

function getLocalTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Porto_Velho",
  });
}

export function useWhatsAppDemoActions({
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
}: UseWhatsAppDemoActionsOptions) {
  async function submitMessage(
    event?: FormEvent,
    overrideText?: string,
  ): Promise<void> {
    event?.preventDefault();
    const cleanText = (overrideText ?? text).trim();
    if (loading || !cleanText) return;

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
    if (overrideText === undefined) setText("");

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
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          mine: false,
          text: responseText,
          time: getLocalTime(),
          status: "read",
        },
      ]);
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
    if (!result || !canConfirm || confirming) return;
    setConfirming(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await confirmWhatsAppTransaction({
        parsed: result.parsed,
        rawText: result.originalText,
      });
      const successText =
        response?.message ||
        "✅ Movimentação registrada com sucesso na MetricsFlow AI!";
      setSuccess(successText);
      setMessages((prev) => [
        ...prev,
        {
          id: `success-${Date.now()}`,
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
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-user-action`,
        mine: true,
        text: replyText,
        time: getLocalTime(),
        status: "sent",
      },
    ]);
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
          text: "❌ Operação cancelada. Como posso ajudar?",
          time: getLocalTime(),
          status: "read",
        },
      ]);
      return;
    }
    void submitMessage(undefined, replyText);
  }

  return {
    submitMessage,
    confirmTransaction,
    reset,
    useExample,
    handleQuickReply,
  };
}
