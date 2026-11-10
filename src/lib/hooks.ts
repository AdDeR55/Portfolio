"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/config/site";

/** Scroll-spy: which section is currently centered in the viewport. */
export function useActiveSection(): { id: SectionId; index: number; progress: number } {
  const [id, setId] = useState<SectionId>("home");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setId(e.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { id, index: sections.findIndex((s) => s.id === id), progress };
}

export function useTyping(words: readonly string[], enabled = true) {
  const [text, setText] = useState(enabled ? "" : words[0]);

  useEffect(() => {
    if (!enabled) return;
    let wi = 0, ci = 0, del = false;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const w = words[wi];
      ci += del ? -1 : 1;
      setText(w.slice(0, ci));
      let delay = del ? 35 : 75;
      if (!del && ci === w.length) { del = true; delay = 1500; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 350; }
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, [words, enabled]);

  return enabled ? text : words[0];
}

export function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setR(m.matches);
    u();
    m.addEventListener("change", u);
    return () => m.removeEventListener("change", u);
  }, []);
  return r;
}
