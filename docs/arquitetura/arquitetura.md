# 🏗️ Arquitetura do projeto

O MetricsFlow utiliza uma arquitetura **monorepo**, contendo frontend e backend no mesmo repositório Git.

```text
metricsflow-ai/
│
├── frontend/
│   └── Next.js
│
├── backend/
│   └── NestJS
│
├── .gitignore
├── README.md
└── LICENSE
```

A separação permite que frontend e backend evoluam de forma independente dentro do mesmo projeto.

---

# 🖥️ Frontend

O frontend é desenvolvido utilizando **Next.js com App Router**, React e TypeScript.

Estrutura simplificada:

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
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── public/
├── package.json
└── ...
```
Os componentes são organizados de acordo com os domínios da aplicação.

Entre eles:

- Dashboard;
- Movimentações;
- DRE;
- Perfil;
- Empresa;
- Preferências;
- WhatsApp;
- Autenticação;
- Notificações;
- Formulários;
- Modais;

---

# ⚙️ Backend

A V2 introduz um backend próprio desenvolvido com **NestJS**.

O backend centraliza APIs, autenticação, regras de negócio e integrações que não devem ficar expostas no frontend.

Estrutura simplificada:

```text
backend/
│
├── src/
│   ├── modules/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── companies/
│   │   ├── health/
│   │   ├── supabase/
│   │   ├── transactions/
│   │   └── whatsapp/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env
├── package.json
└── ...
```

O backend possui prefixo global:

```text
/api
```

Principais rotas atualmente estruturadas:

```text
GET    /api
GET    /api/health
GET    /api/supabase/test

GET    /api/companies
POST   /api/companies
GET    /api/companies/:companyId/members

GET    /api/transactions
POST   /api/transactions
PATCH  /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/categories

GET    /api/whatsapp/connection
POST   /api/whatsapp/connection

POST   /api/whatsapp/demo
POST   /api/whatsapp/confirm

GET    /api/whatsapp/webhook
POST   /api/whatsapp/webhook
```

A estrutura de WhatsApp está preparada no backend, mas a integração efetiva com o WhatsApp ainda não está disponível no fluxo de produção.

---

# 🧩 Organização do Backend

O backend é organizado por módulos de domínio.

```text
backend/src/modules/

├── ai/
│   ├── ai.module.ts
│   ├── parser.service.ts
│   ├── transcription.service.ts
│   └── types.ts
│
├── auth/
│
├── categories/
│
├── companies/
│
├── health/
│
├── supabase/
│
├── transactions/
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

Essa organização permite que cada domínio evolua de maneira independente.

---