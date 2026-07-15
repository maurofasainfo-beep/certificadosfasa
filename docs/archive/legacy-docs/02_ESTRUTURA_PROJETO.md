# 02 - Estrutura do Projeto

## Arvore resumida

```text
certificadosfasa/
  src/
    app/
      (auth)/
      (internal)/
      api/
      download/
      layout.tsx
      page.tsx
    components/
      layout/
      ui/
    lib/
      api/
      auth/
      certificados/
      crypto/
      download/
      notifications/
      pfx/
      security/
      storage/
      supabase/
      utils/
      validations/
      whatsapp/
  netlify/
    functions/
  scripts/
  docs/
  documentacao-api-euatendo/
  supabase/
    migrations/
  supabase_schema.sql
  README.md
  package.json
  next.config.ts
  middleware.ts
```

## `src/app`

Contem as rotas App Router.

- `src/app/page.tsx`: redireciona `/` para `/dashboard`.
- `src/app/layout.tsx`: layout raiz com fonte de sistema local.
- `src/app/(auth)/login`: tela de login.
- `src/app/(internal)`: rotas autenticadas.
- `src/app/download/[token]`: tela publica de download protegido.
- `src/app/api`: backend HTTP.

## `src/app/(internal)`

Rotas administrativas:

- `dashboard`: painel com metricas, graficos e atencoes.
- `certificados`: listagem, upload, importacao, detalhe e envio manual de aviso.
- `clientes`: listagem de clientes.
- `notificacoes`: avisos/eventos de notificacao.
- `whatsapp`: Canal WhatsApp com euAtendo, health check e testes controlados.
- `configuracoes`: configuracoes de avisos, templates e destinatarios.

O layout interno em `src/app/(internal)/layout.tsx` chama `requireInternalUser()` e renderiza `AppShell`.

## `src/app/api`

APIs de dominio e infraestrutura:

- `certificados`: listagem, upload, importacao, detalhe, exclusao, link e aviso manual.
- `clientes`: listagem e cadastro.
- `configuracoes`: endpoint legado de configuracoes.
- `notifications`: settings, templates, recipients, events e rebuild.
- `whatsapp/euatendo`: health check, verificacao de numero e mensagem de teste.
- `download`: validacao publica do link.
- `cron`: jobs de vencimentos e dispatcher euAtendo.
- `admin/storage/reconcile`: reconciliacao de Storage.
- `auth/logout`: encerramento de sessao.

As rotas antigas de bot local foram removidas. O backend nao expoe mais endpoints de polling, device, assinatura local ou confirmacao externa de envio.

## `src/components`

Componentes reutilizaveis.

- `layout`: shell, navegacao, logo, logout e transicao de pagina.
- `ui`: cards, tabelas, badges, graficos, filtros, empty states e utilitarios visuais.

## `src/lib`

Camada de dominio e infraestrutura.

- `api`: helpers de erro HTTP.
- `auth`: RBAC e validacao de usuario nas APIs.
- `certificados`: upload, status e renovacao.
- `crypto`: criptografia AES-256-GCM de segredos.
- `download`: token e senha do link publico.
- `notifications`: engine de avisos, validacao e filtros.
- `pfx`: leitura e parsing PFX.
- `security`: rate limit generico server-side.
- `storage`: operacoes de PFX no Storage e reconciliacao.
- `supabase`: clientes SSR, browser e admin.
- `utils`: formatadores, telefone, classes CSS.
- `validations`: schemas Zod.
- `whatsapp/euatendo`: cliente HTTP, provider, dispatcher e schemas da API euAtendo.

## `netlify`

Contem funcoes agendadas:

- `netlify/functions/certificados-vencimentos.mjs`: chama `/api/cron/certificados-vencimentos`.
- `netlify/functions/euatendo-dispatch.mjs`: chama `/api/cron/euatendo-dispatch`.

## `scripts`

Contem script operacional:

- `scripts/clear-certificate-storage.mjs`: limpa objetos do bucket `certificados-pfx` mediante `--confirm`.

## Arquivos raiz relevantes

- `supabase_schema.sql`: schema completo para Supabase.
- `package.json`: scripts e dependencias.
- `next.config.ts`: bundle analyzer e root Turbopack.
- `middleware.ts`: protecao inicial de rotas.
- `netlify.toml`: configuracao de deploy Netlify.
- `.env` e `.env.example`: variaveis de ambiente, sem valores sensiveis versionados.

## Documentacao Markdown existente

Os documentos em `docs/` descrevem a arquitetura atual com Canal WhatsApp via euAtendo. Relatorios `RELATORIO_*.md` e arquivos de analise historica registram decisoes passadas e devem ser lidos como contexto, nao como contrato operacional quando conflitarem com o codigo atual.

## Diretorios ausentes relevantes

Nao existe `desktop-bot/` no checkout atual. O canal oficial de WhatsApp e server-side via euAtendo.
