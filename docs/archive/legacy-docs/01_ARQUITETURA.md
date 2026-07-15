# Arquitetura

```mermaid
flowchart LR
  UI[Next.js App Router] --> API[API Routes Backend]
  API --> DB[(Supabase Postgres)]
  API --> Storage[(Supabase Storage Privado)]
  API --> Provider[EuAtendoWhatsAppProvider]
  Provider --> EuAtendo[API euAtendo]
  Cron[Cron Protegido] --> API
```

Componentes principais:

- Frontend: Server Components e Client Components isolados.
- Backend: API Routes Node.js para certificados, links, avisos e euAtendo.
- Banco: Supabase Postgres com RLS, funções e RPCs.
- Storage: bucket privado `certificados-pfx`.
- WhatsApp: Canal WhatsApp euAtendo via backend server-only.
