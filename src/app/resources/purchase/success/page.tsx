import type { Metadata } from "next";
import { PurchaseStatus } from "@/components/playbooks/PurchaseStatus";
import { getPlaybook, playbookPath } from "@/lib/playbooks";
export const metadata: Metadata = { title: "Purchase confirmation | Northmark Press" };
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string; slug?: string }> }) {
  const { session_id, slug } = await searchParams;
  const book = getPlaybook(slug || "master-interviews");
  return <main id="main" className="commerce-page"><p className="book-eyebrow">Northmark Press / Purchase confirmation</p><PurchaseStatus sessionId={session_id || ""} returnHref={book ? playbookPath(book) : "/resources"} title={book?.title || "resources"} /></main>;
}
