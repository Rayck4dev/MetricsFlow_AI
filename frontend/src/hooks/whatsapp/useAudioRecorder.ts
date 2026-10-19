"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resampleWave } from "@/lib/whatsapp-demo/audio";

export type RecorderState = "idle" | "recording" | "paused";
export type RecordedAudio = {
  blob: Blob;
  duration: number;
  wave: number[];
  url: string;
};

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const peaks = useRef<number[]>([]);
  const audioCtx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const accumulated = useRef(0);
  const startedAt = useRef(0);
  const live = useRef(false);

  const elapsed = () =>
    accumulated.current +
    (live.current ? (Date.now() - startedAt.current) / 1000 : 0);

  const release = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    interval.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    audioCtx.current?.close().catch(() => {});
    stream.current = null;
    audioCtx.current = null;
    analyser.current = null;
    recorder.current = null;
    chunks.current = [];
    peaks.current = [];
    accumulated.current = 0;
    live.current = false;
    setState("idle");
    setSeconds(0);
    setLevels([]);
  }, []);

  useEffect(() => release, [release]);

  const tick = () => {
    if (!live.current) return;
    setSeconds(elapsed());
    const node = analyser.current;
    if (!node) return;
    const buf = new Uint8Array(node.fftSize);
    node.getByteTimeDomainData(buf);
    let peak = 0;
    for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128);
    const level = Math.min(1, peak * 2);
    peaks.current.push(level);
    setLevels((prev) => [...prev.slice(-27), level]);
  };

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia)
      throw new Error("Microfone indisponível");
    const media = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.current = media;
    const mimeType = MIME_CANDIDATES.find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    const rec = new MediaRecorder(media, mimeType ? { mimeType } : undefined);
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.current.push(e.data);
    };
    rec.start();
    recorder.current = rec;

    const ctx = new AudioContext();
    const node = ctx.createAnalyser();
    node.fftSize = 256;
    ctx.createMediaStreamSource(media).connect(node);
    audioCtx.current = ctx;
    analyser.current = node;

    accumulated.current = 0;
    startedAt.current = Date.now();
    live.current = true;
    setState("recording");
    interval.current = setInterval(tick, 100);
  }, []);

  const pause = useCallback(() => {
    if (recorder.current?.state !== "recording") return;
    recorder.current.pause();
    accumulated.current = elapsed();
    live.current = false;
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    if (recorder.current?.state !== "paused") return;
    recorder.current.resume();
    startedAt.current = Date.now();
    live.current = true;
    setState("recording");
  }, []);

  const stop = useCallback(async (): Promise<RecordedAudio | null> => {
    const rec = recorder.current;
    if (!rec) return null;
    const duration = Math.max(1, Math.round(elapsed()));
    const wave = resampleWave(peaks.current);
    const done = new Promise<void>((resolve) => {
      rec.onstop = () => resolve();
    });
    if (rec.state !== "inactive") rec.stop();
    await done;
    const blob = new Blob(chunks.current, {
      type: rec.mimeType || "audio/webm",
    });
    const url = URL.createObjectURL(blob);
    release();
    return { blob, duration, wave, url };
  }, [release]);

  const cancel = useCallback(() => {
    const rec = recorder.current;
    if (rec) {
      rec.onstop = null;
      if (rec.state !== "inactive") rec.stop();
    }
    release();
  }, [release]);

  return { state, seconds, levels, start, pause, resume, stop, cancel };
}
