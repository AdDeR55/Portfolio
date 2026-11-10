"use client";

import { useEffect, useState } from "react";

/** Permanent subtle analog texture (scanlines, grain, rolling bar) + transient glitch on `fx:vhs`. */
export function VHSOverlay() {
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => {
      setGlitch((g) => g + 1);
      clearTimeout(t);
      t = setTimeout(() => setGlitch(0), 460);
    };
    window.addEventListener("fx:vhs", on);
    return () => { window.removeEventListener("fx:vhs", on); clearTimeout(t); };
  }, []);

  return (
    <>
      <div className="vhs-scan" aria-hidden="true" />
      <div className="vhs-grain" aria-hidden="true" />
      <div className="vhs-roll" aria-hidden="true" />
      {glitch > 0 && <div key={glitch} className="glitch-layer" aria-hidden="true" />}
    </>
  );
}
