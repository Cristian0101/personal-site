import Link from "next/link";
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from "@/lib/seo";
import { interviewScorecard, dailyChecklist, tamWorksheet, coldCallScorecard, coldEmailChecklist, allResources, resourceMetadata } from "@/lib/resources";

export const metadata = resourceMetadata("Resources", "Five free, practical tech sales tools for interview preparation, daily planning, market segmentation, cold-call practice, and cold-email review.", "/resources");

export default function ResourcesPage() {
  const schema = graphSchema(personSchema, {
    "@type": "CollectionPage", "@id": `${SITE_URL}/resources#collection`,
    name: "Resources", url: `${SITE_URL}/resources`, publisher: { "@id": PERSON_ID },
    mainEntity: { "@type": "ItemList", itemListElement: allResources.map((resource, index) => ({ "@type": "ListItem", position: index + 1, name: resource.title, url: `${SITE_URL}${resource.path}` })) },
  });
  return (
    <main id="main" className="blog-doc resource-doc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="blog-doc__label">Resources</p>
      <h1>Put the next step on paper.</h1>
      <p className="blog-doc__lede">Practical tools for breaking into tech sales and doing the work. Pick one thing you want to get better at.</p>
      <section className="resource-feature" aria-labelledby="scorecard-title">
        <div className="resource-feature__top"><span className="resource-kicker">01 / Interview practice</span><span className="resource-tag">Free</span></div>
        <h2 id="scorecard-title">Interview Prep Scorecard</h2>
        <p>Turn “I think I’m ready” into notes you can use. Research one role, practice your answers out loud, then choose one thing to improve.</p>
        <ol className="resource-sequence">
          <li><span>01</span> Research the role</li>
          <li><span>02</span> Build your answers</li>
          <li><span>03</span> Practice and review</li>
        </ol>
        <Link className="resource-button" href={interviewScorecard.path}>Get the scorecard <span aria-hidden="true">↗</span></Link>
        <p className="resource-small">Printable PDF + image pages + accessible HTML · No email required</p>
      </section>
      <section className="resource-feature" aria-labelledby="daily-title">
        <div className="resource-feature__top"><span className="resource-kicker">02 / Your working day</span><span className="resource-tag">Free</span></div>
        <h2 id="daily-title">SDR/BDR Daily Operating Checklist</h2>
        <p>Give your day a useful order. Start with promises and priorities, prepare relevant outreach, then leave clean notes for the next step.</p>
        <ol className="resource-sequence">
          <li><span>01</span> Set your priorities</li>
          <li><span>02</span> Work a focused block</li>
          <li><span>03</span> Close the loop</li>
        </ol>
        <Link className="resource-button" href={dailyChecklist.path}>Get the daily checklist <span aria-hidden="true">↗</span></Link>
        <p className="resource-small">Printable PDF + image pages + accessible HTML · No email required</p>
      </section>
      {[
        { resource: tamWorksheet, number: "03", category: "Account planning", id: "tam-title", copy: "Define your market before you build a list. Keep the evidence visible, estimate a range, and choose a segment you can explain.", steps: ["Set the boundaries", "Check the assumptions", "Prioritize a small list"], action: "Get the TAM worksheet" },
        { resource: coldCallScorecard, number: "04", category: "Conversation practice", id: "call-title", copy: "Rehearse a fictional call with a partner. Review what you actually said and heard, then retry one part with a clear purpose.", steps: ["Set up a scenario", "Observe the conversation", "Retry one moment"], action: "Get the call scorecard" },
        { resource: coldEmailChecklist, number: "05", category: "Message review", id: "email-title", copy: "Look at an email from the reader’s side. Check the evidence and the ask, study a fictional edit, then rewrite your own practice draft.", steps: ["Check the reason to write", "Review the example", "Make one useful edit"], action: "Get the email checklist" },
      ].map(({ resource, number, category, id, copy, steps, action }) => (
        <section className="resource-feature" aria-labelledby={id} key={resource.path}>
          <div className="resource-feature__top"><span className="resource-kicker">{number} / {category}</span><span className="resource-tag">Free</span></div>
          <h2 id={id}>{resource.title}</h2><p>{copy}</p>
          <ol className="resource-sequence">{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
          <Link className="resource-button" href={resource.path}>{action}<span aria-hidden="true">↗</span></Link>
          <p className="resource-small">Printable PDF + image pages + accessible HTML · No email required</p>
        </section>
      ))}
      <section className="resource-section" aria-labelledby="start-small">
        <h2 id="start-small">One useful tool at a time.</h2>
        <p>Choose the worksheet that fits your next interview, practice session, or workday. Keep the notes that help you, and come back when you need another.</p>
        <p><Link href="/blog/take-a-walk-with-me">Read the story behind the work →</Link></p>
      </section>
      <footer className="blog-footer"><p>&copy; 2026 Cristian Sanchez-Aguilera</p></footer>
    </main>
  );
}
