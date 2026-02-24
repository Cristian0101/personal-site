import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
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

export default function Home() {
  return (
    <div
      className={`${dmSans.variable} ${cormorantGaramond.variable} min-h-screen bg-[#FAFAF8] text-[#1C1917]`}
    >
      <main className="mx-auto w-full max-w-[560px] px-6 py-14 md:px-0 md:py-20 animate-fadeUp">
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light leading-[1.02] tracking-tight md:text-6xl">
          Cristian <span className="italic">Sanchez-Aguilera</span>
        </h1>

        <p className="mt-2 mb-10 text-xs font-[family-name:var(--font-dm)] uppercase tracking-[0.14em] text-[#78716C]">
          New York · Builder · Founder
        </p>

        <hr className="mb-10 border-t border-[#E7E5E4]" />

        <p className="font-[family-name:var(--font-dm)] text-[0.975rem] font-light leading-[1.9] text-[#44403C]">
          I&apos;m 20 years old, based in New York. For the past year and a half
          I&apos;ve worked in go-to-market — carrying quota as a BDR, making
          hundreds of cold calls, and learning firsthand how broken the tools are
          for sales teams trying to build real pipeline.
        </p>

        <p className="mt-8 font-[family-name:var(--font-dm)] text-[0.975rem] font-light leading-[1.9] text-[#44403C]">
          That frustration became{" "}
          <span className="font-medium text-[#1C1917]">Syntri AI</span> — the
          first agentic territory management platform built for B2B sales teams.
          Instead of giving reps a database and leaving them to figure it out,
          Syntri turns buying signals into a daily attack plan. I&apos;m building
          it solo, shipping fast, and documenting everything in public.
        </p>

        <p className="mt-8 font-[family-name:var(--font-dm)] text-[0.975rem] font-light leading-[1.9] text-[#44403C]">
          If you&apos;re in sales, investing in early-stage startups, or just want
          to talk — reach out.
        </p>

        <div className="mt-10 mb-14 flex flex-wrap gap-4">
          <a
            href="https://app.syntriai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E4] bg-white px-4 py-2 text-sm font-[family-name:var(--font-dm)] text-[#78716C] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1C1917] hover:text-[#1C1917] before:pointer-events-none before:absolute before:left-0 before:right-0 before:top-0 before:h-full before:w-full before:border-b before:border-current before:scale-x-0 before:origin-left before:opacity-0 before:transition-all before:duration-200 before:content-[''] hover:before:scale-x-100 hover:before:opacity-100"
          >
            Syntri AI ↗
          </a>

          <a
            href="https://linkedin.com/in/cristian-sanchez-aguilera"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E4] bg-white px-4 py-2 text-sm font-[family-name:var(--font-dm)] text-[#78716C] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1C1917] hover:text-[#1C1917] before:pointer-events-none before:absolute before:left-0 before:right-0 before:top-0 before:h-full before:w-full before:border-b before:border-current before:scale-x-0 before:origin-left before:opacity-0 before:transition-all before:duration-200 before:content-[''] hover:before:scale-x-100 hover:before:opacity-100"
          >
            LinkedIn ↗
          </a>

          <a
            href="mailto:cristian@syntriai.com"
            className="group relative inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E4] bg-white px-4 py-2 text-sm font-[family-name:var(--font-dm)] text-[#78716C] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1C1917] hover:text-[#1C1917] before:pointer-events-none before:absolute before:left-0 before:right-0 before:top-0 before:h-full before:w-full before:border-b before:border-current before:scale-x-0 before:origin-left before:opacity-0 before:transition-all before:duration-200 before:content-[''] hover:before:scale-x-100 hover:before:opacity-100"
          >
            cristian@syntriai.com
          </a>
        </div>

        <section className="rounded-2xl border border-[#E7E5E4] bg-white p-4 sm:p-6">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <span className="font-[family-name:var(--font-dm)] text-xs font-medium tracking-[0.1em] uppercase text-[#78716C]">
                Course
              </span>
              <h2 className="font-[family-name:var(--font-dm)] mt-1 text-lg font-medium text-[#1C1917]">
                BLDR — From BDR to Builder
              </h2>
            </div>
            <span className="ml-4 whitespace-nowrap rounded-full bg-[#F5F5F4] px-2.5 py-1 font-[family-name:var(--font-dm)] text-xs text-[#78716C]">
              Launching April 2026
            </span>
          </div>
          <p className="mb-4 font-[family-name:var(--font-dm)] text-sm leading-[1.75] font-light text-[#78716C]">
            A course teaching sales professionals how to build production SaaS apps
            using AI agents. No CS degree required — I built Syntri using this exact
            system.
          </p>
          <a
            href="https://whop.com/bldr-e4e2/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-dm)] inline-flex items-center gap-1.5 text-sm font-medium text-[#1C1917] transition-all duration-200 hover:gap-2.5"
          >
            Join the waitlist ↗
          </a>
        </section>

        <p className="font-[family-name:var(--font-dm)] mt-14 text-xs text-[#C4B5AD]">
          © 2026 Cristian Sanchez-Aguilera
        </p>
      </main>
    </div>
  );
}
