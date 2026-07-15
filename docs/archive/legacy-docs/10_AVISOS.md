# Avisos

O backend e a fonte da verdade dos avisos.

Tipos:

- `certificate_expiring`: certificado a vencer.
- `certificate_expired`: resumo diario consolidado de vencidos.
- `manual_test`: teste controlado.

Publicos:

- `internal`: destinatarios internos ativos.
- `client`: telefone do cliente, se preenchido e permitido.

O dispatcher euAtendo processa um evento por execucao, respeita delay persistente e usa retry no mesmo evento.
