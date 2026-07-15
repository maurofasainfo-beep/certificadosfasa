# 07 - Componentes

## Layout

### `AppShell`

Arquivo: `src/components/layout/app-shell.tsx`

Responsabilidade:

- Renderizar estrutura interna com sidebar, topbar, usuario e conteudo.
- Receber perfil e email.
- Controlar visibilidade do item WhatsApp para admin.

### `AppNavigation`

Arquivo: `src/components/layout/app-navigation.tsx`

Responsabilidade:

- Navegacao desktop e mobile.
- Usa `usePathname`, portanto e Client Component.
- Usa icones `lucide-react`.

### `LogoutButton`

Arquivo: `src/components/layout/logout-button.tsx`

Responsabilidade:

- Enviar formulario POST para `/api/auth/logout`.
- Nao carrega Supabase browser client.

### `FasaLogo`

Arquivo: `src/components/layout/fasa-logo.tsx`

Responsabilidade:

- Exibir marca visual. O usuario pediu troca posterior para `fasa.png`; a documentacao reflete o estado do codigo analisado.

## Componentes UI

### `StatCard`

Arquivo: `src/components/ui/stat-card.tsx`

Usado para metricas do dashboard e demais telas.

### `StatusBadge`

Arquivo: `src/components/ui/status-badge.tsx`

Centraliza badges de status com cores semanticas.

### `SectionCard` e `SectionHeader`

Arquivos:

- `src/components/ui/section-card.tsx`
- `src/components/ui/section-header.tsx`

Organizam blocos visuais das paginas.

### `DataTable` / `TableShell`

Arquivo: `src/components/ui/data-table.tsx`

Responsavel por padrao visual de tabela.

### `FilterBar`

Arquivo: `src/components/ui/filter-bar.tsx`

Padrao visual para filtros e busca.

### `PaginationBar`

Arquivo: `src/components/ui/pagination-bar.tsx`

Exibe paginacao server-side.

### `EmptyState`

Arquivo: `src/components/ui/empty-state.tsx`

Estado vazio padronizado.

### `LoadingSkeleton`

Arquivo: `src/components/ui/loading-skeleton.tsx`

Skeleton visual.

### `charts.tsx`

Arquivo: `src/components/ui/charts.tsx`

Client Component com Recharts:

- donut de certificados;
- barras de vencimentos.

Importado dinamicamente por `src/components/ui/lazy-dashboard-charts.tsx`.

### `BotStatusCard` e `AlertCard`

Arquivos:

- `src/components/ui/bot-status-card.tsx`
- `src/components/ui/alert-card.tsx`

Cards auxiliares para status e alertas.

## Componentes de paginas

### Login

- `src/app/(auth)/login/login-form.tsx`

### Upload

- `src/app/(internal)/certificados/novo/upload-certificate-form.tsx`
- `src/app/(internal)/certificados/importar/bulk-import-certificates-form.tsx`

### Detalhe do certificado

- `download-link-manager.tsx`
- `delete-certificate-button.tsx`
- `client-edit-form.tsx`

### Configuracoes

- `src/app/(internal)/configuracoes/configuracoes-form.tsx`

### WhatsApp

- `src/app/(internal)/whatsapp/whatsapp-devices-panel.tsx`

### Notificacoes

- `src/app/(internal)/notificacoes/retry-event-button.tsx`

### Download publico

- `src/app/download/[token]/download-form.tsx`

## Observacoes de qualidade visual

- Existem componentes client apenas onde ha interacao real.
- Graficos sao isolados como client/dynamic.
- Alguns componentes contem textos com encoding quebrado.
- Algumas acoes destrutivas usam `window.confirm`, o que e funcional mas visualmente menos consistente.
