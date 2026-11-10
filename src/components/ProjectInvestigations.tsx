"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ExternalLink, FileSearch, Layers, Network, Terminal, X } from "lucide-react";
import { projects, type Project } from "@/config/site";
import { Github } from "@/components/ui/BrandIcons";
import { Section, SectionHeading, Reveal } from "@/components/ui/Section";
import { fx } from "@/lib/fx";

const kindIcon = { saas: Layers, agent: Bot, resume: FileSearch, canvas: Network, terminal: Terminal } as const;
type Open = (p: Project, e: React.MouseEvent) => void;

const tier = (p: Project) => (p.level === 5 ? "FLAGSHIP" : "FEATURED");
const num = (i: number) => `PROJECT ${String(i + 1).padStart(3, "0")}`;

function Level({ p, dark = true }: { p: Project; dark?: boolean }) {
  return (
    <span
      className={`retro inline-block border-2 px-3 py-0.5 text-xl tracking-widest ${
        dark ? "border-accent text-accent shadow-[0_0_12px_-2px_rgba(var(--glow),0.7)]" : "border-[#b5121b] text-[#b5121b]"
      }`}
    >
      {tier(p)}
    </span>
  );
}

/** Screenshot when provided; otherwise a CRT-style placeholder that says so honestly. */
function Preview({ p, className = "" }: { p: Project; className?: string }) {
  const Icon = kindIcon[p.kind];
  if (p.image) {
    return (
      <div className={`relative overflow-hidden border border-line ${className}`}>
        <Image src={p.image} alt={`${p.name} preview`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`crt relative grid place-items-center overflow-hidden border border-line ${className}`} role="img" aria-label={`${p.name} preview placeholder`}>
      <div className="bg-dots absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(var(--glow),0.3),transparent_65%)]" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true" />
      <div className="relative z-[1] flex flex-col items-center gap-2 text-accent">
        <Icon size={46} strokeWidth={1.2} />
        <span className="retro text-xl tracking-widest text-mute">SCREENSHOT COMING SOON</span>
      </div>
    </div>
  );
}

function Tech({ p, n = 99 }: { p: Project; n?: number }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {p.tech.slice(0, n).map((t) => (
        <li key={t} className="border border-line bg-black/50 px-2 py-1 font-mono text-[11px] text-fg">{t}</li>
      ))}
    </ul>
  );
}

function Actions({ p, onOpen, light = false }: { p: Project; onOpen: Open; light?: boolean }) {
  const ghost = light ? "border-[#2a1d14]/60 text-[#2a1d14] hover:bg-[#2a1d14] hover:text-cream" : "border-white/30 text-fg hover:border-accent hover:text-accent";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={(e) => onOpen(p, e)}
        className="retro border-2 border-accent bg-accent px-5 py-2 text-xl tracking-widest text-black transition hover:bg-transparent hover:text-accent"
      >
        View project
      </button>
      {p.live && (
        <a href={p.live} target="_blank" rel="noopener noreferrer" className={`retro inline-flex items-center gap-1.5 border-2 px-4 py-2 text-xl tracking-wider transition ${ghost}`}>
          <ExternalLink size={15} /> Live
        </a>
      )}
      {p.repo && (
        <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source on GitHub`} className={`grid h-10 w-10 place-items-center border-2 transition ${ghost}`}>
          <Github size={16} />
        </a>
      )}
    </div>
  );
}

/* ───────── five distinct file layouts ───────── */

/** 1 — wide dossier with stamp */
function Dossier({ p, i, onOpen }: { p: Project; i: number; onOpen: Open }) {
  return (
    <article className="hud panel grid gap-0 overflow-hidden md:grid-cols-[1.1fr_1fr]">
      <div className="relative p-5 md:p-7">
        <Preview p={p} className="aspect-[16/10]" />
        <div aria-hidden="true" className="retro pointer-events-none absolute right-8 bottom-9 rotate-[-8deg] border-[5px] border-accent/70 px-4 py-1 text-5xl tracking-widest text-accent/70 md:text-6xl">{tier(p)}</div>
      </div>
      <div className="flex flex-col p-6 md:p-9">
        <div className="mb-4 flex items-center justify-between"><p className="retro text-xl text-mute">{num(i)}</p><Level p={p} /></div>
        <h3 className="st-title text-4xl sm:text-5xl">{p.name}</h3>
        <p className="mt-4 text-fg/85">{p.summary}</p>
        <div className="my-5"><Tech p={p} /></div>
        <div className="mt-auto"><Actions p={p} onOpen={onOpen} /></div>
      </div>
    </article>
  );
}

/** 2 — terminal session */
function TerminalFile({ p, i, onOpen }: { p: Project; i: number; onOpen: Open }) {
  return (
    <article className="crt border-2 border-[#1a3a22] p-5 sm:p-8 md:ml-12">
      <div className="relative z-[1] font-mono text-sm text-term" style={{ textShadow: "0 0 8px rgba(124,242,154,.5)" }}>
        <p className="retro mb-4 flex items-center justify-between text-xl text-term/70"><span>PROJECT TERMINAL · SESSION {num(i)}</span><span>{tier(p)}</span></p>
        <p>&gt; open --file <span className="text-fg">{p.name.toLowerCase().replace(/ /g, "_")}.summary</span></p>
        <h3 className="retro mt-3 text-5xl text-term sm:text-6xl">{p.name}</h3>
        <p className="mt-3 max-w-2xl text-term/90">&gt; {p.summary}</p>
        <p className="mt-4 text-term/70">&gt; stack:</p>
        <p className="max-w-2xl text-term/90">{p.tech.join(" · ")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-sans">
          <Actions p={p} onOpen={onOpen} />
          <span className="animate-blink font-mono text-term">█</span>
        </div>
      </div>
    </article>
  );
}

/** 3 — polaroid evidence */
function Polaroid({ p, i, onOpen }: { p: Project; i: number; onOpen: Open }) {
  return (
    <article className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
      <div className="relative mx-auto w-full max-w-sm rotate-[-3deg] bg-[#f1e7d3] p-3 pb-12 shadow-[10px_14px_30px_rgba(0,0,0,0.8)]">
        <div aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-[#d9c79a]/80" />
        <Preview p={p} className="aspect-square" />
        <p className="font-hand absolute right-4 bottom-3 left-4 text-xl text-[#2a1d14]">{p.name.toLowerCase()} — project #{i + 1}</p>
      </div>
      <div className="panel p-6 md:p-9">
        <div className="mb-3 flex items-center gap-4"><Level p={p} /><p className="retro text-xl text-mute">{num(i)}</p></div>
        <h3 className="st-title text-4xl sm:text-5xl">{p.name}</h3>
        <p className="mt-4 text-fg/85">{p.summary}</p>
        <div className="my-5"><Tech p={p} /></div>
        <Actions p={p} onOpen={onOpen} />
      </div>
    </article>
  );
}

/** 4 — case board: folder tab, red string, pinned chips */
function CaseBoard({ p, i, onOpen }: { p: Project; i: number; onOpen: Open }) {
  return (
    <article className="relative mt-6">
      <div className="retro absolute -top-6 left-6 z-[1] rounded-t-md border-2 border-b-0 border-accent bg-char px-5 py-0.5 text-xl text-accent">
        PROJECT {String(i + 1).padStart(3, "0")}
      </div>
      <div className="hud panel relative overflow-hidden border-2 border-accent/50 p-6 md:p-10">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path d="M560 40 L700 190 L930 90 M700 190 L820 360 M700 190 L580 340" stroke="#ff2424" strokeOpacity=".5" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Level p={p} />
            <h3 className="st-title mt-4 text-4xl sm:text-5xl md:text-6xl">{p.name}</h3>
            <p className="mt-4 text-fg/85">{p.summary}</p>
            <div className="mt-6"><Actions p={p} onOpen={onOpen} /></div>
          </div>
          <div>
            <Preview p={p} className="aspect-[16/9]" />
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {p.features.map((f, k) => (
                <li key={f} className="relative border border-line bg-black/60 p-3 pl-6 text-xs text-fg/85" style={{ rotate: `${k % 2 ? 0.6 : -0.6}deg` }}>
                  <span aria-hidden="true" className="absolute top-3 left-2.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5"><Tech p={p} /></div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** 5 — typed memo on paper */
function Memo({ p, i, onOpen }: { p: Project; i: number; onOpen: Open }) {
  return (
    <article className="paper relative mx-auto max-w-4xl rotate-[0.5deg] p-6 sm:p-10">
      <div aria-hidden="true" className="absolute top-0 right-0 h-0 w-0 border-t-[44px] border-l-[44px] border-t-[#08080866] border-l-transparent" />
      <div className="flex items-center justify-between">
        <p className="retro text-xl tracking-widest text-[#6b0000]">PROJECT MEMO · {num(i)}</p>
        <Level p={p} dark={false} />
      </div>
      <div className="my-3 h-[3px] bg-[#2a1d14]" />
      <p className="retro text-xl text-[#6b0000]">RE:</p>
      <h3 className="font-display text-3xl leading-tight font-extrabold uppercase sm:text-4xl">{p.name}</h3>
      <p className="mt-4 text-lg leading-relaxed text-[#2a1d14]">{p.summary}</p>
      <ul className="mt-4 space-y-1.5 text-[#2a1d14]">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2"><span className="retro text-[#b5121b]">▪</span>{f}</li>
        ))}
      </ul>
      <div className="mt-6"><Actions p={p} onOpen={onOpen} light /></div>
    </article>
  );
}

const layouts = [Dossier, TerminalFile, Polaroid, CaseBoard, Memo];

/** Unsealed classified document shown after the portal transition. */
function Unsealed({ p, i, onClose }: { p: Project; i: number; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/85 p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} project details`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0, rotateX: 18 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 240 }}
        className="paper relative max-h-[92vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-10"
      >
        <button onClick={onClose} aria-label="Close file" className="absolute top-4 right-4 z-[2] grid h-9 w-9 place-items-center border-2 border-[#2a1d14] text-[#2a1d14] hover:bg-[#2a1d14] hover:text-cream"><X size={18} /></button>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 2.2, rotate: -20 }}
          animate={{ opacity: 0.85, scale: 1, rotate: -9 }}
          transition={{ delay: 0.35, type: "spring", damping: 12 }}
          className="retro pointer-events-none absolute top-24 right-6 border-[5px] border-[#b5121b] px-3 py-0.5 text-4xl tracking-widest text-[#b5121b] sm:right-12 sm:text-5xl"
        >
          FILE OPEN
        </motion.div>
        <p className="retro text-xl tracking-widest text-[#6b0000]">{num(i)} · {tier(p)} · {p.date ?? "DATE REDACTED"}</p>
        <h3 className="mt-1 pr-12 font-display text-4xl leading-none font-black uppercase sm:text-5xl">{p.name}</h3>
        <div className="my-4 h-[3px] bg-[#2a1d14]" />
        <p className="text-lg leading-relaxed text-[#2a1d14]">{p.summary}</p>
        <div className="my-6"><Preview p={p} className="aspect-[16/8]" /></div>

        <h4 className="retro text-2xl text-[#6b0000]">KEY FEATURES</h4>
        <ul className="mt-2 space-y-2 text-[#2a1d14]">
          {p.features.map((f) => (
            <li key={f} className="flex gap-3"><span className="retro text-[#b5121b]">▪</span>{f}</li>
          ))}
        </ul>
        <h4 className="retro mt-6 text-2xl text-[#6b0000]">TECHNOLOGY</h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {p.tech.map((t) => (<li key={t} className="border border-[#2a1d14]/60 px-2.5 py-1 font-mono text-xs text-[#2a1d14]">{t}</li>))}
        </ul>
        {p.note && <p className="mt-6 border border-dashed border-[#2a1d14]/50 p-3 text-sm text-[#2a1d14]">{p.note}</p>}
        {(p.live || p.repo) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="retro inline-flex items-center gap-2 border-2 border-[#b5121b] bg-[#b5121b] px-5 py-2 text-xl tracking-wider text-cream hover:bg-transparent hover:text-[#b5121b]"><ExternalLink size={16} /> Live deployment</a>}
            {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="retro inline-flex items-center gap-2 border-2 border-[#2a1d14] px-5 py-2 text-xl tracking-wider text-[#2a1d14] hover:bg-[#2a1d14] hover:text-cream"><Github size={16} /> Source code</a>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function ProjectInvestigations() {
  const [open, setOpen] = useState<{ p: Project; i: number } | null>(null);
  const onOpen: Open = (p, e) => {
    const i = projects.findIndex((x) => x.id === p.id);
    fx.portal(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, () => setOpen({ p, i }));
  };

  return (
    <Section id="projects">
      <SectionHeading id="projects" code="PROJECT FILES" title="Featured Projects" sub="Five projects I have built. Open any file for the full details." />
      <div className="space-y-16 md:space-y-24">
        {projects.map((p, i) => {
          const L = layouts[i % layouts.length];
          return (
            <Reveal key={p.id}>
              <L p={p} i={i} onOpen={onOpen} />
            </Reveal>
          );
        })}
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>{open && <Unsealed key={open.p.id} p={open.p} i={open.i} onClose={() => setOpen(null)} />}</AnimatePresence>,
          document.body,
        )}
    </Section>
  );
}
