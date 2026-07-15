# Analise Atual da Integracao euAtendo

## Resumo executivo

O Sistema de Certificados Fasa usa a API euAtendo como canal oficial de envio WhatsApp. A regra de negocio permanece no backend do sistema: certificados, clientes, destinatarios, templates, dias de aviso, eventos, retry, delay e auditoria continuam controlados internamente.

A euAtendo atua apenas como provedor de transporte. Ela recebe numero de destino e mensagem ja renderizada, sem acessar certificados, clientes, senhas, Storage ou regras de vencimento.

## Estado atual

Fluxo operacional:

```text
Certificados / Configuracoes
  -> Notification Engine
  -> notification_events
  -> Dispatcher euAtendo
  -> EuAtendoWhatsAppProvider
  -> API euAtendo
  -> WhatsApp
```

O canal local anterior foi removido do runtime. Novos eventos usam `provider = 'euatendo'`.

## Documentacao euAtendo analisada

Pasta analisada:

- `documentacao-api-euatendo/`

Arquivos principais:

- `DOCUMENTACAO_COMPLETA_API_EUATENDO.md`
- `REANALISE_COMPLETA_API_EUATENDO.md`
- `api_endpoints_extraidos.json`
- `endpoints.csv`
- `campos_por_endpoint.csv`
- `postman_collection.json`

Endpoints usados nesta implementacao:

- `GET /list-instances`
- `POST /check-instance-status`
- `POST /check-number-whatsapp`
- `POST /send-text-message`
- `POST /get-message-status`, quando houver identificador compativel.

## Arquitetura implementada

Modulos principais:

- `src/lib/whatsapp/euatendo/config.ts`: leitura e validacao de variaveis server-only.
- `src/lib/whatsapp/euatendo/client.ts`: cliente HTTP com Bearer Token, timeout e erros sanitizados.
- `src/lib/whatsapp/euatendo/provider.ts`: contrato de provider WhatsApp.
- `src/lib/whatsapp/euatendo/dispatcher.ts`: reserva evento, envia, aplica retry/backoff e atualiza status.
- `src/app/api/whatsapp/euatendo/*`: rotas administrativas de teste.
- `src/app/api/cron/euatendo-dispatch/route.ts`: execucao protegida por `CRON_SECRET`.

## Seguranca

- Token euAtendo fica apenas em variavel server-only.
- O frontend nunca recebe token, headers sensiveis ou resposta bruta.
- Logs e respostas sao sanitizados.
- O dispatcher nao recebe senha de certificado, link publico, storage path ou arquivo PFX.
- Cron exige `CRON_SECRET`.
- Rotas administrativas exigem usuario autenticado e perfil admin.

## Banco de dados

Tabelas preservadas:

- `notification_settings`
- `notification_templates`
- `notification_recipients`
- `notification_events`
- `notification_runs`
- `whatsapp_provider_state`
- `whatsapp_provider_logs`
- `audit_logs`

Campos importantes em `notification_events`:

- `provider`
- `provider_message_id`
- `provider_status`
- `dispatched_at`
- `sent_at`
- `failed_at`
- `delivered_at`
- `read_at`
- `attempt_count`
- `max_attempts`
- `next_retry_at`
- `reservation_id`
- `reservation_expires_at`

## Delay, retry e idempotencia

- O dispatcher processa no maximo uma mensagem por execucao.
- O delay minimo e persistido por provider em `whatsapp_provider_state`.
- Retry reutiliza o mesmo evento.
- `idempotency_key` continua unica.
- Falhas temporarias usam backoff.
- Falhas permanentes encerram o evento conforme limite de tentativas.

## Dashboard e Canal WhatsApp

Dashboard exibe metricas de negocio: certificados, avisos, falhas e status resumido do canal.

A tela Canal WhatsApp concentra:

- health check;
- status da instancia;
- mensagem de teste;
- verificacao de numero;
- pendentes;
- retries;
- falhas;
- ultimos envios.

## Riscos atuais

| Risco | Impacto | Mitigacao |
|---|---|---|
| euAtendo fora do ar | avisos atrasam | retry/backoff e health check |
| token ausente/incorreto | envio bloqueado | erro server-side claro e sem vazamento |
| cron pouco frequente | fila processa mais devagar | configurar agendamento conforme ambiente |
| volume alto de eventos | rebuild/listagens podem pesar | paginacao, indices e futura otimizacao set-based |

## Recomendacao

Manter a euAtendo como canal oficial e remover qualquer dependencia operacional do canal local antigo. Historicos de migrations antigas podem permanecer no reposititorio, desde que a migration final remova as estruturas legadas no banco aplicado.
