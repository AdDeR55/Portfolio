"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { CalendarDays, ChevronDown, MapPin } from "lucide-react";
import { experience } from "@/config/site";
import { Section, SectionHeading, Reveal } from "@/components/ui/Section";

export function ExperienceTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <Section id="experience">
      <SectionHeading id="experience" code="EXPERIENCE" title="Work Experience" sub="Two internships, filed as reports. Open one for what I worked on." />

      <ol ref={ref} className="relative space-y-8 pl-9 sm:pl-14">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[13px] w-[2px] bg-line sm:left-[21px]" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute top-2 bottom-2 left-[13px] w-[2px] bg-accent shadow-[0_0_14px_var(--accent)] sm:left-[21px]"
        />

        {experience.map((e, i) => {
          const open = openId === e.id;
          const panel = `report-${e.id}`;
          return (
            <li key={e.id} className="relative">
              <span aria-hidden="true" className="absolute top-6 -left-9 grid h-7 w-7 place-items-center rounded-full border-2 border-accent bg-ink sm:-left-14 sm:h-10 sm:w-10">
                <span className="animate-pulse-red h-2.5 w-2.5 rounded-full bg-accent sm:h-3 sm:w-3" />
              </span>
              <Reveal>
                <article className="hud panel overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panel}
                    onClick={() => setOpenId(open ? null : e.id)}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left sm:p-8"
                  >
                    <span>
                      <span className="retro flex flex-wrap items-center gap-x-4 gap-y-1 text-xl text-accent">
                        {e.label}
                        <span className="border border-accent/60 px-2 text-base text-term" style={{ borderColor: "rgba(124,242,154,.5)" }}>● COMPLETED</span>
                      </span>
                      <span className="st-title mt-2 block text-2xl sm:text-3xl" style={{ textShadow: "0 0 16px rgba(var(--glow),.35)" }}>{e.role}</span>
                      <span className="mt-1 block text-lg text-accent-soft">
                        {e.org}
                        {e.orgNote && <span className="retro ml-2 border border-accent/40 px-2 text-base text-accent">{e.orgNote}</span>}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-mute">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {e.period}</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {e.location}</span>
                      </span>
                    </span>
                    <ChevronDown className={`mt-2 shrink-0 text-accent transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panel}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-line px-6 pt-6 pb-8 sm:px-8">
                          <p className="retro mb-2 text-xl text-mute">OVERVIEW</p>
                          <p className="text-fg/90">{e.summary}</p>
                          <p className="retro mt-6 mb-2 text-xl text-mute">RESPONSIBILITIES</p>
                          <ul className="space-y-2.5">
                            {[...e.highlights, ...e.achievements].map((h) => (
                              <li key={h} className="flex gap-3 text-sm text-fg/85 sm:text-base">
                                <span aria-hidden="true" className="retro mt-0.5 text-accent">▪</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="retro mt-6 mb-2 text-xl text-mute">TECH USED</p>
                          <ul className="flex flex-wrap gap-2">
                            {e.stack.map((s) => (
                              <li key={s} className="border border-line bg-black/50 px-2.5 py-1 font-mono text-xs text-fg">{s}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
              <span className="sr-only">Role {i + 1} of {experience.length}</span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
