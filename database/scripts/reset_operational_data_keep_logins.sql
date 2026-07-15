-- Reset operacional do Fasa Certificados.
-- Mantem logins e permissoes:
--   - auth.users
--   - auth.identities
--   - public.user_profiles
--
-- Execute no Supabase SQL Editor somente quando quiser limpar os dados
-- do sistema, certificados, avisos e bot WhatsApp.

begin;

-- O Supabase bloqueia DELETE direto em storage.objects.
-- Para limpar os arquivos PFX antigos, use a Storage API:
-- npm run storage:clear-certificados -- --confirm

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

-- Recria as configuracoes padrao do sistema antigo de vencimentos.
insert into public.configuracoes_sistema (
  id,
  dias_aviso_vencimento
)
values (
  '00000000-0000-0000-0000-000000000001',
  array[30,15,7]
);

-- Recria as configuracoes padrao do bot WhatsApp.
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

-- Recria os templates padrao.
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

-- Observacao sobre arquivos PFX:
-- Este SQL nao remove objetos do Storage diretamente.
-- Use npm run storage:clear-certificados -- --confirm para limpar o bucket privado.
