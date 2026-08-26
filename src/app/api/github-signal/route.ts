import { NextResponse } from "next/server";

const githubUser = "Cristian0101";

type GithubEvent = {
  type: string;
  created_at: string;
  repo?: { name?: string };
};

const eventLabels: Record<string, string> = {
  PushEvent: "code pushed",
  CreateEvent: "public project created",
  PullRequestEvent: "pull request activity",
  IssuesEvent: "issue activity",
  ReleaseEvent: "public release",
  WatchEvent: "repository starred",
};

export async function GET() {
  try {
    const [eventsResponse, contributionsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUser}/events/public?per_page=30`, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "cristiansanchezaguilera.com" },
        next: { revalidate: 1800 },
      }),
      fetch(`https://github.com/users/${githubUser}/contributions`, {
        headers: { "User-Agent": "cristiansanchezaguilera.com" },
        next: { revalidate: 21600 },
      }),
    ]);

    const events = eventsResponse.ok ? await eventsResponse.json() as GithubEvent[] : [];
    const contributionsHtml = contributionsResponse.ok ? await contributionsResponse.text() : "";
    const contributionMatch = contributionsHtml.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
    const contributionCount = contributionMatch ? Number.parseInt(contributionMatch[1].replaceAll(",", ""), 10) : null;
    const latest = events[0];
    const repository = latest?.repo?.name?.split("/").pop();
    const action = latest ? (eventLabels[latest.type] ?? "public activity") : null;

    if (!latest && contributionCount === null) {
      return NextResponse.json({ error: "github signal unavailable" }, { status: 503 });
    }

    return NextResponse.json(
      {
        contributionCount,
        latestLabel: latest ? `${action}${repository ? ` · ${repository}` : ""}` : null,
        latestAt: latest?.created_at ?? null,
      },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json({ error: "github signal unavailable" }, { status: 503 });
  }
}
