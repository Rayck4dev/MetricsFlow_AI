# 🏗️ Arquitetura do Projeto

A **MetricsFlow AI** utiliza uma arquitetura **monorepo**, mantendo o frontend e o backend em um único repositório Git. Essa organização facilita o gerenciamento do código, o versionamento e a evolução dos componentes da aplicação.

```text
metricsflow-ai/
│
├── frontend/       # Aplicação web
├── docs/           # Documentação
├── backend/        # API e serviços
├── .gitignore
├── README.md
└── LICENSE
```

A separação entre frontend e backend permite que cada parte evolua de forma independente, mantendo uma organização centralizada do projeto.

> **Nota:** a estrutura apresentada é simplificada e pode sofrer alterações conforme a evolução do projeto.

---

# 🖥️ Frontend

O frontend é desenvolvido com **Next.js, utilizando App Router, React e TypeScript**.

## Estrutura simplificada

```text
frontend/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── demo/
│   │   ├── dre/
│   │   ├── empresa/
│   │   ├── movimentacoes/
│   │   ├── onboarding/
│   │   ├── perfil/
│   │   ├── preferencias/
│   │   └── whatsapp/
│   │
│   ├── components/
│   ├── constants/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── supabase/
│   ├── types/
│   └── utils/
│
├── proxy.ts
├── public/
├── package.json
└── ...
```

Os componentes e as páginas são organizados por áreas funcionais da aplicação, facilitando a manutenção e a reutilização de código.

Entre os principais domínios e recursos do frontend estão:

- **Dashboard:** visualização das informações financeiras.
- **Movimentações:** gerenciamento de transações financeiras.
- **DRE:** área destinada à demonstração do resultado do exercício.
- **Perfil:** gerenciamento das informações do usuário.
- **Empresa:** funcionalidades relacionadas à organização e aos seus membros.
- **Preferências:** configurações da aplicação.
- **WhatsApp:** interface destinada aos recursos relacionados à integração e à demonstração.
- **Autenticação e onboarding:** fluxos de acesso e configuração inicial.
- **Componentes compartilhados:** notificações, formulários, modais e demais elementos reutilizáveis.

---

# ⚙️ Backend

A versão 2 (V2) conta com um backend próprio desenvolvido com **NestJS e TypeScript**.

O backend centraliza a exposição das APIs, a aplicação das regras de negócio e as integrações com serviços externos. Essa separação permite manter no servidor as operações que não devem ser executadas exclusivamente no frontend.

## Estrutura simplificada

```text
backend/
│
├── src/
│   ├── modules/
│   │   ├── ai/
│   │   ├── attachments/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── companies/
│   │   ├── health/
│   │   ├── transactions/
│   │   ├── whatsapp/
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   │   
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── app.controller.ts
│   └── main.ts
│
├── .env
├── package.json
└── ...
```

O backend utiliza o prefixo global `/api` para organizar os endpoints.

## Principais endpoints

> **Atenção:** a lista abaixo representa o estado documentado atualmente. Rotas, parâmetros e contratos podem mudar durante o desenvolvimento. Para conferir a configuração disponível no ambiente, consulte o Swagger.

| Método   | Endpoint                            | Descrição                                                |
| -------- | ----------------------------------- | -------------------------------------------------------- |
| `GET`    | `/api`                              | Endpoint raiz da API.                                    |
| `GET`    | `/api/health`                       | Verificação do estado da API.                            |
| `GET`    | `/api/supabase/test`                | Teste da conexão com o Supabase.                         |
| `GET`    | `/api/companies`                    | Consulta empresas conforme as regras de acesso.          |
| `POST`   | `/api/companies`                    | Criação de uma empresa.                                  |
| `GET`    | `/api/companies/:companyId/members` | Consulta dos membros de uma empresa.                     |
| `GET`    | `/api/transactions`                 | Consulta de transações.                                  |
| `POST`   | `/api/transactions`                 | Criação de uma transação.                                |
| `PATCH`  | `/api/transactions/:id`             | Atualização de uma transação.                            |
| `DELETE` | `/api/transactions/:id`             | Exclusão de uma transação.                               |
| `GET`    | `/api/transactions/:id/attachments` | Consulta dos anexos associados a uma transação.          |
| `GET`    | `/api/categories`                   | Consulta de categorias.                                  |
| `GET`    | `/api/whatsapp/connection`          | Consulta do estado da conexão com o WhatsApp.            |
| `POST`   | `/api/whatsapp/connection`          | Operação relacionada à conexão com o WhatsApp.           |
| `GET`    | `/api/whatsapp/demo/messages`       | Consulta de mensagens da demonstração.                   |
| `POST`   | `/api/whatsapp/demo`                | Processamento de interações no ambiente de demonstração. |
| `POST`   | `/api/whatsapp/demo/audio`          | Recebimento e processamento de áudio para transcrição.   |
| `POST`   | `/api/whatsapp/confirm`             | Processamento de solicitações de confirmação.            |
| `GET`    | `/api/whatsapp/webhook`             | Verificação do webhook.                                  |
| `POST`   | `/api/whatsapp/webhook`             | Recebimento de eventos por webhook.                      |

A documentação interativa dos endpoints está disponível em:

`http://localhost:3001/api/docs`

---

# 🧩 Organização do Backend

O backend é organizado em módulos de domínio, agrupando controladores, serviços, tipos e demais componentes relacionados a cada área funcional.

```text
backend/src/modules/
│
├── ai/
│   ├── ai.module.ts
│   ├── parser.service.ts
│   ├── transcription.service.ts
│   └── types.ts
├── parser/
│
├── auth/
├── categories/
├── companies/
├── health/
├── supabase/
├── transactions/
├── attachments/
│
└── whatsapp/
    ├── whatsapp.controller.ts
    ├── whatsapp.module.ts
    ├── whatsapp.service.ts
    ├── meta.service.ts
    ├── process-message.service.ts
    ├── message-guard.service.ts
    ├── types.ts
    └── dto/
```

A estrutura modular favorece a separação de responsabilidades e permite que cada domínio seja mantido e evoluído de forma organizada.

## Integração com WhatsApp

A integração direta com a API oficial da Meta não foi viabilizada nesta etapa do projeto. Por esse motivo, foi adotado um **ambiente de demonstração interativa**, que permite apresentar e validar os fluxos da solução sem depender de uma conexão efetiva com a infraestrutura oficial do WhatsApp.

O backend mantém módulos e serviços relacionados ao processamento de mensagens e à integração com a Meta. Entretanto, a presença desses componentes na estrutura do código não significa que a integração oficial esteja operacional em produção.

A abordagem adotada nesta etapa utiliza recursos de Inteligência Artificial no processamento das interações, incluindo a transcrição de áudio por meio da OpenAI.

## Evolução da arquitetura

A arquitetura, os módulos e os endpoints permanecem sujeitos a ajustes durante o desenvolvimento da V2.

A documentação específica das funcionalidades de Inteligência Artificial planejadas para essa versão será complementada posteriormente, conforme a definição dos fluxos e a evolução da implementação.

---

**Observação geral:** os diretórios e endpoints apresentados têm finalidade documental e representam uma visão simplificada da estrutura atual. A implementação do repositório e a documentação atualizada do Swagger devem ser utilizadas como referência para confirmar detalhes técnicos.
