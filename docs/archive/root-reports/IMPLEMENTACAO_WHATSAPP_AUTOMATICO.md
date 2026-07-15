# Implementacao WhatsApp Automatico via euAtendo

## Resumo executivo

Foi implementada a automacao server-side para envio de avisos WhatsApp usando a API euAtendo como provider de transporte.

As regras de certificados, vencimentos, templates, destinatarios internos, retry, delay, auditoria e dashboard permanecem no Sistema de Certificados. A euAtendo recebe apenas telefone de destino e mensagem ja renderizada.

O Desktop Bot nao foi removido. Ele continua como legado/fallback e consome apenas eventos `provider = whatsapp_desktop`.

## Arquitetura implementada

Fluxo atual com euAtendo:

```mermaid
flowchart TD
  Certificado[Cadastro/Renovacao/Configuracao] --> Rebuild[Notification Rebuild Service]
  Rebuild --> Events[notification_events]
  Cron[/api/cron/euatendo-dispatch]
  Cron --> RPC[reserve_euatendo_notification_event]
  RPC --> Dispatcher[EuAtendoNotificationDispatcher]
  Dispatcher --> Provider[EuAtendoWhatsAppProvider]
  Provider --> API[API euAtendo]
  Dispatcher --> Status[status sent/retry/failed]
  Dispatcher --> Logs[whatsapp_provider_logs]
  Dispatcher --> State[whatsapp_dispatcher_state]
```

## Alteracoes realizadas

- Eventos agora possuem `audience`:
  - `internal`: equipe interna.
  - `client`: cliente do certificado.
- Templates independentes:
  - `certificate_expiring`: equipe.
  - `certificate_expired`: equipe.
  - `client_certificate_expiring`: cliente.
  - `client_certificate_expired`: preparado para fase futura, inativo.
- Cliente ganhou controle:
  - `whatsapp_notifications_enabled`.
- O campo WhatsApp/telefone do cliente e opcional.
- O upload/cadastro permite bloquear notificacoes ao cliente sem bloquear avisos internos.
- O rebuild cria eventos internos e, quando permitido, eventos de cliente.
- O dispatcher euAtendo processa 1 evento por execucao.
- O delay minimo de 30 segundos e persistido no banco, sem `sleep` serverless.

## Banco alterado

Migration principal:

- `supabase/migrations/20260715100000_euatendo_automatic_dispatch.sql`

Atualizacoes tambem foram incorporadas ao:

- `supabase_schema.sql`

Objetos adicionados/alterados:

- `clientes.whatsapp_notifications_enabled`
- `notification_events.audience`
- `notification_events.provider_message_id`
- `notification_events.provider_status`
- `notification_events.dispatched_at`
- `notification_events.delivered_at`
- `notification_events.read_at`
- `whatsapp_dispatcher_state`
- `whatsapp_provider_logs`
- RPC `reserve_euatendo_notification_event`
- funcao `registrar_upload_certificado` com o novo parametro de permissao WhatsApp do cliente

## Variaveis necessarias

```env
EUATENDO_API_URL=https://apicluster.euatendo.app
EUATENDO_API_TOKEN=
EUATENDO_INSTANCE_ID=
EUATENDO_PROVIDER_ENABLED=true
CRON_SECRET=
```

`EUATENDO_API_TOKEN` deve existir apenas no backend/hospedagem. Nunca use `NEXT_PUBLIC`.

## Fluxo de criacao de eventos

1. O certificado e cadastrado, renovado ou uma configuracao de avisos e alterada.
2. O Notification Rebuild Service recalcula eventos futuros.
3. Para cada certificado dentro dos dias configurados, cria evento para a equipe interna.
4. Se euAtendo estiver ativo, telefone do cliente existir e o cliente permitir notificacoes, cria tambem evento de cliente.
5. Cada evento possui idempotency key propria.
6. Evento da equipe e evento do cliente sao independentes.

## Dispatcher

Arquivo principal:

- `src/lib/whatsapp/euatendo/dispatcher.ts`

Responsabilidades:

- verificar `EUATENDO_PROVIDER_ENABLED`;
- reservar atomicamente 1 evento;
- marcar `processing`;
- enviar texto pela euAtendo;
- atualizar `sent`, `retry` ou `failed`;
- registrar logs sanitizados;
- atualizar `next_allowed_send_at`;
- nunca processar em paralelo.

## Cron

Endpoint:

```http
POST /api/cron/euatendo-dispatch
Authorization: Bearer CRON_SECRET
```

Arquivo:

- `src/app/api/cron/euatendo-dispatch/route.ts`

Netlify:

- `netlify/functions/euatendo-dispatch.mjs`

Na Netlify o cron roda a cada minuto. O delay minimo de 30 segundos continua garantido pelo banco, mas a cadencia pratica maxima fica em 1 envio por minuto sem um agendador externo mais frequente.

## Retry

O retry reaproveita o mesmo evento.

Regras:

- HTTP 429 respeita `Retry-After` quando existir.
- Timeout, rede e 5xx entram em retry.
- 400/401/404 e erros permanentes falham sem loop infinito.
- Backoff padrao: 1 min, 5 min, 15 min, 30 min.
- `attempt_count` incrementa na tentativa real reservada.
- `max_attempts` vem de `notification_settings`.

## Delay

O envio nao usa `sleep(30000)`.

O estado fica em:

- `whatsapp_dispatcher_state.last_dispatch_at`
- `whatsapp_dispatcher_state.next_allowed_send_at`
- `whatsapp_dispatcher_state.locked_until`

O dispatcher so reserva quando `next_allowed_send_at <= now()`.

## Logs e observabilidade

Tabela:

- `whatsapp_provider_logs`

Registra:

- event id;
- provider;
- publico;
- telefone mascarado;
- template/tipo;
- duracao;
- status;
- tentativa;
- codigo de erro;
- mensagem sanitizada;
- response id quando existir.

Nao registra:

- token euAtendo;
- headers;
- senha de certificado;
- link publico;
- storage path;
- PFX;
- payload bruto sensivel.

## Interface

Atualizacoes:

- `Configuracoes`: templates separados para equipe e cliente.
- `Certificados`: WhatsApp opcional e bloqueio de notificacoes ao cliente.
- `Clientes`: mostra se avisos ao cliente estao permitidos ou bloqueados.
- `Avisos`: filtro por canal/provider e publico.
- `Canal WhatsApp`: status da euAtendo, fila, retries, falhas, enviados hoje/mes, tempo medio, logs recentes e estado do dispatcher.
- `Dashboard`: resumo de mensagens, pendentes, falhas, ultima sincronizacao e status euAtendo.

## Compatibilidade

- Desktop Bot continua existindo.
- Eventos legados `whatsapp_desktop` continuam separados.
- Eventos pendentes antigos nao foram migrados automaticamente para euAtendo.
- A ativacao da euAtendo ocorre por feature flag.

## Como ativar em producao

1. Aplicar `supabase/migrations/20260715100000_euatendo_automatic_dispatch.sql` no Supabase.
2. Configurar variaveis euAtendo no ambiente da hospedagem.
3. Testar conexao em `Canal WhatsApp`.
4. Verificar numero controlado.
5. Enviar mensagem de teste.
6. Definir `EUATENDO_PROVIDER_ENABLED=true`.
7. Salvar configuracoes ou executar rebuild para planejar eventos novos com provider euAtendo.
8. Garantir que o cron `/api/cron/euatendo-dispatch` esteja ativo.

## Rollback

1. Definir `EUATENDO_PROVIDER_ENABLED=false`.
2. Reativar/usar o Desktop Bot legado.
3. Reexecutar o rebuild se quiser gerar novos eventos para `whatsapp_desktop`.
4. Eventos euAtendo pendentes podem ser cancelados manualmente ou preservados para auditoria.

## Testes obrigatorios recomendados

- Cliente sem telefone: nao cria evento de cliente.
- Cliente com telefone: cria evento de cliente.
- Cliente bloqueado: nao cria evento de cliente.
- Multiplo destinatario interno: cria eventos internos independentes.
- Timeout/429/5xx: evento entra em retry.
- Erro permanente: evento fica failed.
- Duas execucoes concorrentes do cron: apenas uma reserva o evento.
- Cron repetido antes do delay: retorna `waiting`.
- Evento enviado: vira `sent` e grava log.
- Evento de equipe falhando nao cancela evento do cliente.

## Validacoes executadas

- `npx.cmd tsc --noEmit --pretty false`: aprovado durante a implementacao.

As validacoes finais de lint/build foram executadas ao final da tarefa e registradas na resposta final.

## Riscos residuais

- Netlify Scheduled Functions executam no minimo em cadencia de minuto; para envio real a cada 30 segundos sera necessario agendador externo ou worker persistente.
- Webhook euAtendo ainda nao foi ativado porque depende de confirmacao de assinatura/segredo do provider.
- Sem webhook, `sent` significa mensagem aceita pela euAtendo, nao entregue/lida.
- Eventos antigos nao sao migrados automaticamente para evitar troca silenciosa de provider.

## Melhorias futuras

- Implementar webhook autenticado da euAtendo.
- Adicionar tela administrativa para migrar eventos pendentes entre providers com confirmacao explicita.
- Criar testes automatizados com mocks de contrato da API euAtendo.
- Avaliar worker persistente se a operacao exigir throughput maior que 1 mensagem/minuto na Netlify.
