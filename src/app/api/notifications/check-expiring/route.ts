import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { rebuildNotificationSchedule, runDueNotificationJob } from "@/lib/notifications/engine";

export const runtime = "nodejs";

export async function POST() {
  const auth = await requireApiUser(["admin"]);

  if ("response" in auth) {
    return auth.response;
  }

  const result = await rebuildNotificationSchedule({
    triggeredBy: "manual",
    userId: auth.user.id,
  });
  const dueResult = await runDueNotificationJob({
    triggeredBy: "manual",
    userId: auth.user.id,
  });

  const errors = [...result.errors, ...dueResult.errors];

  return NextResponse.json(
    {
      ...result,
      notificacao_dia: dueResult,
      errors,
    },
    { status: errors.length ? 207 : 200 },
  );
}
