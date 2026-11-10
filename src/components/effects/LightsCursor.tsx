"use client";

import { useEffect, useRef } from "react";

const BULBS = ["#ff2424", "#ffd166", "#4cc9f0", "#7cf29a", "#ff8a3d"];

/** Christmas-lights cursor trail: small coloured bulbs that fade. Desktop mouse only; off for reduced motion. */
export function LightsCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const ok = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || !ctx || !ok) return;

    let w = window.innerWidth, h = window.innerHeight, raf = 0, n = 0, lastX = -99, lastY = -99;
    const pts: { x: number; y: number; life: number; c: string }[] = [];
    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of pts) p.life -= 0.028;
      while (pts.length && pts[0].life <= 0) pts.shift();
      for (const p of pts) {
        const r = 2 + p.life * 6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        g.addColorStop(0, p.c + "ff");
        g.addColorStop(0.35, p.c + "88");
        g.addColorStop(1, p.c + "00");
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = pts.length ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 18) return; // spaced like bulbs on a wire
      lastX = e.clientX; lastY = e.clientY;
      pts.push({ x: e.clientX, y: e.clientY, life: 1, c: BULBS[n++ % BULBS.length] });
      if (pts.length > 22) pts.shift();
      if (!raf) raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95]" />;
}
