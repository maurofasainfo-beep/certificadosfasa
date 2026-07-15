# Segurança

- Service role somente no backend.
- Token euAtendo server-only.
- Senha real do PFX criptografada com AES-256-GCM.
- Links publicos com token e senha em hash.
- Storage privado sem acesso direto pelo frontend.
- Cron protegido por `CRON_SECRET`.
- Logs sanitizados e telefones mascarados.
- Financeiro nao recebe hashes, tokens, segredos ou campos operacionais internos.
