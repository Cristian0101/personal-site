import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaybookPage } from "@/components/playbooks/PlaybookPage";
import { getPlaybook, playbookPath } from "@/lib/playbooks";
import { purchaseAvailable } from "@/lib/commerce/config";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const book = getPlaybook((await params).slug);
  if (!book) return {};
  return { title: `${book.seo.title} | Northmark Press`, description: book.seo.description, alternates: { canonical: playbookPath(book) },
    openGraph: { type: "website", title: book.seo.title, description: book.seo.description, url: `${SITE_URL}${playbookPath(book)}`, images: [{ url: book.cover.src, width: book.cover.width, height: book.cover.height, alt: book.cover.alt }] },
    twitter: { card: "summary_large_image", title: book.seo.title, description: book.seo.description, images: [book.cover.src] },
  };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const book = getPlaybook((await params).slug);
  if (!book) notFound();
  return <PlaybookPage book={book} canPurchase={purchaseAvailable(book)} />;
}
