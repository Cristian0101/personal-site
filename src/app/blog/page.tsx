import { posts } from "@/lib/posts";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function BlogPage() {
  return (
    <main className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-[var(--bg)] px-6 py-20`}>
      <div className="max-w-[560px] md:max-w-[780px] mx-auto">
        <Link
          href="/"
          className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] hover:text-[var(--text)] transition-colors mb-12 inline-block"
        >
          ← Back
        </Link>
        <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-sans)] mb-6">
          Writing
        </p>
        <div className="space-y-0">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-start justify-between gap-4 py-5 border-b border-[var(--border)] group"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text)] font-[family-name:var(--font-geist-sans)] group-hover:text-emerald-500 transition-colors mb-1">
                  {post.title}
                </p>
                <p className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light">
                  {post.description}
                </p>
              </div>
              <span className="text-[10px] text-[var(--muted)] whitespace-nowrap mt-0.5">
                {post.date}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
