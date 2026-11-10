"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Download, Radio, X } from "lucide-react";
import { links, sections, site, type SectionId } from "@/config/site";
import { fx } from "@/lib/fx";
import { Logo } from "@/components/ui/Logo";

const BULB = ["#ff2424", "#ffd166", "#4cc9f0", "#7cf29a", "#ff8a3d"];
const navItems = sections.filter((s) => s.nav);

function jump(id: SectionId) {
  fx.vhs();
  if (id === "contact") fx.vecna();
}

/** One word on the "alphabet wall": a bulb above every letter that lights on hover / when active. */
function WallWord({ id, label, active, offset }: { id: SectionId; label: string; active: boolean; offset: number }) {
  return (
    <a
      href={`#${id}`}
      onClick={() => jump(id)}
      aria-current={active ? "true" : undefined}
      aria-label={label}
      className="group relative flex flex-col items-center px-2.5 pt-1 pb-0.5"
    >
      {/* wire */}
      <svg aria-hidden="true" className="absolute inset-x-0 top-0 h-2 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
        <path d="M0 2 Q50 9 100 2" fill="none" stroke="#2a1313" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden="true" className="flex">
        {label.split("").map((ch, i) => {
          const c = BULB[(offset + i) % BULB.length];
          return (
            <span key={i} className="flex w-[13px] flex-col items-center">
              <span
                className={`mt-1 mb-0.5 block h-[9px] w-[7px] rounded-b-full rounded-t-[40%] transition-all duration-200 ${
                  active
                    ? "opacity-100 shadow-[0_0_12px_3px_var(--c)]"
                    : "animate-twinkle opacity-35 group-hover:animate-none group-hover:opacity-100 group-hover:shadow-[0_0_12px_3px_var(--c)]"
                }`}
                style={{ background: c, ["--c" as string]: c, animationDelay: `${(i * 0.4) % 2.4}s` }}
              />
              <span className={`font-hand text-[15px] leading-none transition-colors ${active ? "text-fg" : "text-mute group-hover:text-fg"}`}>{ch}</span>
            </span>
          );
        })}
      </span>
    </a>
  );
}

/** Mobile: a handheld radio. Tune to a channel (section) with the dial buttons or the list. */
function RadioMenu({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false);
  const all = sections;
  const idx = Math.max(0, all.findIndex((s) => s.id === active));
  const ch = (n: number) => String(n + 1).padStart(2, "0");

  const tune = (i: number) => {
    const s = all[(i + all.length) % all.length];
    jump(s.id);
    document.getElementById(s.id)?.scrollIntoView();
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close radio menu" : "Open radio menu"}
        className="retro flex items-center gap-2 rounded-md border border-accent/60 bg-black/70 px-3 py-1.5 text-lg text-accent"
      >
        {open ? <X size={16} /> : <Radio size={16} />} CH {ch(idx)}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full right-0 mt-3 w-[min(86vw,320px)]"
          >
            {/* antenna */}
            <div className="mr-8 ml-auto h-10 w-2 rounded-t-full bg-[#2a2327]" aria-hidden="true" />
            <div className="rounded-2xl border-2 border-[#3b3135] bg-gradient-to-b from-[#2b2427] to-[#171214] p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)]">
              <div className="crt mb-3 rounded border border-[#0c1a10] px-3 py-2">
                <p className="retro text-sm text-term/70">NAVIGATION RADIO · CH {ch(idx)}</p>
                <p className="retro text-3xl text-term" style={{ textShadow: "0 0 10px rgba(124,242,154,.7)" }}>{all[idx].label}</p>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <button type="button" onClick={() => tune(idx - 1)} aria-label="Previous channel" className="grid h-12 w-12 place-items-center rounded-full border border-[#4a3f44] bg-[#120e10] text-fg active:scale-95"><ChevronUp /></button>
                <div className="grid flex-1 grid-cols-8 gap-1.5" aria-hidden="true">
                  {Array.from({ length: 24 }, (_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-black/70" />)}
                </div>
                <button type="button" onClick={() => tune(idx + 1)} aria-label="Next channel" className="grid h-12 w-12 place-items-center rounded-full border border-[#4a3f44] bg-[#120e10] text-fg active:scale-95"><ChevronDown /></button>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {all.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => { jump(s.id); setOpen(false); }}
                      className={`retro flex items-center gap-2 rounded border px-2 py-1.5 text-lg ${active === s.id ? "border-accent bg-accent/15 text-accent" : "border-[#3b3135] text-fg hover:border-accent"}`}
                    >
                      <span className="text-mute">{ch(i)}</span> {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={links.resume} download="Meet_Jaiswal_Resume.pdf" className="retro mt-3 flex items-center justify-center gap-2 rounded border border-[#3b3135] py-2 text-lg text-mute hover:text-fg">
                <Download size={15} /> Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HawkinsNavbar({ active }: { active: SectionId }) {
  // starting letter index of every word, so bulb colours run continuously across the wall
  const starts = navItems.map((_, i) => navItems.slice(0, i).reduce((a, s) => a + s.label.length, 0));
  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <nav aria-label="Primary" className="glass relative flex w-full max-w-6xl items-center justify-between gap-3 rounded-xl py-2 pr-3 pl-3">
        <a href="#home" onClick={() => fx.vhs()} className="flex items-center gap-2.5 text-fg" aria-label={`${site.name}, back to top`}>
          <Logo />
          <span className="st-title hidden text-lg sm:inline" style={{ textShadow: "none" }}>MJ</span>
        </a>

        <ul className="hidden items-end lg:flex">
          {navItems.map((s, i) => (
            <li key={s.id}>
              <WallWord id={s.id} label={s.label} active={active === s.id} offset={starts[i]} />
            </li>
          ))}
        </ul>

        <a
          href={links.resume}
          download="Meet_Jaiswal_Resume.pdf"
          className="retro hidden items-center gap-2 border border-accent/60 px-3 py-1.5 text-lg text-accent transition hover:bg-accent hover:text-black lg:inline-flex"
        >
          <Download size={15} /> <span className="hidden xl:inline">Resume</span>
        </a>
        <RadioMenu active={active} />
      </nav>
    </header>
  );
}
