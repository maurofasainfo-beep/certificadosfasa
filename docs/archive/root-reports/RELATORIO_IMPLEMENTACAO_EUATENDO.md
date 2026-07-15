# Relatório de Implementação euAtendo

## Resumo

A integração euAtendo foi implementada como canal server-side de WhatsApp. Nesta versão, a euAtendo permanece como único canal operacional do sistema.

## Componentes

- Cliente HTTP server-only em `src/lib/whatsapp/euatendo`.
- Provider `EuAtendoWhatsAppProvider`.
- Rotas administrativas em `/api/whatsapp/euatendo/*`.
- Dispatcher automático em `/api/cron/euatendo-dispatch`.
- Estado persistente em `whatsapp_dispatcher_state`.
- Logs sanitizados em `whatsapp_provider_logs`.

## Segurança

- Token euAtendo apenas no backend.
- Sem credenciais `NEXT_PUBLIC`.
- Cron protegido por `CRON_SECRET`.
- Logs sem token, headers, senhas ou dados do PFX.

## Banco

O provider operacional para novos eventos é:

```sql
euatendo
```

A migration `20260715140000_remove_desktop_bot_legacy.sql` remove estruturas legadas e migra eventos pendentes do canal antigo para a euAtendo.

## Status do canal legado

Removido do runtime. O histórico finalizado pode permanecer no banco apenas para auditoria, conforme migration de remoção.
