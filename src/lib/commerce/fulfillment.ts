import type Stripe from "stripe";
import { verifiedPayment, type Order, type Purchase } from "./rules";

export type FulfillmentServices = {
  findOrder: (id: string) => Promise<Order | undefined>;
  getSession: (id: string) => Promise<Stripe.Checkout.Session>;
  recordPurchase: (order: Order, email: string, intent: string) => Promise<Purchase>;
  emailAccess: (purchase: Purchase, key: string) => Promise<void>;
  markEmailed: (id: string) => Promise<void>;
};

// Only the signature-verified webhook calls this. A success-page visit never fulfills an order.
export async function fulfillPayment(sessionId: string, services: FulfillmentServices) {
  const order = await services.findOrder(sessionId);
  if (!order) throw new Error("Order not recorded yet; retry webhook");
  const session = await services.getSession(sessionId);
  if (session.payment_status !== "paid") return "pending";
  const payment = verifiedPayment(session, order);
  if (!payment) throw new Error("Payment does not match the recorded order");
  const purchase = await services.recordPurchase(order, payment.email, payment.paymentIntent);
  if (purchase.revoked) return "revoked";
  if (!purchase.email_sent_at) {
    // The durable purchase and Resend's idempotency key make retries safe after partial failure.
    await services.emailAccess(purchase, `playbook:${sessionId}`);
    await services.markEmailed(sessionId);
  }
  return "fulfilled";
}
