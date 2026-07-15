-- Fasa Certificados - envio automatico WhatsApp via euAtendo.
-- Migration incremental e compativel com dados existentes.

alter table public.clientes
  add column if not exists whatsapp_notifications_enabled boolean not null default true;

comment on column public.clientes.whatsapp_notifications_enabled is
  'Quando false, o sistema nao cria eventos WhatsApp destinados ao telefone do cliente. Avisos internos continuam ativos.';

alter table public.notification_templates drop constraint if exists notification_templates_type_check;
alter table public.notification_templates add constraint notification_templates_type_check
  check (type in (
    'certificate_expiring',
    'certificate_expired',
    'manual_test',
    'client_certificate_expiring',
    'client_certificate_expired'
  ));

alter table public.notification_events
  add column if not exists audience text not null default 'internal';

alter table public.notification_events drop constraint if exists notification_events_audience_check;
alter table public.notification_events add constraint notification_events_audience_check
  check (audience in ('internal','client'));

alter table public.notification_events
  add column if not exists provider_message_id text,
  add column if not exists provider_status text,
  add column if not exists dispatched_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists read_at timestamptz;

alter table public.notification_events drop constraint if exists notification_events_provider_check;
alter table public.notification_events add constraint notification_events_provider_check
  check (provider in ('whatsapp_desktop','euatendo'));

create table if not exists public.whatsapp_dispatcher_state (
  provider text primary key,
  last_dispatch_at timestamptz,
  next_allowed_send_at timestamptz not null default now(),
  locked_until timestamptz,
  lock_id uuid,
  updated_at timestamptz not null default now(),
  constraint whatsapp_dispatcher_state_provider_check check (provider in ('euatendo')),
  constraint whatsapp_dispatcher_state_lock_check check (locked_until is null or lock_id is not null)
);

create table if not exists public.whatsapp_provider_logs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id uuid references public.notification_events(id) on delete set null,
  audience text,
  operation text not null,
  telefone_mascarado text,
  template_type text,
  duration_ms integer,
  status text not null,
  attempt_count integer,
  error_code text,
  error_message text,
  request_id text,
  response_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint whatsapp_provider_logs_provider_check check (provider in ('euatendo','whatsapp_desktop')),
  constraint whatsapp_provider_logs_status_check check (status in ('started','sent','retry','failed','skipped','locked','waiting','error'))
);

drop trigger if exists set_whatsapp_dispatcher_state_updated_at on public.whatsapp_dispatcher_state;
create trigger set_whatsapp_dispatcher_state_updated_at
before update on public.whatsapp_dispatcher_state
for each row execute function public.set_updated_at();

create index if not exists notification_events_euatendo_ready_idx
  on public.notification_events (send_date, next_retry_at, created_at)
  where provider = 'euatendo' and status in ('pending','retry');

create index if not exists notification_events_audience_idx
  on public.notification_events (audience, provider, status, send_date);

create index if not exists whatsapp_provider_logs_created_idx
  on public.whatsapp_provider_logs (provider, created_at desc);

create index if not exists whatsapp_provider_logs_event_idx
  on public.whatsapp_provider_logs (event_id, created_at desc);

insert into public.whatsapp_dispatcher_state (provider)
values ('euatendo')
on conflict (provider) do nothing;

insert into public.notification_templates (type, title, content, active)
values (
  'client_certificate_expiring',
  'Aviso de vencimento ao cliente',
  'Ola {cliente_nome}

O certificado digital do CNPJ {cnpj} vencera em {dias} dia(s).

Data: {data_vencimento}

Entre em contato com a Fasa Informatica para renovar seu certificado.',
  true
)
on conflict do nothing;

insert into public.notification_templates (type, title, content, active)
values (
  'client_certificate_expired',
  'Certificado vencido ao cliente',
  'Ola {cliente_nome}

O certificado digital do CNPJ {cnpj} esta vencido desde {data_vencimento}.

Entre em contato com a Fasa Informatica para regularizar seu certificado.',
  false
)
on conflict do nothing;

drop function if exists public.registrar_upload_certificado(
  text, text, text, text, text, text, text, text, text, text, text, date, date, public.certificado_status, text, text, text, uuid, inet, uuid
);
drop function if exists public.registrar_upload_certificado(
  text, text, text, text, text, boolean, text, text, text, text, text, text, date, date, public.certificado_status, text, text, text, uuid, inet, uuid
);

create or replace function public.registrar_upload_certificado(
  p_cnpj text,
  p_nome_razao_social text,
  p_email text,
  p_telefone text,
  p_whatsapp text,
  p_whatsapp_notifications_enabled boolean,
  p_responsavel text,
  p_observacoes text,
  p_nome_titular text,
  p_senha_ciphertext text,
  p_senha_iv text,
  p_senha_auth_tag text,
  p_data_emissao date,
  p_data_vencimento date,
  p_status public.certificado_status,
  p_storage_path text,
  p_nome_arquivo_original text,
  p_hash_arquivo text,
  p_criado_por uuid,
  p_ip inet,
  p_certificado_id_existente uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cliente_id uuid;
  v_certificado_id uuid;
  v_old_data_vencimento date;
  v_old_hash_arquivo text;
  v_old_storage_path text;
  v_is_update boolean := false;
begin
  if p_cnpj is null or p_cnpj !~ '^[0-9]{14}$' then
    raise exception 'cnpj_invalido';
  end if;

  if p_certificado_id_existente is not null then
    select id, cliente_id, data_vencimento, hash_arquivo, storage_path
    into v_certificado_id, v_cliente_id, v_old_data_vencimento, v_old_hash_arquivo, v_old_storage_path
    from public.certificados
    where id = p_certificado_id_existente
    for update;

    if v_certificado_id is null then
      raise exception 'certificado_nao_encontrado';
    end if;

    if exists (
      select 1 from public.clientes where cnpj = p_cnpj and id <> v_cliente_id
    ) then
      raise exception 'cnpj_ja_vinculado';
    end if;

    update public.clientes
    set
      cnpj = p_cnpj,
      nome_razao_social = coalesce(nullif(trim(p_nome_razao_social), ''), public.clientes.nome_razao_social),
      email = nullif(trim(coalesce(p_email, '')), ''),
      telefone = nullif(trim(coalesce(p_telefone, '')), ''),
      whatsapp = nullif(trim(coalesce(p_whatsapp, '')), ''),
      whatsapp_notifications_enabled = coalesce(p_whatsapp_notifications_enabled, true),
      responsavel = nullif(trim(coalesce(p_responsavel, '')), ''),
      observacoes = nullif(trim(coalesce(p_observacoes, '')), ''),
      updated_at = now()
    where id = v_cliente_id;
  else
    insert into public.clientes (
      cnpj,
      nome_razao_social,
      email,
      telefone,
      whatsapp,
      whatsapp_notifications_enabled,
      responsavel,
      observacoes
    )
    values (
      p_cnpj,
      nullif(trim(p_nome_razao_social), ''),
      nullif(trim(coalesce(p_email, '')), ''),
      nullif(trim(coalesce(p_telefone, '')), ''),
      nullif(trim(coalesce(p_whatsapp, '')), ''),
      coalesce(p_whatsapp_notifications_enabled, true),
      nullif(trim(coalesce(p_responsavel, '')), ''),
      nullif(trim(coalesce(p_observacoes, '')), '')
    )
    on conflict (cnpj) do update
      set
        nome_razao_social = coalesce(nullif(trim(excluded.nome_razao_social), ''), public.clientes.nome_razao_social),
        email = excluded.email,
        telefone = excluded.telefone,
        whatsapp = excluded.whatsapp,
        whatsapp_notifications_enabled = excluded.whatsapp_notifications_enabled,
        responsavel = excluded.responsavel,
        observacoes = excluded.observacoes,
        updated_at = now()
    returning id into v_cliente_id;

    select id, data_vencimento, hash_arquivo, storage_path
    into v_certificado_id, v_old_data_vencimento, v_old_hash_arquivo, v_old_storage_path
    from public.certificados
    where cliente_id = v_cliente_id
    order by updated_at desc
    limit 1
    for update;
  end if;

  if v_certificado_id is not null then
    v_is_update := true;

    update public.certificados
    set
      cnpj = p_cnpj,
      nome_titular = p_nome_titular,
      senha_ciphertext = p_senha_ciphertext,
      senha_iv = p_senha_iv,
      senha_auth_tag = p_senha_auth_tag,
      data_emissao = p_data_emissao,
      data_vencimento = p_data_vencimento,
      status = p_status,
      storage_path = p_storage_path,
      nome_arquivo_original = p_nome_arquivo_original,
      hash_arquivo = p_hash_arquivo,
      ultimo_upload_em = now(),
      updated_at = now()
    where id = v_certificado_id;
  else
    insert into public.certificados (
      cliente_id,
      cnpj,
      nome_titular,
      senha_ciphertext,
      senha_iv,
      senha_auth_tag,
      data_emissao,
      data_vencimento,
      status,
      storage_path,
      nome_arquivo_original,
      hash_arquivo,
      criado_por
    )
    values (
      v_cliente_id,
      p_cnpj,
      p_nome_titular,
      p_senha_ciphertext,
      p_senha_iv,
      p_senha_auth_tag,
      p_data_emissao,
      p_data_vencimento,
      p_status,
      p_storage_path,
      p_nome_arquivo_original,
      p_hash_arquivo,
      p_criado_por
    )
    returning id into v_certificado_id;
  end if;

  insert into public.audit_logs (user_id, acao, certificado_id, ip, metadata)
  values (
    p_criado_por,
    case when v_is_update then 'renovacao_certificado' else 'upload_certificado' end,
    v_certificado_id,
    p_ip,
    jsonb_build_object(
      'cnpj', p_cnpj,
      'hash_arquivo', p_hash_arquivo,
      'renovado', v_is_update,
      'validade_anterior', v_old_data_vencimento,
      'nova_validade', p_data_vencimento,
      'hash_anterior', v_old_hash_arquivo,
      'storage_path_anterior', v_old_storage_path,
      'whatsapp_notifications_enabled', coalesce(p_whatsapp_notifications_enabled, true)
    )
  );

  return v_certificado_id;
end;
$$;

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
    reservation_token_hash = null,
    reserved_at = null,
    reservation_expires_at = null,
    processing_started_at = null
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
    reservation_token_hash = null,
    reserved_at = null,
    reservation_expires_at = null,
    processing_started_at = null
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
    error_message = null
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

revoke all on function public.registrar_upload_certificado(
  text, text, text, text, text, boolean, text, text, text, text, text, text, date, date, public.certificado_status, text, text, text, uuid, inet, uuid
) from public, anon, authenticated;
grant execute on function public.registrar_upload_certificado(
  text, text, text, text, text, boolean, text, text, text, text, text, text, date, date, public.certificado_status, text, text, text, uuid, inet, uuid
) to service_role;

revoke all on function public.reserve_euatendo_notification_event(integer) from public, anon, authenticated;
grant execute on function public.reserve_euatendo_notification_event(integer) to service_role;

alter table public.whatsapp_dispatcher_state enable row level security;
alter table public.whatsapp_provider_logs enable row level security;

drop policy if exists "Only admins can read whatsapp dispatcher state" on public.whatsapp_dispatcher_state;
create policy "Only admins can read whatsapp dispatcher state"
on public.whatsapp_dispatcher_state
for select
to authenticated
using (public.is_admin());

drop policy if exists "Only admins can read whatsapp provider logs" on public.whatsapp_provider_logs;
create policy "Only admins can read whatsapp provider logs"
on public.whatsapp_provider_logs
for select
to authenticated
using (public.is_admin());

revoke select on public.whatsapp_dispatcher_state from anon, authenticated;
grant select (provider, last_dispatch_at, next_allowed_send_at, locked_until, updated_at)
on public.whatsapp_dispatcher_state to authenticated;

revoke select on public.whatsapp_provider_logs from anon, authenticated;
grant select (
  id,
  provider,
  event_id,
  audience,
  operation,
  telefone_mascarado,
  template_type,
  duration_ms,
  status,
  attempt_count,
  error_code,
  error_message,
  request_id,
  response_id,
  created_at
) on public.whatsapp_provider_logs to authenticated;

comment on table public.whatsapp_dispatcher_state is 'Estado persistente do dispatcher por provider para lock e delay sem depender de memoria de funcao serverless.';
comment on table public.whatsapp_provider_logs is 'Logs sanitizados de envios por provider WhatsApp, sem tokens, headers ou payloads sensiveis.';
comment on column public.notification_events.audience is 'Destino logico do evento: internal para equipe interna, client para telefone do cliente.';
