export type Playbook = {
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  cover: { src: string; width: number; height: number; alt: string };
  accent: string;
  accentBorder?: string;
  price: { amount: number; currency: string; approved: boolean };
  checkoutPriceEnv: string;
  status: "preparation" | "published";
  purchaseEnabled: boolean;
  finalPdfApproved: boolean;
  fileKeyEnv: string;
  format: string;
  delivery: string;
  collectionNumber: string;
  outcomeHeading: string;
  outcomeIntro: string;
  contentsEyebrow: string;
  contentsNote: string;
  closing: { heading: string; copy: string };
  freeResource: { href: string; label: string };
  outcomes: { title: string; description: string }[];
  modules: { title: string; description: string }[];
  previews: { src: string; width: number; height: number; alt: string; caption: string }[];
  author: { name: string; role: string; image?: string; paragraphs: string[] };
  seo: { title: string; description: string };
};

const authorBackground = "I'm Cristian Sanchez. I broke into enterprise tech sales at 19 without a degree or a traditional path into the industry. I've worked across cybersecurity, ecommerce, and finance-focused software sales, and founded Outflow to help others navigate the same career transition.";

export const playbooks: Playbook[] = [{
  slug: "master-interviews",
  title: "Master Interviews",
  subtitle: "The SDR/BDR Interview Preparation Playbook",
  shortDescription: "A complete preparation process for your next SDR or BDR interview.",
  description: "Stop walking into tech sales interviews hoping you've prepared enough. Build a company-specific interview strategy, prepare stronger answers from your real experiences, and practice the conversations that matter before interview day.",
  cover: {
    src: "/playbooks/master-interviews/mockup.webp", width: 2172, height: 1452,
    alt: "Approved Master Interviews hardcover mockup, showing the charcoal cover and full spine with icy-blue lettering. The product is a digital playbook.",
  },
  accent: "#a9cce5",
  price: { amount: 3900, currency: "usd", approved: false },
  checkoutPriceEnv: "MASTER_INTERVIEWS_STRIPE_PRICE_ID",
  status: "preparation",
  purchaseEnabled: false,
  finalPdfApproved: false,
  fileKeyEnv: "MASTER_INTERVIEWS_FILE_KEY",
  format: "Digital playbook · PDF",
  delivery: "In preparation. Digital edition; no physical book is included.",
  collectionNumber: "01",
  outcomeHeading: "Walk into your next interview with a plan.",
  outcomeIntro: "A process designed to help you build four concrete capabilities.",
  contentsEyebrow: "From research to rehearsal",
  contentsNote: "The proposed editorial structure. Modules may evolve as the playbook is finalized.",
  closing: { heading: "Prepare with purpose.", copy: "Your experience is the raw material. This playbook helps you organize it, communicate it, and practice showing what you can do." },
  freeResource: { href: "/resources/interview-prep-scorecard", label: "Want to start smaller? Try the free Interview Prep Scorecard." },
  outcomes: [
    { title: "Research the company", description: "Understand the company's product, buyers, market, and sales motion so your answers are specific rather than generic." },
    { title: "Build your story bank", description: "Prepare six truthful examples from your own experience that demonstrate relevant skills and judgment." },
    { title: "Practice the interview", description: "Work through common SDR/BDR questions, behavioral scenarios, and mock sales conversations." },
    { title: "Know your next step", description: "Create a practical preparation and rehearsal plan leading up to interview day." },
  ],
  modules: [
    { title: "Understanding the SDR/BDR Role", description: "Get clear on the work, the expectations, and the skills your interview needs to demonstrate." },
    { title: "Company & Role Research", description: "Turn research into a company-specific point of view you can bring to the conversation." },
    { title: "Your Six-Story Interview Bank", description: "Find six real experiences and shape them into clear examples of your skills and judgment." },
    { title: "Interview Answers & Frameworks", description: "Organize your thinking and practice answers that sound like you, grounded in what you've actually done." },
    { title: "Mock Calls & Sales Exercises", description: "Rehearse realistic sales conversations, review your approach, and decide what to practice next." },
    { title: "The Final Preparation Plan", description: "Bring your research, stories, and rehearsal into a practical plan for interview day." },
  ],
  // Add only approved, genuine interior excerpts (2–4). The cover is not a sample page.
  previews: [],
  author: {
    name: "Cristian Sanchez", role: "Founder, Outflow",
    paragraphs: [
      authorBackground,
      "I created Master Interviews to turn interview preparation into something practical: research, real stories, deliberate practice, and a plan you can actually follow.",
    ],
  },
  seo: {
    title: "Master Interviews — The SDR/BDR Interview Preparation Playbook",
    description: "A digital playbook by Cristian Sanchez for company research, truthful interview stories, SDR/BDR practice, and a practical preparation plan. In preparation from Northmark Press.",
  },
}, {
  "price": {
    "amount": 3900,
    "currency": "usd",
    "approved": false
  },
  "status": "preparation",
  "purchaseEnabled": false,
  "finalPdfApproved": false,
  "format": "Digital playbook · PDF",
  "delivery": "In preparation. Digital edition; no physical book is included.",
  "outcomeIntro": "A process designed to help you build four concrete capabilities.",
  "contentsNote": "The proposed editorial structure. Modules may evolve as the playbook is finalized.",
  "previews": [],
  "slug": "sdr-bdr-job-mastery",
  "title": "SDR/BDR Job Mastery",
  "subtitle": "A Practical Playbook to Break Into Tech Sales, Perform, and Get Promoted",
  "shortDescription": "Build the routines, prospecting skills, and judgment to perform and grow after joining a sales team.",
  "description": "Landing your first SDR or BDR role is just the beginning. Learn how to understand your responsibilities, build effective daily habits, manage your territory, improve your prospecting, and develop the skills that prepare you for the next stage of your sales career.",
  "accent": "#f47721",
  "accentBorder": "#873b17",
  "cover": {
    "src": "/playbooks/sdr-bdr-job-mastery/mockup.webp",
    "width": 2150,
    "height": 1436,
    "alt": "Approved SDR/BDR Job Mastery hardcover mockup showing the full cover and spine. The product is a digital playbook."
  },
  "checkoutPriceEnv": "SDR_BDR_JOB_MASTERY_STRIPE_PRICE_ID",
  "fileKeyEnv": "SDR_BDR_JOB_MASTERY_FILE_KEY",
  "collectionNumber": "02",
  "outcomeHeading": "Don't just land the role. Learn to master it.",
  "contentsEyebrow": "From daily habits to career growth",
  "closing": {
    "heading": "Master the role. Build the career.",
    "copy": "A practical guide to developing the habits, skills, and judgment that help sales professionals grow."
  },
  "freeResource": {
    "href": "/resources/sdr-bdr-daily-checklist",
    "label": "Want to start smaller? Try the free SDR/BDR Daily Operating Checklist."
  },
  "outcomes": [
    {
      "title": "Understand the job",
      "description": "Learn what SDRs and BDRs actually do, how teams measure performance, and what strong execution looks like."
    },
    {
      "title": "Build your operating system",
      "description": "Create structured prospecting routines, organize your pipeline, and prioritize the right activities."
    },
    {
      "title": "Improve your execution",
      "description": "Develop practical approaches to account research, outreach, objection handling, and meeting creation."
    },
    {
      "title": "Prepare for advancement",
      "description": "Understand how to develop stronger sales judgment, work effectively with account executives, and build toward future opportunities."
    }
  ],
  "modules": [
    {
      "title": "Understanding the SDR/BDR Role",
      "description": "Clarify your responsibilities, team expectations, and what strong day-to-day execution involves."
    },
    {
      "title": "Building Your Daily Operating System",
      "description": "Build a practical routine for prospecting, follow-ups, pipeline organization, and review."
    },
    {
      "title": "Territory Planning & Prospect Research",
      "description": "Prepare account context and prioritize where to focus your time."
    },
    {
      "title": "Multi-Channel Prospecting Execution",
      "description": "Coordinate research, calls, emails, and follow-ups into a consistent working process."
    },
    {
      "title": "Meetings, Metrics & Performance Improvement",
      "description": "Prepare useful handoffs, review meaningful activity, and choose what to improve."
    },
    {
      "title": "Career Development & Advancement",
      "description": "Develop sales judgment, collaborate with account executives, and plan your next stage of growth."
    }
  ],
  "seo": {
    "title": "SDR/BDR Job Mastery — Sales Execution & Career Development",
    "description": "A digital playbook by Cristian Sanchez for SDR/BDR daily routines, prospecting execution, performance improvement, and career development. In preparation from Northmark Press."
  },
  "author": {
    "name": "Cristian Sanchez",
    "role": "Founder, Outflow",
    "paragraphs": [
      authorBackground,
      "This playbook brings the same practical approach to daily execution and career development: clear priorities, deliberate practice, and stronger sales judgment."
    ]
  }
}, {
  "price": {
    "amount": 3900,
    "currency": "usd",
    "approved": false
  },
  "status": "preparation",
  "purchaseEnabled": false,
  "finalPdfApproved": false,
  "format": "Digital playbook · PDF",
  "delivery": "In preparation. Digital edition; no physical book is included.",
  "outcomeIntro": "A process designed to help you build four concrete capabilities.",
  "contentsNote": "The proposed editorial structure. Modules may evolve as the playbook is finalized.",
  "previews": [],
  "slug": "break-up-your-tam",
  "title": "Break Up Your TAM",
  "subtitle": "A Practical Playbook for Identifying, Prioritizing, and Converting the Right Accounts",
  "shortDescription": "Turn a broad territory into prioritized account segments and a focused account-based outbound plan.",
  "description": "Your total addressable market isn't your prospecting strategy. Learn how to break a large territory into manageable account segments, identify high-priority opportunities, build account intelligence, and turn scattered prospecting into a more focused outbound system.",
  "accent": "#c17af1",
  "accentBorder": "#8150a7",
  "cover": {
    "src": "/playbooks/break-up-your-tam/mockup.webp",
    "width": 2182,
    "height": 1452,
    "alt": "Approved Break Up Your TAM hardcover mockup showing the full cover and spine. The product is a digital playbook."
  },
  "checkoutPriceEnv": "BREAK_UP_YOUR_TAM_STRIPE_PRICE_ID",
  "fileKeyEnv": "BREAK_UP_YOUR_TAM_FILE_KEY",
  "collectionNumber": "03",
  "outcomeHeading": "Stop working every account. Start working the right ones.",
  "contentsEyebrow": "From market definition to territory execution",
  "closing": {
    "heading": "Your territory is only as good as your strategy.",
    "copy": "Replace random prospecting with a structured system for finding, prioritizing, and engaging the accounts that matter."
  },
  "freeResource": {
    "href": "/resources/tam-segmentation-worksheet",
    "label": "Want to start smaller? Try the free TAM Segmentation Worksheet."
  },
  "outcomes": [
    {
      "title": "Define your market",
      "description": "Understand how to move from a broad TAM toward accounts that fit your company's ideal customer profile."
    },
    {
      "title": "Segment with purpose",
      "description": "Organize accounts by fit, buying signals, opportunity potential, and practical prospecting priority."
    },
    {
      "title": "Build account intelligence",
      "description": "Research companies, identify relevant stakeholders, and develop account-specific outreach angles."
    },
    {
      "title": "Execute a focused territory plan",
      "description": "Turn your prioritized accounts into actionable prospecting lists, outreach sequences, and weekly territory reviews."
    }
  ],
  "modules": [
    {
      "title": "Understanding TAM, SAM & ICP",
      "description": "Connect market size and your ideal customer profile to practical account selection."
    },
    {
      "title": "Account Segmentation & Prioritization",
      "description": "Group accounts using fit, evidence, and a clear prospecting priority."
    },
    {
      "title": "Building Your Target Account Lists",
      "description": "Translate your chosen segments into manageable lists you can research and maintain."
    },
    {
      "title": "Account Research & Buying Signals",
      "description": "Develop account intelligence and distinguish meaningful signals from assumptions."
    },
    {
      "title": "Multi-Threading & Account-Based Outreach",
      "description": "Identify relevant stakeholders and plan coordinated, account-specific outreach."
    },
    {
      "title": "Territory Execution & Optimization",
      "description": "Build weekly territory reviews and adjust priorities as new evidence emerges."
    }
  ],
  "seo": {
    "title": "Break Up Your TAM — Territory Strategy & Account Prioritization",
    "description": "A digital playbook by Cristian Sanchez for territory strategy, TAM segmentation, account prioritization, buying signals, and account-based outbound. In preparation from Northmark Press."
  },
  "author": {
    "name": "Cristian Sanchez",
    "role": "Founder, Outflow",
    "paragraphs": [
      authorBackground,
      "This playbook brings the same practical approach to territory strategy: account research, purposeful prioritization, and a plan you can put to work."
    ]
  }
}, {
  slug: "science-of-a-cold-call",
  title: "The Science of a Cold Call",
  subtitle: "A Systematic Playbook for Opening, Engaging, and Booking More Meetings",
  shortDescription: "A systematic approach to opening calls, creating relevance, and earning the next step.",
  description: "Cold calling isn't about memorizing the perfect script. It's about understanding how conversations work. Learn how to open calls, create relevance, navigate objections, and confidently ask for the next step using a repeatable prospecting framework.",
  cover: {
    src: "/playbooks/science-of-a-cold-call/mockup.webp", width: 2182, height: 1456,
    alt: "Approved The Science of a Cold Call hardcover mockup, showing the full deep-navy cover and spine with electric-cyan lettering. The product is a digital playbook.",
  },
  accent: "#1be2f6",
  accentBorder: "#1164c8",
  price: { amount: 3900, currency: "usd", approved: false },
  checkoutPriceEnv: "SCIENCE_COLD_CALL_STRIPE_PRICE_ID",
  status: "preparation",
  purchaseEnabled: false,
  finalPdfApproved: false,
  fileKeyEnv: "SCIENCE_COLD_CALL_FILE_KEY",
  format: "Digital playbook · PDF",
  delivery: "In preparation. Digital edition; no physical book is included.",
  collectionNumber: "04",
  outcomeHeading: "Make every cold call more intentional.",
  outcomeIntro: "A process designed to help you build four concrete capabilities.",
  contentsEyebrow: "From preparation to conversation",
  contentsNote: "The proposed editorial structure. Modules may evolve as the playbook is finalized.",
  closing: { heading: "Better calls start with better conversations.", copy: "Build the judgment, structure, and confidence to approach outbound calls with purpose." },
  freeResource: { href: "/resources/cold-call-practice-scorecard", label: "Want to start smaller? Try the free Cold Call Practice Scorecard." },
  outcomes: [
    { title: "Open with confidence", description: "Develop clear, permission-based openings that give prospects a reason to engage." },
    { title: "Create real conversations", description: "Learn how to establish relevance, ask better questions, and move beyond scripted pitches." },
    { title: "Handle resistance", description: "Understand common objections and practice responding without sounding defensive or robotic." },
    { title: "Earn the next step", description: "Learn how to transition from discovery and interest into a clear meeting request." },
  ],
  modules: [
    { title: "The Psychology of Cold Calling", description: "Understand the prospect's perspective and the decisions that shape an unfamiliar conversation." },
    { title: "Research, Relevance & Preparation", description: "Build a clear reason for calling from what you can actually learn about an account." },
    { title: "Opening the Conversation", description: "Practice concise, permission-based openings that make room for a real response." },
    { title: "Discovery & Conversation Control", description: "Ask useful questions, listen for context, and guide the conversation without forcing a pitch." },
    { title: "Objection Handling & Recovery", description: "Work through common resistance and practice responding with clarity and respect." },
    { title: "Securing Meetings & Improving Performance", description: "Make a clear next-step request, review your calls, and choose what to improve." },
  ],
  previews: [],
  author: {
    name: "Cristian Sanchez", role: "Founder, Outflow",
    paragraphs: [authorBackground, "I created The Science of a Cold Call to turn call preparation into something practical: relevant research, clear openings, deliberate practice, and a thoughtful next step."],
  },
  seo: {
    title: "The Science of a Cold Call — A Systematic Prospecting Playbook",
    description: "A digital playbook by Cristian Sanchez for relevant cold-call openings, better conversations, objection practice, and clear next steps. In preparation from Northmark Press.",
  },
}, {
  slug: "science-of-a-cold-email",
  title: "The Science of a Cold Email",
  subtitle: "A Framework for Writing Cold Emails That Get Replies, Meetings, and Opportunities",
  shortDescription: "A practical framework for researching prospects, writing relevant emails, and following up with purpose.",
  description: "Stop treating cold email like a numbers game. Learn how to research prospects, write relevant messages, communicate value clearly, and develop thoughtful follow-up sequences without relying on generic templates.",
  cover: {
    src: "/playbooks/science-of-a-cold-email/mockup.webp", width: 1546, height: 1024,
    alt: "Approved The Science of a Cold Email hardcover mockup, showing the full forest-green cover and spine with electric-lime lettering. The product is a digital playbook.",
  },
  accent: "#badd49",
  accentBorder: "#126b48",
  price: { amount: 3900, currency: "usd", approved: false },
  checkoutPriceEnv: "SCIENCE_COLD_EMAIL_STRIPE_PRICE_ID",
  status: "preparation",
  purchaseEnabled: false,
  finalPdfApproved: false,
  fileKeyEnv: "SCIENCE_COLD_EMAIL_FILE_KEY",
  format: "Digital playbook · PDF",
  delivery: "In preparation. Digital edition; no physical book is included.",
  collectionNumber: "05",
  outcomeHeading: "Write emails worth opening.",
  outcomeIntro: "A process designed to help you build four concrete capabilities.",
  contentsEyebrow: "From research to the next reply",
  contentsNote: "The proposed editorial structure. Modules may evolve as the playbook is finalized.",
  closing: { heading: "Write less noise. Create more opportunity.", copy: "Develop a repeatable approach to researching, writing, and improving outbound emails." },
  freeResource: { href: "/resources/cold-email-teardown-checklist", label: "Want to start smaller? Try the free Cold Email Teardown Checklist." },
  outcomes: [
    { title: "Understand your audience", description: "Identify relevant buying signals, prospect priorities, and meaningful reasons to reach out." },
    { title: "Write stronger openings", description: "Craft concise subject lines and opening sentences built around specific relevance." },
    { title: "Communicate real value", description: "Explain why your message matters without relying on exaggerated claims or generic pitches." },
    { title: "Build better follow-ups", description: "Create purposeful follow-up sequences that add context instead of repeating the same ask." },
  ],
  modules: [
    { title: "The Psychology of Cold Email", description: "Consider how a reader decides whether an unfamiliar message deserves their attention." },
    { title: "Prospect Research & Personalization", description: "Find meaningful context and use it to build a specific, truthful reason to reach out." },
    { title: "Subject Lines & Opening Sentences", description: "Practice concise subject lines and openings that make the relevance clear." },
    { title: "Messaging, Value & Calls to Action", description: "Connect your message to the reader's priorities and write a clear, proportionate ask." },
    { title: "Follow-Up Sequences & Deliverability", description: "Plan follow-ups that add context and understand the delivery considerations behind them." },
    { title: "Testing, Measuring & Improving Results", description: "Review your messaging, interpret results carefully, and decide what to test next." },
  ],
  previews: [],
  author: {
    name: "Cristian Sanchez", role: "Founder, Outflow",
    paragraphs: [authorBackground, "I created The Science of a Cold Email to turn outbound writing into something practical: thoughtful research, relevant messages, purposeful follow-ups, and a process you can keep improving."],
  },
  seo: {
    title: "The Science of a Cold Email — A Practical Outbound Email Playbook",
    description: "A digital playbook by Cristian Sanchez for prospect research, relevant cold emails, clear messaging, and purposeful follow-ups. In preparation from Northmark Press.",
  },
}];

// All editions share the same page and commerce components; launch approvals remain independent.
export function getPlaybook(slug: string) { return playbooks.find(book => book.slug === slug); }
export function playbookPath(book: Pick<Playbook, "slug">) { return `/resources/${book.slug}`; }
export function formatPrice(book: Pick<Playbook, "price">) {
  const digits = new Intl.NumberFormat("en-US", { style: "currency", currency: book.price.currency }).resolvedOptions().maximumFractionDigits ?? 2;
  const value = book.price.amount / 10 ** digits;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: book.price.currency, maximumFractionDigits: Number.isInteger(value) ? 0 : digits }).format(value);
}
export function priceValue(book: Pick<Playbook, "price">) {
  const digits = new Intl.NumberFormat("en-US", { style: "currency", currency: book.price.currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return book.price.amount / 10 ** digits;
}
