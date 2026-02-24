import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function Home() {
  return (
    <div
      className={`${dmSans.className} flex min-h-screen items-center justify-center bg-[#F7F5F2] px-6 text-[#1C1917]`}
    >
      <main className="w-full max-w-[520px] [animation:fadeUp_.7s_ease-out_both]">
        <h1
          className={`${cormorantGaramond.className} text-[clamp(2.8rem,8vw,4rem)] font-light leading-[1.02] tracking-tight`}
        >
          Cristian <span className="italic">Sanchez-Aguilera</span>
        </h1>

        <p className="mt-3 text-[0.68rem] uppercase tracking-[0.24em] text-[#78716C]">
          New York · Builder · Founder
        </p>

        <hr className="my-8 border-0 border-t border-[#E7E5E4]" />

        <p className="text-[1.02rem] font-light leading-[1.85] text-[#1C1917]">
          I&apos;m 20 years old, based in New York. For the past year and a half
          I&apos;ve worked in go-to-market — carrying quota as a BDR, making
          hundreds of cold calls, and learning firsthand how broken the tools are
          for sales teams trying to build real pipeline.
          <br />
          <br />
          That frustration became{" "}
          <span className="font-medium text-[#1C1917]">Syntri AI</span> — the
          first agentic territory management platform built for B2B sales teams.
          Instead of giving reps a database and leaving them to figure it out,
          Syntri turns buying signals into a daily attack plan. I&apos;m building
          it solo, shipping fast, and documenting everything in public.
          <br />
          <br />
          If you&apos;re in sales, investing in early-stage startups, or just
          want to talk — reach out.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6 text-[0.96rem]">
          <a
            href="https://app.syntriai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[#1C1917] font-medium text-[#1C1917]"
          >
            Syntri AI ↗
          </a>

          <span aria-hidden="true" className="text-[#E7E5E4]">
            ●
          </span>

          <a
            href="https://linkedin.com/in/cristian-sanchez-aguilera"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#78716C] transition-colors hover:text-[#1C1917] hover:underline underline-offset-4"
          >
            LinkedIn
          </a>

          <span aria-hidden="true" className="text-[#E7E5E4]">
            ●
          </span>

          <a
            href="mailto:cristian@syntriai.com"
            className="text-[#78716C] transition-colors hover:text-[#1C1917] hover:underline underline-offset-4"
          >
            cristian@syntriai.com
          </a>
        </div>

        <p className="mt-14 text-[0.68rem] text-[#C4B5AD]">© 2026</p>
      </main>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
