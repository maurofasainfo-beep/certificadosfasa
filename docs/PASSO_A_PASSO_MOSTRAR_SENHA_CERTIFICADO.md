# Passo a passo para configurar o botao Mostrar senha

Este guia configura a senha administrativa exigida para revelar a senha PFX de um certificado dentro da tela de detalhes.

## O que essa funcao faz

- Mostra um botao `Mostrar senha` dentro de `/certificados/[id]`.
- Solicita uma senha administrativa.
- Valida essa senha no servidor.
- Se estiver correta, revela a senha PFX do certificado especifico.
- Registra auditoria da acao.
- Nao salva senha digitada nem senha PFX em logs.

## Importante

Nao salve a senha administrativa em texto puro no Supabase.

O Supabase deve receber somente o hash gerado, no formato:

```text
scrypt$...
```

## 1. Abrir o SQL Editor do Supabase

1. Acesse o painel do Supabase.
2. Abra o projeto do sistema Fasa Certificados.
3. Clique em `SQL Editor`.
4. Clique em `New query`.

## 2. Criar a coluna no banco

Cole e execute este SQL:

```sql
alter table public.configuracoes_sistema
  add column if not exists senha_admin_certificado_hash text;

comment on column public.configuracoes_sistema.senha_admin_certificado_hash is
  'Hash scrypt da senha administrativa exigida para revelar a senha criptografada de um certificado PFX.';
```

Se o Supabase responder que executou com sucesso, siga para o proximo passo.

## 3. Gerar o hash da senha administrativa

No PowerShell, execute:

```powershell
cd C:\Users\User\certificadosfasa
$env:CERTIFICATE_ADMIN_PASSWORD="COLOQUE_A_SENHA_ADMIN_AQUI"
npm run security:hash-cert-admin-password
```

Exemplo:

```powershell
cd C:\Users\User\certificadosfasa
$env:CERTIFICATE_ADMIN_PASSWORD="MinhaSenhaForte123"
npm run security:hash-cert-admin-password
```

Use uma senha forte e guarde essa senha com seguranca. Ela sera a senha digitada no campo `Senha administrativa`.

## 4. Copiar o SQL gerado

O comando vai mostrar uma saida parecida com esta:

```sql
update public.configuracoes_sistema
set senha_admin_certificado_hash = 'scrypt$16384$8$1$...',
    updated_at = now()
where id = '00000000-0000-0000-0000-000000000001'::uuid;
```

Copie o `UPDATE` completo gerado pelo comando.

Nao use o exemplo acima literalmente, porque ele esta incompleto.

## 5. Salvar o hash no Supabase

Volte ao `SQL Editor` do Supabase.

Cole o `UPDATE` gerado no passo anterior e execute.

Depois disso, a tabela `configuracoes_sistema` tera o hash da senha administrativa.

## 6. Testar localmente

No PowerShell:

```powershell
cd C:\Users\User\certificadosfasa
npm run dev
```

Abra o sistema local:

```text
http://localhost:3000
```

Depois:

1. Entre com usuario admin.
2. Abra `Certificados`.
3. Abra um certificado especifico.
4. Clique em `Mostrar senha`.
5. Digite a senha administrativa usada no passo 3.
6. Clique em `Revelar senha`.

Se a senha estiver correta, o sistema vai mostrar a senha PFX daquele certificado.

## 7. Erros comuns

### Mensagem: Senha administrativa nao configurada

Significa que o hash ainda nao foi salvo em `configuracoes_sistema.senha_admin_certificado_hash`.

Resolva executando os passos 3, 4 e 5.

### Mensagem: Senha administrativa incorreta

Significa que a senha digitada no painel nao bate com o hash salvo no Supabase.

Resolva conferindo se voce digitou a mesma senha usada em `CERTIFICATE_ADMIN_PASSWORD`.

### Mensagem: Nao foi possivel revelar a senha deste certificado

Pode indicar problema na chave `CERT_ENCRYPTION_KEY` ou nos dados criptografados do certificado.

Nesse caso, confira se o ambiente local esta usando a mesma `CERT_ENCRYPTION_KEY` usada quando o certificado foi importado.

## 8. Arquivos alterados pela funcionalidade

- `src/app/(internal)/certificados/[id]/certificate-password-reveal.tsx`
- `src/app/(internal)/certificados/[id]/page.tsx`
- `src/app/api/certificados/[id]/senha/route.ts`
- `src/lib/validations/certificados.ts`
- `src/lib/supabase/database.types.ts`
- `database/migrations/20260722090000_add_certificate_password_admin_hash.sql`
- `database/schema/supabase_schema.sql`
- `scripts/hash-certificate-admin-password.mjs`
- `package.json`

## 9. Observacao sobre Vercel

Esta etapa nao publica nada na Vercel.

Para funcionar em producao futuramente, sera necessario:

1. Aplicar a alteracao SQL no Supabase de producao.
2. Salvar o hash da senha administrativa no Supabase de producao.
3. Fazer push/deploy do codigo quando for decidido publicar.
