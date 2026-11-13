import { NextResponse } from "next/server";
import { db, findPurchase, findOrder } from "@/lib/commerce/db";
import { stripe } from "@/lib/commerce/providers";
import { privateHeaders, validSessionId } from "@/lib/commerce/http";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session_id") || "";
  if (!validSessionId(id)) return NextResponse.json({ state: "invalid" }, { status: 400, headers: privateHeaders });
  try {
    const purchase = await findPurchase(id);
    if (purchase) return NextResponse.json({ state: purchase.revoked ? "revoked" : purchase.email_sent_at ? "confirmed" : "delivery_pending" }, { headers: privateHeaders });
    const order = await findOrder(id);
    if (!order) return NextResponse.json({ state: "invalid" }, { status: 404, headers: privateHeaders });
    const failed = await db()`SELECT id FROM commerce_events WHERE id = ${`failed:${id}`}`;
    if (failed.length) return NextResponse.json({ state: "failed" }, { headers: privateHeaders });
    const session = await stripe().checkout.sessions.retrieve(id);
    return NextResponse.json({ state: session.status === "expired" ? "expired" : "pending" }, { headers: privateHeaders });
  } catch { return NextResponse.json({ state: "unavailable" }, { status: 503, headers: privateHeaders }); }
}
