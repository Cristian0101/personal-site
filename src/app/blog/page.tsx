"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { posts } from "@/lib/posts";

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-20 md:py-32">
      <div className="mx-auto max-w-[560px] md:max-w-[780px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-16"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] mb-4 font-mono">
            Writing
          </p>
          <h1 className="text-4xl md:text-5xl font-mono font-normal tracking-tight mb-4">
            Essays & Build-in-Public
          </h1>
          <p className="text-[var(--color-muted)] text-lg mb-16">
            Raw notes from building a YC-target SaaS as a solo founder.
          </p>
        </motion.div>

        <div className="space-y-0">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-baseline justify-between py-6 border-b border-[var(--color-border)]">
                  <div className="flex-1 mr-8">
                    <h2 className="font-mono text-lg text-[var(--color-text)] group-hover:text-emerald-500 transition-colors duration-200 group-hover:translate-x-1 transform">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                      {post.subtitle}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-muted)] whitespace-nowrap font-mono">
                    {post.date}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 pt-8 border-t border-[var(--color-border)]"
        >
          <p className="text-sm text-[var(--color-muted)]">
            &copy; 2026 Cristian Sanchez-Aguilera
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
