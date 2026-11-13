import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, playbookPath, playbooks, type Playbook } from "@/lib/playbooks";

function PlaybookCard({ book, priority }: { book: Playbook; priority: boolean }) {
  return <article className="premium-listing" style={{ "--book-accent": book.accent } as CSSProperties}>
    <Link href={playbookPath(book)} className="premium-listing__image" aria-label={`Explore ${book.title}`}>
      <Image {...book.cover} alt={book.cover.alt} sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" quality={92} loading={priority ? "eager" : "lazy"} />
    </Link>
    <div className="premium-listing__copy">
      <p className="book-eyebrow">Digital playbook <span aria-hidden="true">/</span> {book.status === "preparation" ? "In preparation" : "Northmark Press"}</p>
      <h3><Link href={playbookPath(book)}>{book.title}</Link></h3>
      <p>{book.shortDescription}</p>
      <div className="premium-listing__bottom"><span>{formatPrice(book)} <small>{book.price.approved ? "one-time" : "proposed · one-time"}</small></span><Link href={playbookPath(book)}>Explore playbook <span aria-hidden="true">↗</span></Link></div>
    </div>
  </article>;
}

export function PremiumCollection() {
  return (
    <section className="premium-collection" aria-labelledby="premium-heading">
      <div className="premium-collection__intro">
        <div><p className="book-eyebrow">Northmark Press</p><h2 id="premium-heading">Premium Playbooks</h2></div>
        <p>Practical guides for breaking into tech sales, mastering outbound, and building a stronger career.</p>
      </div>
      <div className="premium-grid">{playbooks.map((book, index) => <PlaybookCard key={book.slug} book={book} priority={index === 0} />)}</div>
    </section>
  );
}
