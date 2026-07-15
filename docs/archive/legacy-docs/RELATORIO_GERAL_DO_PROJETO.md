# Relatório Geral do Projeto

O Sistema de Certificados Fasa e um painel interno Next.js/Supabase para gerenciar certificados PFX, clientes, links publicos e avisos de vencimento por WhatsApp via API euAtendo.

## Arquitetura Consolidada

- Frontend Next.js App Router.
- Backend em API Routes Node.js.
- Supabase Auth/Postgres/Storage.
- Outbox em `notification_events`.
- Dispatcher euAtendo protegido por cron e `CRON_SECRET`.

## Estado Atual

O Canal WhatsApp usa euAtendo como provider oficial. O canal local anterior foi removido do runtime e das rotas operacionais.

## Validação

A manutenção deve rodar:

```powershell
npx.cmd tsc --noEmit --pretty false
npm.cmd run lint
npm.cmd run build
```
