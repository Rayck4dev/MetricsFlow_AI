# 📐 Diagramas UML — MetricsFlow AI

Este documento reúne os diagramas UML do MetricsFlow AI, representando os principais atores, entidades e fluxos da aplicação.

Os diagramas devem ser mantidos alinhados ao código do frontend, backend e banco de dados. Funcionalidades ainda não implementadas são identificadas como planejadas.

---

# 👥 1. Diagrama de Caso de Uso

O diagrama apresenta as principais funcionalidades disponibilizadas aos usuários da plataforma.

```mermaid
flowchart LR
    Owner["👤 Proprietário"]
    Collaborator["👤 Colaborador"]

    subgraph System["MetricsFlow AI"]
        Auth(["Autenticar-se"])
        Dashboard(["Visualizar dashboard"])
        Transactions(["Gerenciar movimentações"])
        DRE(["Visualizar DRE"])
        Company(["Gerenciar empresa"])
        Members(["Gerenciar membros"])
        Profile(["Gerenciar perfil"])
        Preferences(["Configurar preferências"])
        Notifications(["Gerenciar notificações"])
        ReceiveNotifications(["Receber notificações"])
        Attachments(["Consultar anexos"])
    end

    Owner --> Auth
    Owner --> Dashboard
    Owner --> Transactions
    Owner --> DRE
    Owner --> Company
    Owner --> Members
    Owner --> Profile
    Owner --> Preferences
    Owner --> Notifications
    Owner --> Attachments

    Collaborator --> Auth
    Collaborator --> Dashboard
    Collaborator --> Transactions
    Collaborator --> Profile
    Collaborator --> Preferences
    Collaborator --> ReceiveNotifications
    Collaborator --> Attachments
```
---

# 📦 2. Diagrama de Classes

O diagrama representa as principais entidades do domínio financeiro e seus relacionamentos.

Os atributos abaixo refletem o modelo conceitual fornecido para a documentação. Antes de considerar o diagrama definitivo, é necessário conferir os campos com o esquema atual do banco de dados.

```mermaid
classDiagram
    direction LR

    class Profile {
        +UUID id
        +string name
        +string email
        +string phone
    }

    class Company {
        +UUID id
        +string name
        +string document
        +string phone
        +string inviteCode
        +Date createdAt
        +Date updatedAt
    }

    class CompanyMember {
        +UUID id
        +UUID companyId
        +UUID userId
        +UserRole role
        +Date createdAt
    }

    class Category {
        +UUID id
        +UUID companyId
        +string name
        +TransactionType type
        +string color
        +boolean isDefault
        +integer sortOrder
        +Date createdAt
    }

    class Transaction {
        +UUID id
        +UUID companyId
        +UUID categoryId
        +UUID createdByUserId
        +TransactionType type
        +decimal amount
        +string description
        +PaymentMethod paymentMethod
        +Date transactionDate
        +string origin
        +Date createdAt
        +Date updatedAt
    }

    class Notification {
        +UUID id
        +UUID userId
        +UUID actorUserId
        +UUID companyId
        +string type
        +string title
        +string message
        +boolean read
        +boolean dismissed
        +Date createdAt
    }

    class WhatsAppMessage {
        +UUID id
        +UUID transactionId
        +string message
        +string status
        +Date createdAt
    }

    class Attachment {
        +UUID id
        +UUID transactionId
    }

    Profile "1" --> "0..*" CompanyMember : participa
    Company "1" --> "0..*" CompanyMember : possui membros

    Company "1" --> "0..*" Category : possui
    Company "1" --> "0..*" Transaction : registra

    Category "1" --> "0..*" Transaction : classifica
    Profile "1" --> "0..*" Transaction : registra

    Profile "1" --> "0..*" Notification : recebe
    Company "1" --> "0..*" Notification : relaciona

    Transaction "1" --> "0..*" Attachment : possui anexos
    Transaction "1" --> "0..*" WhatsAppMessage : pode originar
```

## 2.1. Descrição das classes

| Classe            | Responsabilidade                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `Profile`         | Representa os dados de perfil do usuário.                                                     |
| `Company`         | Representa uma empresa cadastrada na plataforma.                                              |
| `CompanyMember`   | Relaciona usuários às empresas e registra seus papéis.                                        |
| `Category`        | Representa categorias utilizadas na classificação financeira.                                 |
| `Transaction`     | Representa uma movimentação financeira, como receita ou despesa.                              |
| `Notification`    | Representa notificações associadas a usuários e empresas, caso o recurso esteja implementado. |
| `WhatsAppMessage` | Representa mensagens relacionadas ao fluxo de WhatsApp, caso exista persistência para elas.   |
| `Attachment`      | Representa os metadados ou a referência de um anexo associado a uma movimentação.             |

---

# 🔄 3. Diagrama de Sequência — Movimentação Web

Este diagrama representa o fluxo de criação de uma movimentação pela interface web, desde o preenchimento do formulário até a atualização da interface.

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend as Next.js
    participant Auth as Supabase Auth
    participant API as NestJS API
    participant DB as PostgreSQL

    Usuario->>Frontend: Preenche movimentação
    Usuario->>Frontend: Confirma registro

    Frontend->>Auth: Obtém ou verifica sessão
    Auth-->>Frontend: Retorna estado da sessão

    Frontend->>API: Envia requisição autenticada
    API->>API: Valida identidade e autorização
    API->>DB: Consulta empresa e permissões
    DB-->>API: Retorna dados consultados

    alt Usuário autorizado
        API->>DB: Insere movimentação
        DB-->>API: Retorna movimentação criada
        API-->>Frontend: Retorna resultado da operação
        Frontend-->>Usuario: Atualiza interface
    else Usuário não autorizado
        API-->>Frontend: Retorna erro de acesso
        Frontend-->>Usuario: Exibe mensagem de erro
    end
```

## 3.1. Etapas do fluxo

1. O usuário preenche os dados da movimentação.
2. O frontend obtém ou verifica a sessão de autenticação.
3. O frontend envia a requisição para a API.
4. O backend verifica a identidade e as permissões necessárias.
5. A API consulta os dados da empresa e a autorização do usuário.
6. Se a operação for autorizada, a API registra a movimentação no banco.
7. O backend retorna o resultado.
8. O frontend atualiza a interface.

---

# 🤖 4. Diagrama de Sequência — Fluxo Futuro do WhatsApp

> **Status: integração oficial planejada.** Este diagrama descreve um fluxo futuro e não deve ser interpretado como confirmação de que a integração com a WhatsApp Cloud API está ativa em produção.

O módulo de demonstração pode ser utilizado para testar partes do processamento sem que isso signifique que o recebimento de mensagens reais pelo WhatsApp esteja concluído.

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant WhatsApp as WhatsApp
    participant Meta as Meta Cloud API
    participant API as NestJS API
    participant AI as Módulo de IA
    participant Provider as Provedor de IA
    participant DB as Supabase PostgreSQL

    Usuario->>WhatsApp: Envia mensagem
    WhatsApp->>Meta: Encaminha mensagem
    Meta->>API: Envia webhook

    API->>API: Identifica contexto e valida a solicitação

    alt Mensagem de texto
        API->>AI: Encaminha texto
        AI->>Provider: Solicita interpretação financeira
        Provider-->>AI: Retorna interpretação
    else Mensagem de áudio
        API->>AI: Encaminha áudio
        AI->>Provider: Solicita transcrição
        Provider-->>AI: Retorna texto transcrito
        AI->>Provider: Solicita interpretação financeira
        Provider-->>AI: Retorna interpretação
    end

    AI-->>API: Retorna resultado estruturado
    API->>API: Valida os dados e prepara confirmação
    API->>Meta: Solicita envio da mensagem de confirmação
    Meta->>WhatsApp: Entrega mensagem
    WhatsApp-->>Usuario: Exibe resumo para confirmação

    Usuario->>WhatsApp: Confirma movimentação
    WhatsApp->>Meta: Encaminha confirmação
    Meta->>API: Envia webhook de confirmação

    API->>API: Valida confirmação e autorização
    API->>DB: Registra movimentação
    DB-->>API: Retorna resultado

    API->>Meta: Solicita mensagem de sucesso
    Meta->>WhatsApp: Entrega confirmação
    WhatsApp-->>Usuario: Informa resultado do registro
```

---

# ⚙️ 5. Diagrama de Atividade — Registro de Movimentação

Este diagrama representa o processo de registro de uma movimentação pela plataforma web, incluindo a validação dos dados e a autorização da operação.

```mermaid
flowchart TD
    A([Início]) --> B["Usuário acessa Movimentações"]
    B --> C["Seleciona Receita ou Despesa"]
    C --> D["Preenche os dados"]
    D --> E{"Dados válidos?"}

    E -- "Não" --> F["Exibe erros de validação"]
    F --> D

    E -- "Sim" --> G["Envia solicitação ao backend"]
    G --> H["Valida autenticação e permissões"]
    H --> I{"Usuário autorizado?"}

    I -- "Não" --> J["Retorna erro de acesso"]
    J --> K([Fim])

    I -- "Sim" --> L["Registra transação no banco"]
    L --> M["Retorna resultado da operação"]
    M --> N["Atualiza a interface"]
    N --> O([Fim])
```

## 5.1. Descrição das etapas

| Etapa                      | Descrição                                                   |
| -------------------------- | ----------------------------------------------------------- |
| Início                     | O usuário inicia o processo de registro.                    |
| Seleção                    | Escolhe se a movimentação é uma receita ou uma despesa.     |
| Preenchimento              | Informa os dados necessários.                               |
| Validação dos dados        | Verifica se os campos atendem às regras de validação.       |
| Autenticação e autorização | O backend verifica a identidade e as permissões do usuário. |
| Registro                   | A API persiste a movimentação se a operação for autorizada. |
| Atualização                | O frontend apresenta o resultado ao usuário.                |
| Fim                        | O processo é concluído ou encerrado por erro de acesso.     |

---

# 📎 6. Diagrama de Sequência — Consulta de Anexos

Este diagrama representa a consulta de anexos associados a uma movimentação. O fluxo de acesso ao arquivo depende do serviço de armazenamento e das políticas efetivamente configuradas.

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend as Next.js
    participant API as NestJS API
    participant Auth as Autenticação e autorização
    participant DB as Supabase PostgreSQL
    participant Storage as Serviço de armazenamento

    Usuario->>Frontend: Solicita anexos da movimentação
    Frontend->>API: GET /api/transactions/:id/attachments

    API->>Auth: Verifica identidade e permissões
    Auth-->>API: Retorna resultado da verificação

    alt Acesso permitido
        API->>DB: Consulta metadados dos anexos
        DB-->>API: Retorna referências disponíveis
        opt Arquivos armazenados em serviço externo
            API->>Storage: Solicita arquivo ou acesso autorizado
            Storage-->>API: Retorna arquivo ou referência de acesso
        end
        API-->>Frontend: Retorna os dados disponíveis
        Frontend-->>Usuario: Apresenta os anexos
    else Acesso negado
        API-->>Frontend: Retorna erro de acesso
        Frontend-->>Usuario: Exibe mensagem de erro
    end
```

---

# 🧩 7. Relação entre os diagramas

Os diagramas representam perspectivas diferentes do mesmo sistema.

| Diagrama            | O que representa                                                        |
| ------------------- | ----------------------------------------------------------------------- |
| Caso de uso         | Os atores e as funcionalidades disponibilizadas.                        |
| Classes             | As entidades do domínio e seus relacionamentos.                         |
| Sequência web       | A interação entre frontend, autenticação, API e banco.                  |
| Sequência WhatsApp  | A integração oficial planejada para o processamento de mensagens.       |
| Atividade           | As etapas e decisões do processo de registro.                           |
| Sequência de anexos | A consulta aos metadados e, quando aplicável, aos arquivos armazenados. |
---
