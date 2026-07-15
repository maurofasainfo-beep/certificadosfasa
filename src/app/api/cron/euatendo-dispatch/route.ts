import { NextResponse } from "next/server";

import { getOptionalEnv } from "@/lib/supabase/env";
import { dispatchEuAtendoNotificationBatch } from "@/lib/whatsapp/euatendo/dispatcher";

export const runtime = "nodejs";

function getBearerSecret(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-cron-secret")?.trim() ?? null;
}

async function handleCronRequest(request: Request) {
  const expectedSecret = getOptionalEnv("CRON_SECRET");
  const receivedSecret = getBearerSecret(request);

  if (!expectedSecret || !receivedSecret || receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const result = await dispatchEuAtendoNotificationBatch();
  const status = result.status === "partial_error" ? 207 : 200;

  return NextResponse.json(result, { status });
}

export async function GET(request: Request) {
  return handleCronRequest(request);
}

export async function POST(request: Request) {
  return handleCronRequest(request);
}
