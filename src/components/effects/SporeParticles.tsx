"use client";

import { useEffect, useRef } from "react";

interface P { x: number; y: number; r: number; vx: number; vy: number; a: number; t: number }

/**
 * Floating Upside Down spores. In the Upside Down they drift down instead of up.
 * Pauses when the tab is hidden; draws a single static frame under reduced motion.
 */
export function SporeParticles({ density = 1, fixed = false, className = "" }: { density?: number; fixed?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, running = true;
    let ps: P[] = [];

    const make = (initial: boolean, dir: number): P => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : dir < 0 ? h + 8 : -8,
      r: 0.5 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (0.12 + Math.random() * 0.5) * dir,
      a: 0.2 + Math.random() * 0.6,
      t: Math.random() * 6.28,
    });

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width || window.innerWidth;
      h = rect?.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000) * density);
      ps = Array.from({ length: n }, () => make(true, -1));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const rgb = getComputedStyle(document.documentElement).getPropertyValue("--glow").trim() || "255,36,36";
      for (const p of ps) {
        const tw = 0.55 + Math.sin(p.t) * 0.45;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(${rgb},${p.a * tw})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, 7);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running) return;
      const upside = document.documentElement.dataset.dimension === "upside";
      const dir = upside ? 1 : -1; // up normally, down in the Upside Down
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.t += 0.03;
        p.x += p.vx + Math.sin(p.t * 0.7) * 0.15;
        p.y += Math.sign(p.vy) === dir ? p.vy : -p.vy;
        if (p.y < -12 || p.y > h + 12 || p.x < -12 || p.x > w + 12) ps[i] = make(false, dir);
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      running = !document.hidden;
      if (running && !reduced) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) draw();
    else {
      raf = requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", onVis);
    }
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 ${className}`} />;
}
