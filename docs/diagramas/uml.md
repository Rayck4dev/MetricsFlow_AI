# 📐 Diagramas UML — MetricsFlow AI

# 👥 Diagrama de Caso de Uso

```mermaid
flowchart LR

    Owner["👤 Proprietário"]
    Collaborator["👤 Colaborador"]

    System(("MetricsFlow AI"))

    Owner -->|Autenticar-se| System
    Owner -->|Visualizar dashboard| System
    Owner -->|Gerenciar movimentações| System
    Owner -->|Visualizar DRE| System
    Owner -->|Gerenciar empresa| System
    Owner -->|Gerenciar membros| System
    Owner -->|Gerenciar perfil| System
    Owner -->|Configurar preferências| System
    Owner -->|Gerenciar notificações| System

    Collaborator -->|Autenticar-se| System
    Collaborator -->|Visualizar dashboard| System
    Collaborator -->|Gerenciar movimentações| System
    Collaborator -->|Gerenciar perfil| System
    Collaborator -->|Configurar preferências| System
    Collaborator -->|Receber notificações| System
```

---

# 📦 Diagrama de Classes

```mermaid
classDiagram

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

    Profile "1" --> "*" CompanyMember : participa
    Company "1" --> "*" CompanyMember : possui
    Company "1" --> "*" Category : possui
    Company "1" --> "*" Transaction : possui
    Category "1" --> "*" Transaction : classifica
    Profile "1" --> "*" Transaction : registra
    Profile "1" --> "*" Notification : recebe
    Company "1" --> "*" Notification : relaciona
    Transaction "1" --> "*" WhatsAppMessage : poderá originar
```

---

# 🔄 Diagrama de Sequência — Movimentação Web

```mermaid
sequenceDiagram

    actor Usuario
    participant Frontend as Next.js
    participant Auth as Supabase Auth
    participant API as NestJS API
    participant DB as PostgreSQL

    Usuario->>Frontend: Preenche movimentação
    Usuario->>Frontend: Confirma

    Frontend->>Auth: Verifica sessão
    Auth-->>Frontend: Usuário autenticado

    Frontend->>API: Envia dados
    API->>DB: Valida empresa e permissões
    DB-->>API: Operação autorizada

    API->>DB: Insere transação
    DB-->>API: Transação criada

    API-->>Frontend: Retorna resultado
    Frontend-->>Usuario: Atualiza interface
```

---

# 🤖 Diagrama de Sequência — Fluxo futuro do WhatsApp

> Este fluxo representa a arquitetura planejada. A integração efetiva com o WhatsApp ainda não está concluída.

```mermaid
sequenceDiagram

    actor Usuario

    participant WhatsApp as WhatsApp
    participant Meta as Meta Cloud API
    participant API as NestJS
    participant AI as AI API
    participant DB as Supabase

    Usuario->>WhatsApp: Envia mensagem
    WhatsApp->>Meta: Mensagem
    Meta->>API: Webhook

    API->>API: Identifica usuário e empresa

    alt Texto
        API->>AI: Envia texto
    else Áudio
        API->>AI: Solicita transcrição
        AI-->>API: Texto transcrito
        API->>AI: Interpreta texto
    end

    AI-->>API: JSON estruturado

    API->>API: Valida dados
    API->>WhatsApp: Solicita confirmação

    Usuario->>WhatsApp: Confirma

    WhatsApp->>Meta: Confirmação
    Meta->>API: Webhook

    API->>DB: Registra transação
    DB-->>API: Transação criada

    API->>WhatsApp: Confirma lançamento
```

---

# ⚙️ Diagrama de Atividade

## Registro de movimentação pela plataforma

```mermaid
flowchart TD

    A([Início])
    B[Usuário acessa Movimentações]
    C[Seleciona Receita ou Despesa]
    D[Preenche dados]
    E{Dados válidos?}
    F[Exibir erros]
    G[Verificar autenticação]
    H{Usuário autorizado?}
    I[Negar operação]
    J[Registrar transação]
    K[Gerar atualização]
    L[Atualizar interface]
    M([Fim])

    A --> B
    B --> C
    C --> D
    D --> E

    E -->|Não| F
    F --> D

    E -->|Sim| G
    G --> H

    H -->|Não| I
    I --> M

    H -->|Sim| J
    J --> K
    K --> L
    L --> M
```

---
