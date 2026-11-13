import { NextResponse } from "next/server";
import { findPurchase, rateLimit } from "@/lib/commerce/db";
import { stripe, readFile } from "@/lib/commerce/providers";
import { verifyAccessToken } from "@/lib/commerce/tokens";
import { hasReversedPayment } from "@/lib/commerce/rules";
import { privateHeaders, sameOrigin } from "@/lib/commerce/http";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please use your private access link." }, { status: 403, headers: privateHeaders });
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  const access = verifyAccessToken(token, process.env.COMMERCE_ACCESS_SECRET || "");
  if (!access) return NextResponse.json({ error: "This access link is invalid or has expired. Request a fresh link using your purchase email." }, { status: 401, headers: privateHeaders });
  try {
    const purchase = await findPurchase(access.sessionId);
    if (!purchase || purchase.revoked) return NextResponse.json({ error: "Access is not available for this purchase." }, { status: 403, headers: privateHeaders });
    if (!await rateLimit(`download:${purchase.session_id}`, 30)) return NextResponse.json({ error: "Download limit reached. Please try again in an hour." }, { status: 429, headers: privateHeaders });
    const intent = await stripe().paymentIntents.retrieve(purchase.payment_intent_id, { expand: ["latest_charge"] });
    if (intent.livemode !== purchase.livemode || hasReversedPayment(intent)) return NextResponse.json({ error: "Payment no longer qualifies for access." }, { status: 403, headers: privateHeaders });
    const stream = await readFile(purchase.file_key);
    return new Response(stream as ReadableStream<Uint8Array>, { headers: { ...privateHeaders, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${purchase.slug.replace(/[^a-z0-9-]/g, "")}.pdf"`, "X-Content-Type-Options": "nosniff" } });
  } catch {
    console.error("[commerce] Private download could not complete.");
    return NextResponse.json({ error: "Your file is temporarily unavailable. Please try again shortly." }, { status: 503, headers: privateHeaders });
  }
}
