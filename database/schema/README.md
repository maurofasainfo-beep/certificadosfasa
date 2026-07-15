# Schema

`supabase_schema.sql` e o schema oficial para criar um banco novo do zero.

Ele deve conter o estado atual consolidado do banco:

- tipos
- tabelas
- constraints
- indices
- triggers
- funcoes
- grants
- policies RLS
- seed minimo de configuracoes/templates
- bucket privado

Para bancos existentes, use tambem as migrations em `../migrations/`.
