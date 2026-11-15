import type { Playbook } from "../playbooks";

export type CommerceEnv = Record<string, string | undefined>;
export const requiredCommerceEnv = ["POLAR_ACCESS_TOKEN", "POLAR_ORGANIZATION_SLUG", "COMMERCE_SITE_URL"];

/** test = Polar sandbox, live = Polar production. Anything else is treated as test and blocked from live. */
export function commerceLive(env: CommerceEnv = process.env) { return env.COMMERCE_MODE === "live"; }
export function polarApiBase(env: CommerceEnv = process.env) { return commerceLive(env) ? "https://api.polar.sh" : "https://sandbox-api.polar.sh"; }

/** Polar-hosted customer portal: buyers sign in with their purchase email to re-download files and get receipts. */
export function customerPortalUrl(env: CommerceEnv = process.env) {
  const slug = env.POLAR_ORGANIZATION_SLUG;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return null;
  return `${commerceLive(env) ? "https://polar.sh" : "https://sandbox.polar.sh"}/${slug}/portal`;
}

export function purchaseAvailable(book: Playbook, env: CommerceEnv = process.env): boolean {
  try { commerceOrigin(env.COMMERCE_SITE_URL || ""); } catch { return false; }
  return book.purchaseEnabled && book.status === "published" && book.finalPdfApproved && book.price.approved
    && (!env.COMMERCE_MODE || ["test", "live"].includes(env.COMMERCE_MODE))
    && Number.isSafeInteger(book.price.amount) && book.price.amount > 0 && /^[a-z]{3}$/.test(book.price.currency)
    && env.COMMERCE_VERIFIED === "true" && (!commerceLive(env) || env.COMMERCE_LIVE_VERIFIED === "true")
    && requiredCommerceEnv.every(key => Boolean(env[key])) && customerPortalUrl(env) !== null
    && Boolean(env[book.polarProductEnv]);
}

export function siteOrigin() {
  return commerceOrigin(process.env.COMMERCE_SITE_URL || "http://127.0.0.1:3218");
}
export function commerceOrigin(value: string) {
  const url = new URL(value);
  const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password || (url.protocol !== "https:" && !localHttp)) throw new Error("Invalid commerce origin");
  return url.origin;
}

export const privateHeaders = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
export function sameOrigin(request: Request) {
  try {
    const url = new URL(request.url);
    // Next's dev adapter can normalize request.url to localhost even when Host is 127.0.0.1.
    const expected = process.env.COMMERCE_SITE_URL ? siteOrigin() : `${url.protocol}//${request.headers.get("host") || url.host}`;
    return request.headers.get("origin") === expected;
  } catch { return false; }
}
