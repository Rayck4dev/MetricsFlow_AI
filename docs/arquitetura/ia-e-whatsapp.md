# 🧠 Inteligência Artificial

A V2 introduz uma camada de inteligência artificial preparada para interpretar mensagens financeiras.

A responsabilidade da IA é **interpretar informações**, e não executar diretamente operações no banco.

Fluxo conceitual:

```text
Mensagem
   ↓
IA
   ↓
JSON estruturado
   ↓
Validação do Backend
   ↓
Regras de negócio
   ↓
Confirmação
   ↓
Banco de dados
```

A estrutura de interpretação contempla informações como:

```json
{
  "intent": "create_transaction",
  "type": "income",
  "amount": 850,
  "description": "Projeto de criação de site",
  "categoryId": null,
  "categoryName": null,
  "paymentMethod": null,
  "transactionDate": null,
  "confidence": 0.95,
  "missingFields": []
}
```

A aplicação deve validar a resposta antes de qualquer persistência.

A IA não deve:

- Criar categorias inexistentes;
- Inventar informações;
- Registrar uma movimentação sem confirmação;
- Ignorar campos obrigatórios;
- Bypassar as regras de autorização.

---

# 📱 WhatsApp

A integração com WhatsApp é a principal funcionalidade ainda pendente da V2.

A arquitetura do backend já possui a estrutura necessária para receber e processar mensagens, porém a integração completa com a plataforma do WhatsApp ainda não está concluída.

O fluxo planejado é:

```text
                 WHATSAPP
                     │
                     ▼
              Meta Cloud API
                     │
                     ▼
                  Webhook
                     │
                     ▼
             NestJS Backend
                     │
                     ▼
             Identificação
             do usuário
                     │
                     ▼
          Identificação da empresa
                     │
                     ▼
          Processamento da mensagem
                     │
              ┌──────┴──────┐
              ▼             ▼
            Texto          Áudio
              │             │
              │       Transcrição
              │             │
              └──────┬──────┘
                     ▼
               IA / Parser
                     │
                     ▼
             Dados estruturados
                     │
                     ▼
               Validação
                     │
                     ▼
              Confirmação
                     │
              ┌──────┴──────┐
              ▼             ▼
          Confirmar       Corrigir/
              │           Cancelar
              ▼
            Supabase
              │
              ▼
          Transação
              │
              ▼
          Dashboard
```

### Regra principal

Nenhuma movimentação deverá ser registrada apenas porque a IA interpretou uma mensagem.

O fluxo previsto exige:

```text
Interpretar
    ↓
Validar
    ↓
Solicitar confirmação
    ↓
Usuário confirma
    ↓
Registrar
```

---
