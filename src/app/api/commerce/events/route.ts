import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getPlaybook } from "@/lib/playbooks";
import { rateLimit, recordEvent, requestIp } from "@/lib/commerce/db";
import { sameOrigin } from "@/lib/commerce/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403 });
  const body = await request.json().catch(() => null);
  const book = typeof body?.slug === "string" ? getPlaybook(body.slug) : undefined;
  if (!book) return new NextResponse(null, { status: 400 });
  // No existing analytics provider is installed. Persist anonymous views when the commerce DB is configured.
  if (process.env.COMMERCE_DATABASE_URL) {
    try {
      if (await rateLimit(`view:${requestIp(request)}`, 120)) await recordEvent(`view:${randomUUID()}`, "product_view", book.slug, process.env.COMMERCE_MODE === "live");
    } catch { console.error("[commerce] Product-view telemetry unavailable."); }
  }
  return new NextResponse(null, { status: 204 });
}
