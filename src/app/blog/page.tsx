"use client";

import { posts } from "@/lib/posts";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export default function BlogPage() {
  return (
    <main className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-[var(--bg)] px-6 py-20`}>
      <div className="max-w-[560px] md:max-w-[780px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] hover:text-[var(--text)] transition-colors duration-200 mb-14"
          >
            <ArrowLeft size={12} />
            Back
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-14"
        >
          <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-sans)] mb-3">
            Writing
          </p>
          <h1 className="font-[family-name:var(--font-geist-mono)] text-3xl md:text-4xl font-normal text-[var(--text)] leading-tight mb-3">
            Essays &amp; Build-in-Public
          </h1>
          <p className="text-sm text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light leading-[1.7]">
            Raw notes from building a YC-target SaaS as a solo founder.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-0">
          {posts.map((post) => (
            <motion.div key={post.slug} variants={fadeUp} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start justify-between gap-4 py-5 border-b border-[var(--border)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--muted)] font-[family-name:var(--font-geist-mono)] mb-1 leading-snug group-hover:text-[var(--text)] transition-colors duration-200">
                    {post.title}
                  </p>
                  <p className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light leading-[1.7] group-hover:text-[var(--text)] transition-colors duration-200">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5 shrink-0">
                  <span className="text-[10px] text-[var(--muted)] whitespace-nowrap">{post.date}</span>
                  <ArrowUpRight
                    size={12}
                    className="text-[var(--muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--text)] transition-all duration-200"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-16 text-[11px] text-[var(--muted)] font-[family-name:var(--font-geist-sans)] tracking-wide">
          © 2026 Cristian Sanchez-Aguilera
        </p>
      </div>
    </main>
  );
}
