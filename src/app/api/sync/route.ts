import { NextRequest, NextResponse } from "next/server";
import { syncCatalog } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  // Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on
  // scheduled Cron invocations once CRON_SECRET is set as an env var.
  // Manual/external triggers (GitHub Actions, cron-job.org, curl) use the
  // same header.
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncCatalog();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
