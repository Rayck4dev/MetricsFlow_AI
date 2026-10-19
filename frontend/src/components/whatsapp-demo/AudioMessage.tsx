"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play } from "lucide-react";
import type { DemoAudio } from "@/types/whatsapp-demo";
import { formatDuration } from "@/lib/whatsapp-demo/audio";

const SPEEDS = [1, 1.5, 2];
let activeAudio: HTMLAudioElement | null = null;

export function AudioMessage({ audio }: { audio: DemoAudio }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [speed, setSpeed] = useState(1);

  const duration = audio.duration || 0;
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleEnded = () => {
      setPlaying(false);
      setCurrent(0);
    };

    const handlePause = () => setPlaying(false);
    const handlePlay = () => setPlaying(true);

    element.addEventListener("ended", handleEnded);
    element.addEventListener("pause", handlePause);
    element.addEventListener("play", handlePlay);

    return () => {
      element.removeEventListener("ended", handleEnded);
      element.removeEventListener("pause", handlePause);
      element.removeEventListener("play", handlePlay);

      if (activeAudio === element) {
        activeAudio = null;
      }
    };
  }, []);

  async function toggle() {
    const element = ref.current;
    if (!element || !audio.url) return;

    if (!element.paused) {
      element.pause();
      return;
    }

    if (activeAudio && activeAudio !== element) {
      activeAudio.pause();
    }

    activeAudio = element;
    element.playbackRate = speed;

    try {
      await element.play();
    } catch (error) {
      console.error("Não foi possível reproduzir o áudio:", error);
    }
  }

  function seek(event: React.MouseEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element || !duration) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );

    element.currentTime = ratio * duration;
    setCurrent(element.currentTime);
  }

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);

    if (ref.current) {
      ref.current.playbackRate = next;
    }
  }

  return (
    <div className="flex w-[min(320px,72vw)] min-w-0 items-center gap-2.5 py-1">
      {audio.url && (
        <audio
          ref={ref}
          src={audio.url}
          preload="metadata"
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) {
              setCurrent(0);
            }
          }}
        />
      )}

      <button
        type="button"
        onClick={toggle}
        disabled={!audio.url}
        aria-label={playing ? "Pausar áudio" : "Reproduzir áudio"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#d7dfe1] transition hover:bg-white/10 disabled:opacity-40"
      >
        {playing ? (
          <Pause size={25} fill="currentColor" />
        ) : (
          <Play size={25} fill="currentColor" className="translate-x-0.5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div
          role="slider"
          aria-label="Progresso do áudio"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          tabIndex={0}
          onClick={seek}
          onKeyDown={(event) => {
            const element = ref.current;
            if (!element) return;

            if (event.key === "ArrowRight") {
              element.currentTime = Math.min(duration, element.currentTime + 5);
              setCurrent(element.currentTime);
            }

            if (event.key === "ArrowLeft") {
              element.currentTime = Math.max(0, element.currentTime - 5);
              setCurrent(element.currentTime);
            }
          }}
          className="flex h-8 min-w-0 cursor-pointer items-center gap-[2px] rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#53bdeb]"
        >
          {audio.wave.map((height, index) => {
            const played = index / Math.max(audio.wave.length, 1) < progress;

            return (
              <span
                key={index}
                className={`min-w-[2px] flex-1 rounded-full ${
                  played ? "bg-[#53bdeb]" : "bg-white/40"
                }`}
                style={{
                  height: `${Math.max(4, Math.min(23, 4 + height * 19))}px`,
                }}
              />
            );
          })}
        </div>

        <div className="mt-0.5 flex items-center justify-between text-[11px] leading-4 text-white/65">
          <span>
            {formatDuration(playing || current > 0 ? current : duration)}
          </span>

          {playing && (
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label="Alterar velocidade de reprodução"
              className="rounded px-1.5 py-0.5 font-medium text-[#d7dfe1] hover:bg-white/10"
            >
              {speed}×
            </button>
          )}
        </div>
      </div>

      <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-[#b7c2c5]">
        <Mic size={19} />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#144d37] bg-[#53bdeb]" />
      </div>
    </div>
  );
}
