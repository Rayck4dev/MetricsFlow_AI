import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export function WhatsAppDemoCallout() {
  return (
<section className="relative mt-8 overflow-hidden rounded-[26px] border border-emerald-400/15 bg-[#061b2b]/90 sm:mt-10">
              <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-emerald-400/[0.07] blur-[90px]" />

              <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-9">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                    <Sparkles size={22} />
                  </div>

                  <div className="max-w-xl">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                      Experimente
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                      Veja o fluxo funcionando.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Envie uma mensagem de exemplo, confira os dados
                      interpretados e explore a experiência demonstrativa.
                    </p>
                  </div>
                </div>

                <Link
                  href="/whatsapp/demo"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#031321] shadow-[0_10px_35px_-15px_rgba(52,211,153,.55)] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061b2b]"
                >
                  Abrir demonstração
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-6 py-3.5 sm:px-8 lg:px-10">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Usa a conta autenticada
                </span>

                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Confirmação antes do lançamento
                </span>
              </div>
            </section>
  );
}
