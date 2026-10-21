# 📦 Armazenamento de Arquivos — Supabase Storage

O **MetricsFlow AI** utiliza o **Supabase Storage** para armazenar arquivos associados às movimentações financeiras da aplicação.

O armazenamento de arquivos é separado do PostgreSQL: enquanto o banco mantém os registros e relacionamentos entre as entidades, o Storage é responsável por guardar os arquivos propriamente ditos.

## 🎯 Objetivo

O armazenamento de arquivos permite associar documentos e outros arquivos às transações financeiras, mantendo cada anexo vinculado à movimentação correspondente.

Essa estrutura facilita a consulta dos anexos e evita armazenar o conteúdo binário dos arquivos diretamente nas tabelas relacionais.

## 🏗️ Arquitetura

A solução utiliza dois componentes principais:

- **PostgreSQL — tabela `attachments`:** registra os dados dos anexos e seu relacionamento com as transações.
- **Supabase Storage — bucket:** armazena os arquivos enviados à aplicação.

O relacionamento lógico pode ser representado assim:

```text
Frontend
   │
   │ Envio ou consulta de anexos
   ▼
Backend — NestJS
   │
   ├── PostgreSQL
   │      └── attachments
   │             └── transaction_id
   │
   └── Supabase Storage
          └── Bucket de arquivos
```

O fluxo exato de upload, consulta e recuperação dos arquivos depende dos serviços implementados no backend.

## 🗂️ Organização dos arquivos

O bucket funciona como um espaço de armazenamento de objetos no Supabase Storage.

Cada arquivo armazenado pode ser identificado por um caminho dentro do bucket. A tabela `attachments` pode manter a referência necessária para localizar esse arquivo e associá-lo à transação correspondente.

A estrutura de diretórios e os campos utilizados para registrar essas referências devem seguir a configuração efetivamente implementada no projeto.

## 🔗 Relacionamento com as transações

Os anexos são associados às movimentações financeiras por meio da tabela `attachments`.

O relacionamento permite consultar os arquivos vinculados a uma transação específica.

O backend disponibiliza o endpoint:

`GET /api/transactions/:id/attachments`

Esse endpoint recebe o identificador da transação e consulta os anexos associados, respeitando as regras de autenticação e autorização implementadas na aplicação.

A consulta dos metadados e o acesso ao conteúdo do arquivo são operações distintas: a disponibilidade do endpoint não significa, por si só, que o arquivo esteja acessível publicamente.

## 🔐 Segurança e controle de acesso

O armazenamento deve ser configurado para impedir o acesso não autorizado aos arquivos.

As regras de segurança precisam considerar:

- A autenticação do usuário;
- A autorização para acessar a empresa e a transação relacionada;
- As políticas de acesso configuradas no Supabase Storage;
- A forma como o backend disponibiliza os arquivos;
- A proteção de URLs e credenciais utilizadas no acesso aos objetos.

Caso o bucket seja privado, o acesso aos arquivos deve ocorrer por meio de mecanismos autorizados, como políticas adequadas ou URLs assinadas com validade limitada, conforme a implementação adotada.

## ⚙️ Configuração

A configuração do armazenamento depende do projeto Supabase utilizado pela **MetricsFlow AI**.

As informações que devem ser documentadas após a conferência da configuração são:

- Nome do bucket;
- Visibilidade pública ou privada;
- Tipos de arquivos aceitos;
- Limite de tamanho por arquivo;
- Políticas de acesso;
- Estrutura dos caminhos dos arquivos;
- Estratégia de upload e recuperação;
- Relacionamento entre os caminhos armazenados e a tabela `attachments`.

As credenciais administrativas do Supabase não devem ser expostas no frontend nem incluídas no README.

## 📌 Considerações

O Supabase Storage complementa o PostgreSQL ao separar o armazenamento físico dos arquivos dos dados relacionais da aplicação.

A tabela `attachments` mantém a associação entre os anexos e as transações, enquanto o bucket armazena os objetos correspondentes.

A configuração do bucket, suas políticas e o fluxo de acesso devem permanecer sincronizados com a implementação do backend e com as regras de segurança da **MetricsFlow AI**.
