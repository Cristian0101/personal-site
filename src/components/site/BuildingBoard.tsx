"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { businesses, buildingFilters, type BuildingFilter, type Business } from "@/lib/businesses";

function CompanyRow({ business }: { business: Business }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className={`company-row company-row--${business.slug}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <div className="company-row__lead">
          <div className="company-row__logo">
            <Image src={business.logo} alt="" width={84} height={84} quality={92} />
          </div>
          <div className="company-row__main">
            <strong>{business.name}</strong>
            <span>{business.description}</span>
          </div>
        </div>
        <span className="company-row__state">{business.stateLabel ?? business.state}</span>
      </button>

      {open ? (
        <div className="company-detail">
          <p>{business.overview}</p>
          <div className="company-detail__meta">
            <div>
              <span>Who it is for</span>
              <strong>{business.audience}</strong>
            </div>
            <div>
              <span>Core offer</span>
              <strong>
                {business.offer} · {business.price}
              </strong>
            </div>
            <div>
              <span>Outcome</span>
              <strong>{business.outcome}</strong>
            </div>
          </div>
          <div className="company-detail__features" aria-label={`${business.name} capabilities`}>
            {business.features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
          {business.href ? (
            <a className="company-detail__link" href={business.href} target="_blank" rel="noreferrer">
              {business.linkLabel ?? `Visit ${business.name}`} <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="company-row__state">{business.footerLabel ?? "In active development"}</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function BuildingBoard() {
  const [filter, setFilter] = useState<BuildingFilter>("all");
  const tablistRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ x: number; width: number } | null>(null);
  const [inkLive, setInkLive] = useState(false);
  const visible = useMemo(
    () => (filter === "all" ? businesses : businesses.filter((business) => business.lane === filter)),
    [filter],
  );
  const status = {
    all: `Showing all ${visible.length} companies`,
    saas: `Showing ${visible.length} SaaS companies`,
    membership: `Showing ${visible.length} memberships`,
    opensource: `Showing ${visible.length} open source ${visible.length === 1 ? "project" : "projects"}`,
    service: `Showing ${visible.length} ${visible.length === 1 ? "service" : "services"}`,
  }[filter];

  useLayoutEffect(() => {
    const list = tablistRef.current;
    const tab = document.getElementById(`building-filter-${filter}`);
    if (!list || !tab) return;
    const listBox = list.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    setInk({
      x: tabBox.left - listBox.left + 10,
      width: Math.max(8, tabBox.width - 20),
    });
  }, [filter]);

  useEffect(() => {
    if (ink) setInkLive(true);
  }, [ink]);

  useEffect(() => {
    const onResize = () => {
      const list = tablistRef.current;
      const tab = document.getElementById(`building-filter-${filter}`);
      if (!list || !tab) return;
      const listBox = list.getBoundingClientRect();
      const tabBox = tab.getBoundingClientRect();
      setInk({
        x: tabBox.left - listBox.left + 10,
        width: Math.max(8, tabBox.width - 20),
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [filter]);

  return (
    <div className="building-board">
      <div ref={tablistRef} className="into-deck__index" role="tablist" aria-label="Filter companies">
        {buildingFilters.map((item) => {
          const count = item.id === "all" ? businesses.length : businesses.filter((business) => business.lane === item.id).length;
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="building-list"
              id={`building-filter-${item.id}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              <span className="building-count">{count}</span>
            </button>
          );
        })}
        {ink ? (
          <span
            className={`building-ink${inkLive ? " is-live" : ""}`}
            style={{ transform: `translateX(${ink.x}px)`, width: ink.width }}
          />
        ) : null}
      </div>
      <p className="building-status">{status}</p>
      <div className="building-stage" id="building-list" role="tabpanel" aria-labelledby={`building-filter-${filter}`}>
        <div className="company-list" key={filter}>
          {visible.map((business, index) => (
            <div className="company-item" key={business.slug} style={{ animationDelay: `${Math.min(index, 8) * 28}ms` }}>
              <CompanyRow business={business} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
