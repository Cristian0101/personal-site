"use client";

import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Envelope,
  LinkedinLogo,
  Moon,
  Sun,
  XLogo,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

const experience = [
  {
    company: "Syntri AI",
    role: "Founder",
    period: "Feb 2026 – Present",
    current: true,
    description:
      "Building the all-in-one BDR platform that combines territory management, rep onboarding, and AI-prioritized daily attack plans — solo.",
  },
  {
    company: "DataSnipper",
    role: "Business Development Specialist",
    period: "Jul 2025 – Feb 2026",
    current: false,
    description:
      "Drove growth for the leading Excel-embedded automation platform used by 95 of the Top 100 accounting firms. Ran full-cycle outbound targeting audit, tax, and advisory leaders.",
  },
  {
    company: "Swap",
    role: "Founding GTM",
    period: "Feb 2025 – Jun 2025",
    current: false,
    description:
      "First GTM hire at a fast-growing cross-border e-commerce OS for DTC brands. Built outbound motion from zero.",
  },
  {
    company: "Varonis",
    role: "Sales Development Representative",
    period: "Sep 2024 – Feb 2025",
    current: false,
    description:
      "Enterprise cybersecurity outbound — cold calls, emails, and LinkedIn targeting security and IT leaders. Salesforce, Outreach, ZoomInfo, and Sales Navigator.",
  },
  {
    company: "Renewal by Andersen",
    role: "Proximity Marketer",
    period: "Jun 2024 – Sep 2024",
    current: false,
    description:
      "Door-to-door outbound promoting window and door solutions across Stamford, CT. Built pipeline through direct customer engagement and relationship management.",
  },
  {
    company: "Best Choice Roofing",
    role: "Sales Representative",
    period: "May 2024 – Aug 2024",
    current: false,
    description:
      "Generated leads and closed roofing contracts through direct sales. First real taste of commission-based selling and handling rejection at volume.",
  },
  {
    company: "The Home Depot",
    role: "Overnight Freight Associate",
    period: "Feb 2024 – Aug 2024",
    current: false,
    description:
      "Worked overnight freight shifts while building sales skills on the side. New Rochelle, NY.",
  },
  {
    company: "Upwork",
    role: "Freelance Copywriter",
    period: "May 2022 – Sep 2023",
    current: false,
    description:
      "Ran a freelance B2B copywriting business at 16 — landing pages, email sequences, and brand voice work for early-stage startups. First real money made online.",
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-6 right-6 z-50 p-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-all duration-200"
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
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineProgress = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const smoothTimelineProgress = useSpring(timelineProgress, {
    stiffness: 260,
    damping: 34,
    mass: 0.22,
  });
  const renderedTimelineProgress = shouldReduceMotion
    ? timelineProgress
    : smoothTimelineProgress;
  const movingNodeTop = useTransform(
    renderedTimelineProgress,
    (value) => `${value * 100}%`
  );

  useEffect(() => {
    let frameId: number | null = null;
    let timeoutId: number | null = null;

    const updateTimelineProgress = () => {
      frameId = null;

      const track = trackRef.current;
      const markers = markerRefs.current
        .map((marker) => {
          if (!marker) return null;
          const rect = marker.getBoundingClientRect();
          return rect.top + rect.height / 2;
        })
        .filter((center): center is number => center !== null);

      if (!track || markers.length === 0) {
        timelineProgress.set(0);
        setActiveIndex(0);
        return;
      }

      if (markers.length === 1) {
        timelineProgress.set(0);
        setActiveIndex(0);
        return;
      }

      const firstCenter = markers[0];
      const lastCenter = markers[markers.length - 1];
      const viewportAnchor = window.innerHeight * 0.35;
      const atPageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 1;

      const targetCenter = atPageBottom
        ? lastCenter
        : Math.min(Math.max(viewportAnchor, firstCenter), lastCenter);

      const segment = lastCenter - firstCenter;
      const normalizedProgress =
        segment <= 0 ? 0 : (targetCenter - firstCenter) / segment;

      const trackRect = track.getBoundingClientRect();
      const trackHeight = trackRect.height;
      const firstTrackRatio =
        trackHeight <= 0 ? 0 : (firstCenter - trackRect.top) / trackHeight;
      const lastTrackRatio =
        trackHeight <= 0 ? 0 : (lastCenter - trackRect.top) / trackHeight;

      const rawTrackProgress =
        firstTrackRatio + normalizedProgress * (lastTrackRatio - firstTrackRatio);
      const clampedTrackProgress = Math.min(Math.max(rawTrackProgress, 0), 1);

      timelineProgress.set(clampedTrackProgress);

      const nextActiveIndex = atPageBottom
        ? markers.length - 1
        : markers.reduce((closestIndex, center, index, arr) => {
            const currentDistance = Math.abs(center - targetCenter);
            const closestDistance = Math.abs(arr[closestIndex] - targetCenter);
            return currentDistance < closestDistance ? index : closestIndex;
          }, 0);

      setActiveIndex((previousIndex) =>
        previousIndex === nextActiveIndex ? previousIndex : nextActiveIndex
      );
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateTimelineProgress);
    };

    scheduleUpdate();
    timeoutId = window.setTimeout(scheduleUpdate, 100);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [timelineProgress]);

  return (
    <>
      <ThemeToggle />
      <main className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-[560px] md:max-w-[780px] mx-auto px-6 py-20 md:py-28 font-[family-name:var(--font-geist-pixel-grid)]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-[family-name:var(--font-geist-pixel-grid)] uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              New York · Builder · Founder
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mb-10 font-[family-name:var(--font-geist-pixel-grid)] text-5xl leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl"
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
                className="link-pill inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)] transition-colors duration-200 hover:border-[var(--text)] hover:text-[var(--text)]"
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
            className="mb-12 space-y-4 text-[0.975rem] font-light leading-[1.9] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]"
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12"
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
                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
                  Current Focus
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-[family-name:var(--font-geist-pixel-grid)]">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
              <p className="mb-2 text-sm font-medium text-[var(--text)] font-[family-name:var(--font-geist-pixel-grid)]">
                Syntri AI
              </p>
              <p className="text-xs font-light leading-[1.7] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
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
                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
                  Course
                </span>
                <span className="rounded-full bg-[var(--badge)] px-2 py-0.5 text-[10px] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
                  April 2026
                </span>
              </div>
              <p className="mb-2 text-sm font-medium text-[var(--text)] font-[family-name:var(--font-geist-pixel-grid)]">
                BLDR
              </p>
              <p className="text-xs font-light leading-[1.7] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
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
              className="mb-6 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]"
            >
              Experience
            </motion.p>

            <div className="relative">
              <div
                ref={trackRef}
                className="absolute left-[1.25px] top-2.5 bottom-2.5 w-px bg-[var(--border)]"
              >
                <motion.div
                  className="absolute top-0 left-0 h-full w-full bg-emerald-500 opacity-60 origin-top"
                  style={{ scaleY: renderedTimelineProgress }}
                />
                <motion.div
                  className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300 bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.16),0_0_14px_rgba(16,185,129,0.36)]"
                  style={{ top: movingNodeTop }}
                />
              </div>

              <div className="space-y-8 pl-6 md:pl-8">
                {experience.map((entry, index) => (
                  <motion.div
                    key={`${entry.company}-${entry.period}`}
                    variants={slideLeft}
                    className="relative"
                  >
                    <motion.div
                      className="absolute -left-[24px] md:-left-[32px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
                      ref={(element) => {
                        markerRefs.current[index] = element;
                      }}
                      animate={{
                        borderColor: activeIndex === index ? "#10b981" : "var(--border)",
                        backgroundColor: activeIndex === index ? "#10b981" : "var(--bg)",
                        boxShadow:
                          activeIndex === index
                            ? "0 0 0 3px rgba(16,185,129,0.15), 0 0 12px rgba(16,185,129,0.3)"
                            : "0 0 0 0px rgba(16,185,129,0)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span
                        className={`text-sm font-medium font-[family-name:var(--font-geist-pixel-grid)] transition-colors duration-300 ${
                          activeIndex === index ? "text-[var(--text)]" : "text-[var(--muted)]"
                        }`}
                      >
                        {entry.company}
                      </span>
                      <span className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
                        {entry.role}
                      </span>
                      <span
                        className={`ml-auto text-[10px] font-[family-name:var(--font-geist-pixel-grid)] ${
                          entry.current ? "text-emerald-500" : "text-[var(--muted)]"
                        }`}
                      >
                        {entry.period}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-light leading-[1.7] text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]">
                      {entry.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-sans)] mb-6"
            >
              Index
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.a
                href="/blog"
                variants={fadeUp}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-sans)]">
                    Writing
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="text-[var(--border)] group-hover:text-[var(--text)] transition-colors duration-200"
                  />
                </div>
                <p className="text-sm font-medium text-[var(--text)] font-[family-name:var(--font-geist-mono)] mb-2 leading-snug">
                  Essays &amp; Build-in-Public
                </p>
                <p className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light leading-[1.7]">
                  Raw notes from building a YC-target SaaS as a solo founder.
                </p>
              </motion.a>

              <motion.a
                href="/rules"
                variants={fadeUp}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-sans)]">
                    Rules
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="text-[var(--border)] group-hover:text-[var(--text)] transition-colors duration-200"
                  />
                </div>
                <p className="text-sm font-medium text-[var(--text)] font-[family-name:var(--font-geist-mono)] mb-2 leading-snug">
                  29 Things I Know So Far
                </p>
                <p className="text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light leading-[1.7]">
                  Principles collected from doing, failing, and paying attention.
                </p>
              </motion.a>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 text-[11px] tracking-wide text-[var(--muted)] font-[family-name:var(--font-geist-pixel-grid)]"
          >
            © 2026 Cristian Sanchez-Aguilera
          </motion.p>
        </div>
      </main>
    </>
  );
}
