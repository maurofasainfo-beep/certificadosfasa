# Checklist UI/UX

## Tipografia

- [x] Títulos de página padronizados com `SectionHeader`.
- [x] Subtítulos objetivos e orientados a tarefa.
- [x] KPIs com número em destaque e contexto curto.
- [x] Dados secundários em menor peso visual.

## Espaçamentos

- [x] Cards e tabelas com padding vertical mais confortável.
- [x] Grids responsivos em KPIs, formulários e listas.
- [x] Ações agrupadas com espaçamento consistente.

## Cores

- [x] Background geral neutro frio.
- [x] Superfícies principais brancas.
- [x] Azul reservado para ação principal e navegação ativa.
- [x] Verde, âmbar, vermelho e cinza usados com significado de status.

## Cards

- [x] Cards de métrica refatorados.
- [x] Cards de atenção operacional no dashboard.
- [x] Cards responsivos para certificados/clientes em mobile.
- [x] Sombras discretas e bordas suaves.

## Tabelas

- [x] Cabeçalho sticky em `DataTable`.
- [x] `scope="col"` nos cabeçalhos.
- [x] Linhas com hover e foco visível.
- [x] Informação principal e secundária agrupadas.
- [x] Alternativas em cards para telas menores.

## Formulários

- [x] Labels acima dos campos.
- [x] Textos auxiliares onde há risco de dúvida.
- [x] Estados de erro próximos à ação.
- [x] Dias de antecedência em chips na configuração.

## Botões

- [x] Ações com verbo e objeto claros.
- [x] Estados disabled durante processamento.
- [x] Ícones lucide em ações principais.
- [x] Ações destrutivas com tom de perigo.

## Estados

- [x] Empty states em certificados, clientes, avisos e WhatsApp.
- [x] Busca sem resultado com mensagem específica.
- [x] Estados locais de loading em botões.
- [x] Skeletons padronizados.
- [x] Mensagens de erro sem stack trace ou segredo.

## Responsividade

- [x] Sidebar mobile em drawer.
- [x] KPIs empilháveis.
- [x] Tabelas adaptadas para cards.
- [x] Formulários em uma coluna no mobile.
- [ ] Validação visual final em 360px, 390px, 768px, 1024px, 1280px e 1440px. Bloqueada nesta sessão porque o navegador interno não estava disponível.

## Acessibilidade

- [x] `aria-current` na navegação ativa.
- [x] `aria-expanded` e `aria-controls` no drawer mobile.
- [x] Escape fecha o drawer.
- [x] `role="alert"` para erros.
- [x] `role="status"` para progresso de importação.
- [x] Status não dependem apenas de cor.
- [ ] Validação visual final de foco e contraste. Bloqueada nesta sessão porque o navegador interno não estava disponível.

## Textos

- [x] Títulos e subtítulos principais revisados.
- [x] Status humanos padronizados.
- [x] Botões com ações explícitas.
- [x] Placeholders de busca específicos.
- [x] Mensagens de API/validação com acentuação revisada.

## Encoding

- [x] Busca global por mojibake real em `src` e `docs`.
- [x] Correções de acentuação em telas e APIs.
- [x] Documentos arquivados limpos de exemplos com mojibake literal.
- [x] Arquivos mantidos em UTF-8.
