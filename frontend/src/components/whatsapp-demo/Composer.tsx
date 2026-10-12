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
    <div className="z-10 flex items-center gap-1.5 px-3.5 pb-2.5 pt-2">
      {recording ? (
        <div className="flex h-[42px] flex-1 items-center justify-end gap-3 rounded-full bg-[#242626] pl-4 pr-2">
          <button
            onClick={rec.cancel}
            aria-label="Cancelar"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-[#e9edef] ring-[#21c063] hover:ring-2"
          >
            <Trash2 size={21} />
            <span className="pointer-events-none absolute bottom-12 hidden whitespace-nowrap rounded-lg bg-[#e9edef] px-2.5 py-1.5 text-[13px] text-[#111] group-hover:block">
              Cancelar
            </span>
          </button>
          <span
            className={`h-2.5 w-2.5 rounded-full bg-[#f15c6d] ${rec.state === "recording" ? "animate-pulse" : "opacity-50"}`}
          />
          <span className="min-w-[44px] text-base tabular-nums">
            {formatDuration(rec.seconds)}
          </span>
          <div className="ml-6 flex h-7 w-28 items-center justify-end gap-[2px] overflow-hidden">
            {rec.levels.map((l, i) => (
              <span
                key={i}
                className="w-[2px] shrink-0 rounded-full bg-[#9aa4a7]"
                style={{ height: 3 + l * 22 }}
              />
            ))}
          </div>
          <button
            onClick={rec.state === "recording" ? rec.pause : rec.resume}
            aria-label={
              rec.state === "recording" ? "Pausar gravação" : "Retomar gravação"
            }
            className={`${round} text-[#f15c6d]`}
          >
            {rec.state === "recording" ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Mic size={20} strokeWidth={2} />
            )}
          </button>
          <span className={`relative ${round}`} title="Visualização única">
            <CircleDashed size={26} strokeWidth={1.6} />
            <span className="absolute text-[10px] font-semibold">1</span>
          </span>
        </div>
      ) : (
        <div className="flex min-h-[42px] flex-1 items-center gap-0.5 rounded-full bg-[#242626] px-1.5">
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
