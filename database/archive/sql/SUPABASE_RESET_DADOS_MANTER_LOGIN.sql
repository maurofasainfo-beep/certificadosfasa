-- Reset completo dos dados operacionais do Fasa Certificados.
--
-- MANTEM LOGIN E PERFIS:
--   - auth.users
--   - auth.identities
--   - public.user_profiles
--
-- LIMPA:
--   - clientes
--   - certificados
--   - links publicos de download
--   - eventos e configuracoes de notificacao
--   - dispositivos/logs do bot WhatsApp
--   - logs de auditoria
--   - jobs de reconciliacao Storage/Postgres
--   - os objetos PFX do Storage devem ser apagados pela Storage API
--     usando o script npm run storage:clear-certificados -- --confirm
--
-- Execute no SQL Editor do Supabase correto.
-- Depois de executar, seus usuarios continuam existindo e o admin continua admin
-- se o registro em public.user_profiles ja estiver correto.

begin;

-- Limpa dados operacionais sem tocar nos logins.
truncate table
  public.qwep_seen_nonces,
  public.qwep_rate_limit_buckets,
  public.whatsapp_device_logs,
  public.notification_events,
  public.notification_runs,
  public.notification_recipients,
  public.whatsapp_devices,
  public.links_download,
  public.audit_logs,
  public.storage_reconciliation_jobs,
  public.certificados,
  public.clientes,
  public.notification_templates,
  public.notification_settings,
  public.configuracoes_sistema
restart identity cascade;

-- Configuracao antiga/simples de vencimentos usada por compatibilidade.
insert into public.configuracoes_sistema (
  id,
  dias_aviso_vencimento
)
values (
  '00000000-0000-0000-0000-000000000001',
  array[30,15,7]
);

-- Configuracao padrao do modulo de avisos WhatsApp.
insert into public.notification_settings (
  id,
  enabled,
  expired_notifications_enabled,
  dias_aviso_vencimento,
  delay_minimo_segundos,
  delay_maximo_segundos,
  max_attempts,
  polling_interval_seconds,
  heartbeat_interval_seconds,
  send_window_start,
  send_window_end,
  timezone
)
values (
  '00000000-0000-0000-0000-000000000001',
  false,
  true,
  array[30,15,1],
  30,
  60,
  3,
  5,
  30,
  '08:00',
  '18:00',
  'America/Sao_Paulo'
);

-- Templates padrao sem dados sensiveis.
insert into public.notification_templates (
  type,
  title,
  content,
  active
)
values
(
  'certificate_expiring',
  'Aviso de vencimento de certificado',
  'Atencao!

O certificado digital do cliente {cliente_nome}, CNPJ {cnpj}, vencera em {dias} dia(s).

Data de vencimento: {data_vencimento}

Telefone do cliente: {cliente_telefone}

Entre em contato com o cliente para realizar a renovacao.',
  true
),
(
  'certificate_expired',
  'Certificados vencidos',
  'Atencao!

Existem {total_vencidos} certificado(s) vencido(s) em {data_hoje}:

{lista_certificados_vencidos}

Favor entrar em contato com os clientes para regularizacao.',
  true
);

commit;

-- Conferencia rapida depois de executar:
-- select count(*) as usuarios from auth.users;
-- select id, role, active from public.user_profiles;
-- select count(*) as clientes from public.clientes;
-- select count(*) as certificados from public.certificados;
--
-- Importante:
-- O Supabase bloqueia DELETE direto em storage.objects.
-- Para limpar os arquivos PFX antigos, execute no terminal do projeto:
-- npm run storage:clear-certificados -- --confirm
