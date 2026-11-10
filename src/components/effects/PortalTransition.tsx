"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Red portal wipe that expands from the click point (fired by `fx.portal`). */
export function PortalTransition() {
  const [p, setP] = useState<{ x: number; y: number; k: number } | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      setP((prev) => ({ x: d.x, y: d.y, k: (prev?.k ?? 0) + 1 }));
      clearTimeout(t);
      t = setTimeout(() => setP(null), 1100);
    };
    window.addEventListener("fx:portal", on);
    return () => { window.removeEventListener("fx:portal", on); clearTimeout(t); };
  }, []);

  if (!p) return null;
  const size = Math.max(window.innerWidth, window.innerHeight) * 3;
  return (
    <div className="pointer-events-none fixed inset-0 z-[170] overflow-hidden" aria-hidden="true">
      <motion.div
        key={p.k}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: p.x - size / 2,
          top: p.y - size / 2,
          background:
            "radial-gradient(circle, #050000 0%, #050000 28%, #6b0000 38%, #ff2424 42%, #b5121b 47%, #120000 56%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 1.05, times: [0, 0.5, 1], ease: "easeInOut" }}
      />
    </div>
  );
}
