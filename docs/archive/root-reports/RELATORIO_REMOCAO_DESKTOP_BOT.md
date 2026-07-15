# Relatorio de Remocao do Desktop Bot

## 1. Resumo executivo

O legado do Desktop Bot foi removido do runtime do Sistema de Certificados Fasa. O Canal WhatsApp oficial passa a ser exclusivamente a API euAtendo, consumida pelo backend por meio do dispatcher server-side.

O fluxo final e:

```text
notification_events
  -> Dispatcher euAtendo
  -> EuAtendoWhatsAppProvider
  -> API euAtendo
  -> WhatsApp
```

O codigo ativo nao possui mais rotas `/api/whatsapp-bot/*`, rotas de devices locais, modulo QWEP, heartbeat, polling externo ou ACK de bot. O schema completo e a migration incremental removem as tabelas/funcoes legadas e impedem novos eventos com provider antigo.

## 2. Causa e objetivo da remocao

A integracao euAtendo ja estava funcional e homologada. Manter dois consumidores de fila criaria risco de disputa por eventos, duplicidade de envio e complexidade operacional. A remocao consolida um unico canal oficial de WhatsApp.

## 3. Arquivos removidos

APIs antigas:

- `src/app/api/whatsapp-bot/auth/validate/route.ts`
- `src/app/api/whatsapp-bot/status/heartbeat/route.ts`
- `src/app/api/whatsapp-bot/messages/pending/route.ts`
- `src/app/api/whatsapp-bot/messages/stats/route.ts`
- `src/app/api/whatsapp-bot/messages/[id]/ack/route.ts`
- `src/app/api/whatsapp/devices/route.ts`
- `src/app/api/whatsapp/devices/[id]/primary/route.ts`
- `src/app/api/whatsapp/devices/[id]/revoke/route.ts`

Modulos antigos:

- `src/lib/qwep/auth.ts`
- `src/lib/qwep/crypto.ts`
- `src/lib/qwep/rate-limit.ts`

Interface antiga:

- `src/app/(internal)/whatsapp/whatsapp-devices-panel.tsx`
- `docs/11_WHATSAPP_BOT.md`

Diretorio `desktop-bot/`: ausente neste checkout, portanto nao havia pacote local a remover.

## 4. Arquivos alterados

Principais:

- `README.md`
- `RELATORIO_IMPLEMENTACAO_EUATENDO.md`
- `middleware.ts`
- `eslint.config.mjs`
- `src/app/(internal)/dashboard/page.tsx`
- `src/app/(internal)/whatsapp/page.tsx`
- `src/app/(internal)/configuracoes/configuracoes-form.tsx`
- `src/app/(internal)/configuracoes/page.tsx`
- `src/app/(internal)/notificacoes/page.tsx`
- `src/app/api/notifications/events/route.ts`
- `src/app/api/notifications/events/[id]/retry/route.ts`
- `src/lib/notifications/engine.ts`
- `src/lib/notifications/validation.ts`
- `src/lib/supabase/database.types.ts`
- `src/lib/whatsapp/euatendo/config.ts`
- `src/lib/whatsapp/euatendo/types.ts`
- `src/lib/whatsapp/euatendo/dispatcher.ts`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `supabase_schema.sql`

Novos/atualizados:

- `src/app/(internal)/whatsapp/canal-whatsapp-panel.tsx`
- `src/lib/security/rate-limit.ts`
- `docs/11_CANAL_WHATSAPP.md`
- `docs/integracoes/EUATENDO_IMPLEMENTACAO.md`
- `supabase/migrations/20260715140000_remove_desktop_bot_legacy.sql`

## 5. APIs removidas

As rotas antigas de bot nao aparecem no build final:

- `/api/whatsapp-bot/auth/validate`
- `/api/whatsapp-bot/status/heartbeat`
- `/api/whatsapp-bot/messages/pending`
- `/api/whatsapp-bot/messages/:id/ack`
- `/api/whatsapp-bot/messages/stats`
- `/api/whatsapp/devices`
- `/api/whatsapp/devices/:id/primary`
- `/api/whatsapp/devices/:id/revoke`

APIs euAtendo preservadas:

- `/api/whatsapp/euatendo/health`
- `/api/whatsapp/euatendo/check-number`
- `/api/whatsapp/euatendo/test-message`
- `/api/cron/euatendo-dispatch`

## 6. Modulos QWEP removidos

Foram removidos o protocolo local de autenticacao do bot, incluindo:

- Bearer token de device;
- assinatura HMAC;
- nonce/timestamp/body hash;
- protecao de replay especifica do bot;
- rate limit persistente especifico do bot;
- validacao de device principal.

O rate limit reutilizado pelas rotas administrativas euAtendo foi movido para `src/lib/security/rate-limit.ts`.

## 7. Variaveis removidas

Nao restam variaveis operacionais do bot local em `.env.example`/documentacao operacional. Permanecem as variaveis oficiais:

- `EUATENDO_API_URL`
- `EUATENDO_API_TOKEN`
- `EUATENDO_INSTANCE_ID`
- `EUATENDO_PROVIDER_ENABLED`
- `CRON_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CERT_ENCRYPTION_KEY`

## 8. Tabelas removidas

A migration incremental remove:

- `public.whatsapp_devices`
- `public.whatsapp_device_logs`
- `public.qwep_seen_nonces`
- `public.qwep_rate_limit_buckets`

O schema completo tambem contem comandos de limpeza para esses objetos quando aplicado sobre banco existente.

## 9. RPCs removidas

A migration remove:

- `public.reserve_pending_notification_events(...)`
- `public.get_whatsapp_bot_message_stats()`
- `public.cleanup_qwep_operational_tables()`

Foram preservadas/adaptadas funcoes genericas usadas pela euAtendo:

- `public.reserve_euatendo_notification_event(...)`
- `public.release_expired_notification_reservations()`
- `public.get_dashboard_metrics()`

## 10. Policies removidas

A migration remove policies exclusivas das tabelas antigas quando elas existirem:

- leitura/gestao de devices;
- leitura de logs de device.

As policies das tabelas ativas de certificados, clientes, avisos, provider logs e configuracoes foram preservadas.

## 11. Triggers removidos

A migration remove:

- `set_whatsapp_devices_updated_at` sobre `public.whatsapp_devices`.

Foi adicionado trigger de protecao:

- `prevent_legacy_whatsapp_desktop_provider`, para bloquear novos eventos com provider antigo em bancos que ainda possuam historico desse provider.

## 12. Indices removidos

A migration remove indices exclusivos:

- `whatsapp_devices_one_primary_idx`
- `whatsapp_devices_status_idx`
- `whatsapp_devices_token_hash_idx`
- `whatsapp_devices_primary_sender_status_idx`
- `whatsapp_device_logs_device_created_idx`
- `qwep_seen_nonces_expires_idx`
- `qwep_rate_limit_buckets_reset_idx`

Foram preservados indices da fila `notification_events` e indices do provider euAtendo.

## 13. Dados historicos preservados

`notification_events` nao foi apagada. Eventos historicos finalizados podem permanecer com provider antigo no banco migrado para fins de auditoria, mas a aplicacao nao cria novos eventos desse tipo.

No `supabase_schema.sql` novo, bancos criados do zero aceitam apenas `provider = 'euatendo'`.

## 14. Eventos pendentes migrados

A migration `20260715140000_remove_desktop_bot_legacy.sql` migra eventos antigos nao finalizados:

```sql
provider = 'whatsapp_desktop'
status in ('pending','reserved','processing','retry')
```

para:

```sql
provider = 'euatendo'
status = 'pending'
```

As reservas antigas sao limpas e `next_retry_at` e ajustado para permitir processamento seguro pelo dispatcher euAtendo.

## 15. Interface atualizada

A tela antiga de dispositivos foi substituida por `Canal WhatsApp`, exibindo:

- status euAtendo;
- API configurada;
- instancia configurada;
- health check;
- verificacao de numero;
- mensagem de teste;
- ultimos envios;
- pendentes;
- retries;
- falhas.

Nao sao exibidos token, headers, secrets, device local, assinatura, nonce ou payload bruto.

## 16. Dashboard atualizado

O dashboard nao depende mais de device, heartbeat ou status de bot local. O status do canal usa metricas do provider euAtendo e o restante das contagens permanece baseado nas regras de certificados e `notification_events`.

## 17. Documentacao atualizada

Documentos atualizados ou criados:

- `README.md`
- `docs/00_RESUMO_EXECUTIVO.md`
- `docs/01_ARQUITETURA.md`
- `docs/02_ESTRUTURA_PROJETO.md`
- `docs/03_FLUXOS_DO_SISTEMA.md`
- `docs/04_BANCO_DE_DADOS.md`
- `docs/05_SUPABASE.md`
- `docs/06_APIS.md`
- `docs/10_AVISOS.md`
- `docs/11_CANAL_WHATSAPP.md`
- `docs/12_CONFIGURACOES.md`
- `docs/13_SEGURANCA.md`
- `docs/14_PERFORMANCE.md`
- `docs/15_VARIAVEIS_DE_AMBIENTE.md`
- `docs/17_RISCOS.md`
- `docs/18_MELHORIAS_FUTURAS.md`
- `docs/19_DIAGRAMAS.md`
- `docs/README.md`
- `docs/RELATORIO_GERAL_DO_PROJETO.md`
- `docs/integracoes/EUATENDO_IMPLEMENTACAO.md`

## 18. SQL gerado

SQL completo:

- `supabase_schema.sql`

Migration incremental:

- `supabase/migrations/20260715140000_remove_desktop_bot_legacy.sql`

Observacao: a Supabase CLI nao estava disponivel localmente, entao a migration foi criada manualmente com nome timestampado e comandos idempotentes onde possivel.

## 19. Testes executados

| Comando | Resultado |
|---|---|
| `npx.cmd tsc --noEmit --pretty false` | passou |
| `npm.cmd run lint` | passou |
| `npm.cmd run build` | passou |
| `npm.cmd test` | nao executado: nao existe script `test` |
| `npm.cmd --prefix desktop-bot run lint` | nao aplicavel: diretorio/pacote ausente |

O build final listou as rotas euAtendo e nao listou rotas `/api/whatsapp-bot/*`.

## 20. Resultados

- Runtime `src` sem referencias ao bot antigo.
- Rotas antigas removidas.
- QWEP removido.
- Devices locais removidos.
- Canal WhatsApp euAtendo preservado.
- Dispatcher euAtendo preservado.
- Schema completo atualizado para banco novo.
- Migration incremental criada para banco existente.
- Documentacao operacional atualizada para Canal WhatsApp.

## 21. Riscos residuais

| Risco | Impacto | Mitigacao |
|---|---|---|
| SQL ainda nao aplicado no Supabase de producao | objetos antigos permanecem no banco ate aplicar migration | executar backup e aplicar `20260715140000_remove_desktop_bot_legacy.sql` |
| Migrations historicas contem referencias antigas | busca textual em `supabase/migrations` encontra o passado | isso e esperado; migration final remove o legado |
| Ausencia de testes automatizados | validacao depende de build/lint e testes manuais | criar suite de testes do dispatcher |
| Eventos historicos antigos | relatorios podem exibir provider antigo se consultarem historico bruto | UI usa labels amigaveis e novos eventos usam euAtendo |

## 22. Procedimento de rollback

1. Restaurar backup do banco feito antes de aplicar a migration destrutiva.
2. Reverter o commit/branch que removeu os arquivos do bot antigo.
3. Reaplicar variaveis antigas apenas se houver decisao operacional explicita.
4. Confirmar que nao existem dois consumidores processando a mesma fila antes de religar qualquer fluxo legado.

Rollback parcial por SQL nao e recomendado depois de dropar tabelas, porque os segredos antigos de device e logs operacionais nao devem ser recriados sem backup confiavel.

## 23. Confirmacao sobre a euAtendo

A integracao euAtendo permanece como canal oficial. O cliente HTTP, autenticacao Bearer, endpoints administrativos, provider e dispatcher foram preservados. As mudancas feitas ao redor da euAtendo foram de limpeza de tipos/configuracao para remover referencias ao provider antigo.

## 24. Confirmacao de remocao do legado

Confirmado:

- nao ha rotas `/api/whatsapp-bot/*` no build;
- nao ha pasta `src/lib/qwep`;
- nao ha tela de devices locais;
- nao ha API de criacao/revogacao de device local;
- nao ha dependencia operacional de heartbeat/polling externo;
- novos eventos usam `euatendo`;
- `supabase_schema.sql` cria um banco novo sem tabelas antigas;
- migration incremental remove tabelas/funcoes antigas de bancos existentes.
