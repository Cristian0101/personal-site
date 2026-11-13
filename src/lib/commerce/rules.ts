import type Stripe from "stripe";

export type Order = { session_id: string; slug: string; price_id: string; amount: number; currency: string; file_key: string; livemode: boolean };
export type Purchase = Order & { email: string; payment_intent_id: string; created_at: Date; access_expires_at: Date; email_sent_at: Date | null; revoked: boolean };

export function verifiedPayment(session: Stripe.Checkout.Session, order: Order): { email: string; paymentIntent: string } | null {
  const lines = session.line_items;
  const email = session.customer_details?.email?.trim().toLowerCase();
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (session.id !== order.session_id || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid"
    || session.livemode !== order.livemode || session.amount_total !== order.amount || session.currency !== order.currency
    || session.metadata?.app !== "northmark-playbooks" || session.metadata?.slug !== order.slug
    || !lines || lines.has_more || lines.data.length !== 1 || lines.data[0].price?.id !== order.price_id || lines.data[0].quantity !== 1
    || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !paymentIntent) return null;
  return { email, paymentIntent };
}

export function hasReversedPayment(intent: Stripe.PaymentIntent) {
  const charge = typeof intent.latest_charge === "object" ? intent.latest_charge : null;
  return intent.status !== "succeeded" || !charge || charge.refunded || charge.amount_refunded > 0 || charge.disputed;
}
