export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "from-bdr-to-builder",
    title: "From BDR to Builder",
    date: "February 2026",
    description: "How 1.5 years of cold calls turned into building a SaaS product.",
    content: `Coming soon.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
