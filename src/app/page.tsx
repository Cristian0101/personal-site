const primaryLinks = [
  {
    label: "Syntri AI ↗",
    href: "https://app.syntriai.com",
  },
  {
    label: "LinkedIn ↗",
    href: "https://linkedin.com/in/cristian-sanchez-aguilera",
  },
  {
    label: "Email ↗",
    href: "mailto:cristian@syntriai.com",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <div className="noise-grid" aria-hidden />
      <div className="noise-glow" aria-hidden />

      <main className="content-shell">
        <p className="eyebrow reveal" style={{ animationDelay: "0.05s" }}>
          New York · Builder · Founder
        </p>

        <h1 className="headline reveal" style={{ animationDelay: "0.12s" }}>
          <span>Cristian</span>
          <span>Sanchez-Aguilera</span>
        </h1>

        <p className="status-badge reveal" style={{ animationDelay: "0.2s" }}>
          20 · Sales GTM Operator → AI Builder
        </p>

        <p className="lead-copy reveal" style={{ animationDelay: "0.26s" }}>
          I&apos;m 20 years old, based in New York. For the last year and a half
          I&apos;ve worked in go-to-market — carrying quota as a BDR, making
          hundreds of cold calls, and learning firsthand how broken the tools are
          for sales teams trying to build real pipeline.
        </p>

        <p className="lead-copy reveal" style={{ animationDelay: "0.32s" }}>
          That frustration became <strong>Syntri AI</strong> — the first agentic
          territory management platform built for B2B sales teams. Instead of
          giving reps a database and leaving them to figure it out, Syntri turns
          buying signals into a daily attack plan.
        </p>

        <p className="lead-copy reveal" style={{ animationDelay: "0.38s" }}>
          I&apos;m building it solo, shipping fast, and documenting everything in
          public.
        </p>

        <div className="actions reveal" style={{ animationDelay: "0.44s" }}>
          {primaryLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cta"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="panel-grid">
          <article className="panel reveal" style={{ animationDelay: "0.48s" }}>
            <p className="panel-label">Current Focus</p>
            <h2 className="panel-heading">
              Syntri AI — AI Territory Operating System
            </h2>
            <p className="panel-text">
              An execution engine for outbound operators who need more than a CRM
              and fewer than 19 open tabs. Syntri tracks engagement signals, maps
              account intent, and turns every rep&apos;s plan into executable,
              measurable daily output.
            </p>
            <a
              href="https://app.syntriai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="panel-link"
            >
              Explore Syntri AI ↗
            </a>
          </article>

          <article className="panel reveal" style={{ animationDelay: "0.58s" }}>
            <p className="panel-label">Course</p>
            <h2 className="panel-heading">BLDR — From BDR to Builder</h2>
            <p className="panel-text">
              A system for sales professionals learning to build production SaaS
              using AI agents. No CS degree required — I built Syntri from this
              exact operating system.
            </p>
            <a
              href="https://whop.com/bldr-e4e2/"
              target="_blank"
              rel="noopener noreferrer"
              className="panel-link"
            >
              Join the waitlist ↗
            </a>
          </article>
        </div>

        <p className="panel-divider reveal" style={{ animationDelay: "0.62s" }} />
        <p className="site-footer reveal" style={{ animationDelay: "0.68s" }}>
          © 2026 Cristian Sanchez-Aguilera
        </p>
      </main>
    </div>
  );
}
