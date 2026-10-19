import { Check, CheckCheck } from "lucide-react";
import type { DemoMessage } from "@/types/whatsapp-demo";
import { AudioMessage } from "./AudioMessage";

type Props = {
  message: DemoMessage;
  first: boolean;
  onQuickReply?: (text: string) => void;
};

function renderFormattedText(text: string) {
  if (!text) return null;

  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);

  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(1, -1)}
        </strong>
      );
    }

    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return (
        <em key={index} className="text-white/80 italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return part;
  });
}

export function MessageBubble({ message: m, first, onQuickReply }: Props) {
  const tail = first
    ? m.mine
      ? "rounded-tr-none before:absolute before:top-0 before:-right-2 before:h-3 before:w-2 before:bg-inherit before:content-[''] before:[clip-path:polygon(0_0,100%_0,0_100%)]"
      : "rounded-tl-none before:absolute before:top-0 before:-left-2 before:h-3 before:w-2 before:bg-inherit before:content-[''] before:[clip-path:polygon(100%_0,0_0,100%_100%)]"
    : "";

  const meta = (
    <span
      className={`flex items-center gap-1 text-[11px] ${
        m.mine ? "text-white/60" : "text-[#8f9a9d]"
      }`}
    >
      {m.time}

      {m.mine &&
        (m.status === "read" ? (
          <CheckCheck size={16} className="text-[#53bdeb]" />
        ) : m.status === "sent" || m.status === "delivered" ? (
          <CheckCheck size={16} className="text-white/60" />
        ) : (
          <Check size={16} className="text-white/60" />
        ))}
    </span>
  );

  const isAudioMessage = m.messageType === "audio" || !!m.audio;

  const isConfirmationCard =
    !m.mine &&
    typeof m.text === "string" &&
    m.text.includes("Identificada:") &&
    m.text.includes("Tudo certo?");

  return (
    <div
      className={`flex w-full flex-col gap-1.5 ${
        m.mine ? "self-end items-end" : "self-start items-start"
      } max-w-[88%] md:max-w-[min(65%,560px)]`}
    >
      <div
        className={`relative max-w-full rounded-lg px-3 py-2 text-[14.2px] leading-[20px] shadow-[0_1px_1px_rgba(0,0,0,.45)] animate-message-in ${
          m.mine ? "bg-[#144d37]" : "bg-[#1f2323]"
        } ${first ? "mt-2.5" : "mt-0.5"} ${tail}`}
      >
        {isAudioMessage && m.audio?.url ? (
          <div className="flex min-w-0 flex-col gap-2">
            <AudioMessage audio={m.audio} />

            {m.text && m.text !== "Mensagem de voz" && (
              <div className="mt-0.5 border-t border-white/10 pt-2">
                <span className="mb-1 block text-[11px] font-medium text-[#53bdeb]">
                  Transcrição por IA:
                </span>

                <p className="whitespace-pre-wrap break-words text-[13.5px] leading-[19px] text-[#e9edef]">
                  {renderFormattedText(m.text)}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-0.5">{meta}</div>
          </div>
        ) : isAudioMessage ? (
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="block text-[11px] text-white/60">
              Áudio · transcrito pela IA
            </span>

            <p className="whitespace-pre-wrap break-words text-[#e9edef]">
              {renderFormattedText(m.text ?? "")}
            </p>

            <div className="flex justify-end">{meta}</div>
          </div>
        ) : (
          <>
            <span className="whitespace-pre-wrap break-words text-[#e9edef]">
              {renderFormattedText(m.text ?? "")}
            </span>

            <div className="mt-1 flex justify-end">{meta}</div>

            {m.buttons && (
              <div
                className="-mx-3 mt-2 flex flex-col border-t border-white/[0.08]"
                style={{ clear: "both" }}
              >
                {m.buttons.map((button) => (
                  <button
                    key={button}
                    type="button"
                    onClick={() => onQuickReply?.(button)}
                    className="py-2.5 text-center font-medium text-[#53bdeb] transition-colors hover:bg-white/[0.04]"
                  >
                    {button}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!m.mine && isConfirmationCard && (
        <div className="mt-0.5 flex w-full items-center gap-2 animate-message-in">
          <button
            type="button"
            onClick={() => onQuickReply?.("Confirmar")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#21c063] px-3 py-2 text-xs font-semibold text-[#0b1f13] shadow transition-transform hover:bg-[#3ad076] active:scale-95"
          >
            ✅ Confirmar
          </button>

          <button
            type="button"
            onClick={() => onQuickReply?.("Cancelar")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#262b2c] px-3 py-2 text-xs font-semibold text-[#f15c6d] shadow transition-transform hover:bg-white/10 active:scale-95"
          >
            ❌ Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
