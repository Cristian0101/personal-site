"use client";

import { useEffect } from "react";

export function ProductView({ slug }: { slug: string }) {
  useEffect(() => {
    // Best-effort view telemetry. Purchase events are written by the verified webhook only.
    void fetch("/api/commerce/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }), keepalive: true }).catch(() => {});
  }, [slug]);
  return null;
}
