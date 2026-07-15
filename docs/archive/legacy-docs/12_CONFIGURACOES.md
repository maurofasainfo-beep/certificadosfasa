# 12 - Configuracoes

## Objetivo

Centralizar regras de avisos, templates, destinatarios internos, templates de cliente e comportamento do Canal WhatsApp.

## Arquivos principais

- `src/app/(internal)/configuracoes/page.tsx`
- `src/app/(internal)/configuracoes/configuracoes-form.tsx`
- `src/app/api/notifications/settings/route.ts`
- `src/app/api/notifications/configuration-bundle/route.ts`
- `src/app/api/notifications/templates/route.ts`
- `src/app/api/notifications/templates/[id]/route.ts`
- `src/app/api/notifications/recipients/route.ts`
- `src/app/api/notifications/recipients/[id]/route.ts`
- `src/lib/notifications/validation.ts`

## Configuracoes de aviso

Tabela:

- `notification_settings`

Campos principais:

- notificacoes ativas;
- avisos diarios de vencidos ativos;
- dias de aviso;
- delay minimo/maximo entre envios;
- maximo de tentativas;
- intervalo de polling operacional do dispatcher/agendador;
- janela de envio;
- timezone.

Quando `enabled` estiver desligado, o backend nao deve criar planejamento automatico, processar dispatcher automatico ou gerar novos eventos de aviso.

## Templates

Tabela:

- `notification_templates`

Templates esperados:

- `certificate_expiring`: certificado a vencer para equipe interna;
- `certificate_expired`: resumo diario de certificados vencidos para equipe interna;
- templates de cliente WhatsApp quando habilitados no fluxo atual.

O formulario principal salva configuracoes e templates por `/api/notifications/configuration-bundle`, reduzindo multiplos rebuilds em um unico clique.

## Destinatarios internos

Tabela:

- `notification_recipients`

Regras:

- limite de 5;
- telefone normalizado;
- duplicidade evitada;
- admin cria/altera/remove;
- financeiro visualiza.

## Canal WhatsApp

O canal oficial usa a API euAtendo. Credenciais ficam apenas em variaveis server-only:

- `EUATENDO_API_URL`
- `EUATENDO_API_TOKEN`
- `EUATENDO_INSTANCE_ID`
- `EUATENDO_PROVIDER_ENABLED`

Esses valores nao sao retornados ao frontend.

## Configuracao legada

Existe endpoint e tabela de `configuracoes_sistema`, mas o fluxo ativo de avisos usa `notification_settings`, `notification_templates` e `notification_recipients`.

## Efeito ao salvar

Ao salvar configuracoes relevantes:

1. valida dados;
2. grava settings/templates;
3. executa um rebuild de notificacoes quando aplicavel;
4. retorna resultado consolidado.

## Variaveis de template

O editor deve usar somente variaveis aceitas pelo backend. Variaveis ausentes no contexto sao substituidas por vazio no renderizador, sem expor dados sensiveis.
