"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string; redirect?: string };

    if (data.redirect) {
      window.location.href = data.redirect;
      return;
    }

    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Could not subscribe just yet.");
      return;
    }

    setStatus("ok");
    setMessage("You’re in. New Origin issues will land in your inbox.");
    setEmail("");
  }

  return (
    <form className="origin-subscribe" onSubmit={onSubmit}>
      <label htmlFor="newsletter-email">Get Origin in your inbox</label>
      <div className="newsletter__row">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {message ? <p className={`newsletter__status is-${status}`}>{message}</p> : null}
    </form>
  );
}
