"use client";

import { useEffect, useState } from "react";
import styles from "./GridOverlay.module.scss";

// Mirror of the SCSS $grid map (src/styles/_grid.scss). SCSS maps are
// compile-time only, so the dev overlay keeps its own copy in JS.
type GridConfig = { name: string; min: number; cols: number; margin: number };

const GRID: GridConfig[] = [
  { name: "small", min: 0, cols: 4, margin: 16 },
  { name: "medium", min: 768, cols: 12, margin: 40 },
  { name: "large", min: 1440, cols: 12, margin: 200 },
  { name: "xlarge", min: 1920, cols: 12, margin: 200 },
];

const GUTTER = 24;

function activeConfig(width: number): GridConfig {
  // Highest breakpoint whose min-width is satisfied.
  return GRID.reduce((acc, cfg) => (width >= cfg.min ? cfg : acc), GRID[0]);
}

export default function GridOverlay() {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    const onResize = () => setWidth(window.innerWidth);
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs.
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key.toLowerCase() === "g") setVisible((v) => !v);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!visible) return null;

  const cfg = activeConfig(width);

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div
        className={styles.columns}
        style={{
          paddingInline: `${cfg.margin}px`,
          gap: `${GUTTER}px`,
          gridTemplateColumns: `repeat(${cfg.cols}, 1fr)`,
        }}
      >
        {Array.from({ length: cfg.cols }, (_, i) => (
          <span key={i} className={styles.column} />
        ))}
      </div>
      <div className={styles.badge}>
        {cfg.name} · {cfg.cols} cols · {width}px
      </div>
    </div>
  );
}
