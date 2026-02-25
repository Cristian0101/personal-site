"use client";

import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Envelope,
  LinkedinLogo,
  Moon,
  Sun,
  XLogo,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
});

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-6 right-6 z-50 rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-2 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? (
          <Sun size={16} weight="light" />
        ) : (
          <Moon size={16} weight="light" />
        )}
      </motion.div>
    </motion.button>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`}>
      <ThemeToggle />
      <main className="min-h-screen bg-[var(--bg)] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[560px]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-[family-name:var(--font-dm)] uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              New York · Builder · Founder
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mb-10 font-[family-name:var(--font-cormorant)] text-5xl leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl"
            >
              Cristian <em className="italic">Sanchez-Aguilera</em>
            </motion.h1>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 flex flex-wrap gap-2"
          >
            {[
              {
                label: "Syntri AI",
                href: "https://app.syntriai.com",
                icon: <ArrowUpRight size={13} />,
              },
              {
                label: "LinkedIn",
                href: "https://linkedin.com/in/cristian-sanchez-aguilera",
                icon: <LinkedinLogo size={13} />,
              },
              { label: "X", href: "https://x.com/CristianXIV", icon: <XLogo size={13} /> },
              {
                label: "Email",
                href: "mailto:cristian@syntriai.com",
                icon: <Envelope size={13} />,
              },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                variants={fadeUp}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 font-[family-name:var(--font-dm)] text-sm text-[var(--muted)] transition-colors duration-200 hover:border-[var(--text)] hover:text-[var(--text)]"
              >
                {link.icon}
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 border-t border-[var(--border)]"
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 space-y-4 font-[family-name:var(--font-dm)] text-[0.975rem] font-light leading-[1.9] text-[var(--muted)]"
          >
            <p>
              I&apos;m 20 years old, based in New York. For the past year and a half
              I&apos;ve worked in go-to-market — carrying quota as a BDR, making hundreds of
              cold calls, and learning firsthand how broken the tools are for sales teams
              trying to build real pipeline.
            </p>
            <p>
              That frustration became{" "}
              <span className="font-medium text-[var(--text)]">Syntri AI</span> — the first
              agentic territory management platform built for B2B sales teams. Instead of
              giving reps a database and leaving them to figure it out, Syntri turns buying
              signals into a daily attack plan. I&apos;m building it solo, shipping fast, and
              documenting everything in public.
            </p>
            <p>
              If you&apos;re in sales, investing in early-stage startups, or just want to talk
              — reach out.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 border-t border-[var(--border)]"
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <motion.a
              href="https://app.syntriai.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-[family-name:var(--font-dm)] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                  Current Focus
                </span>
                <span className="flex items-center gap-1 font-[family-name:var(--font-dm)] text-[10px] text-emerald-500">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
              <p className="mb-2 font-[family-name:var(--font-dm)] text-sm font-medium text-[var(--text)]">
                Syntri AI
              </p>
              <p className="font-[family-name:var(--font-dm)] text-xs font-light leading-[1.7] text-[var(--muted)]">
                The first agentic territory management platform for B2B sales teams.
              </p>
            </motion.a>

            <motion.a
              href="https://whop.com/bldr-e4e2/"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-[family-name:var(--font-dm)] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                  Course
                </span>
                <span className="rounded-full bg-[var(--badge)] px-2 py-0.5 font-[family-name:var(--font-dm)] text-[10px] text-[var(--muted)]">
                  April 2026
                </span>
              </div>
              <p className="mb-2 font-[family-name:var(--font-dm)] text-sm font-medium text-[var(--text)]">
                BLDR
              </p>
              <p className="font-[family-name:var(--font-dm)] text-xs font-light leading-[1.7] text-[var(--muted)]">
                Teaching sales operators to build production SaaS with AI agents.
              </p>
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 border-t border-[var(--border)]"
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="mb-6 font-[family-name:var(--font-dm)] text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              Experience
            </motion.p>

            <div className="relative">
              <div className="absolute bottom-2 left-0 top-2 w-px bg-[var(--border)]" />

              <div className="space-y-8 pl-6">
                <motion.div variants={slideLeft} className="relative">
                  <div className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border border-[var(--border)] bg-[var(--bg)]" />
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-[family-name:var(--font-dm)] text-sm font-medium text-[var(--text)]">
                      Syntri AI
                    </span>
                    <span className="font-[family-name:var(--font-dm)] text-xs text-[var(--muted)]">
                      Founder
                    </span>
                    <span className="ml-auto font-[family-name:var(--font-dm)] text-[10px] text-emerald-500">
                      Feb 2026 – Present
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-dm)] text-xs font-light leading-[1.7] text-[var(--muted)]">
                    Building the all-in-one BDR platform that combines territory
                    management, rep onboarding, and AI-prioritized daily attack plans —
                    solo.
                  </p>
                </motion.div>

                <motion.div variants={slideLeft} className="relative">
                  <div className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border border-[var(--border)] bg-[var(--bg)]" />
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-[family-name:var(--font-dm)] text-sm font-medium text-[var(--text)]">
                      DataSnipper
                    </span>
                    <span className="font-[family-name:var(--font-dm)] text-xs text-[var(--muted)]">
                      Business Development Specialist
                    </span>
                    <span className="ml-auto font-[family-name:var(--font-dm)] text-[10px] text-[var(--muted)]">
                      Jul 2025 – Feb 2026
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-dm)] text-xs font-light leading-[1.7] text-[var(--muted)]">
                    Drove growth for the leading Excel-embedded automation platform used by
                    95 of the Top 100 accounting firms. Ran full-cycle outbound targeting
                    audit, tax, and advisory leaders.
                  </p>
                </motion.div>

                <motion.div variants={slideLeft} className="relative">
                  <div className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border border-[var(--border)] bg-[var(--bg)]" />
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-[family-name:var(--font-dm)] text-sm font-medium text-[var(--text)]">
                      Swap
                    </span>
                    <span className="font-[family-name:var(--font-dm)] text-xs text-[var(--muted)]">
                      Founding GTM
                    </span>
                    <span className="ml-auto font-[family-name:var(--font-dm)] text-[10px] text-[var(--muted)]">
                      Feb 2025 – Jun 2025
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-dm)] text-xs font-light leading-[1.7] text-[var(--muted)]">
                    Apart of the NYC Founding BDR team at a fast-growing cross-border
                    e-commerce OS for DTC brands. The platform unifies everything a brand
                    needs to operate cross-border- from international shipping, returns
                    management, and inventory forecasting to automated tax compliance,
                    customs clearance, and duty optimization- all on a single dashboard
                  </p>
                </motion.div>

                <motion.div variants={slideLeft} className="relative">
                  <div className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border border-[var(--border)] bg-[var(--bg)]" />
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-[family-name:var(--font-dm)] text-sm font-medium text-[var(--text)]">
                      Varonis
                    </span>
                    <span className="font-[family-name:var(--font-dm)] text-xs text-[var(--muted)]">
                      Sales Development Representative
                    </span>
                    <span className="ml-auto font-[family-name:var(--font-dm)] text-[10px] text-[var(--muted)]">
                      Sep 2024 – Feb 2025
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-dm)] text-xs font-light leading-[1.7] text-[var(--muted)]">
                    Enterprise cybersecurity outbound- cold calls, emails, and LinkedIn
                    targeting security and IT leaders. Used Salesforce, Outreach, ZoomInfo,
                    and Sales Navigator daily.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 font-[family-name:var(--font-dm)] text-[11px] tracking-wide text-[var(--muted)]"
          >
            © 2026 Cristian Sanchez-Aguilera
          </motion.p>
        </div>
      </main>
    </div>
  );
}
