import { getPost, posts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GeistPixelGrid } from "geist/font/pixel";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type BlogPostProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <main className={`${GeistPixelGrid.variable} min-h-screen bg-[var(--bg)] px-6 py-20`}>
      <div className="max-w-[560px] md:max-w-[680px] mx-auto">
        <Link
          href="/"
          className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)] hover:text-[var(--text)] transition-colors mb-12 inline-block"
        >
          ← Back
        </Link>
        <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)] mb-3">
          {post.date}
        </p>
        <h1 className="font-[family-name:var(--font-geist-pixel-grid)] text-3xl md:text-4xl font-normal text-[var(--text)] mb-8 leading-tight">
          {post.title}
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none font-[family-name:var(--font-geist-pixel-grid)] text-[var(--muted)] leading-[1.9] text-sm">
          {post.content}
        </div>
      </div>
    </main>
  );
}
