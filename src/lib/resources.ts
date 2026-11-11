import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const interviewScorecard = {
  title: "Interview Prep Scorecard",
  path: "/resources/interview-prep-scorecard",
  pdf: "/downloads/interview-prep-scorecard.pdf",
  html: "/downloads/interview-prep-scorecard.html",
  images: Array.from({ length: 4 }, (_, index) => ({ href: `/downloads/interview-prep-scorecard-page-${index + 1}.png`, label: `Page ${index + 1}` })),
  description: "A free SDR and BDR interview worksheet: research the role, practice truthful answers, score a mock interview, and choose what to improve next.",
};

export const dailyChecklist = {
  title: "SDR/BDR Daily Operating Checklist",
  path: "/resources/sdr-bdr-daily-checklist",
  pdf: "/downloads/sdr-bdr-daily-checklist.pdf",
  html: "/downloads/sdr-bdr-daily-checklist.html",
  images: Array.from({ length: 2 }, (_, index) => ({ href: `/downloads/sdr-bdr-daily-checklist-page-${index + 1}.png`, label: `Page ${index + 1}` })),
  description: "A free daily checklist for SDRs and BDRs: prioritize follow-ups, prepare relevant outreach, keep accurate records, and close the day with a clear next step.",
};

function practiceResource(slug: string, title: string, description: string, pages = 3) {
  return { title, description, path: `/resources/${slug}`, pdf: `/downloads/${slug}.pdf`, html: `/downloads/${slug}.html`,
    images: Array.from({ length: pages }, (_, index) => ({ href: `/downloads/${slug}-page-${index + 1}.png`, label: `Page ${index + 1}` })),
  };
}
export const tamWorksheet = practiceResource("tam-segmentation-worksheet", "TAM Segmentation Worksheet", "A free worksheet to define a market, record evidence and assumptions, estimate a range, and choose a small account segment to research.");
export const coldCallScorecard = practiceResource("cold-call-practice-scorecard", "Cold Call Practice Scorecard", "A free mock-call worksheet: prepare a fictional scenario, review observable behaviors, and retry one part of the conversation.");
export const coldEmailChecklist = practiceResource("cold-email-teardown-checklist", "Cold Email Teardown Checklist", "A free editing worksheet to check evidence, relevance, accuracy, and a clear next step before rewriting a fictional cold email.");
export const allResources = [interviewScorecard, dailyChecklist, tamWorksheet, coldCallScorecard, coldEmailChecklist];
export type Resource = (typeof allResources)[number];

export function resourceMetadata(title: string, description: string, path: string): Metadata {
  const image = `${path}/opengraph-image`;
  return {
    title: `${title} | Cristian Sanchez-Aguilera`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website", title, description, url: `${SITE_URL}${path}`,
      siteName: "Cristian Sanchez-Aguilera",
      images: [{ url: image, width: 1200, height: 630, alt: `${title}: practical tech sales tools` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
