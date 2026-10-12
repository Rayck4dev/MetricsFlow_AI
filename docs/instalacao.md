# 🛠️ Instalação e execução

> **Branch da avaliação: `v2`**
>
> O projeto completo utilizado para avaliação está disponível na branch `v2`.

---

## 1. Clonar o repositório

Clone o repositório e acesse a branch utilizada na avaliação:

```bash
git clone https://github.com/Rayck4dev/MetricsFlow_AI.git
cd MetricsFlow_AI
git switch v2
```

---

## 2. Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo:

```bash
.env.local
```

Configure as variáveis necessárias do Supabase e da API.

Exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Execute o projeto:

```bash
npm run dev -- -p 3002
```

O frontend estará disponível em:

```text
http://localhost:3002
```

---

## 3. Backend

Em outro terminal, entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo:

```bash
.env
```

Configure as variáveis necessárias para:

- Supabase;
- OpenAI (necessária para transcrever áudio; mensagens de texto podem usar o parser local);
- Configurações da API.


Exemplo:

```env
PORT=3001
SUPABASE_URL=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
OPENAI_FINANCIAL_MODEL=
OPENAI_TRANSCRIPTION_MODEL=
```

Execute o backend:

```bash
npm run start:dev
```

A API estará disponível em:

```bash
http://localhost:3001
```

---

## 4. API

Health Check

O endpoint de health check pode ser utilizado para verificar se o backend está funcionando corretamente:

```bash
http://localhost:3001/api/health
```

### Swagger

A API possui documentação interativa utilizando Swagger / OpenAPI:

```bash
http://localhost:3001/api/docs
```

## 5. Demonstração do WhatsApp

A demonstração interativa está disponível em:

```text
http://localhost:3002/whatsapp/demo
```

Ela requer uma sessão autenticada, uma empresa vinculada ao usuário e as
variáveis do Supabase configuradas no frontend e no backend. O envio de texto
usa o parser local quando `OPENAI_API_KEY` não está configurada. Para gravar e
transcrever áudio, configure uma chave da OpenAI no backend.

Esta tela simula a interface do WhatsApp Web: não conecta à Meta nem envia
mensagens pelo WhatsApp. As mensagens da demonstração são salvas na conta
autenticada e uma movimentação só é registrada após confirmação. Não use dados
financeiros reais durante a apresentação.

---

## 6. Portas

| Aplicação		            | Endereço
|---------------------------|-------------|
| Frontend Next.js	        | http://localhost:3002
| Backend NestJS	        | http://localhost:3001
| Health Check	            | http://localhost:3001/api/health
| Swagger	                | http://localhost:3001/api/docs

O frontend utiliza a seguinte variável para localizar o backend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 🔐 7. Variáveis de ambiente

Os arquivos de ambiente são utilizados para armazenar configurações e credenciais que não devem ser expostas no código-fonte.

#### Frontend

```bash
frontend/.env.local
```

#### Backend

```bash
backend/.env
```

Esses arquivos não devem ser versionados no Git.

As principais configurações podem incluir:

- URL do Supabase;
- chave pública do Supabase;
- URL da API;
- chave da OpenAI;
- configurações da Meta / WhatsApp (somente para a integração oficial, fora desta demonstração);
- tokens e segredos de integração;
- porta do backend.

### 🌿 8. Branch utilizada na avaliação

A versão completa utilizada durante a avaliação está disponível na branch:

```bash
v2
```

Para acessar:

```bash
git switch v2
```

A branch v2 contém a versão completa utilizada como referência para a demonstração do projeto.

### ⚠️ 9. Observações

O frontend e o backend são executados separadamente.

É necessário manter os dois processos ativos durante a utilização completa da aplicação:

```bash
Frontend
   ↓
localhost:3002
   ↓
Backend
   ↓
localhost:3001
   ↓
Supabase / serviços externos
```
A integração oficial com WhatsApp/Meta continua fora do escopo desta demonstração e depende de configuração própria.