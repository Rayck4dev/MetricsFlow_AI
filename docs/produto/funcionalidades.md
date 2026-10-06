# 🚀 Funcionalidades — MetricsFlow AI

O MetricsFlow AI é uma plataforma de gestão financeira desenvolvida para Microempreendedores Individuais (MEIs), com foco em simplificar o controle financeiro e oferecer uma visão clara da situação do negócio.

---

## 🎯 Objetivo

O objetivo do MetricsFlow AI é oferecer ao MEI uma ferramenta simples, visual e acessível para:

- Registrar receitas;
- Registrar despesas;
- Organizar movimentações por categorias;
- Consultar o histórico financeiro;
- Buscar movimentações;
- Filtrar movimentações;
- Editar transações;
- Excluir transações;
- Visualizar receitas, custos e despesas;
- Acompanhar o resultado financeiro;
- Analisar a evolução financeira através de gráficos;
- Visualizar uma DRE simplificada;
- Gerenciar informações da empresa;
- Gerenciar membros da empresa;
- Gerenciar informações pessoais;
- Configurar preferências;
- Controlar diferentes níveis de acesso;
- Receber notificações financeiras;
- Exportar informações financeiras;
- Preparar o sistema para registro financeiro através do WhatsApp;
- Preparar o sistema para interpretação de mensagens utilizando inteligência artificial.

---

# 📊 Dashboard

O dashboard apresenta uma visão geral da situação financeira da empresa atualmente selecionada.

Entre os principais indicadores estão:

- Faturamento;
- Receitas;
- Despesas;
- Lucro;
- Margem;
- Quantidade de movimentações;
- Evolução financeira;
- Gráficos;
- Resumo financeiro;
- Transações recentes;
- Ações rápidas.

Os dados são obtidos a partir das movimentações financeiras vinculadas à empresa.

A arquitetura também permite que os dados sejam atualizados conforme novas movimentações são registradas.

---

# 💰 Movimentações

A área de movimentações concentra o gerenciamento das entradas e saídas financeiras.

## Receitas

É possível registrar uma nova receita informando:

- Descrição;
- Valor;
- Categoria;
- Forma de pagamento;
- Data.

## Despesas

O mesmo fluxo é utilizado para registrar despesas.

## Histórico

As movimentações são apresentadas em uma tabela contendo:

- Tipo;
- Descrição;
- Categoria;
- Forma de pagamento;
- Data;
- Valor.

Também estão disponíveis:

- Busca;
- Filtro por tipo;
- Filtro por categoria;
- Filtro por período;
- Edição;
- Exclusão;
- Exportação para CSV.

As movimentações possuem uma origem, permitindo diferenciar registros realizados pela plataforma web de futuras movimentações provenientes de integrações externas.

---

# 📈 DRE

A página de **DRE — Demonstração do Resultado do Exercício** apresenta uma visão consolidada do desempenho financeiro da empresa.

A estrutura contempla:

- Receita;
- Custos;
- Despesas;
- Resultado;
- Margem;
- Distribuição por categorias;
- Comparação de indicadores;
- Gráficos;
- Seleção de período;
- Exportação dos dados para CSV.

A DRE utiliza as movimentações financeiras registradas para calcular os principais indicadores do período selecionado.

---

# 👤 Perfil

A área de perfil permite que o usuário visualize e gerencie suas informações pessoais.

Contempla:

- Nome;
- E-mail;
- Telefone;
- Informações da conta;
- Segurança.

A autenticação e a sessão do usuário são gerenciadas pelo **Supabase Auth**.

---

# 🏢 Empresa

A área de empresa concentra as informações relacionadas à organização.

Contempla:

- Dados da empresa;
- Dados cadastrais;
- Membros;
- Código de convite;
- Gerenciamento da equipe;
- Papéis de acesso.

O sistema utiliza atualmente dois papéis principais:

## Proprietário

Possui acesso administrativo à empresa e às funcionalidades restritas.

## Colaborador

Pode utilizar as funcionalidades financeiras disponibilizadas aos membros, mas possui permissões diferentes das do proprietário.

A autorização é determinada pelo vínculo existente entre o usuário e a empresa através de `company_members`.

---

# ⚙️ Preferências

A área de preferências concentra configurações relacionadas à experiência de utilização da plataforma.

Entre elas:

- Aparência;
- Notificações;
- Preferências financeiras;
- Período financeiro padrão;
- Moeda;
- Configurações relacionadas à conta;
- Área para ações sensíveis.

As preferências financeiras são persistidas no banco de dados.

---

# 🔔 Notificações

O MetricsFlow possui um sistema de notificações integrado ao banco de dados.

As notificações podem informar eventos relacionados às movimentações financeiras e ao funcionamento da plataforma.

A estrutura contempla:

- Notificações por usuário;
- Identificação da empresa;
- Identificação do usuário responsável pela ação;
- Estado de leitura;
- Estado de arquivamento;
- Data de criação;
- Preferências de recebimento.

O sistema diferencia notificações de demonstração das notificações reais do usuário autenticado.

As notificações relacionadas a movimentações respeitam as preferências configuradas pelo usuário.

---

# 🔐 Autenticação

O sistema utiliza **Supabase Auth** para autenticação e gerenciamento de sessões.

A estrutura contempla:

- Login;
- Cadastro;
- Login com Google;
- Callback de autenticação;
- Recuperação de senha;
- Redefinição de senha;
- Persistência da sessão;
- Identificação do usuário autenticado;
- Identificação da empresa vinculada;
- Controle de acesso por papel.

O vínculo entre usuário e empresa é estabelecido através da estrutura:

```text
auth.users
    │
    ▼
company_members
    │
    ▼
companies
```

# 👥 Controle de acesso

O acesso às funcionalidades é determinado pelo papel do usuário dentro da empresa.

                    Usuário autenticado
                            │
                            ▼
                    company_members
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
               owner              collaborator
                 │                     │
                 ▼                     ▼
        Acesso administrativo    Acesso financeiro


### Proprietário

Possui acesso a:

- Dashboard;
- Movimentações;
- DRE;
- Perfil;
- Empresa;
- Membros;
- Preferências;
- Operações administrativas.

### Colaborador

Possui acesso a:

- Dashboard;
- Movimentações;
- Perfil;
- Preferências.

Operações administrativas e ações restritas são controladas de acordo com o papel do usuário.

---

# 🧭 Onboarding

O sistema possui um fluxo de onboarding para configuração inicial da empresa.

O processo permite:

```text
Cadastro
   ↓
Autenticação
   ↓
Onboarding
   ↓
Criação / identificação da empresa
   ↓
Vínculo do usuário
   ↓
Configuração inicial
   ↓
Categorias padrão
   ↓
Dashboard
```

A criação da empresa e o vínculo do usuário como proprietário são tratados através das regras do banco e da aplicação.

---

# 📱 WhatsApp

A integração com WhatsApp faz parte da evolução da V2 do MetricsFlow AI.

A proposta é permitir o registro de movimentações financeiras através de mensagens de texto ou áudio.

Fluxo planejado:

```text
WhatsApp
    ↓
Mensagem de texto ou áudio
    ↓
Backend
    ↓
Interpretação / transcrição
    ↓
Validação
    ↓
Confirmação do usuário
    ↓
Registro da movimentação
    ↓
Supabase
    ↓
Dashboard
```

A movimentação somente deve ser registrada após a confirmação do usuário.

---

# 🤖 Inteligência Artificial

A V2 possui estrutura preparada para utilização de inteligência artificial na interpretação de mensagens financeiras.

A IA pode auxiliar na identificação de informações como:

- Tipo da movimentação;
- Valor;
- Descrição;
- Categoria;
- Forma de pagamento;
- Data.

A inteligência artificial é responsável pela interpretação das informações fornecidas pelo usuário.

As validações e regras de negócio permanecem sob responsabilidade da aplicação antes da persistência dos dados.

---

# 🔄 Fluxo geral

O funcionamento geral da plataforma pode ser representado da seguinte forma:

                    Usuário
                       │
                       ▼
                ┌─────────────┐
                │  Frontend   │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Backend   │
                │   NestJS    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  Supabase   │
                │ PostgreSQL  │
                └──────┬──────┘
                       │
                       ▼
               Dados financeiros

Na evolução com WhatsApp:

```text
WhatsApp
    │
    ▼
Backend
    │
    ├── IA / Transcrição
    │
    ▼
Validação
    │
    ▼
Confirmação
    │
    ▼
Transação
    │
    ▼
Supabase
    │
    ▼
Dashboard
```

---

# 📌 Resumo das funcionalidades

Área | Principais funcionalidades
---|---
Dashboard | Indicadores, gráficos, resumo e transações recentes
Movimentações | Receitas, despesas, filtros, busca, edição, exclusão e CSV
DRE | Receita, custos, despesas, resultado, margem, gráficos e CSV
Perfil | Dados pessoais e informações da conta
Empresa | Dados, membros, convite e papéis
Preferências | Aparência, notificações e preferências financeiras
Notificações | Eventos financeiros e preferências de recebimento
Autenticação | Login, cadastro, Google e recuperação de senha
Controle de acesso | Proprietário e colaborador
Onboarding | Configuração inicial da empresa
WhatsApp | Estrutura para mensagens e registro financeiro
IA | Interpretação de informações financeiras