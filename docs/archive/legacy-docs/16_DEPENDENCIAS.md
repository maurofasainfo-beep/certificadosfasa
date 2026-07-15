# 16 - Dependencias

Fonte: `package.json`.

## Runtime

| Dependencia | Uso |
|---|---|
| `next` | framework App Router e API Routes |
| `react`, `react-dom` | UI |
| `@supabase/ssr` | clientes Supabase server/browser com cookies |
| `@supabase/supabase-js` | admin client e tipos |
| `node-forge` | parsing PKCS#12/PFX |
| `zod` | validacao de entrada |
| `recharts` | graficos da dashboard |
| `lucide-react` | icones |
| `framer-motion` | dependencia instalada, mas sem import ativo encontrado na busca atual |
| `@next/bundle-analyzer` | analise opcional de bundle |

## Desenvolvimento

| Dependencia | Uso |
|---|---|
| `typescript` | tipagem strict |
| `eslint`, `eslint-config-next` | lint |
| `tailwindcss`, `@tailwindcss/postcss` | estilos |
| `@types/node`, `@types/react`, `@types/react-dom` | tipos |
| `@types/node-forge` | tipos do parser PFX |

## Scripts

| Script | Comando | Uso |
|---|---|---|
| `dev` | `next dev` | ambiente local |
| `build` | `next build` | build producao |
| `start` | `next start` | servir build |
| `lint` | `eslint` | verificacao |
| `analyze` | `cross-env ANALYZE=true next build` | bundle analyzer |

## Observacoes

- `cross-env` aparece no script `analyze`; se nao estiver em dependencias, o script pode falhar em ambiente limpo. Confirmar antes de usar.
- `framer-motion` pode ser dependencia remanescente de refatoracao visual. Sem imports ativos, e candidata a revisao futura.
