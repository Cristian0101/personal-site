"use client";

import { useState } from "react";

export function PurchaseControl({ slug, price, enabled }: { slug: string; price: string; enabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/commerce/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, requestId: crypto.randomUUID() }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout is unavailable. Please try again shortly.");
      window.location.assign(data.url);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not open checkout. Please try again."); setPending(false); }
  }
  if (!enabled) return <div className="book-availability"><span className="book-availability__dot" aria-hidden="true" /><p><strong>In preparation</strong><span>Purchasing will open when the finished playbook is ready.</span></p></div>;
  return <div className="book-checkout"><button className="book-button" type="button" disabled={pending} onClick={checkout}>{pending ? "Opening secure checkout…" : `Get the Playbook — ${price}`}<span aria-hidden="true">↗</span></button><p className="book-fine">PDF · Secure checkout · Access by email after payment confirmation</p>{error ? <p role="alert" className="book-error">{error}</p> : null}</div>;
}
