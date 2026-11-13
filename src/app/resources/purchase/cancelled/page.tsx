import type { Metadata } from "next";
import Link from "next/link";
import { getPlaybook, playbookPath } from "@/lib/playbooks";
export const metadata: Metadata = { title: "Checkout closed | Northmark Press" };
export default async function CancelledPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const book = getPlaybook((await searchParams).slug || "master-interviews");
  return <main id="main" className="commerce-page"><p className="book-eyebrow">Northmark Press</p><h1>Checkout closed.</h1><p>You left checkout. If you already submitted a payment, check your email or recover access before trying again.</p><p><Link href={book ? playbookPath(book) : "/resources"}>← Back to {book?.title || "resources"}</Link></p><p><Link href="/resources/access">Recover purchase access →</Link></p></main>;
}
