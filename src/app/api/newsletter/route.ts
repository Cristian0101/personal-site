import { NextResponse } from "next/server";
import { fetchBeehiivIssues, newsletterConfig } from "@/lib/newsletter";

export async function GET() {
  try {
    const issues = await fetchBeehiivIssues();
    return NextResponse.json({
      issues,
      publicationUrl: newsletterConfig.publicationUrl,
      embedUrl: newsletterConfig.embedUrl,
    });
  } catch {
    return NextResponse.json({ issues: [], publicationUrl: newsletterConfig.publicationUrl, embedUrl: newsletterConfig.embedUrl });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (apiKey && publicationId) {
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "personal-site",
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ error: "Beehiiv could not add that address.", detail }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  }

  if (newsletterConfig.publicationUrl) {
    return NextResponse.json({
      ok: true,
      redirect: `${newsletterConfig.publicationUrl.replace(/\/$/, "")}/subscribe?email=${encodeURIComponent(email)}`,
    });
  }

  return NextResponse.json({
    error: "Add your Beehiiv publication URL or API key to start collecting subscribers.",
  }, { status: 503 });
}
