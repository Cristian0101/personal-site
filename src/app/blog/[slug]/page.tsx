import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import BlogPostContent from "./BlogPostContent";
import type { Metadata } from "next";
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found", robots: { index: false, follow: false } };

  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: `${post.title} - Cristian Sanchez-Aguilera`,
    description: post.subtitle,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: "article",
      url: `${SITE_URL}${canonicalPath}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const pathname = `/blog/${post.slug}`;
  const schema = graphSchema(
    personSchema,
    {
      "@type": "Article",
      "@id": `${SITE_URL}${pathname}#article`,
      headline: post.title,
      description: post.subtitle,
      url: `${SITE_URL}${pathname}`,
      mainEntityOfPage: `${SITE_URL}${pathname}`,
      publisher: { "@id": PERSON_ID },
    },
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BlogPostContent post={post} />
    </>
  );
}
