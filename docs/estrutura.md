# 📂 Estrutura geral do projeto

O MetricsFlow AI utiliza uma organização em **monorepo**, mantendo frontend, backend e documentação no mesmo repositório Git.

Apesar de estarem no mesmo repositório, frontend e backend são aplicações separadas, com responsabilidades distintas.

---

# 🧱 Estrutura principal

```text
metricsflow-ai/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── README.md
├── LICENSE
└── .gitignore
```

## 🖥️ Frontend

O frontend foi desenvolvido utilizando:

**Next.js;**
**React;**
**TypeScript;**
**Tailwind CSS;**
**Framer Motion;**
**Lucide React;**
**Recharts.**

### Estrutura principal:

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │
│   ├── components/
│   │
│   ├── contexts/
│   │
│   ├── data/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   └── ...
│
├── package.json
└── ...
```

### Responsabilidade das principais pastas


| Diretório   | Responsabilidade                                 
| ----------- | ------------------------------------------------------- |
| app/        | Rotas, páginas e estruturas de navegação                |
| components/ | Componentes visuais e elementos reutilizáveis           |
| contexts/   | Estados e informações compartilhadas globalmente        |
| data/       | Dados auxiliares e estruturas utilizadas pela interface |
| hooks/      | Estado, lógica da aplicação e orquestração dos fluxos   |
| lib/        | Clientes, configurações e recursos de infraestrutura    |
| services/   | Operações de acesso, consulta e manipulação de dados    |
| types/      | Tipagens e contratos utilizados pelo frontend           |


Essa organização permite separar a apresentação da interface, o gerenciamento de estado e as operações relacionadas aos dados.

---

## ⚙️ Backend

O backend foi desenvolvido utilizando:


**NestJS;**
**Node.js;**
**TypeScript;**
**REST API;**
**Swagger / OpenAPI.**


###  Estrutura principal:

```text
backend/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── ai/
│   │   │
│   │   ├── auth/
│   │   │
│   │   ├── categories/
│   │   │
│   │   ├── companies/
│   │   │
│   │   ├── health/
│   │   │
│   │   ├── supabase/
│   │   │
│   │   ├── transactions/
│   │   │
│   │   └── whatsapp/
│   │
│   ├── app.module.ts
│   │
│   └── main.ts
│
├── package.json
└── ...
```
---

## 🧩 Módulos do Backend

O backend é organizado por domínios funcionais.

### Módulo Responsabilidade

| Módulo | Responsabilidade                                        |
| ------ | ------------------------------------------------------- |
| ai/    | Interpretação financeira e recursos relacionados à inteligência artificial |
| auth/  | Autenticação e validação de usuários                  |
| categories/ | Consulta e gerenciamento de categorias               |
| companies/ | Empresas, membros e relacionamentos                  |
| health/ | Verificação da disponibilidade da API                |
| supabase/ | Integração com o Supabase                           |
| transactions/  | Operações relacionadas às movimentações financeiras
| whatsapp/ | Integração, recebimento e processamento de mensagens do WhatsApp

---

## 🚀 Arquivos principais do Backend

#### **main.ts**

Responsável pela inicialização da aplicação NestJS e pelas configurações globais da API.

Entre suas responsabilidades estão:

- Inicialização do servidor;
- Prefixo global /api;
- CORS;
- ValidationPipe;
- Swagger / OpenAPI;
- Configuração da porta da aplicação.

---

#### **app.module.ts**

Responsável pela composição dos módulos principais do backend.

Os módulos são registrados nessa estrutura para que a aplicação consiga organizar suas funcionalidades por domínio.

---

## 📚 Documentação

A documentação do projeto foi separada da aplicação principal para evitar que o **README.md** concentre todas as informações do sistema.

### Estrutura:

docs/
│
├── README.md
├── instalacao.md
├── estrutura.md
├── orcamento.pdf
│
├── api/
│ └── endpoints.md
│
├── arquitetura/
│ ├── arquitetura.md
│ ├── autenticacao-e-seguranca.md
│ └── ia-e-whatsapp.md
│
├── banco/
│ └── modelagem.md
│
├── diagramas/
│ ├── c4.md
│ └── uml.md
│
├── produto/
│ └── status-e-roadmap.md
│
└── projeto/
├── documentacao-academica.md
├── organizacao-e-carreira.md
└── visao-do-produto.md

---

### 📁 Organização da documentação

#### **docs/api/**

Contém a documentação dos endpoints da API.

```text
docs/api/
└── endpoints.md
```

---

#### **docs/arquitetura/**

Contém a documentação relacionada à arquitetura técnica da aplicação.

```text
docs/arquitetura/
├── arquitetura.md
├── autenticacao-e-seguranca.md
└── ia-e-whatsapp.md
```

Abrange:

- Arquitetura do frontend;
- Arquitetura do backend;
- Autenticação;
- Controle de acesso;
- Segurança;
- Inteligência artificial;
- WhatsApp.

---

#### **docs/banco/**

Contém a documentação relacionada ao banco de dados.

```text
docs/banco/
└── modelagem.md
```

Abrange:

- Entidades;
- Relacionamentos;
- Persistência;
- Estrutura das tabelas;
- Organização dos dados.

---

#### **docs/diagramas/**

Contém os diagramas utilizados para representar o sistema.

```text
docs/diagramas/
├── c4.md
└── uml.md
```

Inclui:

- Diagrama de Caso de Uso;
- Diagrama de Classes;
- Diagrama de Sequência;
- Diagrama de Atividade;
- C4 Model.

---

#### **docs/produto/**

Contém informações sobre a evolução do produto.

```text
docs/produto/
└── status-e-roadmap.md
```

Abrange:

- Status da V1;
- Status da V2;
- Roadmap;
- Próximas etapas;
- Evolução planejada.

---

#### **docs/projeto/**

Contém informações relacionadas ao projeto, organização e documentação acadêmica.

```text
docs/projeto/
├── documentacao-academica.md
├── organizacao-e-carreira.md
└── visao-do-produto.md
```

Abrange:

- Visão do produto;
- Organização da equipe;
- Organograma;
- Plano de carreira;
- Documentação acadêmica;
- Atividades relacionadas ao projeto.

---

### 🔐 Variáveis de ambiente

As configurações sensíveis são mantidas em arquivos de ambiente locais.

```text
frontend/
└── .env.local

backend/
└── .env
```

Esses arquivos não fazem parte da estrutura versionada do projeto e são protegidos pelo **.gitignore**.

As variáveis de ambiente podem conter configurações relacionadas a:

- Supabase;
- OpenAI;
- WhatsApp / Meta Cloud API;
- URL da API;
- Porta do backend;
- Tokens;
- Chaves de integração;
- Outros serviços externos.

---

### 🔄 Visão geral da arquitetura

A organização geral do projeto pode ser representada da seguinte forma:

                         MetricsFlow AI
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
            Frontend        Backend          Docs
                │              │              │
                ▼              ▼              ▼
             Next.js         NestJS       Markdown
                │              │           Diagramas
                ▼              ▼           Documentos
             React          REST API
                │              │
                └──────┬───────┘
                       │
                       ▼
                   Supabase
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Auth        PostgreSQL      RLS
                       │
                       ▼
                 Functions /
                   Triggers
                       │
                       ▼
                IA / WhatsApp

---    

### 🧠 Separação de responsabilidades

A estrutura do projeto busca separar as responsabilidades de cada camada.

```text
Componentes
↓
Interface e apresentação

Hooks
↓
Estado e orquestração da aplicação

Services
↓
Consultas e operações sobre dados

Backend
↓
API e regras críticas da aplicação

Banco de dados
↓
Persistência, integridade, RLS,
functions e triggers
```

Essa separação reduz o acoplamento e facilita a manutenção e evolução do sistema.

---

### 📦 Monorepo

O MetricsFlow utiliza uma estrutura de monorepo.

Isso significa que frontend, backend e documentação são mantidos dentro de um único repositório Git:

```text
metricsflow-ai/
├── frontend/
├── backend/
├── docs/
└── README.md
```

Embora compartilhem o mesmo repositório, frontend e backend possuem responsabilidades e ambientes de execução separados.

---

### 📌 Branches

O projeto utiliza branches para organizar a evolução do desenvolvimento.

A branch utilizada como referência para a avaliação é:

```text
v2
```

Para acessar:

```bash
git switch v2
```

---

### 📄 Arquivos da raiz

| Arquivo | Responsabilidade |
|---|---|
| README.md | Apresentação geral e ponto de entrada do projeto |
| LICENSE | Termos de licenciamento |
| .gitignore | Arquivos e diretórios ignorados pelo Git |

---

### 🎯 Objetivo da organização

A estrutura foi organizada para facilitar:

- Manutenção do código;
- Separação de responsabilidades;
- Evolução independente do frontend e backend;
- Localização da documentação;
- Colaboração e versionamento;
- Escalabilidade do projeto;
- Apresentação técnica da arquitetura.

A documentação detalhada permanece dentro de docs/, enquanto o README.md da raiz funciona como ponto de entrada para o projeto.