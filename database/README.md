# Database

Area oficial dos SQLs do projeto.

## Estrutura

- `schema/supabase_schema.sql`: schema consolidado para banco novo.
- `migrations/`: migrations incrementais em ordem cronologica.
- `scripts/`: scripts manuais ainda uteis.
- `archive/`: SQL antigo, substituido ou historico.

## Regra

Quando houver mudanca de banco:

1. Criar migration em `database/migrations/`.
2. Atualizar `database/schema/supabase_schema.sql` se a mudanca tambem deve existir em banco novo.
3. Atualizar `docs/SYSTEM_CONTEXT.md`.
4. Registrar em `CHANGELOG.md`.

Nao usar arquivos de `archive/` como orientacao operacional sem comparar com o schema e o codigo atuais.
