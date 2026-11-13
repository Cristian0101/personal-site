import type { Metadata } from "next";
import Link from "next/link";
import { PurchaseAccess } from "@/components/playbooks/PurchaseAccess";
import { requiredCommerceEnv } from "@/lib/commerce/config";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your playbook access | Northmark Press", robots: { index: false, follow: false }, referrer: "no-referrer", alternates: { canonical: null } };
export default function AccessPage() {
  return <main id="main" className="commerce-page"><p className="book-eyebrow">Northmark Press / Your library</p><h1>Your playbook, when you need it.</h1><PurchaseAccess configured={requiredCommerceEnv.every(key => Boolean(process.env[key]))} /><p><Link href="/resources">← Back to resources</Link></p></main>;
}
