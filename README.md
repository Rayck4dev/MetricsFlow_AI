# 📈 MetricsFlow AI

> **Corporate Performance Management (CPM) Simplificado para MEIs e Microempresas via WhatsApp com Inteligência Artificial.**

---

## 📌 Sobre o Projeto

O **MetricsFlow AI** é uma plataforma inovadora de Gestão de Desempenho Corporativo (CPM) desenvolvida como projeto prático para a disciplina de *Laboratório de Empreendimentos Inovadores* (Análise e Desenvolvimento de Sistemas).

A solução permite que microempreendedores individuais (MEIs) e pequenas empresas façam a gestão de suas receitas, despesas, fluxo de caixa e projeções orçamentárias diretamente via áudio ou texto no **WhatsApp**, com processamento inteligente de dados e visualização consolidada em um **Painel Web**.

---

## 🎯 Requisitos & Funcionalidades do MVP

- [x] **Registro Inteligente via WhatsApp:** Envio de gastos e entradas em linguagem natural (texto/áudio).
- [x] **Processamento via IA:** Extração automática de valor, categoria, tipo (receita/despesa) e data.
- [x] **Dashboard de Desempenho (CPM):** Visualização de Receita Bruta, Despesas Operacionais e Lucro Líquido.
- [x] **Extrato em Tempo Real:** Tabela consolidada dos últimos lançamentos.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js, Tailwind CSS, Lucide Icons, Recharts
- **Backend & Banco de Dados:** Supabase (PostgreSQL), Node.js
- **Inteligência Artificial:** OpenAI API / Gemini API
- **Integração WhatsApp:** Evolution API / WhatsApp Webhook

---

## 👥 Matriz de Responsabilidades 

Por se tratar de um desenvolvimento em formato *solo*, as responsabilidades foram acumuladas e organizadas conforme as diretrizes da disciplina:

| Função Oficial | Responsável | Atribuições no Projeto |
| :--- | :--- | :--- |
| **Gerente de Produtos & Scrum Master** | *Raycka* | Gestão do Backlog no GitHub Projects e Build in Public |
| **Arquiteto & Analista de Requisitos** | *Raycka* | Mapeamento de RFs, RNF, DER e Arquitetura da Solução |
| **Desenvolvedor Backend & DB** | *Raycka* | Modelagem do Banco no Supabase e Webhook do WhatsApp/IA |
| **Desenvolvedor Frontend & UX/UI** | *Raycka* | Prototipação e Interface Web em React/Tailwind |

---

## 🚀 Build in Public

Acompanhe o desenvolvimento semanal do **MetricsFlow AI** no meu LinkedIn:
👉 [Acessar Perfil / Posts de Acompanhamento](https://www.linkedin.com/in/raycka-messa-de-castro-408264327)

metricsflow-ai/
├── public/
│   ├── logo-light.png          # Logo oficial (Fundo Claro)
│   └── logo-dark.png           # Logo oficial (Fundo Escuro)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout global com Fontes & Providers
│   │   ├── page.tsx            # Redirecionamento ou Landing Page
│   │   ├── (dashboard)/        # Grupo de rotas autenticadas (Layout Bitrix Style)
│   │   │   ├── layout.tsx      # Sidebar + Header Fixo da Plataforma
│   │   │   ├── page.tsx        # Dashboard CPM (Cards de DRE, Gráficos e Extrato)
│   │   │   └── transacoes/
│   │   │       └── page.tsx    # Tabela Detalhada de Lançamentos
│   │   └── api/
│   │       └── webhook/
│   │           └── route.ts    # Endpoint que recebe as mensagens do WhatsApp
│   ├── components/
│   │   ├── layout/             # Componentes de navegação
│   │   │   ├── Sidebar.tsx     # Menu Lateral (Estilo Bitrix24)
│   │   │   └── Header.tsx      # Topbar com resumo rápido e Perfil
│   │   ├── dashboard/          # Módulos visuais da Dashboard
│   │   │   ├── MetricCard.tsx  # Cards de Receita, Despesa e Saldo
│   │   │   ├── CPMChart.tsx    # Gráfico de Desempenho / DRE (Recharts)
│   │   │   └── TransactionTable.tsx # Tabela de extrato recente
│   │   └── ui/                 # Componentes genéricos de UI (Botões, Modais, Badges)
│   ├── lib/
│   │   ├── supabase/           # Cliente e helper de queries do Supabase
│   │   │   └── client.ts
│   │   └── ai/                 # Parser de Inteligência Artificial
│   │       └── parser.ts       # Tratamento de Prompts (Gemini/OpenAI)
│   └── types/
│       └── index.ts            # Tipagens TypeScript (Transacao, Empresa, DRE)
├── tailwind.config.ts
├── package.json
└── README.md