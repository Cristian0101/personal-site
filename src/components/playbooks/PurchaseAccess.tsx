"use client";

import { useEffect, useState } from "react";

export function PurchaseAccess({ configured }: { configured: boolean }) {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    // Fragments are never sent in HTTP requests or server logs. Remove it from visible history.
    const frame = requestAnimationFrame(() => {
      const fragment = window.location.hash.slice(1);
      if (fragment) { setToken(fragment); window.history.replaceState(null, "", window.location.pathname); }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  async function download() {
    setPending(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/commerce/download", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error((await response.json()).error || "Could not download your playbook.");
      const file = await response.blob();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a"); a.href = url; a.download = response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] || "playbook.pdf"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setMessage("Your PDF download has started. Keep a copy somewhere you can find it.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not download. Please try again."); }
    finally { setPending(false); }
  }
  async function recover(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/commerce/recover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not recover access.");
      setMessage(data.message); setEmail("");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not recover access. Please try again."); }
    finally { setPending(false); }
  }
  return <>{token ? <div><p>Your private access link is ready to check. Download access is verified against your purchase.</p><button type="button" className="book-button" disabled={pending} onClick={download}>{pending ? "Checking your access…" : "Download your playbook"}<span aria-hidden="true">↓</span></button></div> : null}
    {configured ? <form onSubmit={recover}><label htmlFor="purchase-email">Need a fresh link? Enter the email used at checkout.</label><input id="purchase-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /><button className="book-button" disabled={pending} type="submit">{pending ? "Requesting access…" : "Email my access link"}<span aria-hidden="true">↗</span></button></form> : <p>Purchase access will be available when the digital playbook launches. Purchasing is not open yet.</p>}
    {message ? <p role="status">{message}</p> : null}{error ? <p className="book-error" role="alert">{error}</p> : null}</>;
}
