import { Building2, Mail, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { PrivacySection } from "./PrivacySection";

export function PrivacyPolicyRights() {
  return (
    <>
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
                A MetricsFlow AI não deve ser considerada um substituto para
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
    </>
  );
}
