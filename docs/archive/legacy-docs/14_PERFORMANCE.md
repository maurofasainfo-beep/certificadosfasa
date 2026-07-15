# 14 - Performance

## Visao geral

O projeto contem otimizacoes importantes:

- middleware evita `getUser` para rotas publicas, cron e download;
- dashboard usa RPC agregada `get_dashboard_metrics`;
- graficos sao carregados por `next/dynamic`;
- listagens principais usam paginacao server-side;
- dispatcher euAtendo processa uma mensagem por execucao e usa delay persistente;
- fonte do layout usa stack local, evitando fetch de Google Fonts no build.

## Server Components e Client Components

Client Components encontrados:

- login form;
- navegacao;
- graficos;
- formularios;
- botoes interativos;
- painel Canal WhatsApp;
- download publico.

Isso e coerente com necessidade de interacao. Paginas principais permanecem server-side sempre que possivel.

## Dashboard

Fonte principal:

- `get_dashboard_metrics()` no banco.

Fallback em `src/app/(internal)/dashboard/page.tsx` ainda carrega uma amostra de certificados se a RPC falhar. Isso deve ser tratado como fallback emergencial, nao como caminho principal.

## Listagens

APIs:

- `/api/certificados`
- `/api/clientes`
- `/api/notifications/events`

Suportam paginacao por `page` e `pageSize`. Usam `count: "exact"` em alguns pontos, o que pode pesar em volume muito alto.

## Indices

O schema possui:

- trigram GIN para buscas por nome/CNPJ/titular/mensagem;
- indices por status/data;
- indices por send_date/status;
- indices de token/hash;
- indices para eventos pendentes do provider `euatendo`.

## Canal WhatsApp

Pontos de performance:

- envio automatico e server-side via dispatcher euAtendo;
- reserva atomica por RPC;
- processamento de no maximo uma mensagem por execucao;
- delay persistente por provider, sem `sleep` serverless;
- retry com backoff no mesmo evento.

## Bundle

Dependencias de UI:

- `lucide-react`
- `recharts`
- `framer-motion` no package, mas nao foi encontrado import direto na busca atual.

Recharts fica isolado em componente client dinamico, reduzindo bundle inicial.

## Potenciais gargalos

| Area | Gargalo | Impacto |
|---|---|---|
| Notificacoes | rebuild em muitos certificados/destinatarios | pode gerar muitos inserts |
| Notificacoes | listagem com count exact | pode pesar com dezenas de milhares de eventos |
| Dispatcher | cron muito frequente em ambiente serverless | pode consumir cota se mal configurado |
| Dashboard | fallback sem RPC | pode carregar dados demais em memoria |
| Storage | reconciliacao manual | inconsistencia exige operacao admin |

## Recomendacoes sem alterar codigo

- Monitorar tempo de `get_dashboard_metrics`.
- Medir latencia de `/api/cron/euatendo-dispatch`.
- Usar `npm run analyze` antes/depois de grandes mudancas visuais.
- Revisar necessidade de `framer-motion` se nao houver imports ativos.
- Avaliar cursor pagination para tabelas muito grandes.
