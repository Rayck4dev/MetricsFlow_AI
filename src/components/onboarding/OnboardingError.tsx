"use client";

interface OnboardingErrorProps {
  message: string;
}

export default function OnboardingError({ message }: OnboardingErrorProps) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
      <p className="text-xs leading-relaxed text-red-300">{message}</p>
    </div>
  );
}
