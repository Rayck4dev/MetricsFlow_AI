import { Check, CheckCheck } from "lucide-react";
import type { DemoMessage } from "@/types/whatsapp-demo";
import { AudioMessage } from "./AudioMessage";

type Props = {
  message: DemoMessage;
  first: boolean;
  onQuickReply?: (text: string) => void;
};

export function MessageBubble({ message: m, first, onQuickReply }: Props) {
  const tail = first
    ? m.mine
      ? "rounded-tr-none before:absolute before:top-0 before:-right-2 before:h-3 before:w-2 before:bg-inherit before:content-[''] before:[clip-path:polygon(0_0,100%_0,0_100%)]"
      : "rounded-tl-none before:absolute before:top-0 before:-left-2 before:h-3 before:w-2 before:bg-inherit before:content-[''] before:[clip-path:polygon(100%_0,0_0,100%_100%)]"
    : "";

  const meta = (
    <span
      className={`flex items-center gap-1 text-[11px] ${m.mine ? "text-white/60" : "text-[#8f9a9d]"}`}
    >
      {m.time}
      {m.mine &&
        (m.status === "sent" ? (
          <Check size={16} />
        ) : (
          <CheckCheck
            size={16}
            className={m.status === "read" ? "text-[#53bdeb]" : ""}
          />
        ))}
    </span>
  );

  return (
    <div
      className={`relative max-w-[82%] rounded-lg px-2 py-1.5 pl-2.5 text-[14.2px] leading-[19px] shadow-[0_1px_1px_rgba(0,0,0,.45)] md:max-w-[min(65%,560px)] ${
        m.mine ? "self-end bg-[#144d37]" : "self-start bg-[#1f2323]"
      } ${first ? "mt-2.5" : "mt-0.5"} ${tail}`}
    >
      {m.audio ? (
        <>
          <AudioMessage audio={m.audio} />
          <div className="absolute bottom-1 right-2">{meta}</div>
        </>
      ) : (
        <>
          {m.messageType === "audio" && (
            <span className="mb-1 block text-[11px] text-white/60">
              Áudio · transcrito pela IA
            </span>
          )}
          <span className="whitespace-pre-wrap break-words">{m.text}</span>
          <span className="float-right -mb-0.5 ml-3 mt-1.5">{meta}</span>
          {m.buttons && (
            <div
              className="-mx-2 mt-2 flex flex-col border-t border-white/[0.08]"
              style={{ clear: "both" }}
            >
              {m.buttons.map((b) => (
                <button
                  key={b}
                  onClick={() => onQuickReply?.(b)}
                  className="py-2.5 text-center font-medium text-[#53bdeb] transition-colors hover:bg-white/[0.04]"
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
