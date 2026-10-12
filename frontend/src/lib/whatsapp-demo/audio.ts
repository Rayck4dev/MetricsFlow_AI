export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Reduz os picos capturados na gravação para `bars` barras normalizadas (0.12 a 1). */
export function resampleWave(levels: number[], bars = 34): number[] {
  if (!levels.length) return Array.from({ length: bars }, () => 0.2);
  const max = Math.max(...levels, 0.01);
  return Array.from({ length: bars }, (_, i) => {
    const a = Math.floor((i * levels.length) / bars);
    const b = Math.max(a + 1, Math.floor(((i + 1) * levels.length) / bars));
    const slice = levels.slice(a, b);
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
    return Math.max(0.12, Math.min(1, avg / max));
  });
}
