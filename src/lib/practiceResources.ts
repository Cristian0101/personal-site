import type { PracticePageContent } from "@/components/site/PracticeResourcePage";
import { tamWorksheet, coldCallScorecard, coldEmailChecklist, dailyChecklist } from "@/lib/resources";

export const tamContent: PracticePageContent = {
  resource: tamWorksheet, label: "Free worksheet / Account planning",
  lede: "Define the market. Make the assumptions visible. Choose a segment worth researching next.",
  previewCaption: "A practical starting point for market boundaries, evidence, and account selection.",
  contentsTitle: "Give your account list a reason.",
  sections: [
    { title: "Define the market and first segment", text: "Describe the problem and company criteria. Separate account fit from the role of the person you might speak with." },
    { title: "Estimate a range you can defend", text: "Record the method, sources, dates, and assumptions behind a rough market estimate. Keep uncertainty visible." },
    { title: "Prioritize a small account list", text: "Compare candidate accounts using relevant evidence. Decide what to research next before treating a company as a fit." },
  ],
  audienceTitle: "Start with a working hypothesis.",
  audience: ["Use the worksheet for an early account-planning exercise, or practice with a fictional product and sample companies. A broad market estimate and a reachable prospecting list answer different questions.", "Work with public company facts or approved internal data. Keep personal contact details and confidential customer information in approved systems."],
  limitation: "This is a planning aid, not a validated market study or revenue forecast. A company that matches a segment has not necessarily expressed interest or agreed to be contacted.",
  steps: ["Choose one product, problem, and market boundary.", "Write down what you know, where it came from, and what still needs checking.", "Compare a small sample and choose the next piece of evidence to collect."],
  next: { title: "Practice the conversation next.", text: "Turn a fictional account hypothesis into a respectful opening conversation, then review what you observe.", resource: coldCallScorecard },
};
export const coldCallContent: PracticePageContent = {
  resource: coldCallScorecard, label: "Free scorecard / Conversation practice",
  lede: "Rehearse a fictional call. Listen for what actually happens. Retry one moment with a clear purpose.",
  previewCaption: "A scenario, observable review criteria, and a focused second attempt.",
  contentsTitle: "Practice more than the opening line.",
  sections: [
    { title: "Set up a fictional call", text: "Agree on a scenario and relevant context. Prepare a short opening and give your practice partner room to respond." },
    { title: "Review observable behaviors", text: "Use blank 0, 1, or 2 ratings with specific criteria. Notice relevance, listening, clarity, and respect for the other person’s choice." },
    { title: "Retry one moment", text: "Write down what you heard, change one part, and repeat it. Compare the two attempts using specific observations." },
  ],
  audienceTitle: "You can practice before you have prospects.",
  audience: ["Work with a partner using fictional company and buyer details. Take turns as the caller, recipient, and reviewer. You do not need to call real people to use this scorecard.", "Use written notes by default. If you record a practice session, obtain everyone’s permission and follow applicable rules."],
  limitation: "The ratings guide feedback, not hiring or sales predictions. There is no passing total. Real outreach must follow your organization’s process, applicable rules, and the recipient’s preferences.",
  steps: ["Choose a scenario and give the recipient a realistic response to try.", "Run the practice call, then cite specific words or behaviors in the review.", "Choose one change, retry that moment, and record what improved or still needs work."],
  next: { title: "Work on the written version.", text: "Use the same attention to evidence, relevance, and a reasonable next step when you review a practice email.", resource: coldEmailChecklist },
};
export const coldEmailContent: PracticePageContent = {
  resource: coldEmailChecklist, label: "Free checklist / Message review",
  lede: "Read it from the other side. Check the evidence and the ask. Make the next draft easier to understand.",
  previewCaption: "An evidence check, a fictional before-and-after example, and space for your rewrite.",
  contentsTitle: "Give every line a job.",
  sections: [
    { title: "Audit the reason to write", text: "Check the company context, your assumptions, the sender and subject, and the relevance of the request. Remove claims you cannot support." },
    { title: "Watch the edit happen", text: "Study a clearly labeled fictional before-and-after example. Notice what changed and why it makes the message more accurate and useful." },
    { title: "Rewrite it. Review it.", text: "Draft your own practice version, check it from the reader’s perspective, and decide which line needs another edit." },
  ],
  audienceTitle: "Practice the edit before you press send.",
  audience: ["Use a fictional draft or a redacted example you are allowed to review. Keep private customer information and personal contact details out of this download.", "The worksheet helps with clarity and accuracy. Before real outreach, separately check your organization’s rules, local law, permissions, and opt-out requirements."],
  limitation: "No template guarantees replies or inbox placement. This is an editing aid, not a complete legal or deliverability checklist. Completing it does not authorize a send.",
  steps: ["Mark what is verified, inferred, or unsupported in the draft.", "Rewrite around one relevant issue and a clear, reasonable next step.", "Ask a reader to explain the message back to you, then remove what causes confusion."],
  next: { title: "Give the work a place in your day.", text: "Use the Daily Operating Checklist to organize preparation, follow-through, and a short review of what you learned.", resource: dailyChecklist },
};
