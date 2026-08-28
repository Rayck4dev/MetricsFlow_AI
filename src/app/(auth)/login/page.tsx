import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, MessageSquare, BarChart3 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface-main text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-surface-border lg:flex">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[140px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="group flex w-fit items-center gap-3">
              <Image
                src="/logo_metrics_bg.png"
                alt="MetricsFlow AI"
                width={54}
                height={54}
                priority
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <span className="font-heading text-base font-bold text-white">
                MetricsFlow <span className="text-brand-400">AI</span>
              </span>
            </Link>

            <div className="max-w-xl">
              <span className="mb-5 inline-flex items-center rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-400">
                Gestão financeira inteligente
              </span>

              <h2 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                Sua empresa.
                <br />
                Seus números.
                <br />
                <span className="text-brand-400">Mais controle.</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-400">
                Registre suas movimentações pelo WhatsApp e acompanhe o
                desempenho financeiro da sua empresa em um único lugar.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-panel">
                    <MessageSquare size={16} className="text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Registre pelo WhatsApp
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Texto ou áudio, sem complicação.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-panel">
                    <BarChart3 size={16} className="text-brand-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Acompanhe os indicadores
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Tenha uma visão clara do seu negócio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-600">
              © {new Date().getFullYear()} MetricsFlow AI. Todos os direitos
              reservados.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen flex-col">
          <div className="flex items-center justify-between p-5 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo_metrics_bg.png"
                alt="MetricsFlow AI"
                width={42}
                height={42}
                priority
                className="h-10 w-10 object-contain"
              />

              <span className="font-heading text-sm font-bold text-white">
                MetricsFlow <span className="text-brand-400">AI</span>
              </span>
            </Link>

            <Link
              href="/"
              className="text-slate-500 transition-colors hover:text-white"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>

         <div className="flex flex-1 items-center justify-center px-10 py-8">
            <div className="w-full max-w-[420px]">
              <LoginForm />

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-600">
                <ShieldCheck size={13} />
                Seus dados são protegidos e tratados com segurança.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
