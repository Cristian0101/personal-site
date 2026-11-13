import Link from "next/link";
import { ResourcesLibrary } from "@/components/site/ResourcesLibrary";
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from "@/lib/seo";
import { allResources, resourceMetadata } from "@/lib/resources";
import { PremiumCollection } from "@/components/playbooks/PremiumCollection";
import { playbooks, playbookPath } from "@/lib/playbooks";

export const metadata = resourceMetadata("Resources", "Five free tech sales tools, plus deeper digital playbooks from Northmark Press. Interview preparation, daily planning, and deliberate sales practice.", "/resources");

export default function ResourcesPage() {
  const schema = graphSchema(personSchema, {
    "@type": "CollectionPage", "@id": `${SITE_URL}/resources#collection`,
    name: "Resources", url: `${SITE_URL}/resources`, publisher: { "@id": PERSON_ID },
    mainEntity: { "@type": "ItemList", itemListElement: [...allResources, ...playbooks.map(book => ({ title: book.title, path: playbookPath(book) }))].map((resource, index) => ({ "@type": "ListItem", position: index + 1, name: resource.title, url: `${SITE_URL}${resource.path}` })) },
  });
  return (
    <main id="main" className="blog-doc resource-doc resource-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="resource-index__intro">
        <p className="blog-doc__label">Resources</p>
        <h1>Put the next step on paper.</h1>
        <p className="blog-doc__lede">Practical tools for breaking into tech sales and doing the work. Pick one thing you want to get better at.</p>
        <p className="resource-index__note">Five practical tools. Free to use. No email required.</p>
      </header>
      <PremiumCollection />
      <div className="free-library-heading"><p className="book-eyebrow">Open resources</p><h2>Start with something useful.</h2><p>Five practical tools. Free to use. No email required.</p></div>
      <ResourcesLibrary />
      <section className="resource-section" aria-labelledby="start-small">
        <h2 id="start-small">One useful tool at a time.</h2>
        <p>Choose the worksheet that fits your next interview, practice session, or workday. Keep the notes that help you, and come back when you need another.</p>
        <p><Link href="/blog/take-a-walk-with-me">Read the story behind the work →</Link></p>
      </section>
      <footer className="blog-footer"><p>&copy; 2026 Cristian Sanchez-Aguilera</p></footer>
    </main>
  );
}
