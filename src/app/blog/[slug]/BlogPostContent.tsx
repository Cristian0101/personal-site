"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/posts";

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

function ContentBlock({ block }: { block: string }) {
  const trimmed = block.trim();

  if (trimmed === "---") {
    return (
      <div className="my-10">
        <div className="mx-auto h-px w-10 bg-[var(--color-border)]" />
      </div>
    );
  }

  if (trimmed === "meditate.") {
    return <p className="motif">meditate.</p>;
  }

  if (trimmed.startsWith("\u201C") || trimmed.startsWith('"')) {
    return <blockquote>{renderInlineFormatting(trimmed)}</blockquote>;
  }

  const isPunchLine =
    trimmed.length < 60 &&
    !trimmed.endsWith(".") &&
    !trimmed.includes(",") &&
    trimmed.split(" ").length <= 10;

  if (
    isPunchLine ||
    trimmed === "I did it." ||
    trimmed === "Generative AI. Hooked instantly." ||
    trimmed === "Then came the idea." ||
    trimmed === "The list got long. Fast." ||
    trimmed === "No. I refused." ||
    trimmed === "Then my car crashed." ||
    trimmed === "Let's make money." ||
    trimmed === "Let's get a job."
  ) {
    return <p className="punch">{renderInlineFormatting(trimmed)}</p>;
  }

  return <p>{renderInlineFormatting(trimmed)}</p>;
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const blocks = post.content.split("\n\n");

  return (
    <main id="main" className="blog-doc">
      <Link href="/blog" className="blog-back">
        ← Back
      </Link>

      <header>
        <p className="blog-doc__label">Writing</p>
        <h1>{post.title}</h1>
        <p className="blog-doc__meta">
          {post.date} · {post.readTime}
        </p>
      </header>

      <article className="blog-body">
        {blocks.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </article>

      <footer className="blog-footer">
        <Link href="/blog" className="blog-back" style={{ marginBottom: 16 }}>
          ← Back to writing
        </Link>
        <p>&copy; 2026 Cristian Sanchez-Aguilera</p>
      </footer>
    </main>
  );
}
