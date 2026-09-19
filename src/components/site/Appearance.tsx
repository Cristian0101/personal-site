"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

export const typefaces = [
  { id: "inter", label: "Inter", specimen: "Ag" },
  { id: "serif", label: "Serif", specimen: "Ag" },
  { id: "sans", label: "Sans", specimen: "Ag" },
  { id: "fraunces", label: "Fraunces", specimen: "Ag" },
  { id: "plex", label: "Plex", specimen: "Ag" },
] as const;

export const sizes = [
  { id: "compact", label: "S" },
  { id: "regular", label: "M" },
  { id: "large", label: "L" },
] as const;

export type TypefaceId = (typeof typefaces)[number]["id"];
export type SizeId = (typeof sizes)[number]["id"];

type AppearanceState = {
  font: TypefaceId;
  size: SizeId;
  setFont: (font: TypefaceId) => void;
  setSize: (size: SizeId) => void;
};

const AppearanceContext = createContext<AppearanceState | null>(null);

const subscribe = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

export function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error("useAppearance must be used within AppearanceProvider");
  return value;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [font, setFontState] = useState<TypefaceId>("serif");
  const [size, setSizeState] = useState<SizeId>("regular");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("csa-appearance") ?? "{}") as Partial<AppearanceState>;
      if (saved.font && typefaces.some((item) => item.id === saved.font)) setFontState(saved.font);
      if (saved.size && sizes.some((item) => item.id === saved.size)) setSizeState(saved.size);
    } catch {
      /* keep defaults */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.font = font;
    root.dataset.size = size;
    localStorage.setItem("csa-appearance", JSON.stringify({ font, size }));
  }, [font, size]);

  return (
    <AppearanceContext.Provider
      value={{
        font,
        size,
        setFont: setFontState,
        setSize: setSizeState,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function Customize() {
  const { resolvedTheme, setTheme } = useTheme();
  const { font, size, setFont, setSize } = useAppearance();
  const mounted = useSyncExternalStore(subscribe, clientTrue, serverFalse);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = mounted && resolvedTheme === "dark";
  const fontIndex = typefaces.findIndex((item) => item.id === font);
  const sizeIndex = sizes.findIndex((item) => item.id === size);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={`customize${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="customize__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="customize__mark">Aa</span>
        <span>Customize</span>
      </button>

      <div className="customize__panel" role="dialog" aria-label="Appearance">
        <p className="customize__kicker">Appearance</p>

        <div className="customize__block">
          <div className="customize__row">
            <span>Theme</span>
            <small>{isDark ? "Dark" : "Light"}</small>
          </div>
          <button
            type="button"
            className={`theme-slider${isDark ? " is-dark" : ""}`}
            aria-label="Toggle light and dark mode"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <i className="theme-slider__thumb" aria-hidden="true" />
            <span className={!isDark ? "is-active" : ""} aria-hidden="true">
              <Sun size={15} weight={!isDark ? "fill" : "regular"} />
            </span>
            <span className={isDark ? "is-active" : ""} aria-hidden="true">
              <Moon size={15} weight={isDark ? "fill" : "regular"} />
            </span>
          </button>
        </div>

        <div className="customize__block">
          <div className="customize__row">
            <span>Typeface</span>
            <small>{typefaces[fontIndex]?.label}</small>
          </div>
          <div className="font-slider" role="tablist" aria-label="Typeface">
            <i className="font-slider__thumb" style={{ transform: `translateX(${fontIndex * 100}%)` }} />
            {typefaces.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={font === item.id}
                className={font === item.id ? "is-active" : ""}
                data-font={item.id}
                onClick={() => setFont(item.id)}
              >
                <b>{item.specimen}</b>
                <small>{item.label}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="customize__block">
          <div className="customize__row">
            <span>Size</span>
            <small>{sizes[sizeIndex]?.label}</small>
          </div>
          <div className="size-slider" role="tablist" aria-label="Type size">
            <i className="size-slider__thumb" style={{ transform: `translateX(${sizeIndex * 100}%)` }} />
            {sizes.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={size === item.id}
                className={size === item.id ? "is-active" : ""}
                onClick={() => setSize(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
