# 09 - Clientes

## Objetivo

O modulo de clientes armazena dados cadastrais vinculados aos certificados. O sistema cria ou atualiza cliente automaticamente durante upload de certificado, mas tambem possui tela/listagem e API de cadastro.

## Arquivos principais

- `src/app/(internal)/clientes/page.tsx`
- `src/app/api/clientes/route.ts`
- `src/app/(internal)/certificados/[id]/client-edit-form.tsx`
- `src/lib/utils/phone.ts`
- `src/lib/utils/format.ts`
- `supabase_schema.sql`

## Tabela

Tabela: `clientes`.

Campos:

- `id`
- `nome_razao_social`
- `cnpj`
- `email`
- `telefone`
- `whatsapp`
- `responsavel`
- `observacoes`
- `created_at`
- `updated_at`

## Cadastro automatico via certificado

Durante upload, `src/lib/certificados/upload-service.ts` monta dados do cliente e chama a RPC `registrar_upload_certificado`.

A RPC:

1. procura cliente por CNPJ;
2. atualiza dados se encontrar;
3. cria cliente se nao encontrar;
4. vincula o certificado ao cliente.

Na importacao em massa, `preserveExistingClientData` evita sobrescrever dados ja existentes com informacao incompleta.

## Cadastro manual

API:

- `POST /api/clientes`

Requer perfil admin. Valida CNPJ e telefone/WhatsApp conforme schema de cliente.

## Listagem

API:

- `GET /api/clientes`

Suporta:

- busca por nome, CNPJ, email, telefone, WhatsApp e responsavel;
- paginacao;
- ordenacao.

## Edicao pelo detalhe do certificado

O detalhe do certificado possui `client-edit-form.tsx`, permitindo editar dados do cliente vinculado sem sair da tela de certificado.

## Exclusao sincronizada

A exclusao de certificado chama `excluir_certificado_com_cliente`. Se o cliente nao tiver outros certificados, ele tambem e removido.

## Observacoes

- `cnpj` e unico no banco.
- O telefone/WhatsApp e normalizado no backend em fluxos de notificacao e destinatarios.
- A tela de clientes nao e o fluxo principal de criacao; o upload tambem cria cliente.
