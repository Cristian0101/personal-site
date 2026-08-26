"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Briefcase,
  GithubLogo,
  LinkedinLogo,
  MapPin,
  Moon,
  PresentationChart,
  Sun,
  UsersThree,
  X,
  XLogo,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { CommandPalette } from "@/components/portfolio/CommandPalette";
import { FlowField } from "@/components/portfolio/FlowField";
import { LiveClock } from "@/components/portfolio/LiveClock";

type Business = {
  name: string;
  slug: string;
  category: string;
  tagline: string;
  portfolioRole: string;
  description: string;
  overview: string;
  audience: string;
  offer: string;
  price: string;
  outcome: string;
  features: string[];
  logo: string;
  accent: string;
  state: "Live" | "Building" | "Private";
  href?: string;
  footerLabel?: string;
};

const businesses: Business[] = [
  {
    name: "Outflow",
    slug: "outflow",
    category: "Career-entry education",
    tagline: "Build proof. Break in.",
    portfolioRole: "01 · Career entry",
    description: "Turns ambitious nontraditional candidates into credible first-time SDR and BDR hires.",
    overview: "Outflow is a deliberately focused career-entry business. It replaces passive job searching with positioning, proof, targeted pursuit, interview repetitions, and a real system for reaching hiring decision-makers.",
    audience: "First-time tech-sales candidates—often 18–27—coming from retail, warehouses, restaurants, customer service, manual labor, D2D, call centers, or other nontraditional paths.",
    offer: "30-Day Tech Sales Break-In Sprint",
    price: "$297 one-time",
    outcome: "Qualified SDR/BDR interviews → first offer",
    features: ["Sales-focused résumé", "LinkedIn positioning", "Candidate Proof Pack", "Target Company List", "Job Search CRM", "Interview and cold-call reps"],
    logo: "/brands/outflow-original-gold.png",
    accent: "#e6b85d",
    state: "Live",
    href: "https://whop.com/outflow-techsaleswhop/",
  },
  {
    name: "Syntri",
    slug: "syntri",
    category: "Sales Execution OS / BDR OS",
    tagline: "Turn account signals into pipeline execution.",
    portfolioRole: "02 · Sales performance",
    description: "Helps outbound operators know who to call, why now, what to say, and what to execute.",
    overview: "Syntri is the performance layer for outbound. It brings fragmented account intelligence into one ranked operating system so the rep can prioritize before adding more activity.",
    audience: "BDRs, SDRs, self-sourcing AEs, and founder-led sellers who own outbound pipeline and have enough accounts that prioritization materially changes their day.",
    offer: "Plus, Pro, and Ultra",
    price: "$25 / $50 / $90 monthly",
    outcome: "Justified outbound actions → meetings and pipeline",
    features: ["Daily Attack Plan", "Signal Arena", "Blitz", "Outbound Architect", "Competitive Intel", "Voice Practice"],
    logo: "/brands/syntri-original-blue.png",
    accent: "#1598ff",
    state: "Live",
    href: "https://syntriai.com/",
  },
  {
    name: "Amphivia",
    slug: "amphivia",
    category: "Career Mobility OS",
    tagline: "Choose the right next move—then earn it.",
    portfolioRole: "03 · Career leverage",
    description: "Turns complete career evidence into a credible next move and focused daily execution.",
    overview: "Amphivia improves the career decision before optimizing the application. It reasons from verified experience to show which move compounds best and what the user should do today to earn it.",
    audience: "Ambitious nontraditional professionals whose real capabilities are stronger than their titles or résumé imply—and who have enough evidence to make a grounded move.",
    offer: "Evidence → Paths → Mission → Motion",
    price: "Pricing intentionally unresolved",
    outcome: "Better career decisions → qualified interviews",
    features: ["Career Vault", "Safe / Leverage / Breakthrough paths", "One active Career Mission", "Opportunity ranking", "Resume Studio", "Daily Motion"],
    logo: "/brands/amphivia-original-teal.png",
    accent: "#31c8aa",
    state: "Building",
  },
  {
    name: "BLDR",
    slug: "bldr",
    category: "Builder education",
    tagline: "Go from scoped problem to shipped software.",
    portfolioRole: "04 · Building",
    description: "Turns capable nontechnical operators into people who can scope, ship, and sell software.",
    overview: "BLDR is not a learn-to-code course. It teaches operators how to identify pain, direct AI agents, understand the SaaS spine, debug failures, deploy safely, and expose a real product to the market.",
    audience: "Salespeople with software ideas, creators, consultants, agency owners, aspiring founders, and nontechnical founders who have already hit the limits of vague AI prompting.",
    offer: "30-Day Build & Launch Sprint",
    price: "$497 one-time",
    outcome: "Scoped product → production app → launch → feedback",
    features: ["Find the Pain", "Blueprint the Product", "Build With Agents", "Build the SaaS Spine", "Ship and Sell", "Production verification"],
    logo: "/brands/bldr-original-purple.png",
    accent: "#b16cff",
    state: "Live",
    href: "https://whop.com/bldr-e4e2/exp_3j8U1kPZNIjBmi/app/",
  },
  {
    name: "Meridia",
    slug: "meridia",
    category: "Relationship OS / Social Pipeline OS",
    tagline: "Remember the context. Follow through.",
    portfolioRole: "05 · Relationships",
    description: "Preserves why a relationship matters and turns scattered context into thoughtful follow-through.",
    overview: "Meridia fights relationship context decay. It keeps the chain from source-linked context through next action, outcome, and memory—without becoming a hidden LinkedIn bot or giant CRM.",
    audience: "Founder-led B2B sellers and LinkedIn-first operators with valuable warm relationships, scattered context, and inconsistent follow-through.",
    offer: "Relationship memory and Current Motion",
    price: "Paid wedge still in validation",
    outcome: "Context → next action → follow-through → memory",
    features: ["Relationship memory", "Source-linked notes", "Follow-up queues", "Current Motion", "Outcome tracking", "Browser Companion"],
    logo: "/brands/meridia-original-orange.png",
    accent: "#f06e23",
    state: "Building",
  },
  {
    name: "Kovranta",
    slug: "kovranta",
    category: "Founder Motion OS",
    tagline: "Find the constraint. Run the next motion.",
    portfolioRole: "06 · Ownership & distribution",
    description: "Diagnoses the real growth constraint and turns it into a focused, evidence-producing motion.",
    overview: "Kovranta replaces founder GTM drift with a durable loop: understand the product and proof, diagnose the bottleneck, execute a narrow motion, inspect what happened, and decide what to do next.",
    audience: "Solo AI and SaaS founders or founder-led operators with an MVP, beta, launched product, or early revenue—but no repeatable growth motion.",
    offer: "Founder Motion + Distribution Execution",
    price: "$50/month remains a hypothesis",
    outcome: "Diagnose → execute → learn → repeat",
    features: ["Visible diagnosis", "ICP and offer foundations", "7-day motion", "Proof Ledger", "Distribution execution", "Weekly GTM Review"],
    logo: "/brands/kovranta-original-green.png",
    accent: "#a3ad5d",
    state: "Building",
  },
  {
    name: "Project 160",
    slug: "project-160",
    category: "Personal Performance OS",
    tagline: "Build the body. Run the day.",
    portfolioRole: "07 · Personal performance",
    description: "A private command center for training, nutrition, habits, and steady physical progress.",
    overview: "Project 160 brings daily planning, workouts, training programs, nutrition, fasting, body metrics, habits, notes, purchases, and calendar scheduling into one private workspace—so training and everyday life can move together.",
    audience: "A personal system for building a stronger body and a more deliberate life through consistent practice, review, and progress.",
    offer: "Training + Life OS",
    price: "Private personal system",
    outcome: "Plan → train → recover → review",
    features: ["Daily planning", "Training programs", "Workout logging", "Nutrition + fasting", "Body metrics", "Habits + notes", "Calendar + purchases"],
    logo: "/images/project-160-showcase.png",
    accent: "#a855f7",
    state: "Private",
    footerLabel: "Private workspace",
  },
  {
    name: "Surge",
    slug: "surge",
    category: "Cold Email Operating System",
    tagline: "Launch outbound with a clear next move.",
    portfolioRole: "08 · Outbound systems",
    description: "A beginner-first system for turning customer goals into thoughtful, protected outbound campaigns.",
    overview: "Surge brings audience, copy, sequences, sending windows, inboxes, and campaign learning into one calm operating center. It guides the user from first idea to live campaign while the infrastructure keeps the motion durable and controlled.",
    audience: "Founders and small teams who want a practical path into outbound and a better way to improve every campaign that follows.",
    offer: "Launch Wizard + Sender Fleet",
    price: "In active build",
    outcome: "Better targeting → better conversations",
    features: ["Launch Wizard", "Sequence builder", "Sender Fleet", "Safe sending windows", "Unified inbox", "Reply-aware follow-through", "Campaign diagnosis"],
    logo: "/images/project-surge.png",
    accent: "#22d3ee",
    state: "Building",
    footerLabel: "In active development",
  },
  {
    name: "Nebula",
    slug: "nebula",
    category: "Open-source Agent Control Plane",
    tagline: "Turn coding agents into one engineering team.",
    portfolioRole: "09 · Agent coordination",
    description: "Coordinates multi-agent software work with isolated worktrees, clear ownership, and reviewable handoffs.",
    overview: "Nebula gives software teams one command center for working with Codex, Claude Code, Gemini, Cursor, Grok, and other coding agents. Tasks stay isolated, ownership stays explicit, and finished work moves through diffs, quality gates, and human approval before integration.",
    audience: "Developers and teams orchestrating multiple coding agents across real repositories who want speed with visibility and control.",
    offer: "Mission Control for Agent Teams",
    price: "Open source / building",
    outcome: "Parallel work → reviewed integration",
    features: ["Task missions", "Provider roles", "Git worktrees", "File ownership", "Quality gates", "Structured handoffs", "Swarm Mode"],
    logo: "/images/project-nebula.png",
    accent: "#8b5cf6",
    state: "Building",
    footerLabel: "Open-source project",
  },
];

const journey = [
  {
    number: "01",
    company: "Early online work",
    label: "Freelance",
    detail: "Started earning online before I had a conventional career, including a first paid copywriting project through Upwork.",
  },
  {
    number: "02",
    company: "Direct work",
    label: "Home Depot + commission sales",
    detail: "Overnight freight and door-to-door sales taught me consistency, rejection, and how to speak to strangers.",
  },
  {
    number: "03",
    company: "Varonis",
    label: "Enterprise SaaS",
    detail: "Broke into enterprise cybersecurity sales at 19 and learned how complex organizations are prospected and bought into.",
    logo: "/career/varonis.svg",
    lightInvert: true,
  },
  {
    number: "04",
    company: "Swap",
    label: "0→1 go-to-market",
    detail: "Moved into founding GTM and learned what selling looks like when there is no inherited playbook.",
    logo: "/career/swap.svg",
    invert: true,
  },
  {
    number: "05",
    company: "DataSnipper",
    label: "Execution",
    detail: "Carried quota selling audit automation and hit or exceeded target in 7 of 9 full-quota months.",
    logo: "/career/datasnipper.svg",
    lightInvert: true,
  },
  {
    number: "06",
    company: "Syntri",
    label: "Founder · product + go-to-market",
    detail: "Turned problems I experienced as a seller into an AI-native BDR operating system, then took it into discovery calls, demos, pricing, onboarding, and paid use.",
    logo: "/brands/syntri-original-blue.png",
    climax: true,
  },
];

const customerLoop = [
  { label: "Discover", detail: "Find out whether the problem hurts enough to matter." },
  { label: "Demo", detail: "Watch where people lean in—and where they get confused." },
  { label: "Listen", detail: "Ask the follow-up question instead of forcing the pitch." },
  { label: "Build", detail: "Translate repeated pain into a product decision." },
  { label: "Ship", detail: "Get the change back into someone’s hands quickly." },
  { label: "Sell", detail: "A paying customer validates more than polite feedback." },
  { label: "Learn", detail: "Usage decides whether the theory survived reality." },
];

const ownershipLanes = [
  {
    number: "01",
    label: "Customer-facing",
    detail: "Find the problem, make the promise, earn the next conversation.",
    steps: ["Discovery", "Demos", "Pricing + closing", "Onboarding"],
  },
  {
    number: "02",
    label: "Product-facing",
    detail: "Turn the signal into a better product and a tighter distribution loop.",
    steps: ["Product strategy", "Engineering", "Shipping", "Distribution"],
  },
];

const subscribeToMount = () => () => {};
const getClientMount = () => true;
const getServerMount = () => false;

const buildPrinciples = [
  {
    number: "01",
    title: "Find the repeated problem.",
    copy: "The best product ideas I’ve found haven’t started in a brainstorming document. They show up while doing the work and noticing the same friction over and over again.",
    proof: ["Friction", "Friction", "Friction", "Decision"],
  },
  {
    number: "02",
    title: "Get it in front of people.",
    copy: "A clever product theory is still a theory. Demos, objections, confusion, and actual usage tell me more than another week polishing in private.",
    proof: ["Product", "Customer", "Product"],
  },
  {
    number: "03",
    title: "Ship the useful core.",
    copy: "I’d rather build one workflow that genuinely changes someone’s day than ten features that look good in a launch video.",
    proof: ["Ideas", "Cut", "Cut", "Core workflow"],
  },
  {
    number: "04",
    title: "Keep product and GTM close.",
    copy: "The person hearing the objection shouldn’t be ten layers away from the person fixing the product. Early-stage companies move faster when that loop stays short.",
    proof: ["Customer", "Sales", "Product", "Engineering"],
  },
  {
    number: "05",
    title: "Earn complexity.",
    copy: "Start simple. Add automation, agents, infrastructure, and process when reality justifies them—not because the architecture diagram looks impressive.",
    proof: ["Core", "Usage", "Evidence", "System"],
  },
];

const heroNotes = [
  {
    index: "01",
    label: "How I got here",
    text: "My path has been unconventional. I left college after one semester, worked overnight freight and door-to-door sales, broke into enterprise tech at 19, and started building Syntri from the problems I kept hearing.",
    delay: 180,
  },
];

const personalFacts = [
  { number: "01", emoji: "🥊", title: "Combat sports", text: "Kickboxing and Taekwondo as a kid. Boxing now. BJJ and Muay Thai are next." },
  { number: "02", emoji: "💸", title: "My first $45", text: "I made my first $45 at 16 writing a TikTok script for a cannabis business owner." },
  { number: "03", emoji: "🎧", title: "The commute soundtrack", text: "Alex Hormozi in the car, on the commute, basically anywhere. I’ve been taking notes since 16." },
  { number: "04", emoji: "⏰", title: "5 a.m. daily", text: "The gym starts before the rest of the day gets a vote." },
  { number: "05", emoji: "🌌", title: "Quiet inputs", text: "Meditating, reading, journaling, and learning about space." },
  { number: "06", emoji: "🔥", title: "Work-life balance?", text: "Go away, stinky work-life balance people. I like long hours when I’m building something I care about." },
  { number: "07", emoji: "🪙", title: "The quarter test", text: "Some of my best risks started with a coin flip telling me to go for it." },
  { number: "08", emoji: "🥤", title: "The standard loadout", text: "Monster. AirPods. MacBook. You’ll usually find all three with me." },
  { number: "09", emoji: "☕", title: "Parallel play", text: "I love working beside my girlfriend at the gym or a café." },
  { number: "10", emoji: "🧭", title: "Freedom with a point", text: "I want financial freedom so I can pursue bigger goals and help more people." },
  { number: "11", emoji: "📚", title: "Two shelves", text: "Albert Camus on one. Vagabond on the other." },
  { number: "12", emoji: "⚡", title: "Anime edits", text: "Sometimes the motivational speech is an anime edit." },
  { number: "13", emoji: "🦇", title: "Favorite fictional character", text: "Batman. Obviously." },
  { number: "14", emoji: "⏳", title: "Long fasts", text: "I like doing multi-day fasts." },
  { number: "15", emoji: "♟️", title: "Game theory", text: "I’m fascinated by the moves people make when every choice changes the board." },
  { number: "16", emoji: "🌒", title: "Temporary seasons", text: "Good or bad, every period ends. That makes me appreciate it while I’m in it." },
  { number: "17", emoji: "🧠", title: "The long game", text: "I want to collect enough lessons to become wise and useful as my body gets older." },
  { number: "18", emoji: "🎯", title: "No retries", text: "I think a successful life is getting what you actually want out of it. There are no retries." },
  { number: "19", emoji: "🔬", title: "The rabbit hole", text: "I’m really into psychology and neuroscience." },
  { number: "20", emoji: "🏍️", title: "Sixth-grade decision-making", text: "I broke my arm riding a motorcycle while trying to record myself for Snapchat." },
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GithubCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-signal", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("signal unavailable"))))
      .then((data: { contributionCount?: number | null }) => setCount(data.contributionCount ?? null))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCount(null);
      });
    return () => controller.abort();
  }, []);

  return <strong>{count ? `${count.toLocaleString()}+` : "2,000+"}</strong>;
}

function TypingNote({
  index,
  label,
  text,
  delay,
}: {
  index: string;
  label: string;
  text: string;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [status, setStatus] = useState("Waiting");
  const shouldReduceMotion = reduceMotion === true;
  const renderedCharacters = shouldReduceMotion ? text.length : visibleCharacters;
  const isDone = renderedCharacters >= text.length;

  useEffect(() => {
    if (shouldReduceMotion) return;

    let interval = 0;
    const start = window.setTimeout(() => {
      setVisibleCharacters(0);
      setStatus("Writing");
      let current = 0;
      interval = window.setInterval(() => {
        current += 1;
        setVisibleCharacters(current);
        if (current >= text.length) {
          window.clearInterval(interval);
          setStatus("Saved");
        }
      }, 12);
    }, delay);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [delay, shouldReduceMotion, text]);

  return (
    <div className="hero-journal__entry" role="group" aria-label={`${label}: ${text}`}>
      <div className="hero-journal__note-bar">
        <span><i aria-hidden="true" /> Note {index}</span>
        <small>{shouldReduceMotion || isDone ? (shouldReduceMotion ? "Ready" : "Saved") : status}</small>
      </div>
      <span className="hero-journal__label">{label}</span>
      <p className="hero-journal__typing">
        <span aria-hidden="true">{text.slice(0, renderedCharacters)}</span>
        {!shouldReduceMotion ? <i className={`hero-journal__caret${isDone ? " is-done" : ""}`} aria-hidden="true" /> : null}
      </p>
    </div>
  );
}

function CareerTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const railProgress = useTransform(scrollYProgress, [0, 1], [1 / journey.length, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(
      journey.length - 1,
      Math.max(0, Math.round(latest * (journey.length - 1))),
    );
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  return (
    <div className="career-timeline" aria-label="Cristian's career throughline" ref={timelineRef}>
      <div className="career-timeline__rail" aria-hidden="true">
        <motion.i
          style={{ scaleY: reduceMotion ? (activeIndex + 1) / journey.length : railProgress }}
        />
      </div>
      {journey.map((step, index) => {
        const active = index === activeIndex;
        return (
          <motion.article
            className={`career-stage${active ? " is-active" : ""}${step.climax ? " is-climax" : ""}`}
            key={step.number}
            transition={{ duration: reduceMotion ? 0.01 : 0.36 }}
          >
            <span className="career-stage__number">{step.number}</span>
            <i className="career-stage__node" aria-hidden="true" />
            <div className="career-stage__body">
              <div className="career-stage__head">
                <div>
                  <strong>{step.company}</strong>
                  <span>{step.label}</span>
                </div>
                {step.logo ? (
                  <Image
                    className={`career-stage__logo${step.invert ? " is-inverted" : ""}${step.lightInvert ? " is-light-inverted" : ""}`}
                    src={step.logo}
                    alt={`${step.company} logo`}
                    width={180}
                    height={64}
                  />
                ) : null}
              </div>
              <p>{step.detail}</p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function SyntriFounderLoop() {
  const [activeLoop, setActiveLoop] = useState(0);
  const reduceMotion = useReducedMotion();
  const loopRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: loopRef,
    offset: ["start 78%", "end 28%"],
  });
  const active = customerLoop[activeLoop];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(
      customerLoop.length - 1,
      Math.max(0, Math.floor(latest * customerLoop.length)),
    );
    setActiveLoop((current) => (current === nextIndex ? current : nextIndex));
  });

  return (
    <section className="syntri-loop section-frame" id="syntri" aria-labelledby="syntri-loop-title">
      <Reveal className="syntri-loop__intro">
        <div className="syntri-loop__identity">
          <Image src="/brands/syntri-original-blue.png" alt="Syntri logo" width={92} height={92} />
          <span>03 / Syntri · founder loop</span>
        </div>
        <div className="syntri-loop__statement">
          <p>Selling is part of the product work</p>
          <h2 id="syntri-loop-title">The customer and the product stay in the same room.</h2>
        </div>
        <div className="syntri-loop__copy">
          <p>Syntri started as the software I wished I had while working as a BDR. Building it meant more than writing code.</p>
          <p>I had to find people with the problem, get them on calls, run demos, understand what they cared about, handle objections, talk pricing, close customers, onboard them, and return to the product whenever reality disagreed with my assumptions.</p>
          <p>A confusing demo can expose a bad workflow. An objection can expose weak positioning. A closed customer can validate an idea. Actual usage can prove that even a good pitch was solving the wrong problem.</p>
        </div>
      </Reveal>

      <div className="customer-loop-stage" ref={loopRef}>
        <Reveal className="customer-loop" delay={0.05}>
          <div className="customer-loop__head">
            <div><span>The loop in practice</span><strong>Seven moves. One continuous conversation.</strong></div>
            <p>Scroll through the section and each stage will stay with you long enough to read.</p>
          </div>
          <div className="customer-loop__body">
            <div className="customer-loop__track" role="tablist" aria-label="Customer to product loop">
              {customerLoop.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-controls="customer-loop-panel"
                  aria-selected={activeLoop === index}
                  className={activeLoop === index ? "is-active" : ""}
                  key={item.label}
                  onClick={() => setActiveLoop(index)}
                  onFocus={() => setActiveLoop(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="customer-loop__detail"
              id="customer-loop-panel"
              key={active.label}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.28 }}
              aria-live="polite"
              role="tabpanel"
            >
                <div className="customer-loop__detail-head">
                  <span>Stage {String(activeLoop + 1).padStart(2, "0")} / 07</span>
                  <strong>{active.label}</strong>
                </div>
                <p>{active.detail}</p>
                <div className="customer-loop__detail-foot">
                  <small>Customer → product → customer</small>
                  <span className="customer-loop__progress" aria-hidden="true"><i style={{ width: `${((activeLoop + 1) / customerLoop.length) * 100}%` }} /></span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      <div className="syntri-loop__evidence">
        <Reveal className="ownership-list">
          <div className="ownership-list__head">
            <span>One founder loop</span>
            <h3>I carry the work across both sides.</h3>
          </div>
          <div className="ownership-lanes">
            {ownershipLanes.map((lane) => (
              <article key={lane.number}>
                <div className="ownership-lane__head">
                  <span>{lane.number}</span>
                  <div><strong>{lane.label}</strong><small>{lane.detail}</small></div>
                </div>
                <div className="ownership-lane__steps">
                  {lane.steps.map((item, index) => <p key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</p>)}
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="feedback-change" delay={0.06}>
          <div className="feedback-change__head">
            <span>How feedback moves</span>
            <small>Traceable, not theatrical</small>
          </div>
          <div className="feedback-change__steps">
            <div><small>01</small><span>Hear the signal</span><p>A call, objection, or usage pattern reveals friction.</p></div>
            <ArrowRight size={16} aria-hidden="true" />
            <div><small>02</small><span>Verify the pattern</span><p>Compare it with other conversations and product evidence.</p></div>
            <ArrowRight size={16} aria-hidden="true" />
            <div><small>03</small><span>Make the decision</span><p>Change the product, positioning, or next test.</p></div>
          </div>
          <p className="feedback-change__note">The point is not to collect feedback. It is to make the next decision easier to explain.</p>
        </Reveal>
      </div>
    </section>
  );
}

function HowIBuild() {
  return (
    <section className="build-system section-frame" id="build" aria-labelledby="build-title">
      <Reveal className="section-heading section-heading--compact build-heading">
        <div><span className="section-number">04</span><p>Operating system</p></div>
        <h2 id="build-title">How I build.</h2>
        <p>Five principles keep the work close to the problem, the customer, and the decision that comes next.</p>
      </Reveal>

      <div className="build-principles">
        {buildPrinciples.map((principle) => (
          <article className="build-principle" key={principle.number}>
            <div className="build-principle__head">
              <span aria-label={`${principle.number} of 05`}><b>{principle.number}</b><small>/ 05</small></span>
              <i aria-hidden="true" />
            </div>
            <div className="build-principle__body">
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
              <div className="principle-proof" aria-label={`${principle.title} operational trace`}>
                {principle.proof.map((item, proofIndex) => (
                  <div key={`${principle.number}-${item}-${proofIndex}`}>
                    <span>{item}</span>
                    {proofIndex < principle.proof.length - 1 ? <ArrowRight size={13} /> : null}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PersonalFacts() {
  return (
    <section className="personal-facts section-frame" id="facts" aria-labelledby="facts-title">
      <Reveal className="personal-facts__intro">
        <div><span className="section-number">Between</span><p>Personal notes</p></div>
        <h2 id="facts-title">The stuff that doesn&apos;t fit in a résumé.</h2>
        <p>Twenty small facts from the notebook behind the work.</p>
      </Reveal>

      <Reveal className="personal-facts__notebook" delay={0.04}>
        <div className="personal-facts__topline">
          <span><i aria-hidden="true" /> Running notebook / 20 facts</span>
          <span>No filter</span>
        </div>
        <div className="personal-facts__grid">
          {personalFacts.map((fact) => (
            <article className="personal-fact" key={fact.number}>
              <span className="personal-fact__number">{fact.number} / 20</span>
              <span className="personal-fact__emoji" aria-hidden="true">{fact.emoji}</span>
              <div>
                <h3>{fact.title}</h3>
                <p>{fact.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function BusinessPreview({ business, onClose }: { business: Business; onClose: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="business-preview-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.article
        className={`business-preview business-preview--${business.slug}`}
        style={{ "--business-accent": business.accent } as CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`business-preview-${business.slug}`}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 34, scale: reduceMotion ? 1 : 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.96 }}
        transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 310, damping: 30, mass: 0.82 }}
      >
        <div className="business-preview__bar">
          <span>{business.portfolioRole}</span>
          <button type="button" onClick={onClose} aria-label={`Close ${business.name} preview`} autoFocus>
            <X size={18} />
          </button>
        </div>

        <header className="business-preview__hero">
          <div className="business-preview__logo">
            <Image src={business.logo} alt={`${business.name} logo`} width={240} height={240} quality={92} priority />
          </div>
          <div>
            <span className="business-preview__state"><i />{business.state}</span>
            <p>{business.category}</p>
            <h2 id={`business-preview-${business.slug}`}>{business.name}</h2>
            <strong>{business.tagline}</strong>
          </div>
        </header>

        <div className="business-preview__content">
          <section>
            <span>What it is</span>
            <p>{business.overview}</p>
          </section>
          <section>
            <span>Who it is for</span>
            <p>{business.audience}</p>
          </section>
        </div>

        <div className="business-preview__offer">
          <div>
            <span>Core offer</span>
            <strong>{business.offer}</strong>
            <p>{business.price}</p>
          </div>
          <div>
            <span>Portfolio outcome</span>
            <strong>{business.outcome}</strong>
          </div>
        </div>

        <div className="business-preview__features" aria-label={`${business.name} key capabilities`}>
          {business.features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>

        <footer className="business-preview__footer">
          <p>Each project solves a different point in the operator path.</p>
          {business.href ? (
            <a href={business.href} target="_blank" rel="noreferrer">
              Visit {business.name} <ArrowUpRight size={16} />
            </a>
          ) : (
            <span>{business.footerLabel ?? "In active development"}</span>
          )}
        </footer>
      </motion.article>
    </motion.div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeToMount, getClientMount, getServerMount);
  const [isSwitching, setIsSwitching] = useState(false);
  const [targetTheme, setTargetTheme] = useState<"light" | "dark" | null>(null);
  const switchTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
  }, []);

  const currentTheme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  const handleToggle = () => {
    if (isSwitching) return;
    setTargetTheme(nextTheme);
    setIsSwitching(true);
    setTheme(nextTheme);
    switchTimer.current = window.setTimeout(() => {
      setIsSwitching(false);
      setTargetTheme(null);
    }, reduceMotion ? 80 : 620);
  };

  return (
    <button
      type="button"
      className={`theme-toggle${isSwitching && !reduceMotion ? " is-switching" : ""}${targetTheme === "light" ? " is-target-light" : ""}${targetTheme === "dark" ? " is-target-dark" : ""}`}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      aria-pressed={mounted ? currentTheme === "light" : undefined}
      onClick={handleToggle}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <Sun size={13} />
        <Moon size={13} />
        <i />
      </span>
      <span className="theme-toggle__label"><b>Theme</b><small>{currentTheme === "light" ? "Light" : "Dark"}</small></span>
    </button>
  );
}

export default function Home() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 720], [0, reduceMotion ? 0 : -42]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0.48]);

  return (
    <main className="site-shell">
      <div className="site-atmosphere" aria-hidden="true"><FlowField /></div>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <header className="site-nav">
        <a className="site-wordmark" href="#top" aria-label="Cristian Sanchez-Aguilera home">CS—A</a>
        <nav aria-label="Primary navigation">
          <a href="#ecosystem">Work</a>
          <a href="#story">Story</a>
          <a href="#syntri">Syntri</a>
          <Link href="/blog">Writing</Link>
        </nav>
        <div className="nav-meta">
          <ThemeToggle />
          <span className="building-dot"><i /> Building</span>
          <LiveClock />
          <a className="nav-contact" href="mailto:cristian@syntriai.com">Get in touch <ArrowUpRight size={12} /></a>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <motion.div className="hero-main" style={{ y: heroY, opacity: heroOpacity }}>
          <p className="hero-identity"><span>Cristian Sanchez-Aguilera</span><i /><span>New York</span></p>
          <h1 id="hero-title">Hi, I&apos;m Cristian. <span className="hero-title__emoji" aria-hidden="true">🙂</span></h1>
          <p className="hero-intro">
            I&apos;m a founder, seller, and product builder. I like turning problems I&apos;ve lived through into software that is genuinely useful.
          </p>
          <div className="hero-journal">
            <div className="hero-journal__header">
              <span>My running notebook</span>
              <small>One note from the current chapter</small>
            </div>
            <div className="hero-journal__columns hero-journal__columns--single">
              {heroNotes.map((note) => <TypingNote key={note.index} {...note} />)}
            </div>
            <div className="hero-journal__now">
              <span>This site is my running notebook</span>
              <p>The work, the career story, how I build, and what I&apos;m learning along the way.</p>
            </div>
          </div>
          <div className="hero-actions">
            <a className="text-action" href="#story">Read my story <ArrowUpRight size={14} /></a>
            <a className="text-action" href="#ecosystem">Browse what I&apos;m building <ArrowUpRight size={14} /></a>
          </div>
          <span className="location"><MapPin size={14} /> Cristian · New York, NY</span>
        </motion.div>
      </section>

      <section className="proof-strip" aria-label="At a glance">
        <Reveal className="proof-item"><GithubLogo size={28} weight="light" /><div><GithubCount /><span>public GitHub contributions</span></div></Reveal>
        <Reveal className="proof-item" delay={0.04}><Briefcase size={28} weight="light" /><div><strong>19</strong><span>broke into enterprise SaaS</span></div></Reveal>
        <Reveal className="proof-item" delay={0.08}><PresentationChart size={28} weight="light" /><div><strong>43</strong><span>Syntri discovery and demo calls</span></div></Reveal>
        <Reveal className="proof-item" delay={0.12}><UsersThree size={28} weight="light" /><div><strong>9</strong><span>paying Syntri users</span></div></Reveal>
        <Reveal className="proof-connect" delay={0.16}>
          <p>Connect with me here! :)</p>
          <div className="proof-connect__links">
            <a href="https://linkedin.com/in/cristian-sanchez-aguilera" target="_blank" rel="noreferrer" aria-label="Connect with Cristian on LinkedIn">
              <LinkedinLogo size={18} weight="fill" aria-hidden="true" />
              <span>LinkedIn</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href="https://x.com/CristianXIV" target="_blank" rel="noreferrer" aria-label="Connect with Cristian on X">
              <XLogo size={17} weight="bold" aria-hidden="true" />
              <span>X</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>

      <section className="ecosystem section-frame" id="ecosystem" aria-labelledby="ecosystem-title">
        <Reveal className="section-heading">
          <div><span className="section-number">01</span><p>The ecosystem</p></div>
          <h2 id="ecosystem-title">What I&apos;m building.</h2>
          <p>Nine projects built around one sequence: get in, perform, build, compound relationships, and distribute what you own.</p>
        </Reveal>

        <Reveal className="ecosystem-path" delay={0.05}>
          {businesses.map((business, index) => (
            <div key={business.slug}>
              <button type="button" onClick={() => setSelectedBusiness(business)}>
                <span>{business.name}</span>
                <small>{business.portfolioRole.split(" · ")[1]}</small>
              </button>
              {index < businesses.length - 1 ? <ArrowRight size={14} /> : null}
            </div>
          ))}
        </Reveal>

        <div className="business-grid">
          {businesses.map((business, index) => (
            <Reveal key={business.slug} delay={Math.min(index * 0.055, 0.2)}>
              <motion.button
                type="button"
                className={`business-card business-card--${business.slug}`}
                style={{ "--business-accent": business.accent } as CSSProperties}
                onClick={() => setSelectedBusiness(business)}
                aria-haspopup="dialog"
                aria-label={`Learn more about ${business.name}`}
              >
                <div className="business-card__top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className={`business-state business-state--${business.state.toLowerCase()}`}><i />{business.state}</span>
                </div>
                <div className="business-logo">
                  <Image src={business.logo} alt={`${business.name} logo`} width={180} height={180} quality={92} />
                </div>
                <div className="business-copy">
                  <h3>{business.name}</h3>
                  <p className="business-category">{business.category}</p>
                  <p>{business.description}</p>
                </div>
                <span className="business-card__action">Open profile <ArrowUpRight size={14} /></span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="story section-frame" id="story" aria-labelledby="story-title">
        <Reveal className="section-heading section-heading--story">
          <div><span className="section-number">02</span><p>The throughline</p></div>
          <h2 id="story-title">I dropped out after one semester.<br />By 19, I was selling enterprise software.</h2>
          <p>Then I started building the tools I wished I&apos;d had.</p>
        </Reveal>

        <div className="story-grid">
          <Reveal className="story-lede">
            <p>I never followed a clean path into technology. I left college after one semester because I was learning faster by doing the work than sitting in class.</p>
            <p>Before tech, there was freelance copywriting, overnight freight, commission sales, door-to-door conversations, and a lot of rejection.</p>
            <p>Then at 19, I broke into enterprise SaaS.</p>
            <p>Varonis showed me how large organizations buy. Swap put me inside an early-stage team where the GTM motion was still being figured out. DataSnipper gave me a real number to carry every month.</p>
            <p>Along the way, I kept writing down the problems sellers dealt with every day. <strong>Syntri started as my attempt to fix them.</strong></p>
            <Link className="story-link" href="/blog/take-a-walk-with-me">Read the full story <ArrowUpRight size={15} /></Link>
          </Reveal>
          <CareerTimeline />
        </div>
      </section>

      <SyntriFounderLoop />
      <HowIBuild />
      <PersonalFacts />

      <section className="closing section-frame" id="contact">
        <Reveal className="writing-card">
          <span className="section-number">05 / Writing</span>
          <BookOpenText size={26} weight="light" />
          <div><p>Essay / 10 min</p><h2>I dropped out. Then I broke into tech at 19.</h2><span>The unconventional path from overnight freight and direct sales to enterprise SaaS, founding go-to-market, and building Syntri.</span></div>
          <p className="writing-card__excerpt">I got my first interview while I was still knocking doors. By fall, I was selling cybersecurity in New York City.</p>
          <Link href="/blog/take-a-walk-with-me">Read the essay <ArrowUpRight size={15} /></Link>
        </Reveal>
        <Reveal className="contact-card" delay={0.08}>
          <p>Building something difficult?</p>
          <h2>Let&apos;s talk while it&apos;s still messy.</h2>
          <span>I&apos;m interested in emerging products, AI-native software, developer tools, and the stage where somebody still has to figure out how the product becomes a business.</span>
          <a href="mailto:cristian@syntriai.com">Email me <ArrowUpRight size={16} /></a>
          <div className="contact-card__links"><a href="https://linkedin.com/in/cristian-sanchez-aguilera" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://x.com/CristianXIV" target="_blank" rel="noreferrer">X ↗</a><a href="https://github.com/Cristian0101" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </Reveal>
      </section>

      <footer className="site-footer">
        <a className="site-wordmark" href="#top">CS—A</a>
        <span>© 2026 Cristian Sanchez-Aguilera</span>
        <div><a href="https://github.com/Cristian0101" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com/in/cristian-sanchez-aguilera" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://x.com/CristianXIV" target="_blank" rel="noreferrer">X</a><a href="mailto:cristian@syntriai.com">Email</a></div>
        <span><MapPin size={12} /> New York, NY</span>
      </footer>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <AnimatePresence>
        {selectedBusiness ? (
          <BusinessPreview business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
