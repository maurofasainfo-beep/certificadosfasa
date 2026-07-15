# 08 - Certificados

## Objetivo do modulo

Gerenciar certificados digitais PFX de clientes, com validacao de senha, extracao de dados, armazenamento seguro e acompanhamento de validade.

## Arquivos principais

- `src/app/(internal)/certificados/page.tsx`
- `src/app/(internal)/certificados/novo/page.tsx`
- `src/app/(internal)/certificados/novo/upload-certificate-form.tsx`
- `src/app/(internal)/certificados/importar/page.tsx`
- `src/app/(internal)/certificados/importar/bulk-import-certificates-form.tsx`
- `src/app/(internal)/certificados/[id]/page.tsx`
- `src/app/api/certificados/route.ts`
- `src/app/api/certificados/upload/route.ts`
- `src/app/api/certificados/importar/route.ts`
- `src/app/api/certificados/[id]/route.ts`
- `src/lib/certificados/upload-service.ts`
- `src/lib/certificados/status.ts`
- `src/lib/pfx/parse.ts`
- `src/lib/storage/certificates.ts`

## Upload individual

Entrada:

- arquivo `.pfx`;
- senha real do certificado;
- nome/razao social;
- WhatsApp;
- CNPJ manual opcional;
- email opcional;
- cliente manual opcional.

Validacoes:

- admin obrigatorio;
- arquivo presente;
- extensao `.pfx`;
- buffer nao vazio;
- primeiro byte `0x30`, indicando estrutura ASN.1 DER;
- senha obrigatoria;
- dados de cliente via Zod.

Parsing:

- `node-forge` abre PKCS#12.
- O codigo tenta localizar certificado com CNPJ.
- Extrai CNPJ de campos de subject/extensoes.
- Extrai titular e datas de validade.

Erros:

- senha incorreta ou arquivo invalido retornam mensagem generica.
- algoritmo PKCS#12 nao suportado deve ser tratado como erro de parsing, sem crash.

## Criptografia da senha

Implementacao em `src/lib/crypto/secrets.ts`.

- Algoritmo: AES-256-GCM.
- Chave: `CERT_ENCRYPTION_KEY`, 32 bytes em base64.
- IV aleatorio de 12 bytes.
- Auth tag de 16 bytes.
- Campos salvos: `senha_ciphertext`, `senha_iv`, `senha_auth_tag`.

## Storage

Implementacao em `src/lib/storage/certificates.ts`.

Path:

```text
certificados/{cnpj}/certificado.pfx
```

Renovacao sobrescreve o arquivo com `upsert: true`.

## Banco

Tabela `certificados` guarda:

- cliente;
- CNPJ;
- titular;
- datas;
- status;
- hash do arquivo;
- caminho de Storage;
- senha criptografada;
- timestamps.

Existe uma constraint efetiva de um certificado por cliente por meio do indice unico `certificados_um_por_cliente_idx`.

## Renovacao

A implementacao atual nao cria outro registro quando encontra certificado existente.

Fluxo:

1. Upload recebe novo PFX.
2. Identifica cliente por `cliente_id_manual` ou CNPJ.
3. Busca certificado existente.
4. Faz upload do novo objeto Storage.
5. Chama `registrar_upload_certificado`.
6. A RPC atualiza a linha existente.
7. Rebuild de notificacoes e executado.

O status `substituido` nao existe mais no enum atual.

## Importacao em massa

Arquivos:

- UI: `bulk-import-certificates-form.tsx`
- API: `src/app/api/certificados/importar/route.ts`

Regras reais do codigo:

- Usa `webkitdirectory`.
- Agrupa arquivos por pasta.
- Aceita `.pfx` e `.txt`.
- Pastas internas sao ignoradas conforme a heuristica de profundidade.
- A senha vem do nome do arquivo `.txt`, nao do conteudo.
- Tamanho de lote no cliente: 5 certificados e 20 arquivos por batch.
- API limita a 240 arquivos e 80 certificados por chamada.
- Para importacao em massa, telefone nao e obrigatorio.
- Nome do cliente pode ser derivado do nome do PFX.

## Status

Status persistidos:

- `ativo`
- `vencendo`
- `vencido`
- `invalido`

O status tambem pode ser calculado dinamicamente por `getCertificateRuntimeStatus()` em `src/lib/certificados/status.ts`, considerando `data_vencimento` e dias configurados.

## Exclusao

Endpoint:

- `DELETE /api/certificados/:id`

Fluxo:

1. Valida admin.
2. Busca certificado.
3. Cria job de reconciliacao.
4. Faz backup do objeto Storage.
5. Remove Storage se path nao estiver compartilhado.
6. Chama RPC `excluir_certificado_com_cliente`.
7. Remove cliente se nao houver outros certificados.
8. Rebuild de notificacoes.

Risco residual: nao existe transacao distribuida real entre Storage e Postgres.

## Links publicos

Gerenciados por:

- `download-link-manager.tsx`
- `src/app/api/certificados/[id]/link/route.ts`
- `src/app/download/[token]`
- `src/app/api/download/[token]/validar/route.ts`

O link ativo continua apontando para o certificado atualizado porque referencia `certificado_id` e o Storage path padrao e sobrescrito na renovacao.
