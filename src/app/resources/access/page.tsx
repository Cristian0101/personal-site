import type { Metadata } from "next";
import Link from "next/link";
import { customerPortalUrl } from "@/lib/commerce/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Playbook access & support | Northmark Press", description: "Download your Northmark Press playbooks again, find receipts, and get help with a purchase." };

// Public support URL for Northmark Press purchases (used in Polar's organization settings).
export default function AccessPage() {
  const portal = customerPortalUrl();
  return <main id="main" className="commerce-page"><p className="book-eyebrow">Northmark Press / Support</p><h1>Your playbook, when you need it.</h1>
    <h2>Download your PDF again</h2>
    <p>Payments and delivery are handled by Polar. After purchase you receive an email with your receipt and download link.</p>
    {portal
      ? <p>Lost it? Open the <a href={portal} rel="noopener">customer portal ↗</a> and sign in with your purchase email. You&apos;ll get a one-time code, then you can download your files and invoices anytime.</p>
      : <p>Purchasing is not open yet. Download access will be available here when the digital playbooks launch.</p>}
    <h2>Receipts, invoices and refunds</h2>
    <p>Your receipt and invoice are in the customer portal. For a question about a charge or a refund, message <a href="https://linkedin.com/in/cristian-sanchez-aguilera" rel="noopener">Cristian on LinkedIn ↗</a> with the email you used at checkout.</p>
    <p><Link href="/resources">← Back to resources</Link></p></main>;
}
