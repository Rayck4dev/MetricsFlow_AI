# 🌐 API — MetricsFlow AI

## Prefixo

Todos os endpoints da API utilizam o prefixo `/api`.

## Endpoints

> **Aviso:** os endpoints e seus contratos estão sujeitos a alterações durante o desenvolvimento. Esta tabela representa o estado atual da API e poderá ser atualizada conforme a evolução do projeto, especialmente nos módulos de WhatsApp e Inteligência Artificial.

### Geral e infraestrutura

| Método | Endpoint             | Descrição                                    |
| ------ | -------------------- | -------------------------------------------- |
| `GET`  | `/api`               | Endpoint raiz da API.                        |
| `GET`  | `/api/health`        | Verifica o estado da API.                    |
| `GET`  | `/api/supabase/test` | Endpoint de teste da conexão com o Supabase. |

### Empresas

| Método | Endpoint                            | Descrição                                                      |
| ------ | ----------------------------------- | -------------------------------------------------------------- |
| `GET`  | `/api/companies`                    | Consulta as empresas disponíveis conforme as regras de acesso. |
| `POST` | `/api/companies`                    | Cria uma empresa.                                              |
| `GET`  | `/api/companies/:companyId/members` | Consulta os membros de uma empresa específica.                 |

### Transações

| Método   | Endpoint                            | Descrição                                      |
| -------- | ----------------------------------- | ---------------------------------------------- |
| `GET`    | `/api/transactions`                 | Consulta as transações.                        |
| `POST`   | `/api/transactions`                 | Cria uma transação.                            |
| `PATCH`  | `/api/transactions/:id`             | Atualiza uma transação existente.              |
| `DELETE` | `/api/transactions/:id`             | Exclui uma transação.                          |
| `GET`    | `/api/transactions/:id/attachments` | Consulta os anexos associados a uma transação. |

### Categorias

| Método | Endpoint          | Descrição                           |
| ------ | ----------------- | ----------------------------------- |
| `GET`  | `/api/categories` | Consulta as categorias disponíveis. |

### WhatsApp

| Método | Endpoint                      | Descrição                                                    |
| ------ | ----------------------------- | ------------------------------------------------------------ |
| `GET`  | `/api/whatsapp/connection`    | Consulta o estado da conexão com o WhatsApp.                 |
| `POST` | `/api/whatsapp/connection`    | Executa uma operação relacionada à conexão com o WhatsApp.   |
| `GET`  | `/api/whatsapp/demo/messages` | Consulta as mensagens da demonstração interativa.            |
| `POST` | `/api/whatsapp/demo`          | Processa uma interação no ambiente de demonstração.          |
| `POST` | `/api/whatsapp/demo/audio`    | Recebe um arquivo de áudio para processamento e transcrição. |
| `POST` | `/api/whatsapp/confirm`       | Processa uma solicitação de confirmação.                     |
| `GET`  | `/api/whatsapp/webhook`       | Endpoint de verificação do webhook.                          |
| `POST` | `/api/whatsapp/webhook`       | Recebe eventos por meio do webhook.                          |

## Integração com WhatsApp

Nesta etapa do projeto, não foi possível viabilizar a integração direta com a API oficial da Meta. Como alternativa, foi adotada uma abordagem baseada em um **ambiente de demonstração interativa**, permitindo apresentar e validar o fluxo de utilização sem depender de uma conexão ativa com a plataforma.

A demonstração utiliza recursos de Inteligência Artificial no processamento das interações, incluindo a transcrição de mensagens de áudio por meio da OpenAI. Essa abordagem permite demonstrar os fluxos previstos para a solução, sem representar uma conexão efetiva com a infraestrutura oficial do WhatsApp.

A estratégia de integração poderá ser reavaliada em etapas futuras, conforme a evolução do projeto e a viabilidade técnica.

## Observações sobre a Inteligência Artificial

A documentação dos recursos de Inteligência Artificial previstos para a **versão 2 (V2)** será revisada e complementada posteriormente, conforme a definição dos fluxos, das funcionalidades e dos contratos da API.

As funcionalidades planejadas para essa versão não devem ser consideradas definitivas até que sua implementação e documentação sejam atualizadas.

## Swagger

A documentação interativa da API está disponível no ambiente local:

[http://localhost:3001/api/docs](http://localhost:3001/api/docs)
