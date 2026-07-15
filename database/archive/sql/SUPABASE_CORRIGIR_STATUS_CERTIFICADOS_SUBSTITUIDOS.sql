-- Corrige a regra de substituicao de certificados e repara dados ja importados.
-- Execute no Supabase SQL Editor do projeto correto.
-- Nao apaga certificados, clientes, arquivos ou logins.

create or replace function public.registrar_upload_certificado(
  p_cnpj text,
  p_nome_razao_social text,
  p_email text,
  p_telefone text,
  p_whatsapp text,
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
  p_ip inet
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cliente_id uuid;
  v_certificado_id uuid;
  v_existing_latest_vencimento date;
  v_insert_status public.certificado_status := p_status;
begin
  if p_cnpj is null or p_cnpj !~ '^[0-9]{14}$' then
    raise exception 'cnpj_invalido';
  end if;

  insert into public.clientes (
    cnpj,
    nome_razao_social,
    email,
    telefone,
    whatsapp,
    responsavel,
    observacoes
  )
  values (
    p_cnpj,
    nullif(trim(p_nome_razao_social), ''),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_telefone, '')), ''),
    nullif(trim(coalesce(p_whatsapp, '')), ''),
    nullif(trim(coalesce(p_responsavel, '')), ''),
    nullif(trim(coalesce(p_observacoes, '')), '')
  )
  on conflict (cnpj) do update
    set
      nome_razao_social = coalesce(nullif(trim(excluded.nome_razao_social), ''), public.clientes.nome_razao_social),
      email = excluded.email,
      telefone = excluded.telefone,
      whatsapp = excluded.whatsapp,
      responsavel = excluded.responsavel,
      observacoes = excluded.observacoes,
      updated_at = now()
  returning id into v_cliente_id;

  select max(data_vencimento)
  into v_existing_latest_vencimento
  from public.certificados
  where cliente_id = v_cliente_id;

  if v_existing_latest_vencimento is null or p_data_vencimento >= v_existing_latest_vencimento then
    update public.certificados
    set status = 'substituido', updated_at = now()
    where cliente_id = v_cliente_id
      and status <> 'substituido';
  else
    v_insert_status := 'substituido';
  end if;

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
    v_insert_status,
    p_storage_path,
    p_nome_arquivo_original,
    p_hash_arquivo,
    p_criado_por
  )
  returning id into v_certificado_id;

  insert into public.audit_logs (user_id, acao, certificado_id, ip, metadata)
  values (
    p_criado_por,
    'upload_certificado',
    v_certificado_id,
    p_ip,
    jsonb_build_object('cnpj', p_cnpj, 'hash_arquivo', p_hash_arquivo)
  );

  return v_certificado_id;
end;
$$;

revoke all on function public.registrar_upload_certificado(
  text, text, text, text, text, text, text, text, text, text, text, date, date, public.certificado_status, text, text, text, uuid, inet
) from public, anon, authenticated;

grant execute on function public.registrar_upload_certificado(
  text, text, text, text, text, text, text, text, text, text, text, date, date, public.certificado_status, text, text, text, uuid, inet
) to service_role;

do $$
declare
  v_days int[];
  v_timezone text;
  v_today date;
  v_repaired integer := 0;
  v_refreshed integer := 0;
begin
  select
    coalesce(dias_aviso_vencimento, array[30,15,7]),
    coalesce(timezone, 'America/Sao_Paulo')
  into v_days, v_timezone
  from public.notification_settings
  where id = '00000000-0000-0000-0000-000000000001'::uuid;

  v_days := coalesce(v_days, array[30,15,7]);
  v_timezone := coalesce(v_timezone, 'America/Sao_Paulo');
  v_today := (now() at time zone v_timezone)::date;

  with ranked as (
    select
      id,
      row_number() over (
        partition by cliente_id
        order by data_vencimento desc, created_at desc, id desc
      ) as rn
    from public.certificados
  ),
  repaired as (
    update public.certificados c
    set
      status = case
        when ranked.rn = 1 then 'ativo'::public.certificado_status
        else 'substituido'::public.certificado_status
      end,
      updated_at = now()
    from ranked
    where ranked.id = c.id
      and c.status is distinct from case
        when ranked.rn = 1 then 'ativo'::public.certificado_status
        else 'substituido'::public.certificado_status
      end
    returning c.id
  )
  select count(*) into v_repaired from repaired;

  v_refreshed := public.refresh_certificado_statuses(v_days, v_today);

  raise notice 'certificados_reparados=%, certificados_status_atualizados=%', v_repaired, v_refreshed;
end;
$$;

select
  status,
  count(*) as total
from public.certificados
group by status
order by status;
