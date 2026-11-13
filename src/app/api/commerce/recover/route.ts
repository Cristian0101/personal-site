import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { db, findPurchase, rateLimit, requestIp } from "@/lib/commerce/db";
import { emailAccess } from "@/lib/commerce/providers";
import { privateHeaders, sameOrigin } from "@/lib/commerce/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please use the access recovery page." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid purchase email." }, { status: 400 });
  try {
    if (!await rateLimit(`recovery-ip:${requestIp(request)}`, 10) || !await rateLimit(`recovery-email:${email}`, 3)) return NextResponse.json({ error: "Please wait before requesting another access link." }, { status: 429, headers: { ...privateHeaders, "Retry-After": "3600" } });
    const rows = await db()`SELECT session_id FROM commerce_purchases WHERE email = ${email} AND NOT revoked ORDER BY created_at DESC LIMIT 10`;
    for (const row of rows) {
      const purchase = await findPurchase(row.session_id);
      if (purchase) await emailAccess(purchase, `recovery:${randomUUID()}`, Date.now() + 24 * 60 * 60 * 1000);
    }
    // The same response for purchasers and non-purchasers avoids exposing purchase history.
    return NextResponse.json({ message: "If a purchase matches that address, a fresh access link will arrive by email. Check your spam folder too." }, { headers: privateHeaders });
  } catch {
    console.error("[commerce] Access recovery could not complete.");
    return NextResponse.json({ error: "Access recovery is temporarily unavailable. Please try again later." }, { status: 503, headers: privateHeaders });
  }
}
