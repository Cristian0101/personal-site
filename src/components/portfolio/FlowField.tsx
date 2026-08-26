"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

const RAMP = "  ..,:;irsXA253hMHGS#9B&@";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function FlowField() {
  const fieldRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer: Point = { x: 0.72, y: 0.44 };
    const pointerTarget: Point = { ...pointer };
    let width = window.innerWidth;
    let height = window.innerHeight;
    let columns = 120;
    let rows = 54;
    let scrollProgress = 0;
    let frame = 0;
    let lastPaint = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      columns = clamp(Math.floor(width / (width < 680 ? 5.8 : 5.5)), 54, 300);
      rows = clamp(Math.floor(height / (width < 680 ? 11 : 10.5)), 34, 104);
    };

    const onScroll = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - height, 1);
      scrollProgress = window.scrollY / scrollable;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = 0.68 + (event.clientX / Math.max(width, 1) - 0.5) * 0.12;
      pointerTarget.y = 0.43 + (event.clientY / Math.max(height, 1) - 0.5) * 0.09;
    };

    const paint = (time: number) => {
      pointer.x += (pointerTarget.x - pointer.x) * 0.045;
      pointer.y += (pointerTarget.y - pointer.y) * 0.045;

      const phase = reducedMotion.matches ? 0.35 : time * 0.00022;
      const centerX = width < 720 ? 0.69 : pointer.x;
      const centerY = pointer.y + scrollProgress * 0.08;
      const aspect = columns / Math.max(rows, 1) * 0.48;
      const output: string[] = [];

      for (let row = 0; row < rows; row += 1) {
        const y = row / Math.max(rows - 1, 1);
        let line = "";

        for (let column = 0; column < columns; column += 1) {
          const x = column / Math.max(columns - 1, 1);
          const dx = (x - centerX) * aspect;
          const dy = y - centerY;
          const radius = Math.sqrt(dx * dx + dy * dy) + 0.0001;
          const angle = Math.atan2(dy, dx);

          const eventHorizon = Math.exp(-Math.pow((radius - 0.16) / 0.034, 2));
          const innerVoid = radius < 0.105 ? 0 : 1;
          const spiral = Math.pow(Math.max(0, Math.cos(angle * 2.15 - radius * 34 + phase * 5.4)), 10);
          const outerStream = Math.pow(Math.max(0, Math.cos(angle * 1.35 - radius * 22 - phase * 3.2)), 18);
          const lowerWave = Math.exp(-Math.pow((y - (0.67 + Math.sin(x * 8 + phase * 2) * 0.045)) / 0.12, 2));
          const leftFade = clamp((x - 0.06) / 0.42, 0, 1);
          const noise = Math.abs((Math.sin(column * 12.9898 + row * 78.233) * 43758.5453) % 1);

          let intensity = (
            eventHorizon * 0.82
            + spiral * Math.exp(-radius * 2.7) * 0.82
            + outerStream * Math.exp(-radius * 1.7) * 0.46
            + lowerWave * (0.12 + x * 0.22)
            + noise * 0.06
          ) * innerVoid * leftFade;

          if (radius < 0.108) intensity = 0;
          intensity = clamp(intensity * 1.18, 0, 1);
          line += RAMP[Math.floor(intensity * (RAMP.length - 1))];
        }

        output.push(line.replace(/ +$/, ""));
      }

      field.textContent = output.join("\n");
    };

    const animate = (time: number) => {
      if (time - lastPaint > 72) {
        paint(time);
        lastPaint = time;
      }
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    };

    const restart = () => {
      window.cancelAnimationFrame(frame);
      paint(0);
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    };

    resize();
    onScroll();
    restart();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reducedMotion.addEventListener("change", restart);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      reducedMotion.removeEventListener("change", restart);
    };
  }, []);

  return <pre ref={fieldRef} className="flow-field ascii-field" aria-hidden="true" />;
}
