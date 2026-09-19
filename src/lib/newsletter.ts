export type NewsletterIssue = {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  date: string;
};

const ORIGIN_URL = "https://cristians-newsletter-00abb3.beehiiv.com";

export const newsletterConfig = {
  name: "Origin",
  publicationUrl: process.env.NEXT_PUBLIC_BEEHIIV_URL ?? ORIGIN_URL,
  embedUrl: process.env.NEXT_PUBLIC_BEEHIIV_EMBED ?? "",
  rssUrl: process.env.NEXT_PUBLIC_BEEHIIV_RSS ?? "",
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

export function parseRss(xml: string): NewsletterIssue[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match, index) => {
    const block = match[1];
    const title = tag(block, "title") || "Untitled issue";
    const url = tag(block, "link");
    const date = tag(block, "pubDate");
    const subtitle = tag(block, "description").replace(/<[^>]+>/g, "").slice(0, 180);
    return {
      id: tag(block, "guid") || url || String(index),
      title,
      subtitle,
      url,
      date: date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    };
  });
}

export async function fetchBeehiivIssues(): Promise<NewsletterIssue[]> {
  try {
    const publication = newsletterConfig.publicationUrl.replace(/\/$/, "");
    const rssUrl = newsletterConfig.rssUrl || (publication ? `${publication}/feed` : "");
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (apiKey && publicationId) {
      const response = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/posts?limit=8&status=confirmed&order_by=publish_date&direction=desc`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(700),
        },
      );
      if (response.ok) {
        const payload = (await response.json()) as {
          data?: Array<{ id: string; title: string; subtitle?: string; web_url?: string; slug?: string; publish_date?: number }>;
        };
        return (payload.data ?? []).map((post) => ({
          id: post.id,
          title: post.title,
          subtitle: post.subtitle,
          url: post.web_url || (publication ? `${publication}/p/${post.slug}` : "#"),
          date: post.publish_date
            ? new Date(post.publish_date * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "",
        }));
      }
    }

    if (!rssUrl) return [];

    const response = await fetch(rssUrl, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(700),
    });
    if (!response.ok) return [];
    return parseRss(await response.text()).slice(0, 8);
  } catch {
    return [];
  }
}
