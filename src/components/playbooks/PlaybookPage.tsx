import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, playbookPath, priceValue, type Playbook } from "@/lib/playbooks";
import { SITE_URL } from "@/lib/seo";
import { PreviewGallery } from "./PreviewGallery";
import { ProductView } from "./ProductView";
import { PurchaseControl } from "./PurchaseControl";

export function PlaybookPage({ book, canPurchase }: { book: Playbook; canPurchase: boolean }) {
  const price = formatPrice(book);
  const schema = {
    "@context": "https://schema.org", "@type": "Product", name: book.title,
    description: book.description, image: `${SITE_URL}${book.cover.src}`, url: `${SITE_URL}${playbookPath(book)}`,
    brand: { "@type": "Brand", name: "Northmark Press" }, category: "Digital playbook",
    // An unfinished product has no offer. Do not publish a price as an available purchase.
    ...(canPurchase ? { offers: { "@type": "Offer", price: priceValue(book), priceCurrency: book.price.currency.toUpperCase(), availability: "https://schema.org/InStock", url: `${SITE_URL}${playbookPath(book)}` } } : {}),
  };
  return <main id="main" className="book-page" style={{ "--book-accent": book.accent, "--book-accent-border": book.accentBorder || "#7197b3" } as CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <ProductView slug={book.slug} />
    <div className="book-breadcrumb"><Link href="/resources">← All resources</Link><span>Northmark Press <span aria-hidden="true">/</span> {book.collectionNumber}</span></div>
    <section className="book-hero" aria-labelledby="book-title">
      <figure className="book-hero__visual"><div className="book-hero__artwork"><Image {...book.cover} alt={book.cover.alt} sizes="(max-width: 767px) 100vw, 55vw" quality={92} preload /></div><figcaption>Digital edition <span aria-hidden="true">—</span> hardcover shown for presentation</figcaption></figure>
      <div className="book-hero__copy">
        <p className="book-eyebrow">Northmark Press / Digital Playbook</p>
        <h1 id="book-title">{book.title}</h1>
        <p className="book-subtitle">{book.subtitle}</p>
        <p className="book-description">{book.description}</p>
        <p className="book-price">{price}<span>{book.price.approved ? "One-time purchase" : "Proposed one-time price"}</span></p>
        <PurchaseControl slug={book.slug} price={price} enabled={canPurchase} />
        <p className="book-fine">{book.format} · {canPurchase ? "Digital edition; no physical book is included." : "Final price and release details to be confirmed."}</p>
        <div className="book-byline"><span>By {book.author.name}</span><span>{book.author.role}</span></div>
      </div>
    </section>
    <section className="book-section book-outcomes" aria-labelledby="outcomes-heading">
      <div className="book-section__heading"><p className="book-eyebrow">The preparation, made practical</p><h2 id="outcomes-heading">{book.outcomeHeading}</h2><p>{book.outcomeIntro}</p></div>
      <div className="book-outcomes__list">{book.outcomes.map((item, index) => <div key={item.title}><span className="book-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div>
    </section>
    <section id="contents" className="book-section book-contents" aria-labelledby="contents-heading">
      <div className="book-section__heading"><p className="book-eyebrow">{book.contentsEyebrow}</p><h2 id="contents-heading">Inside the playbook.</h2><p>{book.contentsNote}</p></div>
      <ol className="book-modules">{book.modules.map((item, index) => <li key={item.title}><span className="book-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
    </section>
    <PreviewGallery images={book.previews} />
    <section className="book-section book-author" aria-labelledby="author-heading">
      <div className="book-section__heading"><p className="book-eyebrow">A note from the author</p><h2 id="author-heading">Experience into practice.</h2>{book.author.image ? <Image src={book.author.image} width={144} height={144} alt={book.author.name} className="book-author__portrait" /> : null}<p className="book-author__name">{book.author.name}<span>{book.author.role}</span></p></div>
      <div className="book-author__copy">{book.author.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
    </section>
    <section className="book-final" aria-labelledby="purchase-heading"><p className="book-eyebrow">{book.title}</p><h2 id="purchase-heading">{book.closing.heading}</h2><p>{book.closing.copy}</p><p className="book-price">{price}<span>{book.price.approved ? "One-time purchase" : "Proposed one-time price"}</span></p><PurchaseControl slug={book.slug} price={price} enabled={canPurchase} /><p className="book-fine">{book.format} · {book.delivery}</p><Link className="book-free-link" href={book.freeResource.href}>{book.freeResource.label} <span aria-hidden="true">↗</span></Link></section>
    <footer className="book-footer"><Link href="/resources">← Back to resources</Link><p>© 2026 Cristian Sanchez <span aria-hidden="true">/</span> Northmark Press</p></footer>
  </main>;
}
