"use client";

import {
  Barbell,
  BookOpen,
  Brain,
  Coins,
  Compass,
  CurrencyDollar,
  Flame,
  Headphones,
  Lightning,
  MoonStars,
  Motorcycle,
  Target,
  Timer,
  Coffee,
  Hourglass,
  Flask,
  ShieldStar,
  Strategy,
  type Icon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LiveClock } from "@/components/portfolio/LiveClock";
import { IntoDeck } from "@/components/site/IntoDeck";
import { StoryFold } from "@/components/site/StoryFold";
import { businesses } from "@/lib/businesses";

const journey = [
  {
    number: "01",
    company: "Copy Cristian",
    label: "First dollars online",
    detail: "At 16 I made my first $45 writing TikTok scripts for a cannabis business on Upwork. That was the first proof I could turn words into money without asking anyone for a job.",
  },
  {
    number: "02",
    company: "Direct work",
    label: "Home Depot + door-to-door",
    detail: "I left college after one semester and spent five months learning sales the hard way: overnight freight, then roofing and windows on doors. Rejection, consistency, and talking to strangers became the curriculum.",
  },
  {
    number: "03",
    company: "Varonis",
    label: "Cybersecurity · enterprise SaaS",
    detail: "Three weeks after I committed to tech sales, I broke in as a BDR at 19. Varonis taught me how large organizations are prospected, bought into, and moved through a real enterprise cycle.",
    logo: "/career/varonis.svg",
    lightInvert: true,
  },
  {
    number: "04",
    company: "Swap",
    label: "Ecom · 0→1 go-to-market",
    detail: "Moved into founding GTM at an early-stage ecom company. No inherited playbook. I had to figure out who to call, what the offer was, and how a motion gets built from nothing.",
    logo: "/career/swap.svg",
    invert: true,
  },
  {
    number: "05",
    company: "DataSnipper",
    label: "Finance · audit automation",
    detail: "Sold into finance and audit teams who did not want another tool — they wanted fewer hours in spreadsheets. That was the first time I had to explain a product in the language of the work it replaced, not the language of the pitch.",
    logo: "/career/datasnipper.svg",
    lightInvert: true,
  },
  {
    number: "06",
    company: "Syntri",
    label: "Founder · product + go-to-market",
    detail: "Turned the problems I lived as a seller into an AI-native BDR operating system, then took it into discovery calls, demos, pricing, onboarding, and paid use.",
    logo: "/brands/syntri-original-blue.png",
    climax: true,
  },
];

const glance = [
  { what: "First $45 writing TikTok scripts", note: "at 16" },
  { what: "Left college after one semester", note: "to learn sales" },
  { what: "Door-to-door for five months", note: "then 3 weeks" },
  { what: "Broke into enterprise tech as a BDR", note: "at 19" },
  {
    what: "Syntri crossed $5k ARR",
    note: "still picking up",
    logos: [{ src: "/brands/syntri-original-blue.png", alt: "Syntri" }],
  },
  {
    what: "Fractional SDR work",
    note: "Outbound Foundry",
    logos: [{ src: "/brands/outbound-foundry.png", alt: "Outbound Foundry" }],
  },
  {
    what: "Two memberships",
    note: "Outflow + BLDR",
    logos: [
      { src: "/brands/outflow-original-gold.png", alt: "Outflow" },
      { src: "/brands/bldr-original-purple.png", alt: "BLDR" },
    ],
  },
];

const storyProof = [
  { mark: "16", label: "First money earned online" },
  { mark: "19", label: "Broke into enterprise SaaS" },
  { mark: "$1.48M+", label: "Pipeline generated across SaaS, roofing, and home-improvement sales roles" },
  { mark: "$5K+ ARR", label: "Syntri" },
  { mark: "$6K+ revenue", label: "Outbound Foundry" },
  { mark: "$40K+ pipeline", label: "Client pipeline" },
  { mark: "7 people", label: "Helped into tech sales" },
];

const buildPrinciples = [
  {
    number: "01",
    title: "Find the repeated problem.",
    copy: "The best product ideas I’ve found haven’t started in a brainstorming document. They show up while doing the work and noticing the same friction over and over again.",
  },
  {
    number: "02",
    title: "Get it in front of people.",
    copy: "A clever product theory is still a theory. Demos, objections, confusion, and actual usage tell me more than another week polishing in private.",
  },
  {
    number: "03",
    title: "Ship the useful core.",
    copy: "I’d rather build one workflow that genuinely changes someone’s day than ten features that look good in a launch video.",
  },
  {
    number: "04",
    title: "Keep product and GTM close.",
    copy: "The person hearing the objection shouldn’t be ten layers away from the person fixing the product. Early-stage companies move faster when that loop stays short.",
  },
  {
    number: "05",
    title: "Earn complexity.",
    copy: "Start simple. Add automation, agents, infrastructure, and process when reality justifies them—not because the architecture diagram looks impressive.",
  },
];

type PersonalFact = {
  title: string;
  text: string;
  Icon: Icon;
};

type IntoGroup = {
  title: string;
  intro: string;
  facts: PersonalFact[];
};

const intoGroups: IntoGroup[] = [
  {
    title: "Body & discipline",
    intro: "The day starts before anyone else gets a vote. Training, fasting, and a small set of objects I carry everywhere keep the rest of the work honest.",
    facts: [
      {
        Icon: Barbell,
        title: "Combat sports",
        text: "Kickboxing and Taekwondo as a kid. Boxing now. BJJ and Muay Thai are next. I like sports where you can’t fake the round—either you showed up prepared or you didn’t.",
      },
      {
        Icon: Timer,
        title: "5 a.m. daily",
        text: "The gym starts before the rest of the day gets a vote. If I lose the morning, I spend the afternoon negotiating with a version of myself I don’t respect.",
      },
      {
        Icon: Hourglass,
        title: "Long fasts",
        text: "I like doing multi-day fasts. Not as a performance. As a reminder that most of the noise I treat as urgent is just appetite with better branding.",
      },
      {
        Icon: Lightning,
        title: "The standard loadout",
        text: "Monster. AirPods. MacBook. You’ll usually find all three with me. It’s not aesthetic. It’s the smallest kit that lets me work from a gym, a café, or a late train.",
      },
    ],
  },
  {
    title: "Work & ambition",
    intro: "I don’t want a balanced life as much as I want a pointed one. The first $45 at 16 was the start of a pattern: take the risk, keep the lesson, raise the standard.",
    facts: [
      {
        Icon: CurrencyDollar,
        title: "My first $45",
        text: "I made my first $45 at 16 writing a TikTok script for a cannabis business owner on Upwork. It wasn’t the ICP I wanted. It was the first time a stranger paid me for something I made.",
      },
      {
        Icon: Flame,
        title: "Work-life balance?",
        text: "Go away, stinky work-life balance people. I like long hours when I’m building something I care about. Seasons of intensity are how I get the life I actually want later.",
      },
      {
        Icon: Coins,
        title: "The quarter test",
        text: "Some of my best risks started with a coin flip telling me to go for it. When the analysis loops, I still need a way to choose motion over another week of thinking.",
      },
      {
        Icon: Compass,
        title: "Freedom with a point",
        text: "I want financial freedom so I can pursue bigger goals and help more people. The point isn’t escaping work. It’s owning the work I spend my life on.",
      },
      {
        Icon: Target,
        title: "No retries",
        text: "I think a successful life is getting what you actually want out of it. There are no retries. That sentence makes me less patient with work that only looks impressive.",
      },
    ],
  },
  {
    title: "Inputs",
    intro: "What I put in my head shows up in how I sell and what I build. Hormozi on the commute. Camus and Vagabond on the shelf. Psychology when I want to understand why people move.",
    facts: [
      {
        Icon: Headphones,
        title: "The commute soundtrack",
        text: "Alex Hormozi in the car, on the commute, basically anywhere. I’ve been taking notes since 16. A lot of my operating language still comes from those tapes.",
      },
      {
        Icon: MoonStars,
        title: "Quiet inputs",
        text: "Meditating, reading, journaling, and learning about space. The loud part of the day is useful. The quiet part is where I notice what I’m actually optimizing for.",
      },
      {
        Icon: BookOpen,
        title: "Two shelves",
        text: "Albert Camus on one. Vagabond on the other. One is about living without a guaranteed meaning. The other is about becoming dangerous through craft.",
      },
      {
        Icon: Flask,
        title: "The rabbit hole",
        text: "I’m really into psychology and neuroscience. Not as a hobby pile. As a way to understand why a demo stalls, why a habit sticks, and why people say one thing and buy another.",
      },
      {
        Icon: Strategy,
        title: "Game theory",
        text: "I’m fascinated by the moves people make when every choice changes the board. Sales, hiring, and founding are all games. I want to play them consciously.",
      },
    ],
  },
  {
    title: "People & play",
    intro: "The résumé doesn’t get the rest of it: working beside my girlfriend, anime edits as fuel, Batman as the original operating system, and a few stories that still make me laugh.",
    facts: [
      {
        Icon: Coffee,
        title: "Parallel play",
        text: "I love working beside my girlfriend at the gym or a café. Same room, different missions. It’s the closest thing I have to a sustainable pace.",
      },
      {
        Icon: Lightning,
        title: "Anime edits",
        text: "Sometimes the motivational speech is an anime edit. I know how that sounds. I also know it works when I need another hour of honest effort.",
      },
      {
        Icon: ShieldStar,
        title: "Favorite fictional character",
        text: "Batman. Obviously. No powers. Planning, preparation, and will. I watched The Brave and the Bold at four and never really put that idea down.",
      },
      {
        Icon: MoonStars,
        title: "Temporary seasons",
        text: "Good or bad, every period ends. That makes me appreciate it while I’m in it. It also makes it easier to endure the ugly middle of a build.",
      },
      {
        Icon: Brain,
        title: "The long game",
        text: "I want to collect enough lessons to become wise and useful as my body gets older. Speed matters now. Compounding matters more later.",
      },
      {
        Icon: Motorcycle,
        title: "Sixth-grade decision-making",
        text: "I broke my arm riding a motorcycle while trying to record myself for Snapchat. Some lessons arrive as a cast. I still like the part of me that goes first.",
      },
    ],
  },
];

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

  return <span className="proof-mark">{count ? `${count.toLocaleString()}+` : "2,000+"}</span>;
}

function GithubMark() {
  return (
    <span className="doc-item__logo doc-item__logo--github" aria-hidden="true">
      <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        />
      </svg>
    </span>
  );
}

function DocItem({
  what,
  note,
  logos,
  mark,
}: {
  what: ReactNode;
  note: ReactNode;
  logos?: { src: string; alt: string }[];
  mark?: ReactNode;
}) {
  return (
    <div className="doc-item">
      <div className="doc-item__what">
        <span>{what}</span>
      </div>
      <div className={`doc-item__note${logos?.length || mark ? " doc-item__note--logo" : ""}`}>
        {logos?.map((logo) => (
          <Image key={logo.src} className="doc-item__logo" src={logo.src} alt={logo.alt} width={44} height={44} />
        ))}
        {mark}
        <span>{note}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main" className="doc">
      <header className="doc-head">
        <div className="doc-head__identity">
          <h1>Cristian Sanchez-Aguilera</h1>
          <p className="tagline">Founder, seller, and product builder.</p>
        </div>
        <div className="doc-head__contact">
          <a href="mailto:cristian@syntriai.com">cristian@syntriai.com</a>
          <a href="https://x.com/CristianXIV" target="_blank" rel="noreferrer">
            @CristianXIV
          </a>
          <LiveClock />
        </div>
      </header>

      <section className="doc-section" aria-labelledby="glance-title">
        <h2 id="glance-title">At a glance</h2>
        {glance.map((item) => (
          <DocItem key={item.what} what={item.what} note={item.note} logos={item.logos} />
        ))}
        <DocItem what="Shipping in public" note={<GithubCount />} mark={<GithubMark />} />
      </section>

      <section className="doc-section" aria-labelledby="story-title">
        <h2 id="story-title">Story</h2>
        <div className="story-copy">
          <StoryFold
            preview={
              <>
                <p>I build companies around problems I had to live through first.</p>
                <p>
                  I made my first money online at 16: $45 writing TikTok scripts for a cannabis business on Upwork. It barely covered a week of gas. Still, a stranger who had never met me decided something I made was worth paying for.
                </p>
              </>
            }
            rest={
              <>
          <p className="story-beat">That did something to my head.</p>
          <p>
            Until then, work felt like a role adults were assigned. After that payment, it looked more like a skill I could learn, sell, and get better at.
          </p>
          <p>
            College lasted one semester. I would sit in lecture halls doing the math on how long the normal path was going to take, then go home and learn faster by trying to build things myself. I was impatient, probably more than I understood at the time. I wanted a skill I could carry into any business I eventually started.
          </p>
          <p>I picked sales.</p>
          <p>Nothing moves until someone says yes.</p>
          <p>
            The next five months were the unglamorous part. I worked overnight freight at Home Depot, then knocked doors for roofing and windows. Hot days, ugly hours, three hours of sleep some nights. People decided what they thought of me before I finished the first sentence.
          </p>
          <p>
            I crashed my car during that stretch and was back out knocking the following week. I wasn’t fearless. I just didn’t have a better plan to retreat to.
          </p>
          <p>
            Then I heard about tech sales. It was the same basic test I had already been taking at people’s front doors: earn someone’s attention, understand what matters to them, and get them to take the next step. The difference was that the skill had a much higher ceiling.
          </p>
          <p>Three weeks later, at 19, I broke into enterprise SaaS with no degree and no network.</p>
          <p className="story-beat">Just reps.</p>
          <p>
            Each company taught me a different version of how people buy. Varonis taught me enterprise discipline: long sales cycles, crowded buying committees, and how security teams think about risk. At Swap, I joined early enough that there was no finished playbook waiting for me. We had to find the message and the motion while running it. At DataSnipper, I sold audit automation to finance teams who did not want another tool. They wanted fewer hours in spreadsheets, which meant the pitch only worked if it sounded like their work.
          </p>
          <p>
            While doing the job, I kept a running list of everything that made sellers slower than they needed to be: research scattered across tabs, repetitive admin work, missing context, and tools that behaved like separate islands.
          </p>
          <p>Syntri came out of that list.</p>
          <p>
            It has now crossed $5,000 in annual recurring revenue. That number is still small enough to keep me honest, but large enough to prove something important: people will pay for software built by someone who has actually done the work it is supposed to improve.
          </p>
          <p>I still do that work.</p>
          <p>
            Through Outbound Foundry, I cold call and run outbound for clients the old-fashioned way. Two clients have generated more than $6,000 in revenue for the business and over $40,000 in qualified pipeline for themselves.
          </p>
          <p>
            I don’t treat the service work like an embarrassing phase I need to escape before I can call myself a real founder. It funds the software, keeps me close to buyers, and exposes weak assumptions fast.
          </p>
          <p className="story-beat">You don’t get to build the tool if you stop doing the job.</p>
          <p>
            Outflow came from an earlier version of me: 19, no degree, no map, trying to persuade someone to take a chance. Seven people have broken into tech sales through it so far.
          </p>
          <p>
            Seven is not a huge number. It is also seven real people whose direction changed because something I built worked. That matters more to me than a dashboard full of sign-ups.
          </p>
          <p>
            BLDR is newer. It is for operators who have ideas for software but feel locked out by the technical language surrounding it. I know what it is like to enter a field where everyone else seems to have been handed the dictionary. We are building the thing I would have wanted: a practical path from idea to working product without pretending the learning curve is not real.
          </p>
          <p>I don’t want one impressive title.</p>
          <p>
            I want a small group of businesses built around problems I had to live through before I understood them. Some will work. Some probably won’t. That is part of building anything real.
          </p>
          <p>
            The standard is that they leave evidence behind: customers, commits, invoices, mistakes, and a GitHub graph that proves I didn’t just outline them.
          </p>
          <p>
            <Link className="story-link" href="/blog/take-a-walk-with-me">
              Read the full story
            </Link>
          </p>
              </>
            }
          />
        </div>

        <dl className="story-proof">
          {storyProof.map((item) => (
            <div className="story-proof__row" key={item.label}>
              <dt>{item.mark}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>

        <div className="career-list">
          {journey.map((step) => (
            <article className="career-row" key={step.number}>
              <div className="career-row__main">
                <strong>{step.company}</strong>
                <span>{step.label}</span>
              </div>
              <div className="career-row__side">
                {step.logo ? (
                  <Image
                    className={`${step.invert ? "is-inverted" : ""}${step.lightInvert ? " is-light-inverted" : ""}`}
                    src={step.logo}
                    alt={`${step.company} logo`}
                    width={180}
                    height={48}
                  />
                ) : null}
              </div>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section" aria-labelledby="building-title">
        <h2 id="building-title">Building</h2>
        <p>
          Eleven companies. Products, two memberships, an open-source truth checker, and a calling block that keeps the lights on while the rest compounds.
        </p>
        <p className="building-names">{businesses.map((business) => business.name).join(" · ")}</p>
        <p>
          <Link className="story-link" href="/businesses">
            See the companies
          </Link>
        </p>
      </section>

      <section className="doc-section" aria-labelledby="writing-home-title">
        <h2 id="writing-home-title">Writing</h2>
        <p>Origin is the weekly letter. Essays and notes stay on this site.</p>
        <p>
          <Link className="story-link" href="/blog">
            Read Origin
          </Link>
        </p>
      </section>

      <section className="doc-section" aria-labelledby="build-title">
        <h2 id="build-title">How I build</h2>
        <p>Five principles keep the work close to the problem, the customer, and the decision that comes next.</p>
        <div className="principle-list">
          {buildPrinciples.map((principle) => (
            <article className="principle-row" key={principle.number}>
              <div className="principle-row__head">
                <strong>{principle.title}</strong>
                <span>{principle.number}</span>
              </div>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section" aria-labelledby="into-title">
        <h2 id="into-title">Into</h2>
        <p>The résumé is one layer. This is the notebook behind it—grouped so you can actually read it.</p>
        <IntoDeck groups={intoGroups} />
      </section>

      <footer className="doc-footer">
        <div className="doc-footer__meta">
          <span>New York, NY</span>
        </div>
        <div className="doc-footer__links">
          <a href="https://github.com/Cristian0101" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/cristian-sanchez-aguilera" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://x.com/CristianXIV" target="_blank" rel="noreferrer">
            X
          </a>
          <a href="mailto:cristian@syntriai.com">Email</a>
        </div>
      </footer>
    </main>
  );
}
