import Link from "next/link";
import Image from "next/image";
import { ResourceDownloads } from "@/components/site/ResourceDownloads";
import { dailyChecklist as resource, resourceMetadata } from "@/lib/resources";
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from "@/lib/seo";

export const metadata = resourceMetadata(resource.title, resource.description, resource.path);

export default function DailyChecklistPage() {
  const schema = graphSchema(personSchema, {
    "@type": "CreativeWork", "@id": `${SITE_URL}${resource.path}#resource`,
    name: resource.title, description: resource.description, url: `${SITE_URL}${resource.path}`,
    isAccessibleForFree: true, inLanguage: "en", learningResourceType: "Daily checklist",
    publisher: { "@id": PERSON_ID },
    encoding: [
      { "@type": "MediaObject", encodingFormat: "application/pdf", contentUrl: `${SITE_URL}${resource.pdf}` },
      { "@type": "MediaObject", encodingFormat: "text/html", contentUrl: `${SITE_URL}${resource.html}` },
    ],
  });
  return (
    <main id="main" className="blog-doc resource-doc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Link href="/resources" className="blog-back">← All resources</Link>
      <p className="blog-doc__label">Free checklist / SDR &amp; BDR workday</p>
      <h1>SDR/BDR Daily Operating Checklist</h1>
      <p className="blog-doc__lede">Start with the right priorities. Do the outreach with context. Leave a clear next step.</p>
      <ResourceDownloads title={resource.title} pdf={resource.pdf} html={resource.html} images={resource.images} />
      <details className="resource-sheet-preview">
        <summary>Preview page 1 of the 2-page checklist</summary>
        <figure><Image src="/resources/sdr-bdr-daily-checklist-preview.png" width={850} height={1100} alt="First page of the SDR/BDR Daily Operating Checklist. The complete checklist is also available as labeled HTML." /><figcaption>A daily structure you can adapt to your team, territory, and responsibilities.</figcaption></figure>
      </details>
      <section className="resource-section" aria-labelledby="daily-contents">
        <h2 id="daily-contents">Give the day a useful order.</h2>
        <ul className="resource-contents">
          <li><span>01</span><div><h3>Start with promises and priorities</h3><p>Check replies, scheduled meetings, overdue follow-ups, account fit, and current context before building a fresh list.</p></div></li>
          <li><span>02</span><div><h3>Prepare a focused outreach block</h3><p>Know why you’re contacting someone, what problem may matter, and what you want to learn. Respect the channel rules and opt-outs.</p></div></li>
          <li><span>03</span><div><h3>Close the loop</h3><p>Record what happened, make the handoff useful, and leave a clear next action. End with one lesson to try tomorrow.</p></div></li>
        </ul>
      </section>
      <section className="resource-preview" aria-labelledby="daily-fit">
        <p className="resource-kicker">For early-career reps</p>
        <h2 id="daily-fit">Adapt it to the job you actually do.</h2>
        <p>Inbound and outbound roles are different. Use your team’s priorities, approved tools, qualification criteria, and activity expectations. Skip steps that don’t apply.</p>
        <p>Exploring a first SDR or BDR job? Practice the planning and note-taking with fictional examples. You don’t need to contact real prospects to use the checklist.</p>
        <p className="resource-small">No universal call quota or guaranteed pipeline result. The checklist is a work aid, not a substitute for your employer’s process or compliance requirements.</p>
      </section>
      <section className="resource-section" aria-labelledby="daily-use">
        <h2 id="daily-use">Use it for one day. Then adjust.</h2>
        <ol className="resource-steps"><li>Choose your priorities and a focused block that fits your schedule.</li><li>Check off what you actually do. Keep customer details in approved systems, not in a personal download.</li><li>Review the outcomes and choose one improvement for the next day.</li></ol>
      </section>
      <aside className="resource-next" aria-labelledby="daily-next">
        <p className="resource-kicker">Keep learning / Outflow</p>
        <h2 id="daily-next">Still getting to know the role?</h2>
        <p>Outflow’s guide explains the daily work of an SDR. If you’re preparing for an interview, use the Interview Prep Scorecard next.</p>
        <p><a href="https://outflow.academy/blog/what-does-an-sdr-do" target="_blank" rel="noreferrer">Read what an SDR does →</a></p>
        <Link href="/resources/interview-prep-scorecard">Get the Interview Prep Scorecard →</Link>
      </aside>
      <footer className="blog-footer"><Link href="/resources" className="blog-back">← All resources</Link><p>&copy; 2026 Cristian Sanchez-Aguilera</p></footer>
    </main>
  );
}
