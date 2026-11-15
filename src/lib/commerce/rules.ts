import type { Playbook } from "../playbooks";

// Minimal shapes of the Polar API objects we read (API version 2026-10).
export type PolarProduct = {
  id: string; is_archived: boolean; is_recurring: boolean;
  prices: { amount_type: string; price_amount?: number; price_currency?: string; is_archived: boolean }[];
  benefits: { type: string }[];
};
export type PolarCheckout = { id: string; url: string; status: "open" | "expired" | "confirmed" | "succeeded" | "failed"; metadata?: Record<string, unknown> };
export const CHECKOUT_APP = "northmark-playbooks";

/** The Polar product must be a live one-time product whose only active price matches the page, and it must deliver a file. */
export function productMatches(product: PolarProduct, book: Pick<Playbook, "price">, productId: string) {
  const active = product.prices.filter(price => !price.is_archived);
  return product.id === productId && !product.is_archived && !product.is_recurring && active.length === 1
    && active[0].amount_type === "fixed" && active[0].price_amount === book.price.amount
    && active[0].price_currency?.toLowerCase() === book.price.currency
    && product.benefits.some(benefit => benefit.type === "downloadables");
}

/** Only redirect buyers to Polar-hosted checkout pages over HTTPS. */
export function checkoutUrlAllowed(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "polar.sh" || url.hostname.endsWith(".polar.sh")) && !url.username && !url.password;
  } catch { return false; }
}

export function validCheckoutId(id: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id); }
