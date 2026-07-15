import { SectionHeader } from "@/components/ui/section-header";
import { requireAdmin } from "@/lib/auth/rbac";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getEuAtendoConfigStatus } from "@/lib/whatsapp/euatendo/config";

import { CanalWhatsAppPanel } from "./canal-whatsapp-panel";

export default async function WhatsappPage() {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const euAtendoConfig = getEuAtendoConfigStatus();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = `${today.slice(0, 7)}-01`;
  const [
    euAtendoPendingResult,
    euAtendoRetryResult,
    euAtendoFailedResult,
    euAtendoSentTodayResult,
    euAtendoLastSentResult,
    euAtendoSentMonthResult,
    euAtendoProcessingResult,
    euAtendoStateResult,
    euAtendoLogsResult,
    euAtendoAvgDurationResult,
  ] = await Promise.all([
    admin
      .from("notification_events")
      .select("id", { count: "exact", head: true })
      .eq("provider", "euatendo")
      .eq("status", "pending")
      .lte("send_date", today),
    admin
      .from("notification_events")
      .select("id", { count: "exact", head: true })
      .eq("provider", "euatendo")
      .eq("status", "retry")
      .lte("send_date", today),
    admin
      .from("notification_events")
      .select("id", { count: "exact", head: true })
      .eq("provider", "euatendo")
      .eq("status", "failed"),
    admin
      .from("notification_events")
      .select("id", { count: "exact", head: true })
      .eq("provider", "euatendo")
      .eq("status", "sent")
      .gte("sent_at", `${today}T00:00:00`),
    admin
      .from("notification_events")
      .select("sent_at")
      .eq("provider", "euatendo")
      .eq("status", "sent")
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from("notification_events")
      .select("id", { count: "exact", head: true })
      .eq("provider", "euatendo")
      .eq("status", "sent")
      .gte("sent_at", `${monthStart}T00:00:00`),
    admin
      .from("notification_events")
      .select("id", { count: "exact", head: true })
      .eq("provider", "euatendo")
      .in("status", ["reserved", "processing"]),
    admin
      .from("whatsapp_dispatcher_state")
      .select("provider, last_dispatch_at, next_allowed_send_at, locked_until, updated_at")
      .eq("provider", "euatendo")
      .maybeSingle(),
    admin
      .from("whatsapp_provider_logs")
      .select("id, event_id, audience, operation, telefone_mascarado, template_type, duration_ms, status, attempt_count, error_code, error_message, response_id, created_at")
      .eq("provider", "euatendo")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("whatsapp_provider_logs")
      .select("duration_ms")
      .eq("provider", "euatendo")
      .eq("status", "sent")
      .not("duration_ms", "is", null)
      .gte("created_at", `${today}T00:00:00`)
      .limit(100),
  ]);

  return (
    <section>
      <SectionHeader
        title="Automação do WhatsApp"
        description="Valide a integração e acompanhe o envio automático de mensagens."
      />
      <CanalWhatsAppPanel
        euAtendo={{
          config: euAtendoConfig,
          state: euAtendoStateResult.data ?? null,
          logs: euAtendoLogsResult.data ?? [],
          stats: {
            pending: euAtendoPendingResult.count ?? 0,
            retry: euAtendoRetryResult.count ?? 0,
            failed: euAtendoFailedResult.count ?? 0,
            sentToday: euAtendoSentTodayResult.count ?? 0,
            sentMonth: euAtendoSentMonthResult.count ?? 0,
            processing: euAtendoProcessingResult.count ?? 0,
            lastSentAt: euAtendoLastSentResult.data?.sent_at ?? null,
            averageDurationMs:
              euAtendoAvgDurationResult.data && euAtendoAvgDurationResult.data.length
                ? Math.round(
                    euAtendoAvgDurationResult.data.reduce((total, item) => total + (item.duration_ms ?? 0), 0)
                      / euAtendoAvgDurationResult.data.length,
                  )
                : null,
          },
        }}
      />
    </section>
  );
}
