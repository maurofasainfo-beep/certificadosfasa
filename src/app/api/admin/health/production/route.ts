import { NextRequest, NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api";
import { getProductionReadinessReport } from "@/lib/operations/production-readiness";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(["admin"]);

  if ("response" in auth) {
    return auth.response;
  }

  const liveEuAtendo = request.nextUrl.searchParams.get("live_euatendo") === "1";
  const report = await getProductionReadinessReport({ checkEuAtendoLive: liveEuAtendo });

  return NextResponse.json({ report }, { status: report.ready ? 200 : 503 });
}
