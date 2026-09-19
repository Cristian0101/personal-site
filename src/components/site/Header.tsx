"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Customize } from "@/components/site/Appearance";
import { primarySections } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const [ink, setInk] = useState<{ x: number; width: number } | null>(null);
  const [inkLive, setInkLive] = useState(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>("a.is-current");
    if (!nav || !current) return;
    setInk({
      x: current.offsetLeft + 10,
      width: Math.max(8, current.offsetWidth - 20),
    });
  }, [pathname]);

  useEffect(() => {
    if (ink) setInkLive(true);
  }, [ink]);

  useEffect(() => {
    for (const link of primarySections) router.prefetch(link.href);
  }, [router]);

  useEffect(() => {
    const onResize = () => {
      const nav = navRef.current;
      const current = nav?.querySelector<HTMLElement>("a.is-current");
      if (!nav || !current) return;
      setInk({
        x: current.offsetLeft + 10,
        width: Math.max(8, current.offsetWidth - 20),
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  return (
    <header className="masthead">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="masthead__inner">
        <Link href="/" className="masthead__mark">
          Cristian
        </Link>
        <nav ref={navRef} className="masthead__nav" aria-label="Primary">
          {primarySections.map((link) => {
            const current = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                scroll={false}
                className={current ? "is-current" : undefined}
                aria-current={current ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          {ink ? (
            <span
              className={`masthead-ink${inkLive ? " is-live" : ""}`}
              style={{ transform: `translateX(${ink.x}px)`, width: ink.width }}
            />
          ) : null}
        </nav>
        <Customize />
      </div>
    </header>
  );
}
