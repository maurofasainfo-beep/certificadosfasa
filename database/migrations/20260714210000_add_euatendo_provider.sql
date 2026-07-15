-- Fasa Certificados - suporte inicial ao provider euAtendo.
-- Execute no Supabase SQL Editor ou aplique como migration incremental.
-- Nao migra eventos pendentes existentes; a convivencia e controlada por provider.

alter table public.notification_events
  add column if not exists provider_message_id text,
  add column if not exists provider_status text,
  add column if not exists dispatched_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists read_at timestamptz;

alter table public.notification_events drop constraint if exists notification_events_provider_check;
alter table public.notification_events add constraint notification_events_provider_check
  check (provider in ('whatsapp_desktop','euatendo'));

create index if not exists notification_events_euatendo_pending_idx
  on public.notification_events (status, send_date, next_retry_at, created_at)
  where provider = 'euatendo' and status in ('pending','retry');

create index if not exists notification_events_provider_message_idx
  on public.notification_events (provider, provider_message_id)
  where provider_message_id is not null;

comment on column public.notification_events.provider_message_id is
  'Identificador retornado pelo provider de envio, quando existir. Nao armazena token nem segredo.';
comment on column public.notification_events.provider_status is
  'Status bruto/sanitizado retornado pelo provider, sem substituir o status interno da fila.';
comment on column public.notification_events.dispatched_at is
  'Data/hora em que um dispatcher server-side enviou o evento ao provider.';
comment on column public.notification_events.delivered_at is
  'Data/hora de entrega confirmada por provider/webhook futuro, quando disponivel.';
comment on column public.notification_events.read_at is
  'Data/hora de leitura confirmada por provider/webhook futuro, quando disponivel.';

create or replace function public.get_whatsapp_bot_message_stats()
returns jsonb
language sql
security definer
set search_path = public
as $$
with settings as (
  select coalesce(timezone, 'America/Sao_Paulo') as timezone
  from public.notification_settings
  where id = '00000000-0000-0000-0000-000000000001'::uuid
),
today_value as (
  select (now() at time zone coalesce((select timezone from settings), 'America/Sao_Paulo'))::date as today
),
stats as (
  select
    count(*) filter (where status = 'pending' and send_date <= tv.today)::integer as pending,
    count(*) filter (where status = 'reserved')::integer as reserved,
    count(*) filter (where status = 'processing')::integer as processing,
    count(*) filter (where status = 'retry' and send_date <= tv.today and (next_retry_at is null or next_retry_at <= now()))::integer as retry,
    count(*) filter (where status = 'sent')::integer as sent,
    count(*) filter (where status = 'failed')::integer as failed,
    count(*) filter (where status = 'cancelled')::integer as cancelled,
    count(*) filter (where status = 'skipped')::integer as skipped,
    count(*) filter (where status in ('pending','retry') and send_date <= tv.today)::integer as waiting_to_send
  from public.notification_events ne
  cross join today_value tv
  where ne.provider = 'whatsapp_desktop'
)
select jsonb_build_object(
  'pending', coalesce(pending, 0),
  'reserved', coalesce(reserved, 0),
  'processing', coalesce(processing, 0),
  'retry', coalesce(retry, 0),
  'sent', coalesce(sent, 0),
  'failed', coalesce(failed, 0),
  'cancelled', coalesce(cancelled, 0),
  'skipped', coalesce(skipped, 0),
  'waiting_to_send', coalesce(waiting_to_send, 0)
)
from stats;
$$;

revoke all on function public.get_whatsapp_bot_message_stats() from public, anon, authenticated;
grant execute on function public.get_whatsapp_bot_message_stats() to service_role;
