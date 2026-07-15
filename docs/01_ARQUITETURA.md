# Arquitetura

Documento especifico. A fonte oficial completa continua sendo [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md).

## Visao geral

O projeto e um monolito Next.js App Router com frontend e backend no mesmo repositorio. Supabase fornece Auth, Postgres e Storage. A API euAtendo e o unico provider oficial de WhatsApp.

## Camadas

```text
Browser
  -> Next.js pages/components
  -> API Routes server-side
  -> src/lib regras de negocio
  -> Supabase Postgres/Storage/Auth
  -> API euAtendo
```

## Fronteiras

- UI nao acessa Storage PFX diretamente.
- UI nao recebe senha real do PFX.
- UI nao recebe `SUPABASE_SERVICE_ROLE_KEY`, `CERT_ENCRYPTION_KEY` ou token euAtendo.
- APIs server-side fazem RBAC antes de operacoes administrativas.
- Banco aplica RLS para leitura autenticada e operacoes sensiveis.
- Crons usam `CRON_SECRET`.

## Modulos principais

- `src/lib/certificados`: upload, renovacao e status.
- `src/lib/pfx`: parse de PFX.
- `src/lib/crypto`: criptografia de segredos.
- `src/lib/storage`: bucket de certificados e reconciliacao.
- `src/lib/notifications`: engine de avisos.
- `src/lib/whatsapp/euatendo`: client, provider e dispatcher.
- `src/lib/supabase`: clientes server/admin/browser e tipos.

## Integracoes

- Supabase Auth para login.
- Supabase Postgres para dados e fila.
- Supabase Storage para PFX privado.
- Vercel Cron Jobs para cron.
- euAtendo para WhatsApp.

## Decisoes atuais

- `notification_events` e a outbox oficial.
- `provider = 'euatendo'` e o caminho operacional atual.
- Desktop Bot/QWEP e historico removido do runtime.
- `database/schema/supabase_schema.sql` e o schema oficial para banco novo.
- `database/migrations/` e a trilha de atualizacao para banco existente.
