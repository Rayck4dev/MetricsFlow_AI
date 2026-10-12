# 🌐 API — MetricsFlow AI

## Prefixo

```text
/api
```

## Endpoints

```text
GET    /api
GET    /api/health
GET    /api/supabase/test

GET    /api/companies
POST   /api/companies
GET    /api/companies/:companyId/members

GET    /api/transactions
POST   /api/transactions
PATCH  /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/categories

GET    /api/whatsapp/connection
POST   /api/whatsapp/connection

GET    /api/whatsapp/demo/messages
POST   /api/whatsapp/demo
POST   /api/whatsapp/demo/audio
POST   /api/whatsapp/confirm

GET    /api/whatsapp/webhook
POST   /api/whatsapp/webhook
```

Os endpoints `/api/whatsapp/demo/*` exigem autenticação e atendem à
demonstração interativa sem conexão com a Meta. O endpoint de áudio recebe um
arquivo multipart no campo `audio` e o transcreve usando a OpenAI.

## Swagger

```text
http://localhost:3001/api/docs
```
