<p align="center">
  <img src="./frontend/public/logo_completa.png" width="200" alt="Metrics Logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-NextJS-E0234E?style=for-the-badge&logo=nextjs&logoColor=white" alt="NextJS" />
  <img src="https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer-Motion-E2165C?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Lucide-React-000000?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />
  <img src="https://img.shields.io/badge/Recharts-FFC436?style=for-the-badge&logo=recharts&logoColor=black" alt="Recharts" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp" />
  <img src="https://img.shields.io/badge/Google-OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/OpenAI-000000?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/REST-API-000000?style=for-the-badge&logo=rest-api&logoColor=white" alt="REST API" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License MIT" />
</p>

# MetricsFlow AI

> **CPM — Controle e Planejamento Financeiro para MEIs**

**Você conversa. O MetricsFlow organiza.**

A **MetricsFlow AI** é uma plataforma de gestão financeira desenvolvida para **Microempreendedores Individuais (MEIs)**, com foco em simplificar o controle das movimentações financeiras e oferecer uma visão clara da saúde financeira do negócio.

A V1 estabeleceu a plataforma web de gestão financeira. A V2 evolui essa estrutura com uma arquitetura baseada em **frontend + backend**, preparando o sistema para recursos de inteligência artificial e integração com WhatsApp.

## 🎯 Principais funcionalidades

- Dashboard financeiro
- Receitas e despesas
- Categorias
- Histórico e filtros
- Edição e exclusão de movimentações
- Exportação para CSV
- DRE
- Gestão de empresa e membros
- Controle de acesso por papel
- Autenticação com Supabase Auth
- Login com Google
- Onboarding
- Preferências
- Notificações
- Backend REST com NestJS
- Swagger / OpenAPI
- Estrutura preparada para IA e WhatsApp

## 🧱 Arquitetura

```text
metricsflow-ai/
├── frontend/    → Next.js + React + TypeScript
├── backend/     → NestJS + TypeScript
├── docs/        → Documentação técnica e acadêmica
├── README.md
├── LICENSE
└── .gitignore
```

Frontend e backend permanecem no mesmo repositório Git, mas são aplicações separadas.

## 📚 Documentação

- [Visão do produto](./docs/projeto/visao-do-produto.md)
- [Funcionalidades](./docs/produto/funcionalidades.md)
- [Organização e plano de carreira](./docs/projeto/organizacao-e-carreira.md)
- [Documentação acadêmica](./docs/projeto/documentacao-academica.md)
- [Arquitetura](./docs/arquitetura/arquitetura.md)
- [Autenticação e segurança](./docs/arquitetura/autenticacao-e-seguranca.md)
- [IA e WhatsApp](./docs/arquitetura/ia-e-whatsapp.md)
- [Modelagem do banco](./docs/banco/modelagem.md)
- [API](./docs/api/endpoints.md)
- [Diagramas UML](./docs/diagramas/uml.md)
- [C4 Model](./docs/diagramas/c4.md)
- [Status e roadmap](./docs/produto/status-e-roadmap.md)

## 🚀 Executar o projeto

> **O projeto completo utilizado para avaliação está na branch `v2`.**

```bash
git clone https://github.com/Rayck4dev/MetricsFlow_AI.git
cd MetricsFlow_AI
git switch v2
```

---

Para consultar o passo a passo completo de instalação, configuração das variáveis de ambiente, execução do frontend e backend e acesso ao Swagger:

- [Instalação e execução](./docs/instalacao.md)

---

## 📌 Status

**V1:** plataforma web de gestão financeira funcional.

**V2:** frontend + backend estruturados, Supabase integrado, API REST, módulo de IA, parser financeiro, preparação para transcrição e estrutura inicial do módulo WhatsApp.

A integração real com WhatsApp em produção permanece em desenvolvimento.

## 📄 Licença

MIT License. Consulte [`LICENSE`](./LICENSE).
