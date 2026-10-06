# 🔐 Autenticação

O sistema utiliza **Supabase Auth** para autenticação e gerenciamento de sessões.

A estrutura contempla:

- Login;
- Cadastro;
- Login com Google;
- Callback de autenticação;
- Recuperação de senha;
- Redefinição de senha;
- Persistência da sessão;
- Identificação do usuário autenticado;
- Identificação da empresa vinculada;
- Controle de acesso por papel.

O vínculo entre usuário e empresa é estabelecido através da tabela:

```text
auth.users
    │
    ▼
company_members
    │
    ▼
companies
```

---

# 👥 Controle de acesso

O acesso às funcionalidades é determinado pelo papel do usuário dentro da empresa.

```text
                    Usuário autenticado
                            │
                            ▼
                    company_members
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
              owner              collaborator
                 │                     │
                 ▼                     ▼
        Acesso administrativo    Acesso financeiro
```

## Proprietário

Possui acesso a:

- Dashboard;
- Movimentações;
- DRE;
- Perfil;
- Empresa;
- Membros;
- Preferências;
- Operações administrativas.

## Colaborador

Possui acesso a:

- Dashboard;
- Movimentações;
- Perfil;
- Preferências.

Operações administrativas e ações restritas são controladas de acordo com o papel do usuário.

---

# 🔒 Segurança

A arquitetura utiliza múltiplas camadas de proteção.

São utilizados:

- Supabase Auth;
- Controle de sessão;
- Controle de membros;
- Papéis de acesso;
- Row Level Security;
- Validação de dados;
- Integridade referencial;
- Funções PostgreSQL;
- Triggers;
- Validação no backend;
- Separação de variáveis de ambiente;
- Segredos mantidos no backend.

A relação de autorização principal é:

```text
auth.uid()
    ↓
company_members
    ↓
company_id
    ↓
dados autorizados
```

Dessa forma, o usuário somente deve acessar dados das empresas às quais está vinculado.

---

# 🔐 Arquitetura de autenticação

```text
Usuário
   ↓
Next.js
   ↓
Supabase Auth
   ↓
Sessão autenticada
   ↓
Usuário
   ↓
company_members
   ↓
Empresa + Role
   ↓
Permissões
```

Quando necessário, o backend valida o token de autenticação antes de executar operações protegidas.

---
