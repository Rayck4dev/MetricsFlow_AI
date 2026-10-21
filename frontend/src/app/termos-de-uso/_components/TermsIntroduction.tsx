import { AlertTriangle, Building2, FileText, Scale, UserCheck } from "lucide-react";
import { LegalSection } from "./LegalSection";

export function TermsIntroduction() {
  return (
    <>
<LegalSection
              number="1"
              title="Sobre a MetricsFlow AI"
              icon={<FileText size={17} />}
            >
              <p>
                A MetricsFlow AI é uma plataforma de organização e
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
                Ao criar uma conta ou utilizar os recursos da MetricsFlow AI, o
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
                A MetricsFlow AI permite que usuários sejam vinculados a uma
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
                A MetricsFlow AI é uma ferramenta de organização e
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
                O usuário compromete-se a utilizar a MetricsFlow AI de acordo
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
    </>
  );
}
