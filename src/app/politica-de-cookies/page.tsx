import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  Settings2,
  BarChart3,
  EyeOff,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Cookies | MetricsFlow AI",
  description: "Política de Cookies da plataforma MetricsFlow AI.",
};

export default function PoliticaDeCookiesPage() {
  return (
    <main className="min-h-screen bg-surface-main text-slate-100">
      <header className="border-b border-surface-border bg-surface-sidebar/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div className="flex items-center gap-2">
            <Cookie size={16} className="text-brand-400" />

            <span className="text-sm font-semibold text-white">
              MetricsFlow <span className="text-brand-500">AI</span>
            </span>
          </div>
        </div>
      </header>

      <section className="px-5 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-300">
              <Cookie size={13} />
              Cookies e tecnologias similares
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Política de Cookies
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Esta Política explica como cookies e tecnologias semelhantes podem
              ser utilizados pelo MetricsFlow AI.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Última atualização: 02 de setembro de 2026
            </p>
          </div>

          <div className="mb-8 flex gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <Cookie size={18} className="mt-0.5 shrink-0 text-brand-400" />

            <p className="text-xs leading-relaxed text-slate-300">
              O MetricsFlow AI utiliza tecnologias de armazenamento e
              autenticação necessárias ao funcionamento da aplicação. Esta
              Política descreve o papel dos cookies e diferencia seu uso de
              outros mecanismos de armazenamento do navegador.
            </p>
          </div>

          <div className="space-y-8">
            <CookieSection
              number="1"
              title="O que são cookies?"
              icon={<Cookie size={17} />}
            >
              <p>
                Cookies são pequenos arquivos ou identificadores armazenados no
                navegador que podem permitir reconhecer uma sessão, preservar
                determinadas informações ou auxiliar no funcionamento de um site
                ou aplicação.
              </p>

              <p>
                Tecnologias semelhantes podem possuir funções parecidas, embora
                não sejam tecnicamente cookies.
              </p>
            </CookieSection>

            <CookieSection
              number="2"
              title="Cookies necessários"
              icon={<ShieldCheck size={17} />}
            >
              <p>
                Cookies estritamente necessários podem ser utilizados para
                permitir funcionalidades essenciais da plataforma, como
                autenticação, manutenção de sessão e segurança.
              </p>

              <p>
                Esses mecanismos são utilizados para que determinadas partes do
                MetricsFlow AI funcionem corretamente.
              </p>
            </CookieSection>

            <CookieSection
              number="3"
              title="Preferências e armazenamento local"
              icon={<Settings2 size={17} />}
            >
              <p>
                A aplicação também pode utilizar mecanismos de armazenamento
                oferecidos pelo navegador para manter informações relacionadas à
                experiência do usuário.
              </p>

              <p>
                Esse armazenamento pode incluir preferências ou dados
                temporários necessários para determinados fluxos da aplicação.
              </p>

              <p>
                O armazenamento local do navegador, como{" "}
                <code className="rounded bg-surface-sidebar px-1.5 py-0.5 text-[11px] text-brand-300">
                  localStorage
                </code>
                , não é um cookie. Quando utilizado, ele será tratado de acordo
                com a finalidade correspondente e com as configurações da
                aplicação.
              </p>
            </CookieSection>

            <CookieSection
              number="4"
              title="Cookies de análise"
              icon={<BarChart3 size={17} />}
            >
              <p>
                Ferramentas de análise ou métricas podem ser incorporadas ao
                MetricsFlow AI futuramente para compreender o uso da plataforma
                e melhorar a experiência.
              </p>

              <p>
                Caso sejam implementados cookies ou tecnologias de terceiros
                para essa finalidade, esta Política deverá ser atualizada para
                identificar suas finalidades e os respectivos fornecedores.
              </p>
            </CookieSection>

            <CookieSection
              number="5"
              title="Cookies de publicidade"
              icon={<EyeOff size={17} />}
            >
              <p>
                O MetricsFlow AI não declara, nesta Política, a utilização de
                cookies de publicidade ou rastreamento para fins de marketing
                sem que esses mecanismos estejam efetivamente implementados.
              </p>

              <p>
                Caso esse tipo de tecnologia seja posteriormente adotado, suas
                finalidades e condições de utilização deverão ser informadas aos
                usuários de forma adequada.
              </p>
            </CookieSection>

            <CookieSection
              number="6"
              title="Cookies de terceiros"
              icon={<ShieldCheck size={17} />}
            >
              <p>
                Determinados serviços necessários à operação da plataforma podem
                utilizar mecanismos próprios de armazenamento e autenticação.
              </p>

              <p>
                Quando houver utilização de tecnologias de terceiros que
                envolvam cookies ou identificadores semelhantes, as informações
                correspondentes deverão ser disponibilizadas de forma
                transparente.
              </p>
            </CookieSection>

            <CookieSection
              number="7"
              title="Gerenciamento de cookies"
              icon={<Settings2 size={17} />}
            >
              <p>
                O usuário pode utilizar as configurações do próprio navegador
                para bloquear, excluir ou restringir cookies.
              </p>

              <p>
                A desativação de cookies necessários pode impedir o
                funcionamento correto de determinadas funcionalidades da
                plataforma, especialmente aquelas relacionadas à autenticação e
                à manutenção da sessão.
              </p>
            </CookieSection>

            <CookieSection
              number="8"
              title="Atualizações desta Política"
              icon={<Cookie size={17} />}
            >
              <p>
                Esta Política poderá ser atualizada quando houver mudança nas
                tecnologias utilizadas, nas funcionalidades da plataforma ou nas
                práticas relacionadas a cookies.
              </p>

              <p>A versão vigente estará sempre disponível nesta página.</p>
            </CookieSection>

            <CookieSection number="9" title="Contato" icon={<Mail size={17} />}>
              <p>
                Para dúvidas sobre cookies, tecnologias de rastreamento ou
                privacidade, utilize o canal:
              </p>

              <p className="font-medium text-brand-400">
                metricsflowcompany@gmail.com
              </p>
            </CookieSection>
          </div>

          <div className="mt-12 border-t border-surface-border pt-6">
            <p className="text-center text-[11px] text-slate-600">
              MetricsFlow AI — Controle. Analise. Cresça.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

interface CookieSectionProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function CookieSection({ number, title, icon, children }: CookieSectionProps) {
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
