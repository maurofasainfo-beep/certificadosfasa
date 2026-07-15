# Canal WhatsApp

O Canal WhatsApp usa exclusivamente a API euAtendo como provedor de envio.

## Fluxo

1. O backend calcula vencimentos e cria `notification_events`.
2. O dispatcher euAtendo reserva atomicamente um evento elegível.
3. O `EuAtendoWhatsAppProvider` envia a mensagem renderizada.
4. O backend atualiza status, tentativas, retry e logs sanitizados.

## Segurança

- O token euAtendo é server-only.
- O frontend nunca recebe token, headers, payload bruto ou secrets.
- O cron de dispatch é protegido por `CRON_SECRET`.
- Logs usam telefone mascarado e resposta sanitizada.

## Legado removido

O canal local anterior, com autenticação própria, devices locais e polling externo, foi removido do runtime. Eventos antigos finalizados podem permanecer apenas como histórico de banco; novos eventos usam `provider = 'euatendo'`.
