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
- OpenAI;
- WhatsApp / Meta Cloud API;
- Segredos de integração;
- Configurações da API.


Exemplo:

```env
PORT=3001
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

---  

## 5. Portas

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

### 🔐 6. Variáveis de ambiente

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
- configurações da Meta / WhatsApp;
- tokens e segredos de integração;
- porta do backend.

### 🌿 7. Branch utilizada na avaliação

A versão completa utilizada durante a avaliação está disponível na branch:

```bash
v2
```

Para acessar:

```bash
git switch v2
```

A branch v2 contém a versão completa utilizada como referência para a demonstração do projeto.

### ⚠️ 8. Observações

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
A integração com WhatsApp e os recursos de inteligência artificial fazem parte da evolução da V2 e dependem das respectivas variáveis de ambiente e configurações dos serviços externos.