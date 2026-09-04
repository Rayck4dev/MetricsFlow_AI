import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  UserCheck,
  Building2,
  AlertTriangle,
  Copyright,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | MetricsFlow AI",
  description: "Termos de Uso da plataforma MetricsFlow AI.",
};

export default function TermosDeUsoPage() {
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
            <FileText size={16} className="text-brand-400" />

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
              <FileText size={13} />
              Documento legal
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Termos de Uso
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Estes Termos de Uso estabelecem as condições para utilização da
              plataforma MetricsFlow AI.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Última atualização: 02 de setembro de 2026
            </p>
          </div>

          <div className="mb-8 flex gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-400" />

            <p className="text-xs leading-relaxed text-slate-300">
              Ao utilizar o MetricsFlow AI, você declara que leu e compreendeu
              estes Termos de Uso. A utilização da plataforma implica a
              aceitação das condições aqui estabelecidas.
            </p>
          </div>

          <div className="space-y-8">
            <LegalSection
              number="1"
              title="Sobre o MetricsFlow AI"
              icon={<FileText size={17} />}
            >
              <p>
                O MetricsFlow AI é uma plataforma de organização e
                acompanhamento financeiro desenvolvida para apoiar
                microempreendedores na gestão de suas informações financeiras.
              </p>

              <p>
                A plataforma disponibiliza recursos para registro e
                acompanhamento de receitas, despesas, categorias, movimentações,
                indicadores financeiros e informações relacionadas à empresa.
              </p>
            </LegalSection>

            <LegalSection
              number="2"
              title="Aceitação dos Termos"
              icon={<UserCheck size={17} />}
            >
              <p>
                Ao criar uma conta ou utilizar os recursos do MetricsFlow AI, o
                usuário concorda com estes Termos de Uso e com a Política de
                Privacidade aplicável à plataforma.
              </p>

              <p>
                Caso não concorde com alguma condição destes Termos, o usuário
                deverá interromper a utilização da plataforma.
              </p>
            </LegalSection>

            <LegalSection
              number="3"
              title="Cadastro e conta"
              icon={<UserCheck size={17} />}
            >
              <p>
                Para utilizar determinadas funcionalidades, o usuário deverá
                fornecer informações necessárias para criação e manutenção de
                sua conta.
              </p>

              <p>
                O usuário é responsável por fornecer informações verdadeiras,
                completas e atualizadas, bem como por manter a segurança de suas
                credenciais de acesso.
              </p>

              <p>
                A conta é de responsabilidade do respectivo usuário, que deverá
                comunicar qualquer utilização não autorizada ou suspeita de
                comprometimento de acesso.
              </p>
            </LegalSection>

            <LegalSection
              number="4"
              title="Empresas e membros"
              icon={<Building2 size={17} />}
            >
              <p>
                O MetricsFlow AI permite que usuários sejam vinculados a uma
                empresa, de acordo com os recursos disponibilizados pela
                plataforma.
              </p>

              <p>
                Dependendo de seu papel na empresa, um usuário poderá possuir
                diferentes permissões de acesso e gerenciamento.
              </p>

              <p>
                O responsável pela empresa deve utilizar os recursos de convite
                e gerenciamento de membros de forma adequada e somente conceder
                acesso a pessoas autorizadas.
              </p>
            </LegalSection>

            <LegalSection
              number="5"
              title="Informações financeiras"
              icon={<Scale size={17} />}
            >
              <p>
                O usuário é responsável pelas informações financeiras inseridas
                na plataforma, incluindo receitas, despesas, categorias, datas,
                valores e demais informações relacionadas às suas movimentações.
              </p>

              <p>
                O MetricsFlow AI é uma ferramenta de organização e
                acompanhamento financeiro. As informações apresentadas pela
                plataforma não substituem orientação contábil, tributária,
                jurídica ou financeira profissional.
              </p>

              <p>
                O usuário deve verificar as informações registradas antes de
                utilizá-las para tomada de decisões.
              </p>
            </LegalSection>

            <LegalSection
              number="6"
              title="Uso adequado da plataforma"
              icon={<AlertTriangle size={17} />}
            >
              <p>
                O usuário compromete-se a utilizar o MetricsFlow AI de acordo
                com a legislação aplicável e com estes Termos.
              </p>

              <p>É vedado utilizar a plataforma para:</p>

              <ul>
                <li>praticar atividades ilícitas ou fraudulentas;</li>
                <li>
                  tentar acessar contas, dados ou recursos sem autorização;
                </li>
                <li>
                  comprometer, explorar ou prejudicar a segurança da plataforma;
                </li>
                <li>
                  inserir conteúdo malicioso ou destinado a interferir no
                  funcionamento do serviço.
                </li>
              </ul>
            </LegalSection>

            <LegalSection
              number="7"
              title="Disponibilidade do serviço"
              icon={<ShieldCheck size={17} />}
            >
              <p>
                O MetricsFlow AI busca manter seus serviços disponíveis e
                funcionais, mas determinados recursos podem ficar
                temporariamente indisponíveis em razão de manutenção,
                atualizações, falhas técnicas ou fatores externos.
              </p>

              <p>
                A disponibilidade de funcionalidades futuras poderá depender de
                integrações e serviços de terceiros.
              </p>
            </LegalSection>

            <LegalSection
              number="8"
              title="Propriedade intelectual"
              icon={<Copyright size={17} />}
            >
              <p>
                A identidade visual, código, interfaces, textos, componentes,
                elementos gráficos e demais elementos próprios do MetricsFlow AI
                são protegidos pela legislação aplicável.
              </p>

              <p>
                A utilização da plataforma não concede ao usuário qualquer
                direito de propriedade sobre seus elementos, salvo quando
                expressamente indicado.
              </p>
            </LegalSection>

            <LegalSection
              number="9"
              title="Encerramento da conta"
              icon={<UserCheck size={17} />}
            >
              <p>
                O usuário poderá solicitar o encerramento de sua conta pelos
                canais disponibilizados pelo MetricsFlow AI.
              </p>

              <p>
                O encerramento ou exclusão de dados estará sujeito às regras
                aplicáveis de retenção e às obrigações legais eventualmente
                existentes.
              </p>
            </LegalSection>

            <LegalSection
              number="10"
              title="Alterações destes Termos"
              icon={<FileText size={17} />}
            >
              <p>
                Estes Termos poderão ser atualizados para refletir mudanças na
                plataforma, na legislação ou nas práticas adotadas pelo
                MetricsFlow AI.
              </p>

              <p>A versão mais recente estará disponível nesta página.</p>
            </LegalSection>

            <LegalSection
              number="11"
              title="Legislação aplicável"
              icon={<Scale size={17} />}
            >
              <p>
                Estes Termos são interpretados de acordo com a legislação
                brasileira, observadas as normas aplicáveis à relação existente
                entre o usuário e a plataforma.
              </p>
            </LegalSection>

            <LegalSection
              number="12"
              title="Contato"
              icon={<FileText size={17} />}
            >
              <p>
                Para dúvidas relacionadas a estes Termos de Uso, entre em
                contato através do canal oficial:
              </p>

              <p className="font-medium text-brand-400">
                metricsflowcompany@gmail.com
              </p>
            </LegalSection>
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

interface LegalSectionProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function LegalSection({ number, title, icon, children }: LegalSectionProps) {
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
