# Indice da Documentacao

## Fonte oficial

- [`SYSTEM_CONTEXT.md`](SYSTEM_CONTEXT.md): contexto mestre do projeto. Deve ser lido antes de qualquer implementacao.

## Documentos especificos

- [`01_ARQUITETURA.md`](01_ARQUITETURA.md): arquitetura geral.
- [`02_FLUXO_COMPLETO.md`](02_FLUXO_COMPLETO.md): fluxos ponta a ponta.
- [`03_BANCO_DE_DADOS.md`](03_BANCO_DE_DADOS.md): schema, tabelas, relacoes e SQL.
- [`04_NOTIFICACOES.md`](04_NOTIFICACOES.md): notification engine, outbox, retries e idempotencia.
- [`05_WHATSAPP_EUATENDO.md`](05_WHATSAPP_EUATENDO.md): integracao euAtendo, dispatcher e homologacao.
- [`06_FRONTEND.md`](06_FRONTEND.md): telas e componentes.
- [`07_BACKEND.md`](07_BACKEND.md): APIs, jobs e providers.
- [`08_DEPLOY.md`](08_DEPLOY.md): deploy, variaveis e cron.
- [`09_HISTORICO.md`](09_HISTORICO.md): historico tecnico consolidado.
- [`10_REFERENCIA_TECNICA.md`](10_REFERENCIA_TECNICA.md): mapas rapidos de arquivos, endpoints e operacao.

## Banco de dados

- [`../database/schema/supabase_schema.sql`](../database/schema/supabase_schema.sql): schema oficial para banco novo.
- [`../database/migrations/`](../database/migrations/): migrations incrementais.
- [`../database/scripts/`](../database/scripts/): scripts manuais realmente uteis.
- [`../database/archive/`](../database/archive/): SQL historico ou substituido.

## Referencias

- [`reference/euatendo-api/`](reference/euatendo-api/): material bruto preservado da documentacao da API euAtendo.
- [`../CHANGELOG.md`](../CHANGELOG.md): changelog do projeto.
- [`../DOCUMENTACAO_CONSOLIDADA.md`](../DOCUMENTACAO_CONSOLIDADA.md): relatorio desta consolidacao.
- [`../RELATORIO_REFATORACAO_VISUAL_UX.md`](../RELATORIO_REFATORACAO_VISUAL_UX.md): relatorio da refatoracao visual e UX.
- [`../UX_WRITING_MAP.md`](../UX_WRITING_MAP.md): inventario de textos alterados.
- [`../CHECKLIST_UI_UX.md`](../CHECKLIST_UI_UX.md): checklist visual, responsivo e acessivel.

## Historico

- [`archive/`](archive/): auditorias, relatorios intermediarios e documentos substituidos. Use apenas para contexto historico. Quando houver conflito, o codigo atual e `SYSTEM_CONTEXT.md` prevalecem.
