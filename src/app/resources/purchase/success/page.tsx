import type { Metadata } from "next";
import Link from "next/link";
import { getPlaybook, playbookPath } from "@/lib/playbooks";
import { customerPortalUrl } from "@/lib/commerce/config";
import { getCheckout } from "@/lib/commerce/polar";
import { CHECKOUT_APP, validCheckoutId } from "@/lib/commerce/rules";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Purchase confirmation | Northmark Press" };

const messages = {
  succeeded: { title: "Your playbook is ready.", copy: "Payment confirmed. Polar has emailed your receipt and a link to download your PDF. You can also download it anytime from the customer portal with your purchase email." },
  confirmed: { title: "Payment confirmation pending.", copy: "Your payment is still being confirmed. Your download link will arrive by email as soon as it clears. Some payment methods take longer." },
  open: { title: "Checkout isn't finished yet.", copy: "This checkout hasn't been paid. Return to the playbook to complete your purchase." },
  expired: { title: "Checkout has expired.", copy: "This checkout expired before payment was completed. Return to the playbook to start again." },
  failed: { title: "Payment was unsuccessful.", copy: "This payment did not complete and no charge was made. Return to the playbook to try again." },
  invalid: { title: "We couldn't find that purchase.", copy: "If you completed a payment, check your email for your receipt and download link, or open the customer portal." },
  unavailable: { title: "We can't check your purchase right now.", copy: "If you completed a payment, your receipt and download link will still arrive by email. Try this page again in a minute." },
};

async function checkoutState(id: string): Promise<keyof typeof messages> {
  if (!validCheckoutId(id)) return "invalid";
  try {
    const checkout = await getCheckout(id);
    return checkout.metadata?.app === CHECKOUT_APP ? checkout.status : "invalid";
  } catch { return "unavailable"; }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ checkout_id?: string; slug?: string }> }) {
  const { checkout_id, slug } = await searchParams;
  const book = getPlaybook(slug || "");
  // Display only. Polar fulfils the order and delivers the file; visiting this page grants nothing.
  const state = await checkoutState(checkout_id || "");
  const message = messages[state];
  const portal = customerPortalUrl();
  return <main id="main" className="commerce-page"><p className="book-eyebrow">Northmark Press / Purchase confirmation</p>
    <h1>{message.title}</h1><p>{message.copy}</p>
    {["confirmed", "unavailable"].includes(state) ? <p><Link href={`/resources/purchase/success?checkout_id=${encodeURIComponent(checkout_id || "")}&slug=${encodeURIComponent(slug || "")}`}>Check again →</Link></p> : null}
    {portal ? <p><a href={portal} rel="noopener">Open the customer portal ↗</a></p> : null}
    <p><Link href="/resources/access">Help with your purchase →</Link></p>
    <p><Link href={book ? playbookPath(book) : "/resources"}>← Return to {book?.title || "resources"}</Link></p></main>;
}
