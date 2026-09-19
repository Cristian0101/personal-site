"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  isSectionRoot,
  isWritingNested,
  sectionHrefAt,
  sectionIndex,
  transitionKey,
} from "@/lib/nav";

const SWIPE_MIN = 72;
const SWIPE_RATIO = 1.4;
const MOVE_MS = 280;
const FADE_MS = 200;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

type Direction = 1 | -1 | 0;

type Ghost = {
  id: number;
  key: string;
  dir: Direction;
  offset: number;
};

function swipeBlocked(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return true;
  return Boolean(
    el.closest(
      "input, textarea, select, [contenteditable='true'], .into-deck, .into-deck__index, .building-board, .customize, .company-row, .company-detail",
    ),
  );
}

function keyIndex(key: string) {
  if (key === "home") return 0;
  if (key === "businesses") return 1;
  if (key === "writing" || key.startsWith("writing:")) return 2;
  return 0;
}

function snapshotPane(pane: HTMLElement) {
  const wrap = document.createElement("div");
  wrap.className = "page-pane-copy";
  for (const child of Array.from(pane.childNodes)) {
    wrap.appendChild(child.cloneNode(true));
  }
  return wrap;
}

function restPane(el: HTMLElement | null) {
  if (!el) return;
  for (const animation of el.getAnimations()) animation.cancel();
  el.style.opacity = "";
  el.style.transform = "";
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const index = sectionIndex(pathname);
  const liveRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef<HTMLDivElement>(null);
  const ghostHostRef = useRef<HTMLDivElement>(null);
  const pendingSnapRef = useRef<HTMLElement | null>(null);
  const animatingRef = useRef(false);
  const swipeCoolRef = useRef(0);
  const navIdRef = useRef(0);

  const [trackedPath, setTrackedPath] = useState(pathname);
  const [ghost, setGhost] = useState<Ghost | null>(null);

  if (pathname !== trackedPath) {
    const prevPath = trackedPath;
    const prevKey = transitionKey(prevPath);
    const prevI = keyIndex(prevKey);
    const nextI = keyIndex(transitionKey(pathname));
    const nestedFade =
      prevI === nextI && (isWritingNested(pathname) || isWritingNested(prevPath));

    let dir: Direction = 0;
    if (!reduceMotion && !nestedFade) {
      if (nextI > prevI) dir = 1;
      else if (nextI < prevI) dir = -1;
    }

    const jump = Math.abs(nextI - prevI);
    const offset = dir === 0 ? 0 : jump > 1 ? 40 : 28;

    setTrackedPath(pathname);

    if (reduceMotion) {
      pendingSnapRef.current = null;
      animatingRef.current = false;
      setGhost(null);
    } else {
      const live = liveRef.current;
      if (live) pendingSnapRef.current = snapshotPane(live);
      navIdRef.current += 1;
      animatingRef.current = true;
      setGhost({ id: navIdRef.current, key: prevKey, dir, offset });
    }
  }

  const finish = useCallback(() => {
    pendingSnapRef.current = null;
    animatingRef.current = false;
    restPane(liveRef.current);
    setGhost(null);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useLayoutEffect(() => {
    if (!ghost) return;
    const live = liveRef.current;
    const leaving = leavingRef.current;
    const host = ghostHostRef.current;
    const snap = pendingSnapRef.current;
    if (host && snap) {
      host.replaceChildren(snap);
      pendingSnapRef.current = null;
    }
    if (!live) {
      finish();
      return;
    }

    restPane(live);
    restPane(leaving);

    const duration = ghost.dir === 0 ? FADE_MS : MOVE_MS;
    const x = ghost.dir * ghost.offset;
    const fadeOnly = ghost.dir === 0;

    const liveAnim = live.animate(
      [
        {
          opacity: fadeOnly ? 0.001 : 1,
          transform: `translate3d(${x}px, 0, 0)`,
        },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      { duration, easing: EASE, fill: "forwards" },
    );

    const leaveAnim = leaving?.animate(
      [
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
        {
          opacity: 0,
          transform: `translate3d(${-Math.round(x * 0.7)}px, 0, 0)`,
        },
      ],
      { duration, easing: EASE, fill: "forwards" },
    );

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      liveAnim.finish();
      leaveAnim?.finish();
      finish();
    };

    liveAnim.onfinish = settle;
    const watchdog = window.setTimeout(settle, duration + 50);

    return () => {
      window.clearTimeout(watchdog);
      liveAnim.cancel();
      leaveAnim?.cancel();
    };
  }, [finish, ghost]);

  const goRelative = useCallback(
    (delta: 1 | -1) => {
      if (reduceMotion || !isSectionRoot(pathname) || animatingRef.current) return;
      const next = sectionHrefAt(index + delta);
      if (!next) return;
      swipeCoolRef.current = performance.now();
      router.push(next);
    },
    [index, pathname, reduceMotion, router],
  );

  const pointerRef = useRef<{
    id: number;
    x: number;
    y: number;
    t: number;
    locked: boolean | null;
  } | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !isSectionRoot(pathname)) return;
    if (event.pointerType === "mouse") return;
    if (swipeBlocked(event.target)) return;
    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      t: performance.now(),
      locked: null,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current;
    if (!start || start.id !== event.pointerId || start.locked === false) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (start.locked === null) {
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      start.locked = Math.abs(dx) > Math.abs(dy) * SWIPE_RATIO;
      if (!start.locked) return;
    }
    event.preventDefault();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== event.pointerId || start.locked !== true) return;

    const dx = event.clientX - start.x;
    const dt = Math.max(1, performance.now() - start.t);
    const velocity = Math.abs(dx) / dt;
    const flick = velocity > 0.5 && Math.abs(dx) > 32;
    if (Math.abs(dx) < SWIPE_MIN && !flick) return;
    if (dx < 0) goRelative(1);
    else goRelative(-1);
  };

  useEffect(() => {
    if (reduceMotion || !isSectionRoot(pathname)) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) < 48) return;
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY) * SWIPE_RATIO) return;
      if (swipeBlocked(event.target)) return;
      if (performance.now() - swipeCoolRef.current < 380) return;
      event.preventDefault();
      if (event.deltaX > 0) goRelative(1);
      else goRelative(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goRelative, pathname, reduceMotion]);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/businesses");
    router.prefetch("/blog");
  }, [router]);

  return (
    <div
      className="page-stage"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerRef.current = null;
      }}
    >
      {ghost ? (
        <div
          ref={leavingRef}
          className="page-pane is-leaving"
          data-pane={ghost.key}
          aria-hidden="true"
        >
          <div ref={ghostHostRef} />
        </div>
      ) : null}
      <div ref={liveRef} className="page-pane" data-pane={transitionKey(pathname)}>
        {children}
      </div>
    </div>
  );
}
