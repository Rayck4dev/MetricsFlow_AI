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

A aplicação inclui uma demonstração interativa da experiência de conversa em
`/whatsapp/demo`. Ela processa mensagens de texto pelo backend, permite gravar
áudio no navegador e usa o serviço de transcrição da OpenAI antes de interpretar
a mensagem.

> **A demonstração não é uma conexão com o WhatsApp nem com a Meta Cloud API.**
> As mensagens são salvas na conta autenticada e a confirmação registra a
> movimentação na empresa ativa. Áudios enviados são encaminhados à OpenAI
> para transcrição. Use dados fictícios ao apresentar a demonstração.

Mensagens de texto podem usar o parser local quando `OPENAI_API_KEY` não está
configurada. O envio e a transcrição de áudio requerem essa chave no backend.

A integração de produção com a Meta é uma etapa separada e permanece pendente.
Ela envolve webhook público, verificação da conexão e entrega de mensagens
reais, não cobertas pela demonstração.

### Fluxo da demonstração

```text
          Interface demonstrativa
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
              │          OpenAI
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
