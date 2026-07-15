# Fluxos do Sistema

## Upload

1. Usuario autenticado envia PFX e senha.
2. API valida senha, extrai dados e salva PFX no Storage privado.
3. Senha real e criptografada com AES-256-GCM.
4. Cliente e certificado sao criados ou atualizados.
5. Rebuild recalcula avisos futuros.

## Avisos

1. Backend calcula vencimentos.
2. Templates sao renderizados no servidor.
3. Eventos sao gravados em `notification_events` com `provider = 'euatendo'`.
4. Cron chama `/api/cron/euatendo-dispatch`.
5. Dispatcher reserva 1 evento, envia via euAtendo e atualiza status.

## Download Publico

1. Token publico e senha sao validados no backend.
2. Storage privado gera signed URL curta.
3. Link e invalidado apos uso unico.
