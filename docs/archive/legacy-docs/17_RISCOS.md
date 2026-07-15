# Riscos

| Prioridade | Risco | Mitigacao |
|---|---|---|
| Alta | Token euAtendo exposto | Variavel server-only e sem retorno em APIs |
| Alta | Duplicidade de envio | Reserva atomica, lock persistente e um envio por execucao |
| Media | Cron por minuto limitar cadencia | Delay persistente garante minimo; documentar limite operacional |
| Media | Storage e banco sem transacao distribuida | Jobs de reconciliacao e auditoria |
| Media | Webhook sem assinatura confirmada | Nao habilitar webhook ate validar contrato do provedor |
