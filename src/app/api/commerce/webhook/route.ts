import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, emailAccess } from "@/lib/commerce/providers";
import { findOrder, markEmailed, recordPurchase, recordEvent, revokePurchase } from "@/lib/commerce/db";
import { fulfillPayment } from "@/lib/commerce/fulfillment";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  let event: Stripe.Event;
  try { event = stripe().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }
  if (event.livemode !== (process.env.COMMERCE_MODE === "live")) return NextResponse.json({ error: "Webhook mode mismatch." }, { status: 400 });
  try {
    const provider = stripe();
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.metadata?.app !== "northmark-playbooks") break;
        await fulfillPayment(session.id, { findOrder, getSession: id => provider.checkout.sessions.retrieve(id, { expand: ["line_items"] }), recordPurchase, emailAccess, markEmailed });
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object;
        if (session.metadata?.app !== "northmark-playbooks") break;
        const order = await findOrder(session.id);
        if (!order) throw new Error("Order not recorded yet");
        const failed = event.type === "checkout.session.async_payment_failed";
        await recordEvent(`${failed ? "failed" : "expired"}:${session.id}`, failed ? "payment_failed" : "checkout_expired", order.slug, session.livemode);
        break;
      }
      case "charge.refunded": {
        const intent = event.data.object.payment_intent;
        if (intent) await revokePurchase(typeof intent === "string" ? intent : intent.id);
        break;
      }
      case "charge.dispute.created": {
        const chargeId = event.data.object.charge;
        const charge = typeof chargeId === "string" ? await provider.charges.retrieve(chargeId) : chargeId;
        if (charge.payment_intent) await revokePurchase(typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id);
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    console.error("[commerce] Verified webhook processing failed; Stripe must retry.");
    return NextResponse.json({ error: "Processing incomplete. Retry this event." }, { status: 500 });
  }
}
