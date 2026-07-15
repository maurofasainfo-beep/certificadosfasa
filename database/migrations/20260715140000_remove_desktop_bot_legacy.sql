-- Remove o legado operacional do Desktop Bot/QWEP.
-- Execute backup/export das tabelas antigas antes de aplicar em producao:
--   whatsapp_devices, whatsapp_device_logs, qwep_seen_nonces, qwep_rate_limit_buckets.
-- A integracao euAtendo e preservada como unico canal operacional de novos envios.

begin;

alter table if exists public.notification_settings
  drop constraint if exists notification_settings_heartbeat_check,
  drop column if exists heartbeat_interval_seconds;

-- Eventos ainda nao finalizados do antigo consumidor local passam a ser consumidos
-- pelo dispatcher euAtendo sem duplicar idempotency_key ou criar novos eventos.
update public.notification_events
set
  provider = 'euatendo',
  status = case
    when status in ('reserved','processing') then 'pending'::public.notification_event_status
    else status
  end,
  reservation_id = null,
  reserved_at = null,
  reservation_expires_at = null,
  processing_started_at = null,
  next_retry_at = case
    when status in ('reserved','processing') then now()
    else next_retry_at
  end,
  error_message = case
    when status in ('reserved','processing') then null
    else error_message
  end,
  updated_at = now()
where provider = 'whatsapp_desktop'
  and status in ('pending','reserved','processing','retry');

drop function if exists public.reserve_pending_notification_events(uuid, integer);
drop function if exists public.reserve_pending_notification_events(uuid, integer, integer);
drop function if exists public.get_whatsapp_bot_message_stats();
drop function if exists public.cleanup_qwep_operational_tables();

drop index if exists public.notification_events_pending_idx;
drop index if exists public.notification_events_reservation_idx;
drop index if exists public.whatsapp_devices_one_primary_idx;
drop index if exists public.whatsapp_devices_status_idx;
drop index if exists public.whatsapp_devices_token_hash_idx;
drop index if exists public.whatsapp_devices_primary_sender_status_idx;
drop index if exists public.whatsapp_device_logs_device_created_idx;
drop index if exists public.qwep_seen_nonces_expires_idx;
drop index if exists public.qwep_rate_limit_buckets_reset_idx;

do $$
begin
  if to_regclass('public.whatsapp_devices') is not null then
    execute 'drop policy if exists "Only admins can read whatsapp devices" on public.whatsapp_devices';
    execute 'drop policy if exists "Only admins can manage whatsapp devices" on public.whatsapp_devices';
    execute 'drop trigger if exists set_whatsapp_devices_updated_at on public.whatsapp_devices';
  end if;

  if to_regclass('public.whatsapp_device_logs') is not null then
    execute 'drop policy if exists "Only admins can read whatsapp logs" on public.whatsapp_device_logs';
  end if;
end $$;

alter table if exists public.notification_events
  drop column if exists device_id,
  drop column if exists reservation_token_hash;

drop table if exists public.qwep_seen_nonces cascade;
drop table if exists public.qwep_rate_limit_buckets cascade;
drop table if exists public.whatsapp_device_logs cascade;
drop table if exists public.whatsapp_devices cascade;
drop type if exists public.whatsapp_device_status cascade;

alter table public.notification_events alter column provider set default 'euatendo';
alter table public.notification_events drop constraint if exists notification_events_provider_check;
alter table public.notification_events add constraint notification_events_provider_check
  check (provider in ('euatendo','whatsapp_desktop'));

create or replace function public.prevent_legacy_whatsapp_desktop_provider()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.provider = 'whatsapp_desktop' then
    if tg_op = 'INSERT' or (tg_op = 'UPDATE' and old.provider is distinct from new.provider) then
      raise exception 'whatsapp_desktop_provider_removed';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_legacy_whatsapp_desktop_provider on public.notification_events;
create trigger prevent_legacy_whatsapp_desktop_provider
before insert or update of provider on public.notification_events
for each row execute function public.prevent_legacy_whatsapp_desktop_provider();

alter table if exists public.whatsapp_provider_logs drop constraint if exists whatsapp_provider_logs_provider_check;
alter table if exists public.whatsapp_provider_logs add constraint whatsapp_provider_logs_provider_check
  check (provider = 'euatendo');

drop function if exists public.release_expired_notification_reservations();
create or replace function public.release_expired_notification_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.notification_events
  set
    status = case
      when attempt_count >= max_attempts then 'failed'::public.notification_event_status
      else 'retry'::public.notification_event_status
    end,
    failed_at = case
      when attempt_count >= max_attempts then now()
      else failed_at
    end,
    next_retry_at = case
      when attempt_count >= max_attempts then null
      else now()
    end,
    reservation_id = null,
    reserved_at = null,
    reservation_expires_at = null,
    processing_started_at = null,
    error_message = coalesce(error_message, 'Reserva expirada.'),
    updated_at = now()
  where status in ('reserved','processing')
    and reservation_expires_at is not null
    and reservation_expires_at < now();

  get diagnostics affected = row_count;
  return affected;
end;
$$;

drop function if exists public.get_dashboard_metrics();
create or replace function public.get_dashboard_metrics()
returns jsonb
language sql
security definer
set search_path = public
as $$
with effective_settings as (
  select
    coalesce(timezone, 'America/Sao_Paulo') as timezone,
    coalesce(dias_aviso_vencimento, array[30,15,1]) as dias_aviso_vencimento
  from public.notification_settings
  where id = '00000000-0000-0000-0000-000000000001'::uuid
),
today_value as (
  select (now() at time zone coalesce((select timezone from effective_settings), 'America/Sao_Paulo'))::date as today
),
warning_value as (
  select coalesce(max(day_value), 30)::integer as warning_days
  from effective_settings, unnest(dias_aviso_vencimento) as day_value
  where day_value > 0
),
certs as (
  select
    c.id,
    c.cnpj,
    c.nome_titular,
    c.data_vencimento,
    cl.nome_razao_social as cliente_nome,
    (c.data_vencimento - tv.today)::integer as dias_restantes,
    case
      when c.data_vencimento < tv.today then 'vencido'
      when c.data_vencimento <= tv.today + (select warning_days from warning_value) then 'vencendo'
      else 'ativo'
    end as status_calculado
  from public.certificados c
  left join public.clientes cl on cl.id = c.cliente_id
  cross join today_value tv
  where c.status <> 'invalido'
),
cert_counts as (
  select
    count(*)::integer as total_certificados,
    count(*) filter (where status_calculado = 'ativo')::integer as certificados_validos,
    count(*) filter (where status_calculado = 'vencendo')::integer as certificados_vencendo,
    count(*) filter (where status_calculado = 'vencido')::integer as certificados_vencidos
  from certs
),
event_counts as (
  select
    count(*) filter (where status in ('pending','retry') and send_date > tv.today)::integer as avisos_planejados,
    count(*) filter (where status in ('pending','retry') and send_date <= tv.today)::integer as avisos_para_hoje,
    count(*) filter (where status in ('pending','reserved','processing','retry'))::integer as mensagens_aguardando,
    count(*) filter (where status = 'sent')::integer as mensagens_enviadas,
    count(*) filter (where status = 'sent' and (sent_at at time zone (select timezone from effective_settings))::date = tv.today)::integer as mensagens_enviadas_hoje,
    count(*) filter (where status = 'failed')::integer as falhas_envio,
    count(*) filter (where status = 'failed' and coalesce((failed_at at time zone (select timezone from effective_settings))::date, send_date) = tv.today)::integer as falhas_hoje,
    max(sent_at) filter (where status = 'sent') as ultimo_envio
  from public.notification_events ne
  cross join today_value tv
  where ne.provider = 'euatendo'
),
channel_state as (
  select jsonb_build_object(
    'provider', provider,
    'last_dispatch_at', last_dispatch_at,
    'next_allowed_send_at', next_allowed_send_at,
    'locked_until', locked_until,
    'available', (locked_until is null or locked_until < now())
  ) as state
  from public.whatsapp_dispatcher_state
  where provider = 'euatendo'
  limit 1
),
period_counts as (
  select jsonb_build_array(
    jsonb_build_object('name', 'Vencidos', 'value', count(*) filter (where dias_restantes < 0), 'color', '#DC2626'),
    jsonb_build_object('name', '7 dias', 'value', count(*) filter (where dias_restantes >= 0 and dias_restantes <= 7), 'color', '#F59E0B'),
    jsonb_build_object('name', '15 dias', 'value', count(*) filter (where dias_restantes > 7 and dias_restantes <= 15), 'color', '#2563EB'),
    jsonb_build_object('name', '30 dias', 'value', count(*) filter (where dias_restantes > 15 and dias_restantes <= 30), 'color', '#60A5FA')
  ) as data
  from certs
),
attention as (
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'cnpj', cnpj,
        'nome_titular', nome_titular,
        'data_vencimento', data_vencimento,
        'status', status_calculado,
        'dias_restantes', dias_restantes,
        'clientes', jsonb_build_object('nome_razao_social', cliente_nome)
      )
      order by data_vencimento asc, id asc
    ),
    '[]'::jsonb
  ) as data
  from (
    select *
    from certs
    where dias_restantes < 0
       or (dias_restantes >= 0 and dias_restantes <= (select warning_days from warning_value))
    order by data_vencimento asc, id asc
    limit 5
  ) selected
)
select jsonb_build_object(
  'today', (select today from today_value),
  'warning_days', (select warning_days from warning_value),
  'total_certificados', coalesce((select total_certificados from cert_counts), 0),
  'certificados_validos', coalesce((select certificados_validos from cert_counts), 0),
  'certificados_vencendo', coalesce((select certificados_vencendo from cert_counts), 0),
  'certificados_vencidos', coalesce((select certificados_vencidos from cert_counts), 0),
  'avisos_para_hoje', coalesce((select avisos_para_hoje from event_counts), 0),
  'mensagens_enviadas', coalesce((select mensagens_enviadas from event_counts), 0),
  'falhas_envio', coalesce((select falhas_envio from event_counts), 0),
  'falhas_hoje', coalesce((select falhas_hoje from event_counts), 0),
  'avisos_planejados', coalesce((select avisos_planejados from event_counts), 0),
  'fila_hoje', coalesce((select avisos_para_hoje from event_counts), 0),
  'ultimo_envio', (select ultimo_envio from event_counts),
  'canal_whatsapp', (select state from channel_state),
  'status_canal_whatsapp', coalesce((select (state->>'available')::boolean from channel_state), true),
  'mensagens_aguardando', coalesce((select mensagens_aguardando from event_counts), 0),
  'enviadas_hoje', coalesce((select mensagens_enviadas_hoje from event_counts), 0),
  'status_chart', jsonb_build_array(
    jsonb_build_object('name', 'Validos', 'value', coalesce((select certificados_validos from cert_counts), 0), 'color', '#16A34A'),
    jsonb_build_object('name', 'Vencendo', 'value', coalesce((select certificados_vencendo from cert_counts), 0), 'color', '#F59E0B'),
    jsonb_build_object('name', 'Vencidos', 'value', coalesce((select certificados_vencidos from cert_counts), 0), 'color', '#DC2626')
  ),
  'expiration_chart', coalesce((select data from period_counts), '[]'::jsonb),
  'attention_certificates', coalesce((select data from attention), '[]'::jsonb)
);
$$;

drop function if exists public.reserve_euatendo_notification_event(integer);
create or replace function public.reserve_euatendo_notification_event(
  p_lock_ttl_seconds integer default 120
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.notification_settings;
  v_today date;
  v_state public.whatsapp_dispatcher_state;
  v_event public.notification_events;
  v_lock_id uuid := gen_random_uuid();
  v_lock_ttl integer := greatest(60, least(coalesce(p_lock_ttl_seconds, 120), 600));
begin
  select * into v_settings
  from public.notification_settings
  where id = '00000000-0000-0000-0000-000000000001'::uuid
  limit 1;

  if v_settings.id is null or v_settings.enabled is not true then
    return jsonb_build_object('status', 'skipped', 'reason', 'notifications_disabled');
  end if;

  v_today := (now() at time zone coalesce(v_settings.timezone, 'America/Sao_Paulo'))::date;

  insert into public.whatsapp_dispatcher_state (provider)
  values ('euatendo')
  on conflict (provider) do nothing;

  select * into v_state
  from public.whatsapp_dispatcher_state
  where provider = 'euatendo'
  for update;

  if v_state.locked_until is not null and v_state.locked_until > now() then
    return jsonb_build_object('status', 'locked', 'locked_until', v_state.locked_until);
  end if;

  if v_state.next_allowed_send_at > now() then
    return jsonb_build_object('status', 'waiting', 'next_allowed_send_at', v_state.next_allowed_send_at);
  end if;

  update public.notification_events
  set
    status = case when attempt_count >= max_attempts then 'failed'::public.notification_event_status else 'retry'::public.notification_event_status end,
    next_retry_at = case when attempt_count >= max_attempts then next_retry_at else now() + interval '1 minute' end,
    failed_at = case when attempt_count >= max_attempts then now() else failed_at end,
    error_message = coalesce(error_message, 'Reserva euAtendo expirada antes do envio.'),
    reservation_id = null,
    reserved_at = null,
    reservation_expires_at = null,
    processing_started_at = null,
    updated_at = now()
  where provider = 'euatendo'
    and status in ('reserved','processing')
    and dispatched_at is null
    and reservation_expires_at is not null
    and reservation_expires_at < now();

  update public.notification_events
  set
    status = 'failed',
    failed_at = now(),
    error_message = 'Processamento euAtendo interrompido apos inicio do disparo. Revisao manual necessaria para evitar duplicidade.',
    reservation_id = null,
    reserved_at = null,
    reservation_expires_at = null,
    processing_started_at = null,
    updated_at = now()
  where provider = 'euatendo'
    and status = 'processing'
    and dispatched_at is not null
    and reservation_expires_at is not null
    and reservation_expires_at < now();

  select ne.*
  into v_event
  from public.notification_events ne
  left join public.notification_recipients nr on nr.id = ne.recipient_id
  left join public.clientes cl on cl.id = ne.cliente_id
  left join public.certificados c on c.id = ne.certificado_id
  where ne.provider = 'euatendo'
    and ne.status in ('pending','retry')
    and ne.send_date <= v_today
    and (ne.next_retry_at is null or ne.next_retry_at <= now())
    and (
      (ne.audience = 'internal' and ne.recipient_id is not null and nr.ativo is true)
      or
      (ne.audience = 'client' and ne.cliente_id is not null and cl.whatsapp_notifications_enabled is true)
    )
    and (
      ne.type = 'certificate_expired'
      or ne.type = 'manual_test'
      or (
        ne.type = 'certificate_expiring'
        and c.id is not null
        and c.status <> 'invalido'::public.certificado_status
        and c.data_vencimento >= v_today
      )
    )
  order by ne.send_date asc, ne.created_at asc
  for update skip locked
  limit 1;

  if v_event.id is null then
    return jsonb_build_object('status', 'empty');
  end if;

  update public.whatsapp_dispatcher_state
  set
    lock_id = v_lock_id,
    locked_until = now() + make_interval(secs => v_lock_ttl),
    updated_at = now()
  where provider = 'euatendo';

  update public.notification_events
  set
    status = 'reserved',
    reservation_id = v_lock_id,
    reserved_at = now(),
    reservation_expires_at = now() + make_interval(secs => v_lock_ttl),
    processing_started_at = null,
    attempt_count = attempt_count + 1,
    error_message = null,
    updated_at = now()
  where id = v_event.id
  returning * into v_event;

  return jsonb_build_object(
    'status', 'reserved',
    'lock_id', v_lock_id,
    'event', jsonb_build_object(
      'id', v_event.id,
      'audience', v_event.audience,
      'type', v_event.type,
      'telefone_destino', v_event.telefone_destino,
      'mensagem_renderizada', v_event.mensagem_renderizada,
      'template_id', v_event.template_id,
      'attempt_count', v_event.attempt_count,
      'max_attempts', v_event.max_attempts,
      'idempotency_key', v_event.idempotency_key,
      'reservation_id', v_event.reservation_id
    )
  );
end;
$$;

revoke all on function public.prevent_legacy_whatsapp_desktop_provider() from public, anon, authenticated;
revoke all on function public.release_expired_notification_reservations() from public, anon, authenticated;
revoke all on function public.get_dashboard_metrics() from public, anon, authenticated;
revoke all on function public.reserve_euatendo_notification_event(integer) from public, anon, authenticated;
grant execute on function public.release_expired_notification_reservations() to service_role;
grant execute on function public.get_dashboard_metrics() to service_role;
grant execute on function public.reserve_euatendo_notification_event(integer) to service_role;

create index if not exists notification_events_euatendo_pending_idx
  on public.notification_events (status, send_date, next_retry_at, created_at)
  where provider = 'euatendo' and status in ('pending','retry');

create index if not exists notification_events_reservation_idx
  on public.notification_events (provider, reservation_id, reservation_expires_at)
  where status in ('reserved','processing');

comment on function public.prevent_legacy_whatsapp_desktop_provider() is
  'Impede novos eventos com provider legado do Desktop Bot. Historico antigo permanece consultavel.';

commit;
