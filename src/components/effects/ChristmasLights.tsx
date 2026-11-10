"use client";

import { useEffect, useState } from "react";

const COLORS = ["#ff2424", "#ffd166", "#4cc9f0", "#7cf29a", "#ff8a3d"];

/** Decorative string of bulbs. Flickers when the `fx:flicker` event fires (easter egg). */
export function ChristmasLights({ count = 18, className = "" }: { count?: number; className?: string }) {
  const [flick, setFlick] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => { setFlick(true); clearTimeout(t); t = setTimeout(() => setFlick(false), 2200); };
    window.addEventListener("fx:flicker", on);
    return () => { window.removeEventListener("fx:flicker", on); clearTimeout(t); };
  }, []);

  return (
    <div className={`pointer-events-none h-14 w-full ${className}`} aria-hidden="true">
      <svg className="absolute inset-x-0 top-0 h-6 w-full" viewBox="0 0 1000 24" preserveAspectRatio="none">
        <path d="M0 4 Q 125 22 250 4 T 500 4 T 750 4 T 1000 4" fill="none" stroke="#1a0f0f" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const c = COLORS[i % COLORS.length];
        const x = ((i + 0.5) / count) * 100;
        const sag = Math.sin(((i + 0.5) / count) * Math.PI * 8) * 0; // wire sag approximated below
        return (
          <span
            key={i}
            className={`absolute block h-4 w-3 -translate-x-1/2 rounded-b-full rounded-t-[40%] ${flick ? "animate-flicker" : "animate-twinkle"}`}
            style={{
              left: `${x}%`,
              top: `${10 + ((i % 2) * 6) + sag}px`,
              background: c,
              boxShadow: `0 0 14px 3px ${c}99`,
              animationDelay: `${(i * 0.37) % 2.6}s`,
            }}
          />
        );
      })}
    </div>
  );
}
