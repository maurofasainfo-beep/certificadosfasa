# Banco de Dados

Tabelas principais:

- `user_profiles`: RBAC interno.
- `clientes`: dados do cliente e permissao de WhatsApp.
- `certificados`: um certificado por cliente, senha criptografada e path privado.
- `links_download`: links publicos com token/senha em hash.
- `notification_settings`: configuracoes de avisos.
- `notification_templates`: templates internos e do cliente.
- `notification_recipients`: destinatarios internos.
- `notification_events`: fila/outbox de avisos.
- `notification_runs`: execucoes de scanner/rebuild.
- `whatsapp_dispatcher_state`: lock e delay persistente do provider.
- `whatsapp_provider_logs`: logs sanitizados da euAtendo.
- `storage_reconciliation_jobs`: reconciliacao Storage/Postgres.
- `audit_logs`: auditoria sem segredos.

Estruturas antigas do canal local foram removidas pela migration `20260715140000_remove_desktop_bot_legacy.sql`.
