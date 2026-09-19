import { posts } from "@/lib/posts";
import type { NewsletterIssue } from "@/lib/newsletter";

export type WritingKind = "newsletter" | "essay" | "notes";

export type Writing = {
  id: string;
  kind: WritingKind;
  title: string;
  subtitle: string;
  date: string;
  href: string;
  external?: boolean;
  source: string;
  sortDate: string;
};

export const originIssue: Writing = {
  id: "origin-mk1-introductions",
  kind: "newsletter",
  title: "Origin Mk1: Intro / Product",
  subtitle: "Welcome to Origin — notes on founder life, tech sales, systems, and building.",
  date: "Sep 13, 2026",
  href: "https://cristians-newsletter-00abb3.beehiiv.com/p/origin-mk1-introductions",
  external: true,
  source: "Origin",
  sortDate: "2026-09-13",
};

const nativeWritings: Writing[] = [
  ...posts.map((post) => ({
    id: post.slug,
    kind: "essay" as const,
    title: post.title,
    subtitle: post.subtitle,
    date: post.date,
    href: `/blog/${post.slug}`,
    source: "Essay",
    sortDate: parseLooseDate(post.date),
  })),
  {
    id: "rules",
    kind: "notes",
    title: "29 Things I Know So Far",
    subtitle: "Principles collected from doing, failing, and paying attention.",
    date: "Living list",
    href: "/rules",
    source: "Notes",
    sortDate: "2026-01-01",
  },
];

function parseLooseDate(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  const monthYear = value.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = new Date(`${monthYear[1]} 1, ${monthYear[2]}`).getMonth() + 1;
    return `${monthYear[2]}-${String(month).padStart(2, "0")}-01`;
  }
  return "1970-01-01";
}

function fromIssue(issue: NewsletterIssue): Writing {
  return {
    id: issue.id,
    kind: "newsletter",
    title: issue.title,
    subtitle: issue.subtitle ?? "A weekly Origin issue.",
    date: issue.date,
    href: issue.url,
    external: true,
    source: "Origin",
    sortDate: parseLooseDate(issue.date),
  };
}

export function mergeWritings(issues: NewsletterIssue[]): Writing[] {
  const newsletters = issues.length ? issues.map(fromIssue) : [originIssue];
  const seen = new Set<string>();
  const merged: Writing[] = [];

  for (const item of [...newsletters, originIssue, ...nativeWritings]) {
    const key = item.href.replace(/\/$/, "");
    if (seen.has(key) || seen.has(item.id)) continue;
    seen.add(key);
    seen.add(item.id);
    merged.push(item);
  }

  return merged.sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}
