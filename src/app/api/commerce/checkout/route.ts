import { NextResponse } from "next/server";
import { getPlaybook, playbookPath } from "@/lib/playbooks";
import { purchaseAvailable, siteOrigin } from "@/lib/commerce/config";
import { rateLimit, requestIp, saveOrder, recordEvent } from "@/lib/commerce/db";
import { stripe, verifyFile } from "@/lib/commerce/providers";
import { privateHeaders, sameOrigin } from "@/lib/commerce/http";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const book = typeof body?.slug === "string" ? getPlaybook(body.slug) : undefined;
  if (!book || !purchaseAvailable(book)) return NextResponse.json({ error: "This playbook is in preparation. Purchasing is not open yet." }, { status: 503, headers: privateHeaders });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please start checkout from the product page." }, { status: 403 });
  if (typeof body.requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.requestId)) return NextResponse.json({ error: "Please retry from the product page." }, { status: 400 });
  try {
    if (!await rateLimit(`checkout:${requestIp(request)}`, 20)) return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429, headers: { ...privateHeaders, "Retry-After": "3600" } });
    const provider = stripe();
    const priceId = process.env[book.checkoutPriceEnv]!;
    const fileKey = process.env[book.fileKeyEnv]!;
    const [price] = await Promise.all([provider.prices.retrieve(priceId), verifyFile(fileKey)]);
    if (!price.active || price.type !== "one_time" || price.unit_amount !== book.price.amount || price.currency !== book.price.currency || price.livemode !== (process.env.COMMERCE_MODE === "live")) throw new Error("Price configuration mismatch");
    const session = await provider.checkout.sessions.create({ mode: "payment", line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteOrigin()}/resources/purchase/success?session_id={CHECKOUT_SESSION_ID}&slug=${book.slug}`,
      cancel_url: `${siteOrigin()}/resources/purchase/cancelled?slug=${book.slug}`,
      metadata: { app: "northmark-playbooks", slug: book.slug },
      // No client-supplied prices, coupons, file paths, or redirect destinations.
    }, { idempotencyKey: `playbook:${book.slug}:${body.requestId}` });
    if (!session.url?.startsWith("https://checkout.stripe.com/")) throw new Error("Checkout URL unavailable");
    await saveOrder({ session_id: session.id, slug: book.slug, price_id: priceId, amount: book.price.amount, currency: book.price.currency, file_key: fileKey, livemode: session.livemode });
    await recordEvent(`checkout:${session.id}`, "checkout_started", book.slug, session.livemode);
    return NextResponse.json({ url: session.url, returnPath: playbookPath(book) }, { headers: privateHeaders });
  } catch {
    console.error("[commerce] Checkout could not be prepared; check provider, database, price and private file configuration.");
    return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again later." }, { status: 503, headers: privateHeaders });
  }
}
