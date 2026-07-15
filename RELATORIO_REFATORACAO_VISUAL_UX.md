# Relatório de Refatoração Visual e UX

## Resumo

Refatoração visual controlada do painel administrativo Fasa Certificados Digitais, preservando rotas, contratos de API, RBAC, autenticação, banco, Storage, notificações e integração euAtendo. A interface foi reorganizada para funcionar como centro operacional orientado a tarefas.

## Problemas encontrados

- Hierarquia visual fraca em cards, tabelas e cabeçalhos.
- Sidebar com ativo visualmente dominante e pouco refinado.
- Tabelas densas, com dados principais e secundários no mesmo peso.
- Textos técnicos ou vagos em WhatsApp, avisos e configurações.
- Strings com acentuação quebrada na renderização antiga e mensagens sem acento em APIs/templates.
- Estados vazios e de carregamento inconsistentes.
- Logs do WhatsApp expunham erro SQL técnico diretamente na interface.
- Configurações usavam campo bruto para dias de antecedência.

## Direção visual adotada

- Background neutro frio, superfícies brancas, bordas suaves e sombras discretas.
- Azul limitado a ação principal e estados interativos.
- Verde, âmbar, vermelho e cinza usados com significado operacional.
- Cards e tabelas com maior contraste entre informação principal e auxiliar.
- Layouts responsivos com cards em mobile para evitar tabelas comprimidas.

## UX Writing

- Padronizados títulos, subtítulos, ações e status.
- “Painel” passou a aparecer como “Visão geral”.
- “Avisos” passou a “Central de avisos”.
- “Canal WhatsApp” passou a “Automação do WhatsApp”.
- “Pendentes” passou a “Mensagens na fila”.
- “Falhas” passou a “Envios com falha”.
- Erros técnicos foram trocados por mensagens compreensíveis e orientadas a ação.

## Problemas de encoding corrigidos

- Varredura UTF-8 por padrões de mojibake em `src` e `docs` retornou sem ocorrências reais.
- Corrigidas mensagens sem acento em validações, upload, download público, euAtendo, crons, notification engine e documentos arquivados.
- Mantidos nomes técnicos sem acento quando fazem parte de campos internos, enums, rotas ou códigos de auditoria.

## Componentes criados

- `tests/ui-formatting.test.ts` para helpers de apresentação.

## Componentes refatorados

- `SectionHeader`
- `StatCard`
- `StatusBadge`
- `DataTable`
- `FilterBar`
- `EmptyState`
- `LoadingSkeleton`
- `PaginationBar`
- `AppShell`
- `AppNavigation`

## Telas alteradas

- `/dashboard`
- `/certificados`
- `/certificados/novo`
- `/certificados/importar`
- `/certificados/[id]`
- `/clientes`
- `/notificacoes`
- `/whatsapp`
- `/configuracoes`
- `/login`
- `/download/[token]`

## Responsividade

- Sidebar vira drawer em telas pequenas.
- Tabelas principais têm alternativa em cards no mobile.
- Formulários e KPIs usam grids responsivos.
- Botões e campos mantêm área de toque adequada.

## Acessibilidade

- Navegação usa `aria-current`.
- Drawer usa `aria-expanded`, `aria-controls`, botão de fechar e Escape.
- Tabelas usam cabeçalhos com `scope="col"`.
- Feedbacks usam `role="alert"` ou `role="status"` quando aplicável.
- Cores de status têm texto visível, não apenas cor.

## Estados adicionados

- Estados vazios específicos em certificados, clientes, avisos, WhatsApp e buscas sem resultado.
- Estados locais de processamento em upload, importação, envio de aviso, conexão WhatsApp, verificação de número, mensagem de teste e configurações.
- Skeletons padronizados em componentes base.

## Arquivos alterados

- `src/app/(internal)/**`
- `src/app/(auth)/login/**`
- `src/app/download/[token]/**`
- `src/components/layout/**`
- `src/components/ui/**`
- `src/lib/utils/format.ts`
- `src/lib/certificados/status-labels.ts`
- `src/lib/notifications/**`
- `src/lib/whatsapp/euatendo/**`
- `docs/SYSTEM_CONTEXT.md`
- `docs/06_FRONTEND.md`
- `docs/INDEX.md`
- `CHANGELOG.md`

## Testes executados

- `npm test`: passou, com 6 arquivos de teste e 20 testes.
- `npx tsc --noEmit --pretty false`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- Varredura UTF-8 por mojibake real em `src` e `docs`: passou.
- Smoke HTTP local em `http://127.0.0.1:3002`:
  - `/login`: 200.
  - `/download/token-invalido`: 200.
  - `/dashboard`: 307, redirecionando para autenticação como esperado sem sessão.

## Validação visual

Não foi possível executar screenshots automatizados de desktop/tablet/mobile nesta sessão porque o navegador interno disponível para validação visual não estava ativo e a lista de navegadores retornou vazia. A validação visual ficou limitada à revisão dos screenshots fornecidos, inspeção de código dos breakpoints responsivos e smoke HTTP local das rotas públicas.

## Riscos restantes

- Não há confirmação de manual oficial de marca da Fasa.
- Não há confirmação de resolução mais comum dos usuários internos.
- Validação visual autenticada depende de sessão/local env com Supabase disponível.
- Alterações são visuais e textuais, mas mensagens retornadas por API podem aparecer em automações externas se algum consumidor depender do texto exato.
- Screenshots automatizados finais não foram capturados nesta sessão por indisponibilidade do navegador interno.

## Próximos passos

- Validar visualmente nos breakpoints principais quando o navegador interno estiver disponível ou quando houver sessão autenticada aberta.
- Revisar o resultado com usuários internos para confirmar densidade, nomes de navegação e prioridade das métricas.
