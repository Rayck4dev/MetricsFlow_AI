import { Copyright, FileText, Scale, ShieldCheck, UserCheck } from "lucide-react";
import { LegalSection } from "./LegalSection";

export function TermsFinalSections() {
  return (
    <>
<LegalSection
              number="7"
              title="Disponibilidade do serviço"
              icon={<ShieldCheck size={17} />}
            >
              <p>
                A MetricsFlow AI busca manter seus serviços disponíveis e
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
                elementos gráficos e demais elementos próprios da MetricsFlow AI
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
                canais disponibilizados pela MetricsFlow AI.
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
    </>
  );
}
