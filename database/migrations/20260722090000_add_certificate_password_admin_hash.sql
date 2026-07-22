alter table public.configuracoes_sistema
  add column if not exists senha_admin_certificado_hash text;

comment on column public.configuracoes_sistema.senha_admin_certificado_hash is
  'Hash scrypt da senha administrativa exigida para revelar a senha criptografada de um certificado PFX.';
