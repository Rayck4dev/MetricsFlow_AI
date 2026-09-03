import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  UserRound,
  Building2,
  LockKeyhole,
  Share2,
  Trash2,
  Scale,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | MetricsFlow AI",
  description: "Política de Privacidade e proteção de dados do MetricsFlow AI.",
};

export default function PoliticaDePrivacidadePage() {
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
            <ShieldCheck size={16} className="text-brand-400" />

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
              <ShieldCheck size={13} />
              LGPD e proteção de dados
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Política de Privacidade
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Esta Política explica como o MetricsFlow AI trata dados pessoais
              durante a utilização da plataforma.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Última atualização: 02 de setembro de 2026
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-surface-border bg-surface-panel/70 p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={17} className="text-brand-400" />

              <h2 className="text-sm font-bold text-white">
                Identificação do responsável
              </h2>
            </div>

            <div className="grid gap-3 text-xs sm:grid-cols-2">
              <InfoItem label="Controlador" value="MetricsFlow AI" />

              <InfoItem label="CNPJ/CPF" value="AB12C34D000-06" />

              <InfoItem label="E-mail" value="metricsflowcompany@gmail.com" />

              <InfoItem
                label="Canal de privacidade"
                value="metricsflowcompany@gmail.com"
              />
            </div>
          </div>

          <div className="mb-8 flex gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-400" />

            <p className="text-xs leading-relaxed text-slate-300">
              O MetricsFlow AI busca tratar dados pessoais de forma
              transparente, segura e compatível com as finalidades para as quais
              foram coletados, observando a legislação brasileira aplicável,
              incluindo a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados
              Pessoais (LGPD).
            </p>
          </div>

          <div className="space-y-8">
            <PrivacySection
              number="1"
              title="Quais dados podem ser tratados"
              icon={<Database size={17} />}
            >
              <p>
                Dependendo da forma de utilização da plataforma, podem ser
                tratados dados necessários para criação da conta, autenticação,
                utilização das funcionalidades e gerenciamento da empresa.
              </p>

              <SubTitle>Dados de cadastro e conta</SubTitle>

              <ul>
                <li>nome;</li>
                <li>endereço de e-mail;</li>
                <li>telefone, quando informado;</li>
                <li>informações relacionadas à autenticação da conta.</li>
              </ul>

              <SubTitle>Dados relacionados à empresa</SubTitle>

              <ul>
                <li>nome e informações da empresa;</li>
                <li>informações cadastrais fornecidas pelo usuário;</li>
                <li>vínculo do usuário com uma empresa;</li>
                <li>papel ou permissão associada ao usuário.</li>
              </ul>

              <SubTitle>Dados financeiros inseridos pelo usuário</SubTitle>

              <ul>
                <li>receitas;</li>
                <li>despesas;</li>
                <li>categorias;</li>
                <li>valores;</li>
                <li>datas;</li>
                <li>formas de pagamento;</li>
                <li>descrições das movimentações.</li>
              </ul>
            </PrivacySection>

            <PrivacySection
              number="2"
              title="Dados do onboarding e preferências"
              icon={<UserRound size={17} />}
            >
              <p>
                Durante a configuração inicial, o MetricsFlow AI pode registrar
                informações fornecidas pelo usuário para personalizar sua
                experiência.
              </p>

              <ul>
                <li>objetivo financeiro;</li>
                <li>forma atual de controle das finanças;</li>
                <li>principal desafio financeiro;</li>
                <li>indicadores selecionados para acompanhamento;</li>
                <li>frequência de acompanhamento financeiro.</li>
              </ul>

              <p>
                Também podem ser armazenadas preferências da conta, como tema,
                período financeiro padrão, moeda e preferências de notificações.
              </p>
            </PrivacySection>

            <PrivacySection
              number="3"
              title="Para quais finalidades utilizamos os dados"
              icon={<Scale size={17} />}
            >
              <p>Os dados podem ser tratados para finalidades como:</p>

              <ul>
                <li>criação e gerenciamento da conta;</li>
                <li>autenticação do usuário;</li>
                <li>vinculação do usuário a uma empresa;</li>
                <li>disponibilização das funcionalidades da plataforma;</li>
                <li>registro e organização de movimentações financeiras;</li>
                <li>personalização da experiência e do Dashboard;</li>
                <li>armazenamento de preferências;</li>
                <li>segurança e prevenção de acessos indevidos;</li>
                <li>cumprimento de obrigações legais;</li>
                <li>atendimento de solicitações dos titulares.</li>
              </ul>
            </PrivacySection>

            <PrivacySection
              number="4"
              title="Bases legais"
              icon={<Scale size={17} />}
            >
              <p>
                O tratamento de dados pessoais será realizado de acordo com a
                base legal aplicável à finalidade específica e às circunstâncias
                do tratamento.
              </p>

              <p>
                Conforme o caso, poderão ser aplicadas bases legais previstas na
                LGPD, como execução de contrato ou de procedimentos relacionados
                ao contrato, cumprimento de obrigação legal ou regulatória,
                exercício regular de direitos, legítimo interesse ou
                consentimento, quando aplicável.
              </p>

              <p>
                Quando o tratamento depender de consentimento, este deverá ser
                solicitado de forma adequada e poderá ser revogado nos termos da
                legislação aplicável.
              </p>
            </PrivacySection>

            <PrivacySection
              number="5"
              title="Armazenamento e segurança"
              icon={<LockKeyhole size={17} />}
            >
              <p>
                O MetricsFlow AI adota medidas técnicas e administrativas
                destinadas à proteção dos dados pessoais contra acessos não
                autorizados, perda, alteração ou tratamento inadequado,
                considerando a natureza dos dados e os riscos envolvidos.
              </p>

              <p>
                Entre os mecanismos utilizados na arquitetura da aplicação estão
                autenticação, controle de acesso por empresa, definição de
                papéis, políticas de segurança no banco de dados e validações de
                integridade.
              </p>

              <p>
                Nenhum sistema conectado à internet pode garantir segurança
                absoluta. Por isso, o usuário também deve proteger suas
                credenciais e utilizar a plataforma de forma adequada.
              </p>
            </PrivacySection>

            <PrivacySection
              number="6"
              title="Compartilhamento de dados"
              icon={<Share2 size={17} />}
            >
              <p>
                Os dados pessoais poderão ser compartilhados com prestadores de
                serviços e operadores necessários à operação da plataforma,
                sempre de acordo com a finalidade do tratamento e com as
                obrigações aplicáveis.
              </p>

              <p>
                O compartilhamento também poderá ocorrer quando necessário para
                cumprimento de obrigação legal, exercício regular de direitos,
                proteção da segurança ou atendimento de determinação de
                autoridade competente.
              </p>

              <p>
                O MetricsFlow AI não deve ser utilizado como justificativa para
                compartilhamento indiscriminado de dados. O acesso aos dados
                deve observar as permissões aplicáveis a cada usuário e empresa.
              </p>
            </PrivacySection>

            <PrivacySection
              number="7"
              title="Dados financeiros"
              icon={<Building2 size={17} />}
            >
              <p>
                As informações financeiras registradas pelo usuário são dados
                inseridos para utilização das funcionalidades de organização e
                análise disponibilizadas pela plataforma.
              </p>

              <p>
                O usuário deve evitar inserir informações pessoais de terceiros
                que não sejam necessárias para a utilização do serviço.
              </p>

              <p>
                O MetricsFlow AI não deve ser considerado um substituto para
                sistemas contábeis, fiscais ou profissionais especializados.
              </p>
            </PrivacySection>

            <PrivacySection
              number="8"
              title="Retenção e exclusão"
              icon={<Trash2 size={17} />}
            >
              <p>
                Os dados pessoais serão mantidos pelo período necessário para
                cumprir as finalidades informadas ou pelo tempo exigido para
                cumprimento de obrigações legais, exercício de direitos ou
                outras hipóteses previstas na legislação.
              </p>

              <p>
                O titular poderá solicitar a eliminação de seus dados quando
                esse direito for aplicável. A eliminação não é necessariamente
                absoluta, podendo existir hipóteses legais que permitam ou
                exijam a conservação de determinados dados.
              </p>
            </PrivacySection>

            <PrivacySection
              number="9"
              title="Direitos do titular"
              icon={<UserRound size={17} />}
            >
              <p>
                Nos termos da LGPD, o titular possui direitos relacionados aos
                seus dados pessoais, observadas as condições e exceções
                previstas em lei.
              </p>

              <ul>
                <li>confirmação da existência de tratamento;</li>
                <li>acesso aos dados;</li>
                <li>correção de dados incompletos ou incorretos;</li>
                <li>
                  solicitação de anonimização, bloqueio ou eliminação quando
                  aplicável;
                </li>
                <li>portabilidade, conforme regulamentação aplicável;</li>
                <li>informação sobre compartilhamentos;</li>
                <li>revogação do consentimento, quando aplicável;</li>
                <li>oposição nas hipóteses previstas pela LGPD;</li>
                <li>
                  revisão de decisões tomadas exclusivamente por tratamento
                  automatizado, quando aplicável.
                </li>
              </ul>

              <p>
                A ANPD informa que o exercício desses direitos deve ser
                solicitado inicialmente ao controlador.
              </p>
            </PrivacySection>

            <PrivacySection
              number="10"
              title="Encarregado e canal de contato"
              icon={<Mail size={17} />}
            >
              <p>
                Para assuntos relacionados à proteção de dados pessoais,
                solicitações de titulares ou dúvidas sobre esta Política,
                utilize o canal abaixo:
              </p>

              <p className="font-medium text-brand-400">
                metricsflowcompany@gmail.com
              </p>

              <p>
                Quando aplicável, as informações sobre o encarregado pelo
                tratamento de dados pessoais serão disponibilizadas por este
                canal. Agentes de tratamento de pequeno porte podem possuir
                regras específicas quanto à indicação de encarregado, conforme
                regulamentação da ANPD.
              </p>
            </PrivacySection>

            <PrivacySection
              number="11"
              title="Atualizações desta Política"
              icon={<ShieldCheck size={17} />}
            >
              <p>
                Esta Política poderá ser atualizada para refletir alterações na
                plataforma, nas práticas de tratamento ou na legislação
                aplicável.
              </p>

              <p>
                A versão vigente estará disponível nesta página, acompanhada da
                respectiva data de atualização.
              </p>
            </PrivacySection>
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

interface PrivacySectionProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function PrivacySection({
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

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pt-1 text-xs font-bold uppercase tracking-wide text-slate-300">
      {children}
    </h3>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-sidebar/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate font-medium text-slate-300">{value}</p>
    </div>
  );
}
