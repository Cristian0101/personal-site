import type { Playbook } from "../playbooks";

export type CommerceEnv = Record<string, string | undefined>;
export const requiredCommerceEnv = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "COMMERCE_DATABASE_URL", "COMMERCE_SITE_URL", "COMMERCE_ACCESS_SECRET", "COMMERCE_S3_BUCKET", "COMMERCE_S3_REGION", "COMMERCE_S3_ACCESS_KEY_ID", "COMMERCE_S3_SECRET_ACCESS_KEY", "RESEND_API_KEY", "COMMERCE_EMAIL_FROM"];

export function purchaseAvailable(book: Playbook, env: CommerceEnv = process.env): boolean {
  const live = env.COMMERCE_MODE === "live";
  try { commerceOrigin(env.COMMERCE_SITE_URL || ""); } catch { return false; }
  return book.purchaseEnabled && book.status === "published" && book.finalPdfApproved && book.price.approved
    && (!env.COMMERCE_MODE || ["test", "live"].includes(env.COMMERCE_MODE))
    && Number.isSafeInteger(book.price.amount) && book.price.amount > 0 && /^[a-z]{3}$/.test(book.price.currency)
    && env.COMMERCE_VERIFIED === "true" && (!live || env.COMMERCE_LIVE_VERIFIED === "true")
    && (env.STRIPE_SECRET_KEY?.startsWith(live ? "sk_live_" : "sk_test_") ?? false)
    && (env.COMMERCE_ACCESS_SECRET?.length ?? 0) >= 32
    && requiredCommerceEnv.every(key => Boolean(env[key]))
    && Boolean(env[book.checkoutPriceEnv]) && Boolean(env[book.fileKeyEnv]);
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
