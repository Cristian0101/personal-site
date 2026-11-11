"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { interviewScorecard, dailyChecklist, tamWorksheet, coldCallScorecard, coldEmailChecklist } from "@/lib/resources";

const cards = [
  { resource: interviewScorecard, category: "interview", label: "Interview practice", copy: "Turn “I think I’m ready” into notes you can use. Research one role, practice your answers out loud, then choose one thing to improve.", action: "Get the scorecard" },
  { resource: dailyChecklist, category: "workday", label: "Your working day", copy: "Give your day a useful order. Start with promises and priorities, prepare relevant outreach, then leave clean notes for the next step.", action: "Get the daily checklist" },
  { resource: tamWorksheet, category: "workday", label: "Account planning", copy: "Define your market before you build a list. Keep the evidence visible, estimate a range, and choose a segment you can explain.", action: "Get the TAM worksheet" },
  { resource: coldCallScorecard, category: "outreach", label: "Conversation practice", copy: "Rehearse a fictional call with a partner. Review what you actually said and heard, then retry one part with a clear purpose.", action: "Get the call scorecard" },
  { resource: coldEmailChecklist, category: "outreach", label: "Message review", copy: "Look at an email from the reader’s side. Check the evidence and the ask, study a fictional edit, then rewrite your own practice draft.", action: "Get the email checklist" },
] as const;

const filters = [
  { id: "all", label: "All resources" },
  { id: "interview", label: "Interview prep" },
  { id: "workday", label: "Plan your day" },
  { id: "outreach", label: "Practice outreach" },
] as const;
type Filter = (typeof filters)[number]["id"];

export function ResourcesLibrary() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleCards = cards.filter(card => filter === "all" || card.category === filter);

  return (
    <section className="resource-library" aria-label="Free resource library">
      <div className="resource-library__toolbar">
        <div className="resource-filters" role="group" aria-label="Filter resources">
          {filters.map(item => (
            <button key={item.id} type="button" aria-pressed={filter === item.id} aria-controls="resource-grid" onClick={() => setFilter(item.id)}>
              {item.label}<span aria-hidden="true">{item.id === "all" ? cards.length : cards.filter(card => card.category === item.id).length}</span>
            </button>
          ))}
        </div>
        <p className="resource-library__count" role="status" aria-live="polite" aria-atomic="true">{visibleCards.length} {visibleCards.length === 1 ? "resource" : "resources"}</p>
      </div>
      <div id="resource-grid" className="resource-grid">
        {visibleCards.map(({ resource, category, label, copy, action }) => {
          const slug = resource.path.split("/").pop();
          return (
            <article className="resource-card" data-category={category} aria-labelledby={`${slug}-title`} key={resource.path}>
              <div className="resource-card__visual" aria-hidden="true">
                <span className="resource-card__free">Free resource</span>
                <div className="resource-card__paper">
                  <Image src={`/resources/${slug}-preview.png`} alt="" width={1632} height={2112} sizes="(max-width: 620px) 200px, (max-width: 1000px) 220px, 240px" loading="lazy" />
                </div>
                <span className="resource-card__pages">{resource.images.length}-page {slug?.includes("checklist") ? "checklist" : "worksheet"}</span>
              </div>
              <div className="resource-card__body">
                <p className="resource-card__category">{label}</p>
                <h2 id={`${slug}-title`}>{resource.title}</h2>
                <p className="resource-card__description">{copy}</p>
                <div className="resource-card__footer">
                  <p className="resource-card__formats">PDF · Image pages · Accessible HTML</p>
                  <Link className="resource-card__action" href={resource.path}>{action}<span aria-hidden="true">↗</span></Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
