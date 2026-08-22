# MetricsFlow AI

> **CPM — Controle e Planejamento Financeiro para MEIs**

O **MetricsFlow AI** é uma plataforma de gestão financeira desenvolvida para **Microempreendedores Individuais (MEIs)**, com foco em simplificar o controle das movimentações financeiras e oferecer uma visão clara da saúde financeira do negócio.

A plataforma centraliza **receitas, despesas, categorias, histórico financeiro e análise por DRE**, permitindo que o empreendedor acompanhe seus resultados sem depender de planilhas complexas.

O projeto também possui uma arquitetura preparada para futuras integrações com **autenticação, banco de dados, WhatsApp e recursos de inteligência artificial**.

---

## 🎯 Objetivo

O objetivo do MetricsFlow AI é oferecer ao MEI uma ferramenta simples, visual e acessível para:

- Registrar receitas e despesas;
- Organizar movimentações por categorias;
- Consultar o histórico financeiro;
- Filtrar movimentações;
- Editar e excluir transações;
- Visualizar receitas, custos e despesas;
- Acompanhar o resultado financeiro;
- Analisar a evolução financeira através de gráficos;
- Gerar uma visão de DRE;
- Gerenciar informações da empresa;
- Gerenciar informações pessoais;
- Configurar preferências da plataforma;
- Futuramente registrar movimentações através do WhatsApp.

---

## 🚀 Funcionalidades

### 📊 Dashboard

O dashboard apresenta uma visão geral das informações financeiras da empresa, permitindo acompanhar rapidamente os principais indicadores.

Entre os dados apresentados estão:

- Receitas;
- Despesas;
- Saldo;
- Quantidade de movimentações;
- Desempenho financeiro.

---

### 💰 Movimentações

A área de movimentações concentra o controle das entradas e saídas financeiras.

#### Receitas

É possível registrar uma nova receita informando:

- Descrição;
- Valor;
- Categoria;
- Forma de pagamento;
- Data.

#### Despesas

O mesmo fluxo é utilizado para o registro de despesas.

#### Histórico

A plataforma apresenta as movimentações registradas em uma tabela com informações como:

- Tipo;
- Descrição;
- Categoria;
- Forma de pagamento;
- Data;
- Valor.

Também estão previstos recursos de:

- Busca;
- Filtros por tipo;
- Filtros por categoria;
- Filtros por período;
- Edição;
- Exclusão.

---

## 📈 DRE

A página de **DRE — Demonstração do Resultado do Exercício** apresenta uma visão consolidada da situação financeira da empresa.

A estrutura contempla:

- Receita;
- Custos;
- Despesas;
- Resultado;
- Gráficos;
- Distribuição por categorias;
- Comparação dos indicadores;
- Seleção de período.

A arquitetura da DRE foi desenvolvida de forma desacoplada para que os dados atualmente utilizados no frontend possam posteriormente ser substituídos pelos dados provenientes do backend.

---

## 👤 Perfil

A área de perfil permite visualizar e editar informações básicas da conta.

Atualmente contempla:

- Nome;
- E-mail;
- Telefone;
- Informações de segurança.

A autenticação e o gerenciamento real dos dados serão integrados posteriormente ao backend.

---

## 🏢 Empresa

A área de empresa será responsável pelo gerenciamento das informações relacionadas à organização.

A estrutura contempla:

- Informações da empresa;
- Dados cadastrais;
- Membros;
- Código de convite;
- Gerenciamento da equipe.

O sistema foi estruturado considerando diferentes papéis de acesso, como proprietário e colaborador.

---

## ⚙️ Preferências

A área de preferências concentra configurações relacionadas à experiência de utilização da plataforma.

A estrutura contempla:

- Aparência;
- Notificações;
- Preferências financeiras;
- Zona de ações sensíveis.

---

## 📱 WhatsApp

A integração com WhatsApp faz parte da evolução planejada do MetricsFlow AI.

A proposta é permitir que o MEI possa futuramente registrar movimentações financeiras através de mensagens, reduzindo a necessidade de acessar manualmente a plataforma.

Exemplo de fluxo futuro:

```text
Mensagem no WhatsApp
        ↓
Processamento da mensagem
        ↓
Interpretação dos dados
        ↓
Identificação da transação
        ↓
Confirmação
        ↓
Registro financeiro
```

Essa funcionalidade será integrada posteriormente ao backend e aos serviços responsáveis pelo processamento das mensagens.

---

# 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em **Next.js**, separando páginas e componentes por domínio funcional.

Estrutura simplificada:

```text
src/
├── app/
│   ├── dashboard/
│   ├── movimentacoes/
│   ├── dre/
│   ├── perfil/
│   ├── empresa/
│   └── preferencias/
│
├── components/
│   ├── dashboard/
│   ├── movimentacoes/
│   ├── dre/
│   ├── perfil/
│   ├── empresa/
│   └── preferencias/
│
└── ...
```

Essa organização facilita a manutenção e permite que cada área da aplicação evolua de forma independente.

---

# 🧩 Stack

O frontend foi desenvolvido utilizando tecnologias modernas do ecossistema JavaScript/TypeScript.

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **Recharts**

### Backend planejado

A camada de backend será integrada posteriormente, contemplando:

- Autenticação;
- Banco de dados;
- Controle de usuários;
- Empresas;
- Membros;
- Categorias;
- Transações;
- Integração com WhatsApp;
- Processamento de mensagens.

---

# 🗄️ Modelo de dados

A estrutura inicial do banco foi planejada considerando as seguintes entidades principais:

```text
companies
    │
    ├── company_members
    │
    ├── categories
    │
    └── transactions
             │
             └── whatsapp_messages
```

### Empresas

Representam as empresas/MEIs cadastrados na plataforma.

### Membros

Relacionam usuários às empresas e permitem definir seus papéis.

### Categorias

Permitem classificar receitas e despesas.

### Transações

Representam as entradas e saídas financeiras.

### Mensagens do WhatsApp

Armazenam o histórico das mensagens utilizadas posteriormente na integração com WhatsApp e processamento automatizado.

---

# 🔐 Segurança

O backend será estruturado utilizando controle de acesso por empresa.

A arquitetura prevista utiliza:

- Autenticação de usuários;
- Controle de membros;
- Papéis de acesso;
- Isolamento de dados por empresa;
- Row Level Security (RLS);
- Validação de dados;
- Controle de operações sobre transações.

O frontend atualmente utiliza dados mockados para permitir o desenvolvimento das interfaces antes da integração definitiva com o backend.

---

# 🛠️ Desenvolvimento

## Instalação

Clone o repositório:

```bash
git clone <https://github.com/Rayck4dev/MetricsFlow_AI.git>
```

Entre no diretório:

```bash
cd metricsflow-ai
```

Instale as dependências:

```bash
npm install
```

Execute o projeto em desenvolvimento:

```bash
npm run dev
```

---

# 📌 Status do projeto

### Frontend

O frontend encontra-se em fase de finalização das principais interfaces.

Atualmente estão estruturadas áreas como:

- [x] Dashboard
- [x] Movimentações
- [x] Cadastro de receitas
- [x] Cadastro de despesas
- [x] Edição de transações
- [x] Exclusão de transações
- [x] Filtros financeiros
- [x] Histórico de movimentações
- [x] DRE
- [x] Perfil
- [x] Empresa
- [x] Preferências
- [x] Estrutura inicial do WhatsApp

### Backend

A integração com backend será realizada posteriormente.

Planejamento:

- [ ] Configuração do projeto backend
- [ ] Configuração do banco
- [ ] Tabela de usuários
- [ ] Autenticação
- [ ] Login com Google
- [ ] Empresas
- [ ] Membros
- [ ] Categorias
- [ ] Transações
- [ ] CRUD de transações
- [ ] Filtros financeiros
- [ ] DRE com dados reais
- [ ] Integração com WhatsApp
- [ ] Processamento automatizado de mensagens

---

# 👤 Matriz de papéis acumulados

O MetricsFlow AI é desenvolvido individualmente. Dessa forma, todas as áreas necessárias para o desenvolvimento do projeto são acumuladas pela mesma desenvolvedora.

| Papel                | Responsabilidades                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Gestão / Produto** | Levantamento de requisitos, definição de funcionalidades, organização das tarefas e priorização do projeto |
| **UI/UX**            | Arquitetura visual, experiência de navegação, identidade visual, responsividade e componentes              |
| **Frontend**         | Desenvolvimento das páginas, componentização, estados, interações, validações e integração com dados       |
| **Backend**          | Desenvolvimento futuro das APIs, regras de negócio, autenticação e integrações                             |
| **Banco de Dados**   | Modelagem, relacionamentos, políticas de acesso, integridade e manutenção do banco                         |
| **QA / Testes**      | Testes funcionais, validação dos fluxos, identificação e correção de bugs                                  |
| **Documentação**     | README, documentação técnica, organização do projeto e registro das decisões                               |
| **DevOps / Deploy**  | Configuração do ambiente, versionamento, build, deploy e infraestrutura                                    |

### Desenvolvimento individual

Por se tratar de um projeto desenvolvido individualmente, as diferentes responsabilidades são acumuladas ao longo das etapas do projeto.

Essa abordagem permite que todas as decisões de **produto, design, desenvolvimento, banco de dados, testes e documentação** sejam centralizadas durante a construção do MetricsFlow AI.

---

# 🎯 Visão futura

O MetricsFlow AI pretende evoluir de uma plataforma de controle financeiro para um **assistente de gestão financeira voltado para MEIs**.

A evolução prevista inclui:

- Registro financeiro via WhatsApp;
- Automação de lançamentos;
- Análise financeira inteligente;
- Alertas;
- Insights sobre receitas e despesas;
- Auxílio na interpretação da DRE;
- Recomendações baseadas no comportamento financeiro.

A proposta é tornar a gestão financeira mais simples para quem precisa administrar o próprio negócio sem possuir conhecimentos avançados de contabilidade ou gestão financeira.

---

# 📄 Licença

Este projeto está licenciado sob a **MIT License**.

Consulte o arquivo [`LICENSE`](./LICENSE) para obter os termos completos da licença.

---

## MetricsFlow AI

**Controle. Analise. Cresça.**

Projeto desenvolvido como solução de **Controle e Planejamento Financeiro (CPM) para MEIs**.
