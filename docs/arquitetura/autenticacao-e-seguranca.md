# 🔐 Autenticação

O sistema utiliza o **Supabase Auth** para autenticação de usuários e gerenciamento de sessões.

A estrutura da aplicação contempla os seguintes fluxos e recursos:

- Login;
- Cadastro;
- Login com Google;
- Callback de autenticação;
- Recuperação e redefinição de senha;
- Persistência da sessão;
- Identificação do usuário autenticado;
- Identificação da empresa vinculada;
- Controle de acesso baseado em papéis (_roles_).

O relacionamento entre usuários e empresas é estabelecido por meio das tabelas `auth.users`, `company_members` e `companies`.

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

O acesso às funcionalidades é definido pelo papel do usuário no contexto da empresa.

```text
                Usuário autenticado
                        │
                        ▼
                 company_members
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
            owner             collaborator
              │                   │
              ▼                   ▼
      Acesso administrativo  Acesso financeiro
```

## Proprietário (`owner`)

O proprietário possui acesso às funcionalidades administrativas e financeiras previstas para o seu papel, incluindo:

- Dashboard;
- Movimentações;
- DRE;
- Perfil;
- Empresa;
- Gerenciamento de membros;
- Preferências;
- Operações administrativas autorizadas.

## Colaborador (`collaborator`)

O colaborador possui acesso às funcionalidades disponibilizadas para o seu papel, incluindo:

- Dashboard;
- Movimentações;
- Perfil;
- Preferências.

As operações administrativas e as ações restritas devem respeitar as permissões definidas pela aplicação e validadas no backend.

---

# 🔒 Segurança

A arquitetura adota diferentes mecanismos para autenticação, autorização e proteção dos dados.

Entre os recursos utilizados ou previstos na estrutura do sistema estão:

- Supabase Auth;
- Gerenciamento de sessões;
- Controle de membros por empresa;
- Papéis de acesso (_roles_);
- Row Level Security (RLS);
- Validação de dados;
- Integridade referencial;
- Funções e triggers PostgreSQL;
- Validação de requisições no backend;
- Separação de variáveis de ambiente;
- Proteção de credenciais e segredos no ambiente do servidor.

A relação de autorização dos dados segue o vínculo entre o usuário autenticado e a empresa à qual ele pertence:

```text
auth.uid()
    ↓
company_members
    ↓
company_id
    ↓
Dados autorizados
```

Esse modelo tem como objetivo garantir que cada usuário acesse somente os dados permitidos para sua associação à empresa e para o seu papel no sistema.

---

# 🔐 Arquitetura de autenticação

O fluxo geral de autenticação e autorização é representado abaixo:

```text
Usuário
   ↓
Next.js
   ↓
Supabase Auth
   ↓
Sessão autenticada
   ↓
Identificação do usuário
   ↓
company_members
   ↓
Empresa + Role
   ↓
Permissões de acesso
```

Nas operações protegidas, o backend valida o token de autenticação e aplica as verificações de autorização pertinentes antes de executar a operação solicitada.

---

> **Nota:** esta seção descreve a arquitetura de autenticação e controle de acesso do projeto. A disponibilidade de cada fluxo e a aplicação efetiva dos mecanismos de segurança devem ser verificadas na implementação correspondente.
