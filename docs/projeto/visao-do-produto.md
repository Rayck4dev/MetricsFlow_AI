# 🎯 Objetivo

O objetivo da MetricsFlow AI é oferecer ao MEI uma ferramenta simples, visual e acessível para:

- Registrar receitas;
- Registrar despesas;
- Organizar movimentações por categorias;
- Consultar o histórico financeiro;
- Buscar e filtrar movimentações;
- Editar e excluir transações;
- Visualizar receitas, custos e despesas;
- Acompanhar o resultado financeiro;
- Analisar a evolução financeira por meio de gráficos;
- Visualizar uma DRE simplificada;
- Gerenciar informações da empresa;
- Gerenciar membros da empresa;
- Gerenciar informações pessoais;
- Configurar preferências;
- Controlar diferentes níveis de acesso;
- Receber notificações financeiras;
- Exportar informações financeiras, conforme as funcionalidades disponíveis;
- Utilizar inteligência artificial para interpretar informações financeiras;
- Demonstrar o registro financeiro por meio de mensagens de texto e áudio na interface do WhatsApp Demo;
- Preparar a arquitetura para uma possível integração oficial com o WhatsApp no futuro.

---

# 🧠 Visão do produto

A MetricsFlow AI pretende evoluir de uma plataforma de controle financeiro para um **assistente de gestão financeira voltado para MEIs**.

A evolução do produto ocorre em duas etapas principais.

### V1 — Gestão financeira web

A V1 estabelece a base de gestão financeira da plataforma, reunindo autenticação, empresa, categorias, movimentações e acompanhamento dos resultados.

```text
Autenticação
      ↓
Empresa
      ↓
Categorias
      ↓
Movimentações
      ↓
Dashboard
      ↓
DRE
```

Essa etapa concentra as funcionalidades de controle e consulta financeira por meio da interface web.

### V2 — Inteligência artificial e experiência conversacional

A V2 amplia a plataforma com recursos de inteligência artificial para interpretar informações financeiras e auxiliar no registro de movimentações.

O fluxo demonstrado pelo **WhatsApp Demo** ocorre dentro da própria plataforma:

```text
WhatsApp Demo
      ↓
Mensagem de texto ou áudio
      ↓
Interpretação por IA
      ↓
Validação dos dados
      ↓
Confirmação do usuário
      ↓
Registro da movimentação
      ↓
Dashboard e consultas financeiras
```

**Importante:** o WhatsApp Demo é uma demonstração funcional dentro da aplicação. Ele permite testar o processamento de mensagens de texto e áudio, a interpretação financeira e o registro de movimentações após a confirmação do usuário, conforme as validações implementadas.

A **integração oficial com a Meta Cloud API não está implementada**. O recebimento de mensagens reais pelo WhatsApp, por meio de webhook oficial, não faz parte do escopo atualmente concluído.

Uma integração oficial poderá ser considerada em uma etapa futura, caso seja definida como prioridade do produto.

A proposta é tornar o controle financeiro mais simples para empreendedores que precisam administrar o próprio negócio sem depender de planilhas ou processos complexos.

---

# 👩‍💻 Desenvolvimento individual

A MetricsFlow AI é desenvolvida individualmente. Dessa forma, as responsabilidades necessárias para a construção e evolução do produto são acumuladas pela mesma desenvolvedora.

| Área                    | Responsabilidades                                            |
| ----------------------- | ------------------------------------------------------------ |
| Gestão / Produto        | Requisitos, funcionalidades, planejamento e priorização      |
| UI/UX                   | Identidade visual, experiência, responsividade e componentes |
| Frontend                | Next.js, React, TypeScript, componentes e integração         |
| Backend                 | NestJS, APIs, regras de negócio e integrações                |
| Banco de Dados          | PostgreSQL, Supabase, RLS, Functions e Triggers              |
| Inteligência Artificial | Integração, prompts, interpretação e Structured Output       |
| QA / Testes             | Testes funcionais, validação e correção de bugs              |
| DevOps                  | Git, ambientes, build, deploy e variáveis                    |
| Documentação            | README, diagramas e documentação técnica                     |

---
