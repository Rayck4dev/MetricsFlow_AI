"use client";

import { useState } from "react";

export function BotAvatar({
  size = 49,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {failed ? (
        <div
          className="grid h-full w-full place-items-center bg-gradient-to-br from-[#25d366] to-[#0a8f4a] font-extrabold text-[#06220f]"
          style={{ fontSize: size * 0.4 }}
        >
          MF
        </div>
      ) : (
        <img
          src="/robot.png"
          alt="MetricsFlow AI"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function FakeAvatar({
  hue = 200,
  size = 49,
}: {
  hue?: number;
  size?: number;
}) {
  return (
    <div
      className="shrink-0 rounded-full blur-[3px]"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, hsl(${hue} 40% 55%), hsl(${hue + 40} 30% 22%))`,
      }}
    />
  );
}
