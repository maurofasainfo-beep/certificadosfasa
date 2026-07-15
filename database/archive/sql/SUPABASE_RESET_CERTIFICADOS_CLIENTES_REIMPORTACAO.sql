-- Reset para reimportacao limpa de certificados.
--
-- MANTEM:
--   - logins do Supabase Auth
--   - public.user_profiles
--   - configuracoes de notificacao
--   - templates
--   - destinatarios internos
--   - dispositivos do WhatsApp Bot
--
-- REMOVE:
--   - clientes
--   - certificados
--   - links de download
--   - eventos de notificacao gerados para certificados antigos
--   - logs operacionais relacionados
--   - jobs de reconciliacao Storage/Postgres
--   - os arquivos PFX do Storage devem ser apagados pela Storage API
--     usando o script npm run storage:clear-certificados -- --confirm
--
-- Execute no SQL Editor do Supabase do projeto correto antes da nova importacao.

begin;

truncate table
  public.links_download,
  public.notification_events,
  public.notification_runs,
  public.audit_logs,
  public.storage_reconciliation_jobs,
  public.certificados,
  public.clientes
restart identity cascade;

commit;

-- Conferencia depois de executar:
select 'clientes' as tabela, count(*) as total from public.clientes
union all
select 'certificados' as tabela, count(*) as total from public.certificados
union all
select 'notification_events' as tabela, count(*) as total from public.notification_events
union all
select 'links_download' as tabela, count(*) as total from public.links_download;

-- Importante:
-- O Supabase bloqueia DELETE direto em storage.objects.
-- Para limpar os arquivos PFX antigos, execute no terminal do projeto:
-- npm run storage:clear-certificados -- --confirm
