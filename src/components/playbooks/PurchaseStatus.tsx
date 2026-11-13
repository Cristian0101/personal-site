"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const messages: Record<string, { title: string; copy: string }> = {
  checking: { title: "Checking your purchase.", copy: "We're waiting for payment confirmation. This page alone does not confirm a purchase." },
  pending: { title: "Payment confirmation pending.", copy: "Your payment is still being confirmed. Access will be sent to your checkout email after payment is verified. Some payment methods take longer." },
  confirmed: { title: "Your playbook is ready.", copy: "Your payment is verified and your private access link has been sent to your checkout email. Check your inbox and spam folder." },
  delivery_pending: { title: "Payment confirmed. Preparing access.", copy: "Your payment is verified. Email delivery is still being completed. You can also request a fresh link using your purchase email below." },
  failed: { title: "Payment was unsuccessful.", copy: "This payment did not complete and access has not been issued. Return to the playbook to try again." },
  expired: { title: "Checkout has expired.", copy: "This checkout session expired before payment was completed. Return to the playbook to start again." },
  revoked: { title: "Access is unavailable.", copy: "This purchase no longer has active access. If you believe this is an error, reply to your purchase email." },
  invalid: { title: "We couldn't find that purchase.", copy: "Open the confirmation link from your checkout, or recover access using your purchase email." },
  unavailable: { title: "We can't check your purchase yet.", copy: "Confirmation is temporarily unavailable. If you completed a payment, keep your receipt and check your email for access. You can also recover access below." },
};

export function PurchaseStatus({ sessionId, returnHref, title }: { sessionId: string; returnHref: string; title: string }) {
  const [state, setState] = useState("checking");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    async function check() {
      try {
        const response = await fetch(`/api/commerce/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (controller.signal.aborted) return;
        setState(data.state in messages ? data.state : "unavailable");
        if (["pending", "delivery_pending"].includes(data.state) && ++count < 10) timer = setTimeout(check, 2500);
      } catch { if (!controller.signal.aborted) setState("unavailable"); }
    }
    void check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [sessionId, retry]);
  const message = messages[state];
  return <><div aria-live="polite" aria-atomic="true"><h1>{message.title}</h1><p>{message.copy}</p></div>{["pending", "delivery_pending", "unavailable"].includes(state) ? <button className="book-button" type="button" onClick={() => { setState("checking"); setRetry(value => value + 1); }}>Check again</button> : null}<p><Link href="/resources/access">Recover purchase access →</Link></p><p><Link href={returnHref}>← Return to {title}</Link></p></>;
}
