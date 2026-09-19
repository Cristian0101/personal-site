"use client";

import { CaretLeft, CaretRight, type Icon } from "@phosphor-icons/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type IntoFact = {
  title: string;
  text: string;
  Icon: Icon;
};

export type IntoGroup = {
  title: string;
  intro: string;
  facts: IntoFact[];
};

export function IntoDeck({ groups }: { groups: IntoGroup[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLElement | null)[]>([]);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  indexRef.current = index;
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startLeft: number;
    dragging: boolean;
  } | null>(null);

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(groups.length - 1, next));
    setIndex(clamped);
    const slide = slidesRef.current[clamped];
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      return;
    }
    if (track) {
      track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    }
  }, [groups.length]);

  const syncHeight = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (!width) return;

    const progress = track.scrollLeft / width;
    const from = Math.max(0, Math.min(groups.length - 1, Math.floor(progress)));
    const to = Math.max(0, Math.min(groups.length - 1, from + 1));
    const fromSlide = slidesRef.current[from];
    const toSlide = slidesRef.current[to];
    if (!fromSlide || !toSlide) return;

    const t = progress - from;
    track.style.height = `${fromSlide.offsetHeight * (1 - t) + toSlide.offsetHeight * t}px`;
  }, [groups.length]);

  useLayoutEffect(() => {
    syncHeight();
  }, [index, syncHeight]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const syncIndex = () => {
      const width = track.clientWidth;
      if (!width) return;
      const next = Math.round(track.scrollLeft / width);
      setIndex((current) => (current === next ? current : Math.max(0, Math.min(groups.length - 1, next))));
    };

    const onScroll = () => {
      syncIndex();
      syncHeight();
    };

    const onResize = () => {
      track.scrollTo({ left: indexRef.current * track.clientWidth, behavior: "instant" });
      syncHeight();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(syncHeight);
    slidesRef.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    syncHeight();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [groups.length, syncHeight]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if ((event.target as HTMLElement).closest("a, button")) return;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startLeft: track.scrollLeft,
        dragging: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const delta = event.clientX - drag.startX;
      if (!drag.dragging && Math.abs(delta) > 8) {
        drag.dragging = true;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      }
      if (drag.dragging) {
        track.scrollLeft = drag.startLeft - delta;
      }
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (drag.dragging) {
        const width = track.clientWidth;
        const next = Math.round(track.scrollLeft / width);
        track.scrollTo({ left: next * width, behavior: "smooth" });
      }
      track.classList.remove("is-dragging");
      dragRef.current = null;
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div
      className="into-deck"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="into-title"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(index - 1);
        }
      }}
    >
      <div className="into-deck__index" role="tablist" aria-label="Notebook groups">
        {groups.map((group, groupIndex) => (
          <button
            key={group.title}
            type="button"
            role="tab"
            id={`into-tab-${groupIndex}`}
            aria-selected={index === groupIndex}
            aria-controls={`into-panel-${groupIndex}`}
            tabIndex={index === groupIndex ? 0 : -1}
            onClick={() => goTo(groupIndex)}
          >
            {group.title}
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        className="into-deck__track"
        tabIndex={0}
        aria-label="Swipe or use arrow keys to move between notebook groups"
      >
        {groups.map((group, groupIndex) => (
          <article
            key={group.title}
            ref={(node) => {
              slidesRef.current[groupIndex] = node;
            }}
            className="into-group"
            id={`into-panel-${groupIndex}`}
            role="tabpanel"
            aria-labelledby={`into-tab-${groupIndex}`}
            aria-hidden={index !== groupIndex}
          >
            <h3>{group.title}</h3>
            <p className="into-group__intro">{group.intro}</p>
            {group.facts.map((fact) => {
              const FactIcon = fact.Icon;
              return (
                <article className="fact-row" key={fact.title}>
                  <div className="fact-row__head">
                    <FactIcon className="icon" size={15} weight="regular" aria-hidden="true" />
                    <strong>{fact.title}</strong>
                  </div>
                  <p>{fact.text}</p>
                </article>
              );
            })}
          </article>
        ))}
      </div>

      <div className="into-deck__nav">
        <button
          type="button"
          className="into-deck__step"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous notebook group"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <div className="into-deck__dots" aria-hidden="true">
          {groups.map((group, groupIndex) => (
            <button
              key={group.title}
              type="button"
              className={index === groupIndex ? "is-active" : ""}
              onClick={() => goTo(groupIndex)}
              tabIndex={-1}
            />
          ))}
        </div>
        <span className="into-deck__count">
          {String(index + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="into-deck__step"
          onClick={() => goTo(index + 1)}
          disabled={index === groups.length - 1}
          aria-label="Next notebook group"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
