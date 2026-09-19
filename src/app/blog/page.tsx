import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/site/Newsletter";
import { fetchBeehiivIssues, newsletterConfig } from "@/lib/newsletter";
import { mergeWritings } from "@/lib/writings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Writing — Origin",
  description:
    "Origin: notes on founder life, tech sales, systems, and building. Essays, field notes, and the weekly newsletter.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Writing — Origin",
    description: "Notes on founder life, tech sales, systems, and building.",
    images: [{ url: "/origin/banner.jpg", width: 1024, height: 576 }],
  },
};

export default async function BlogPage() {
  const issues = await fetchBeehiivIssues();
  const writings = mergeWritings(issues);
  const archiveUrl = newsletterConfig.publicationUrl || "https://cristians-newsletter-00abb3.beehiiv.com";

  return (
    <main id="main" className="blog-doc writing-doc">
      <p className="blog-doc__label">Writing</p>
      <h1>Origin</h1>
      <p className="blog-doc__lede">
        Notes on founder life, tech sales, systems, and building. The weekly letter lives on Beehiiv; essays stay here.
      </p>

      <figure className="origin-banner">
        <Image
          src="/origin/banner.jpg"
          alt="Origin — notes on founder life, tech sales, systems, and building"
          width={1024}
          height={576}
          priority
        />
      </figure>

      <Newsletter />

      <section className="writing-index" aria-labelledby="writing-index-title">
        <div className="writing-index__head">
          <h2 id="writing-index-title">Recent</h2>
          <a href={archiveUrl} target="_blank" rel="noreferrer">
            Origin archive ↗
          </a>
        </div>

        {writings.map((item) => {
          const className = "writing-card";
          const body = (
            <>
              <span className="writing-card__kind">{item.source}</span>
              <span className="writing-card__copy">
                <span className="writing-card__title">
                  {item.title}
                  {item.external ? <span className="writing-card__out">↗</span> : null}
                </span>
                <span className="writing-card__sub">{item.subtitle}</span>
              </span>
              <span className="writing-card__date">{item.date}</span>
            </>
          );

          return item.external ? (
            <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className={className}>
              {body}
            </a>
          ) : (
            <Link key={item.id} href={item.href} className={className}>
              {body}
            </Link>
          );
        })}
      </section>

      <footer className="blog-footer">
        <p>&copy; 2026 Cristian Sanchez-Aguilera</p>
      </footer>
    </main>
  );
}
