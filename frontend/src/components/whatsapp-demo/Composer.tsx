"use client";

import {
  CircleDashed,
  Mic,
  Pause,
  Plus,
  Send,
  Smile,
  Trash2,
} from "lucide-react";
import {
  useAudioRecorder,
  type RecordedAudio,
} from "@/hooks/whatsapp/useAudioRecorder";
import { formatDuration } from "@/lib/whatsapp-demo/audio";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onSendAudio: (audio: RecordedAudio) => void;
  onError: (message: string) => void;
  disabled?: boolean;
};

const round =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#c8cfd1] transition-colors hover:bg-white/[0.07]";
const green =
  "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#21c063] text-[#0b1f13] hover:bg-[#3ad076]";

export function Composer({
  value,
  onChange,
  onSend,
  onSendAudio,
  onError,
  disabled = false,
}: Props) {
  const rec = useAudioRecorder();
  const recording = rec.state !== "idle";
  const hasText = value.trim().length > 0;

  async function startRecording() {
    if (disabled) return;
    try {
      await rec.start();
    } catch {
      rec.cancel();
      onError(
        "Não foi possível acessar o microfone. Verifique a permissão do navegador.",
      );
    }
  }

  async function sendRecording() {
    const audio = await rec.stop();
    if (audio) onSendAudio(audio);
  }

  return (
    <div className="z-10 flex w-full items-center gap-1.5 px-2 pb-2.5 pt-2 sm:px-3.5">
      {recording ? (
        <div className="flex h-[42px] min-w-0 flex-1 items-center justify-between gap-1.5 rounded-full bg-[#242626] pl-2.5 pr-1.5 sm:gap-3 sm:pl-4 sm:pr-2">
          <button
            onClick={rec.cancel}
            aria-label="Cancelar"
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#e9edef] ring-[#21c063] hover:ring-2 sm:h-10 sm:w-10"
          >
            <Trash2 size={19} className="sm:hidden" />
            <Trash2 size={21} className="hidden sm:block" />
            <span className="pointer-events-none absolute bottom-12 hidden whitespace-nowrap rounded-lg bg-[#e9edef] px-2.5 py-1.5 text-[13px] text-[#111] group-hover:block">
              Cancelar
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={`h-2 w-2 shrink-0 rounded-full bg-[#f15c6d] ${rec.state === "recording" ? "animate-pulse" : "opacity-50"}`}
            />
            <span className="text-sm tabular-nums sm:text-base">
              {formatDuration(rec.seconds)}
            </span>
          </div>

          <div className="flex h-7 min-w-0 flex-1 items-center justify-center gap-[2px] overflow-hidden px-1">
            {rec.levels.slice(-18).map((l, i) => (
              <span
                key={i}
                className="w-[2px] shrink-0 rounded-full bg-[#9aa4a7]"
                style={{ height: Math.max(3, l * 22) }}
              />
            ))}
          </div>

          <button
            onClick={rec.state === "recording" ? rec.pause : rec.resume}
            aria-label={
              rec.state === "recording" ? "Pausar gravação" : "Retomar gravação"
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#f15c6d] hover:bg-white/[0.07] sm:h-10 sm:w-10"
          >
            {rec.state === "recording" ? (
              <Pause size={19} fill="currentColor" />
            ) : (
              <Mic size={19} strokeWidth={2} />
            )}
          </button>

          <span
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#c8cfd1] sm:h-10 sm:w-10"
            title="Visualização única"
          >
            <CircleDashed size={22} strokeWidth={1.6} className="sm:hidden" />
            <CircleDashed
              size={26}
              strokeWidth={1.6}
              className="hidden sm:block"
            />
            <span className="absolute text-[9px] font-semibold sm:text-[10px]">
              1
            </span>
          </span>
        </div>
      ) : (
        <div className="flex min-h-[42px] min-w-0 flex-1 items-center gap-0.5 rounded-full bg-[#242626] px-1.5">
          <button className={round} aria-label="Emojis" disabled={disabled}>
            <Smile size={24} />
          </button>
          <button className={round} aria-label="Anexar" disabled={disabled}>
            <Plus size={24} />
          </button>
          <input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Digite uma mensagem"
            className="min-w-0 flex-1 bg-transparent px-1.5 py-2.5 text-[15px] text-[#e9edef] outline-none placeholder:text-[#8f9a9d]"
          />
        </div>
      )}

      {recording ? (
        <button
          onClick={sendRecording}
          aria-label="Enviar áudio"
          className={green}
        >
          <Send size={21} fill="currentColor" />
        </button>
      ) : hasText ? (
        <button onClick={onSend} aria-label="Enviar" className={green}>
          <Send size={21} fill="currentColor" />
        </button>
      ) : (
        <button
          onClick={startRecording}
          disabled={disabled}
          aria-label="Mensagem de voz"
          className={`${round} h-[42px] w-[42px] disabled:opacity-40`}
        >
          <Mic size={24} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
