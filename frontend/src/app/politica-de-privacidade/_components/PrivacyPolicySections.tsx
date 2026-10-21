import { Database, LockKeyhole, Scale, Share2, UserRound } from "lucide-react";
import { PrivacySection, SubTitle } from "./PrivacySection";

export function PrivacyPolicySections() {
  return (
    <>
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
                Durante a configuração inicial, a MetricsFlow AI pode registrar
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
                A MetricsFlow AI adota medidas técnicas e administrativas
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
                A MetricsFlow AI não deve ser utilizada como justificativa para
                compartilhamento indiscriminado de dados. O acesso aos dados
                deve observar as permissões aplicáveis a cada usuário e empresa.
              </p>
            </PrivacySection>
    </>
  );
}
