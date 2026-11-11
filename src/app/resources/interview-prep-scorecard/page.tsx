import Link from "next/link";
import Image from "next/image";
import { ResourceDownloads } from "@/components/site/ResourceDownloads";
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from "@/lib/seo";
import { interviewScorecard as resource, resourceMetadata } from "@/lib/resources";

export const metadata = resourceMetadata(resource.title, resource.description, resource.path);

export default function InterviewPrepScorecardPage() {
  const schema = graphSchema(personSchema, {
    "@type": "CreativeWork", "@id": `${SITE_URL}${resource.path}#resource`,
    name: resource.title, description: resource.description, url: `${SITE_URL}${resource.path}`,
    isAccessibleForFree: true, inLanguage: "en", learningResourceType: "Practice worksheet",
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
      <p className="blog-doc__label">Free worksheet / SDR &amp; BDR interviews</p>
      <h1>Interview Prep Scorecard</h1>
      <p className="blog-doc__lede">Know the role. Use your real experience. Leave your next practice session knowing what to work on.</p>
      <ResourceDownloads title={resource.title} pdf={resource.pdf} html={resource.html} images={resource.images} />
      <details className="resource-sheet-preview">
        <summary>Preview page 1 of the 4-page worksheet</summary>
        <figure>
          <Image src="/resources/interview-prep-scorecard-preview.png" width={850} height={1100} alt="First page of the Interview Prep Scorecard, with company and role research prompts. All worksheet content is available in the HTML version." />
          <figcaption>Research the role. Then work through answers, practice, and review on the next three pages.</figcaption>
        </figure>
      </details>
      <section className="resource-section" aria-labelledby="inside-heading">
        <h2 id="inside-heading">A small plan for a real interview.</h2>
        <ul className="resource-contents">
          <li><span>01</span><div><h3>Research with a purpose</h3><p>Identify the customer, the problem, and the work the role actually involves. Bring questions where the evidence is missing.</p></div></li>
          <li><span>02</span><div><h3>Practice your own answers</h3><p>Build truthful examples from work, school, volunteering, or personal projects. Use a clear structure without memorizing a script.</p></div></li>
          <li><span>03</span><div><h3>Score what you can hear</h3><p>Review one mock interview against concrete criteria, then repeat the answer that needs the most work.</p></div></li>
        </ul>
      </section>
      <section className="resource-preview" aria-labelledby="preview-heading">
        <p className="resource-kicker">A look at the method</p>
        <h2 id="preview-heading">Make the feedback specific.</h2>
        <p>After practice, write down what was missing and what you’ll change. A score without a next action won’t help much.</p>
        <div className="resource-example"><span className="resource-tag">Example feedback</span><p>“I explained what the team did, but not what I did. I’ll practice that answer again with my own action and a result I can support.”</p></div>
        <p className="resource-small">Illustrative feedback, not a student testimonial. The worksheet is a practice aid, not a validated assessment or a prediction of hiring success.</p>
      </section>
      <section className="resource-section" aria-labelledby="how-heading">
        <h2 id="how-heading">Use it before the next conversation.</h2>
        <ol className="resource-steps"><li>Pick one real opening. Keep the job description beside you.</li><li>Prepare your notes, then answer out loud with a friend or on your own.</li><li>Use the scorecard to choose a specific improvement. Practice again and compare.</li></ol>
        <p>You don’t need a previous tech sales title to practice. Use relevant, truthful examples from the experience you already have.</p>
      </section>
      <aside className="resource-next" aria-labelledby="next-heading">
        <p className="resource-kicker">Keep going / Outflow</p>
        <h2 id="next-heading">Want the longer guide?</h2>
        <p>This worksheet is a quick practice companion. Outflow’s free SDR Interview Prep Kit goes deeper into introductions, story banks, mock calls, and a 48-hour preparation plan.</p>
        <a href="https://outflow.academy/resources/interview-prep-kit" target="_blank" rel="noreferrer">Explore Outflow’s free kit ↗</a>
        <p className="resource-small">Outflow is a separate site and asks for an email to unlock the full kit. Your download here stays ungated.</p>
      </aside>
      <footer className="blog-footer"><Link href="/resources" className="blog-back">← All resources</Link><p>&copy; 2026 Cristian Sanchez-Aguilera</p></footer>
    </main>
  );
}
