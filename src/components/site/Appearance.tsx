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

export const widths = [
  { id: "narrow", label: "Narrow" },
  { id: "wide", label: "Wide" },
  { id: "max", label: "Max" },
] as const;

export type TypefaceId = (typeof typefaces)[number]["id"];
export type SizeId = (typeof sizes)[number]["id"];
export type WidthId = (typeof widths)[number]["id"];

type AppearanceState = {
  font: TypefaceId;
  size: SizeId;
  width: WidthId;
  setFont: (font: TypefaceId) => void;
  setSize: (size: SizeId) => void;
  setWidth: (width: WidthId) => void;
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
  const [width, setWidthState] = useState<WidthId>("narrow");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("csa-appearance") ?? "{}") as Partial<AppearanceState>;
      if (saved.font && typefaces.some((item) => item.id === saved.font)) setFontState(saved.font);
      if (saved.size && sizes.some((item) => item.id === saved.size)) setSizeState(saved.size);
      if (saved.width && widths.some((item) => item.id === saved.width)) setWidthState(saved.width);
    } catch {
      /* keep defaults */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.font = font;
    root.dataset.size = size;
    root.dataset.width = width;
    localStorage.setItem("csa-appearance", JSON.stringify({ font, size, width }));
  }, [font, size, width]);

  return (
    <AppearanceContext.Provider
      value={{
        font,
        size,
        width,
        setFont: setFontState,
        setSize: setSizeState,
        setWidth: setWidthState,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function Customize() {
  const { resolvedTheme, setTheme } = useTheme();
  const { font, size, width, setFont, setSize, setWidth } = useAppearance();
  const mounted = useSyncExternalStore(subscribe, clientTrue, serverFalse);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = mounted && resolvedTheme === "dark";
  const fontIndex = typefaces.findIndex((item) => item.id === font);
  const sizeIndex = sizes.findIndex((item) => item.id === size);
  const widthIndex = widths.findIndex((item) => item.id === width);

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

        <div className="customize__block">
          <div className="customize__row">
            <span>Width</span>
            <small>{widths[widthIndex]?.label}</small>
          </div>
          <div className="width-slider" role="tablist" aria-label="Layout width">
            <i className="width-slider__thumb" style={{ transform: `translateX(${widthIndex * 100}%)` }} />
            {widths.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={width === item.id}
                className={width === item.id ? "is-active" : ""}
                onClick={() => setWidth(item.id)}
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
