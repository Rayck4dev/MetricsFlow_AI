import type { ReactNode } from "react";

interface PrivacySectionProps {
  number: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export function PrivacySection({
  number,
  title,
  icon,
  children,
}: PrivacySectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-400">
          {icon}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-brand-400">
            {number}.
          </span>

          <h2 className="font-heading text-base font-bold text-white md:text-lg">
            {title}
          </h2>
        </div>
      </div>

      <div className="space-y-3 pl-11 text-sm leading-relaxed text-slate-400 [&_li]:ml-4 [&_li]:list-disc">
        {children}
      </div>
    </section>
  );
}

export function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-1 text-xs font-bold uppercase tracking-wide text-slate-300">
      {children}
    </h3>
  );
}
