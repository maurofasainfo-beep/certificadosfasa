# Integração euAtendo

## Estado Atual

A API euAtendo é o único canal oficial de envio WhatsApp do Sistema de Certificados Fasa.

O backend continua responsável por:

- calcular vencimentos;
- renderizar templates;
- criar `notification_events`;
- aplicar idempotência;
- reservar eventos;
- controlar retry;
- respeitar delay;
- registrar logs sanitizados.

A euAtendo é apenas o provedor de transporte.

## Variáveis

```env
EUATENDO_API_URL=https://apicluster.euatendo.app
EUATENDO_API_TOKEN=
EUATENDO_INSTANCE_ID=
EUATENDO_PROVIDER_ENABLED=false
```

`EUATENDO_API_TOKEN` é server-only.

## Endpoints Usados

- `GET /list-instances`
- `POST /check-instance-status`
- `POST /check-number-whatsapp`
- `POST /send-text-message`

## Fluxo Automático

1. Notification Engine cria eventos com `provider = 'euatendo'`.
2. Cron chama `POST /api/cron/euatendo-dispatch`.
3. RPC `reserve_euatendo_notification_event` reserva no máximo 1 evento.
4. `EuAtendoWhatsAppProvider` envia a mensagem renderizada.
5. Evento vira `sent`, `retry` ou `failed`.
6. `whatsapp_provider_logs` registra resultado sanitizado.
7. `whatsapp_dispatcher_state` guarda lock e próximo horário permitido.

## Segurança

- Token não é exposto ao frontend.
- Rotas administrativas exigem admin.
- Cron exige `CRON_SECRET`.
- Logs mascaram telefone.
- Provider response é sanitizado.
- Senhas, links e paths privados não entram nas mensagens.

## Banco

Tabelas usadas:

- `notification_events`
- `notification_settings`
- `notification_templates`
- `notification_recipients`
- `notification_runs`
- `whatsapp_dispatcher_state`
- `whatsapp_provider_logs`

Provider operacional:

```sql
provider = 'euatendo'
```

Eventos antigos finalizados do canal removido podem existir somente como histórico. A migration `20260715140000_remove_desktop_bot_legacy.sql` migra eventos pendentes e bloqueia novos eventos do provider legado.

## Rollback

Rollback operacional seguro:

1. Definir `EUATENDO_PROVIDER_ENABLED=false`.
2. Pausar o cron `euatendo-dispatch`.
3. Corrigir credenciais/instância ou API.
4. Reativar apenas após homologação manual.

O canal removido não deve ser reativado sem restaurar código e tabelas a partir de backup.
