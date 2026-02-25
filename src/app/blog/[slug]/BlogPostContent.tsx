"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import type { BlogPost } from "@/lib/posts";

function renderInlineFormatting(text: string) {
  // Handle *italic* markers
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

  // Section divider
  if (trimmed === "---") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="my-12 md:my-16"
      >
        <div className="w-12 h-px bg-[var(--color-border)] mx-auto" />
      </motion.div>
    );
  }

  // "meditate." motif - styled distinctly
  if (trimmed === "meditate.") {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="my-10 text-center font-mono text-sm tracking-[0.3em] uppercase text-emerald-500/70 select-none"
      >
        meditate.
      </motion.p>
    );
  }

  // Blockquote - lines starting with "
  if (trimmed.startsWith("\u201C") || trimmed.startsWith('"')) {
    return (
      <motion.blockquote
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="my-10 pl-6 border-l-2 border-emerald-500/40 text-[var(--color-muted)] italic text-lg leading-relaxed"
      >
        {renderInlineFormatting(trimmed)}
      </motion.blockquote>
    );
  }

  // Dialogue pairs - detect quote-response pattern
  // e.g., "How do you write so well?" he asked.
  // "I used to do copywriting."
  if (
    (trimmed.startsWith("\u201C") || trimmed.startsWith('"')) &&
    trimmed.length < 120
  ) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="my-4 text-[var(--color-text)] text-lg leading-relaxed italic"
      >
        {renderInlineFormatting(trimmed)}
      </motion.p>
    );
  }

  // Short punchy lines (under 60 chars, not a normal sentence)
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
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="my-8 text-[var(--color-text)] text-xl md:text-2xl font-mono tracking-tight"
      >
        {renderInlineFormatting(trimmed)}
      </motion.p>
    );
  }

  // Default paragraph
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="my-6 text-[var(--color-muted)] text-lg leading-[1.85] tracking-wide"
    >
      {renderInlineFormatting(trimmed)}
    </motion.p>
  );
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const blocks = post.content.split("\n\n");

  return (
    <main className="min-h-screen px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[560px] md:max-w-[680px]">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-16"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 md:mb-20"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] mb-4 font-mono">
            Writing
          </p>
          <h1 className="text-4xl md:text-5xl font-mono font-normal tracking-tight mb-4 text-[var(--color-text)]">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[var(--color-muted)] font-mono">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-muted)]" />
            <span>{post.readTime}</span>
          </div>
        </motion.header>

        {/* Content */}
        <article>
          {blocks.map((block, index) => (
            <ContentBlock key={index} block={block} />
          ))}
        </article>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 pt-8 border-t border-[var(--color-border)]"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Writing
          </Link>
          <p className="text-sm text-[var(--color-muted)] mt-8">
            &copy; 2026 Cristian Sanchez-Aguilera
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
