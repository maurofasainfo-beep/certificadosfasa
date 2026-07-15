# Supabase

Produtos usados:

- Auth para login interno.
- Postgres para dados e fila/outbox.
- Storage privado para arquivos PFX.

RLS deve permanecer ativo nas tabelas sensiveis. O frontend usa anon key apenas para fluxos seguros; service role e usada somente no backend.

Execute `supabase_schema.sql` para projeto novo. Em projeto existente, aplique as migrations em ordem.
