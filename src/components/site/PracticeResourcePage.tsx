import Link from "next/link";
import Image from "next/image";
import { ResourceDownloads } from "@/components/site/ResourceDownloads";
import type { Resource } from "@/lib/resources";
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from "@/lib/seo";

export type PracticePageContent = {
  resource: Resource;
  label: string;
  lede: string;
  previewCaption: string;
  contentsTitle: string;
  sections: { title: string; text: string }[];
  audienceTitle: string;
  audience: string[];
  limitation: string;
  steps: string[];
  next: { title: string; text: string; resource: Resource };
};

export function PracticeResourcePage({ content }: { content: PracticePageContent }) {
  const { resource } = content;
  const slug = resource.path.split("/").pop();
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
      <p className="blog-doc__label">{content.label}</p>
      <h1>{resource.title}</h1><p className="blog-doc__lede">{content.lede}</p>
      <ResourceDownloads title={resource.title} pdf={resource.pdf} html={resource.html} images={resource.images} />
      <details className="resource-sheet-preview">
        <summary>Preview page 1 of the {resource.images.length}-page worksheet</summary>
        <figure><Image src={`/resources/${slug}-preview.png`} width={816} height={1056} alt={`First page of the ${resource.title}. The complete worksheet is also available as labeled HTML.`} /><figcaption>{content.previewCaption}</figcaption></figure>
      </details>
      <section className="resource-section" aria-labelledby="resource-contents">
        <h2 id="resource-contents">{content.contentsTitle}</h2>
        <ul className="resource-contents">{content.sections.map((section, index) => <li key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{section.title}</h3><p>{section.text}</p></div></li>)}</ul>
      </section>
      <section className="resource-preview" aria-labelledby="resource-audience">
        <p className="resource-kicker">For early-career reps and job seekers</p>
        <h2 id="resource-audience">{content.audienceTitle}</h2>
        {content.audience.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <p className="resource-small">{content.limitation}</p>
      </section>
      <section className="resource-section" aria-labelledby="resource-use">
        <h2 id="resource-use">Make it a useful practice session.</h2>
        <ol className="resource-steps">{content.steps.map(step => <li key={step}>{step}</li>)}</ol>
      </section>
      <aside className="resource-next" aria-labelledby="resource-next">
        <p className="resource-kicker">Keep practicing</p>
        <h2 id="resource-next">{content.next.title}</h2><p>{content.next.text}</p>
        <Link href={content.next.resource.path}>{content.next.resource.title} →</Link>
      </aside>
      <footer className="blog-footer"><Link href="/resources" className="blog-back">← All resources</Link><p>&copy; 2026 Cristian Sanchez-Aguilera</p></footer>
    </main>
  );
}
