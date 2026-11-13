import "server-only";
import postgres from "postgres";
import { createHmac } from "node:crypto";
import type { Order, Purchase } from "./rules";

let client: ReturnType<typeof postgres> | undefined;
export function db() {
  if (!process.env.COMMERCE_DATABASE_URL) throw new Error("Commerce database is not configured");
  return client ??= postgres(process.env.COMMERCE_DATABASE_URL, { max: 3, prepare: false, connect_timeout: 5, idle_timeout: 20 });
}

export async function saveOrder(order: Order) {
  await db()`INSERT INTO commerce_orders ${db()(order)} ON CONFLICT (session_id) DO NOTHING`;
}
export async function findOrder(sessionId: string) {
  return (await db()<Order[]>`SELECT * FROM commerce_orders WHERE session_id = ${sessionId}`)[0];
}
export async function findPurchase(sessionId: string) {
  return (await db()<Purchase[]>`SELECT o.*, p.email, p.payment_intent_id, p.created_at, p.access_expires_at, p.email_sent_at, p.revoked FROM commerce_purchases p JOIN commerce_orders o USING(session_id) WHERE session_id = ${sessionId}`)[0];
}
export async function recordPurchase(order: Order, email: string, paymentIntent: string) {
  await db().begin(async sql => {
    await sql`INSERT INTO commerce_purchases (session_id, email, payment_intent_id) VALUES (${order.session_id}, ${email}, ${paymentIntent}) ON CONFLICT (session_id) DO NOTHING`;
    await sql`INSERT INTO commerce_events (id, name, slug, livemode, amount, currency) VALUES (${`purchase:${order.session_id}`}, 'purchase_verified', ${order.slug}, ${order.livemode}, ${order.amount}, ${order.currency}) ON CONFLICT (id) DO NOTHING`;
  });
  return (await findPurchase(order.session_id))!;
}
export async function recordEvent(id: string, name: string, slug: string, live: boolean) {
  await db()`INSERT INTO commerce_events (id, name, slug, livemode) VALUES (${id}, ${name}, ${slug}, ${live}) ON CONFLICT (id) DO NOTHING`;
}
export async function markEmailed(sessionId: string) {
  await db()`UPDATE commerce_purchases SET email_sent_at = now() WHERE session_id = ${sessionId}`;
}
export async function revokePurchase(paymentIntent: string) {
  await db()`UPDATE commerce_purchases SET revoked = true WHERE payment_intent_id = ${paymentIntent}`;
}

// Atomic counters work across server instances. Never retain raw email/IP in rate-limit keys.
export async function rateLimit(key: string, max: number, seconds = 3600) {
  const hashed = createHmac("sha256", process.env.COMMERCE_ACCESS_SECRET || "local-unconfigured").update(key).digest("hex");
  const [row] = await db()`INSERT INTO commerce_rate_limits (key, started_at, attempts) VALUES (${hashed}, now(), 1)
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN commerce_rate_limits.started_at < now() - ${seconds} * interval '1 second' THEN 1 ELSE commerce_rate_limits.attempts + 1 END,
      started_at = CASE WHEN commerce_rate_limits.started_at < now() - ${seconds} * interval '1 second' THEN now() ELSE commerce_rate_limits.started_at END
    RETURNING attempts`;
  return row.attempts <= max;
}

export function requestIp(request: Request) {
  // Vercel overwrites this header. Other hosts must supply a trusted, overwritten proxy header.
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "shared";
}
