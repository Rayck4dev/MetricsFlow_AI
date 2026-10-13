"use client";

import { useRef, useState } from "react";
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
  const progress = Math.min(1, current / audio.duration);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (playing) return el.pause();
    if (activeAudio && activeAudio !== el) activeAudio.pause();
    activeAudio = el;
    el.playbackRate = speed;
    void el.play();
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime =
      Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audio.duration;
    setCurrent(el.currentTime);
  }

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (ref.current) ref.current.playbackRate = next;
  }

  return (
    <div className="flex w-[min(300px,62vw)] items-center gap-2.5 pb-3 pt-0.5">
      <audio
        ref={ref}
        src={audio.url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar" : "Reproduzir"}
        className="h-8 w-8 shrink-0 text-[#c3cdd0]"
      >
        {playing ? (
          <Pause size={28} fill="currentColor" />
        ) : (
          <Play size={28} fill="currentColor" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div
          onClick={seek}
          className="relative flex h-7 cursor-pointer items-center gap-[2px]"
        >
          {audio.wave.map((h, i) => (
            <span
              key={i}
              className={`w-[3px] shrink-0 rounded-full ${i / audio.wave.length < progress ? "bg-[#d9dedf]" : "bg-white/35"}`}
              style={{ height: 4 + h * 20 }}
            />
          ))}
          <span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#53bdeb]"
            style={{ left: `calc(${progress * 100}% - 4px)` }}
          />
        </div>
        <div className="-mt-0.5 text-[11px] text-white/60">
          {formatDuration(playing || current ? current : audio.duration)}
        </div>
      </div>
      {playing ? (
        <button
          onClick={cycleSpeed}
          className="h-[34px] w-[44px] shrink-0 rounded-full bg-white/15 text-[13px] font-medium"
        >
          {speed}×
        </button>
      ) : (
        <div className="relative h-[44px] w-[44px] shrink-0 rounded-full bg-gradient-to-br from-[#6b4e44] to-[#2c2f2f]">
          <span className="absolute -bottom-0.5 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-[#144d37] text-[#53bdeb]">
            <Mic size={12} fill="currentColor" />
          </span>
        </div>
      )}
    </div>
  );
}
