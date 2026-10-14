# 🧠 Inteligência Artificial

O MetricsFlow AI utiliza uma camada de inteligência artificial para auxiliar na interpretação de mensagens financeiras e na extração de informações necessárias para o registro de movimentações.

A integração com a **Groq** é utilizada para disponibilizar os modelos de linguagem e transcrição de áudio, permitindo processar mensagens em texto ou áudio e transformar essas informações em dados estruturados que podem ser validados pelo backend.

## Modelos utilizados

Os modelos são configurados por variáveis de ambiente, permitindo alterar as versões utilizadas sem precisar modificar diretamente a lógica de negócio.

| Variável                     | Finalidade                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `GROQ_FINANCIAL_MODEL`     | Define o modelo utilizado na interpretação de mensagens financeiras pela Groq. |
| `GROQ_TRANSCRIPTION_MODEL` | Define o modelo utilizado na transcrição de áudios pela Groq.                  |

**Configuração prevista:**

```env
GROQ_FINANCIAL_MODEL=SEU_MODELO_FINANCEIRO_GROQ
GROQ_TRANSCRIPTION_MODEL=SEU_MODELO_TRANSCRICAO_GROQ
```

## Interpretação de mensagens financeiras

A camada de inteligência artificial pode interpretar mensagens em linguagem natural para identificar informações relevantes de uma movimentação, como:

- Tipo de movimentação: receita ou despesa.
- Valor informado.
- Descrição da movimentação.
- Categoria, quando identificada.
- Forma de pagamento, quando informada.
- Data da movimentação, quando identificada.
- Campos ausentes que precisam ser preenchidos.

Exemplo conceitual de dados estruturados:

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

O exemplo é ilustrativo. A estrutura definitiva depende do contrato implementado pelo backend.

## Transcrição de áudio

A aplicação prevê o envio de mensagens de áudio para transcrição utilizando o modelo `whisper-large-v3-turbo`, disponibilizado pela Groq.

Após a transcrição, o texto pode seguir para a etapa de interpretação financeira. Dessa forma, mensagens de áudio podem ser convertidas em informações estruturadas para posterior validação.

O processamento depende da configuração correta das credenciais, do modelo e do serviço de transcrição no backend.

## Regras de processamento

A inteligência artificial atua como uma camada de interpretação, não como substituta das regras de negócio da aplicação.

O fluxo previsto é:

1. Receber uma mensagem em texto ou áudio.
2. Transcrever o áudio, quando necessário.
3. Interpretar a mensagem e extrair os dados financeiros.
4. Validar os campos e as regras de negócio no backend.
5. Solicitar confirmação quando aplicável.
6. Registrar a movimentação após a confirmação necessária.

A aplicação deve evitar registros baseados em informações inventadas, categorias inexistentes, campos obrigatórios ausentes ou dados que não tenham passado pelas validações necessárias.

## Demonstração do WhatsApp

O projeto possui uma interface de demonstração para simular o fluxo de envio e processamento de mensagens financeiras.

A demonstração permite explorar o processamento de mensagens sem depender de uma conexão de produção com a plataforma WhatsApp.

**Importante:** a demonstração não representa, por si só, uma integração oficial ativa com a WhatsApp Business Platform ou com a Meta Cloud API. A integração de produção depende da implementação e configuração dos mecanismos oficiais de conexão, recebimento e envio de mensagens.

Durante apresentações e testes, recomenda-se utilizar dados financeiros fictícios.

## Responsabilidades da arquitetura

A divisão de responsabilidades segue o princípio de manter a inteligência artificial separada das regras de negócio:

- **Interface:** coleta a mensagem e apresenta o resultado ao usuário.
- **Serviços de IA:** realizam a transcrição e a interpretação dos dados.
- **Backend:** valida as informações, aplica as regras de negócio e controla o fluxo de confirmação.
- **Banco de dados:** armazena as movimentações autorizadas após o processamento necessário.

## Evolução da integração

A configuração dos modelos, os contratos de dados e o fluxo de processamento podem evoluir durante o desenvolvimento da versão atual do projeto. Esta documentação deve ser atualizada conforme os serviços de inteligência artificial e a integração oficial com o WhatsApp forem implementados e validados.
