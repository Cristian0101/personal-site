export type PrimarySection = {
  href: "/" | "/businesses" | "/blog" | "/resources";
  label: string;
  match: (path: string) => boolean;
};

export const primarySections: PrimarySection[] = [
  { href: "/", label: "Home", match: (path) => path === "/" },
  { href: "/businesses", label: "Businesses", match: (path) => path.startsWith("/businesses") },
  {
    href: "/blog",
    label: "Writing",
    match: (path) => path.startsWith("/blog") || path.startsWith("/rules"),
  },
  { href: "/resources", label: "Resources", match: (path) => path.startsWith("/resources") },
];

export function sectionIndex(pathname: string): number {
  const index = primarySections.findIndex((section) => section.match(pathname));
  return index === -1 ? 0 : index;
}

/** True only on the magazine roots — not nested essay/rules pages. */
export function isSectionRoot(pathname: string): boolean {
  return pathname === "/" || pathname === "/businesses" || pathname === "/blog" || pathname === "/resources";
}

export function sectionHrefAt(index: number): PrimarySection["href"] | null {
  return primarySections[index]?.href ?? null;
}

/** Stable key for AnimatePresence: roots get their own pane; nested writing shares one. */
export function transitionKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/businesses")) return "businesses";
  if (pathname.startsWith("/blog") || pathname.startsWith("/rules")) {
    return isSectionRoot(pathname) ? "writing" : `writing:${pathname}`;
  }
  if (pathname.startsWith("/resources")) return pathname === "/resources" ? "resources" : `resources:${pathname}`;
  return pathname;
}

export function isWritingNested(pathname: string): boolean {
  return (
    (pathname.startsWith("/blog") && pathname !== "/blog") || pathname.startsWith("/rules")
  );
}
