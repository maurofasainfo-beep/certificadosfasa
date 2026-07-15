# Revisao dos Avisos de Vencimento

## Resumo

Foi revisada a logica de planejamento, processamento e envio manual dos avisos de vencimento. A causa raiz encontrada para a configuracao "Avisos ativos" nao ser respeitada estava no servico de rebuild: ele removia eventos futuros antes de validar `notification_settings.enabled`. Isso fazia a operacao parecer ativa mesmo quando a automacao estava desabilitada.

Tambem foi criado um envio manual imediato pela tela de Certificados, usando o template configurado para cliente e a API euAtendo, sem criar eventos, sem alterar planejamento e sem acionar cron.

## Causa raiz

Arquivo: `src/lib/notifications/engine.ts`

No fluxo anterior de `rebuildNotificationSchedule`:

1. carregava `notification_settings`;
2. calculava data atual;
3. atualizava status dos certificados;
4. removia eventos futuros com `removeFutureUnsentEvents`;
5. somente depois verificava `settings.enabled`.

Esse ordenamento era incorreto. Quando "Avisos ativos" estava desligado, o servico ainda mexia no planejamento antes de retornar `notifications_disabled`.

## Logica corrigida

### Avisos ativos desligados

Quando `notification_settings.enabled = false`:

- `rebuildNotificationSchedule` nao remove eventos futuros;
- `rebuildNotificationSchedule` nao cria eventos;
- `runDueNotificationJob` nao cria vencidos diarios;
- `runDueNotificationJob` nao libera fila;
- `dispatchNextEuAtendoNotification` nao chama a RPC de reserva;
- a interface informa que a automacao esta pausada.

### Avisos ativos ligados

Quando `notification_settings.enabled = true`:

- o rebuild continua removendo eventos futuros ainda nao enviados;
- recria eventos de vencimento com idempotencia;
- respeita destinatarios internos;
- respeita eventos de cliente quando `EUATENDO_PROVIDER_ENABLED=true`;
- mantem retry, delay persistente e dispatcher euAtendo.

## Envio manual pelo certificado

Foi criada a rota:

`POST /api/certificados/:id/aviso`

Fluxo:

1. exige usuario `admin`;
2. valida `EUATENDO_PROVIDER_ENABLED`;
3. valida token e instancia euAtendo configurados;
4. busca certificado e cliente vinculado;
5. valida se o cliente permite avisos WhatsApp;
6. localiza telefone/WhatsApp do cliente;
7. normaliza telefone para formato brasileiro internacional;
8. carrega o template `client_certificate_expiring`;
9. calcula `{dias}` no momento do clique;
10. valida disponibilidade da API euAtendo;
11. valida numero no WhatsApp quando o provedor responde essa informacao;
12. envia a mensagem imediatamente;
13. registra `audit_logs`;
14. registra `whatsapp_provider_logs` sanitizado.

O envio manual:

- nao cria `notification_events`;
- nao altera planejamento;
- nao altera cron;
- nao altera eventos futuros;
- nao usa os dias configurados como filtro;
- usa apenas o template configurado para cliente.

## Arquivos alterados

- `src/lib/notifications/engine.ts`
- `src/lib/whatsapp/euatendo/dispatcher.ts`
- `src/app/api/certificados/[id]/aviso/route.ts`
- `src/app/(internal)/certificados/manual-notice-button.tsx`
- `src/app/(internal)/certificados/page.tsx`
- `src/app/(internal)/configuracoes/configuracoes-form.tsx`

## Banco de dados

Nao houve alteracao estrutural de banco nesta revisao.

A funcao SQL `reserve_euatendo_notification_event` ja valida `notification_settings.enabled` antes de reservar eventos. A correcao adicional foi feita no dispatcher TypeScript para evitar chamar a reserva quando os avisos estiverem desligados.

## Validacoes realizadas

- `npx.cmd tsc --noEmit --pretty false`: aprovado.
- `npm.cmd run lint`: aprovado.
- `npm.cmd run build`: aprovado.
- `git diff --check`: aprovado, apenas avisos de conversao LF/CRLF ja existentes no ambiente Windows.

## Testes funcionais cobertos por codigo

- Avisos ativos desligados nao recriam planejamento.
- Botao "Atualizar planejamento" exibe mensagem de automacao pausada quando aplicavel.
- Dispatcher euAtendo nao reserva fila com avisos desligados.
- Envio manual valida telefone ausente.
- Envio manual valida telefone invalido.
- Envio manual valida template do cliente.
- Envio manual valida provider euAtendo ativo.
- Envio manual valida disponibilidade da API antes do disparo.
- Envio manual usa `{dias}` recalculado na hora.
- Envio manual nao cria evento e nao mexe no planejamento.

## Testes manuais recomendados

1. Desligar "Avisos ativos", salvar e clicar em "Atualizar planejamento".
   - Esperado: mensagem de automacao pausada, zero avisos recriados.

2. Com "Avisos ativos" desligado, chamar o cron `/api/cron/certificados-vencimentos`.
   - Esperado: retorno com `skipped_reason = notifications_disabled`.

3. Com "Avisos ativos" desligado, chamar `/api/cron/euatendo-dispatch`.
   - Esperado: retorno `disabled` ou `notifications_disabled`, sem envio.

4. Ligar "Avisos ativos", salvar e atualizar planejamento.
   - Esperado: eventos recriados conforme dias configurados.

5. Em Certificados, clicar "Aviso" em cliente sem telefone.
   - Esperado: erro amigavel.

6. Em Certificados, clicar "Aviso" com telefone valido e euAtendo ativa.
   - Esperado: mensagem enviada e log sanitizado.

7. Clicar "Aviso" rapidamente varias vezes.
   - Esperado: botao fica em loading e evita clique simultaneo no mesmo componente.

## Riscos remanescentes

- O envio manual real depende da API euAtendo estar disponivel e da instancia estar conectada.
- O botao manual esta liberado somente para `admin`. Se a operacao tambem precisar ser feita pelo perfil financeiro, a permissao deve ser ampliada conscientemente.
- Eventos pendentes antigos nao sao apagados quando "Avisos ativos" e desligado. Eles tambem nao sao processados enquanto a configuracao estiver desligada. Ao religar, eles podem voltar a ficar elegiveis se ainda atenderem as regras.

## Confirmacoes

- A configuracao "Avisos ativos" passou a ser respeitada antes de qualquer remocao/criacao de planejamento.
- O dispatcher euAtendo passou a respeitar "Avisos ativos" antes de reservar mensagens.
- O botao "Aviso" realiza envio imediato com template configurado para cliente.
- O envio manual nao interfere no planejamento automatico.
