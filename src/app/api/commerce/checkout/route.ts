import { NextResponse } from "next/server";
import { getPlaybook, playbookPath } from "@/lib/playbooks";
import { privateHeaders, purchaseAvailable, sameOrigin, siteOrigin } from "@/lib/commerce/config";
import { createCheckout, getProduct } from "@/lib/commerce/polar";
import { CHECKOUT_APP, checkoutUrlAllowed, productMatches } from "@/lib/commerce/rules";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const book = typeof body?.slug === "string" ? getPlaybook(body.slug) : undefined;
  if (!book || !purchaseAvailable(book)) return NextResponse.json({ error: "This playbook is in preparation. Purchasing is not open yet." }, { status: 503, headers: privateHeaders });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Please start checkout from the product page." }, { status: 403, headers: privateHeaders });
  try {
    const productId = process.env[book.polarProductEnv]!;
    // Refuse to sell if Polar's price or file benefit has drifted from what the page shows.
    if (!productMatches(await getProduct(productId), book, productId)) throw new Error("Polar product does not match the page");
    // No client-supplied prices, products, discounts or redirect destinations.
    const checkout = await createCheckout({
      products: [productId],
      success_url: `${siteOrigin()}/resources/purchase/success?checkout_id={CHECKOUT_ID}&slug=${book.slug}`,
      return_url: `${siteOrigin()}${playbookPath(book)}`,
      metadata: { app: CHECKOUT_APP, slug: book.slug },
    });
    if (!checkoutUrlAllowed(checkout.url)) throw new Error("Checkout URL unavailable");
    return NextResponse.json({ url: checkout.url }, { headers: privateHeaders });
  } catch {
    console.error("[commerce] Polar checkout could not be prepared; check the token, product ID, price and file benefit.");
    return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again later." }, { status: 503, headers: privateHeaders });
  }
}
