"use client";

import { experiments } from "@/config/site";
import { Section, SectionHeading, Reveal } from "@/components/ui/Section";

export function SkillsSection() {
  return (
    <Section id="skills">
      <SectionHeading id="skills" code="SKILLS" title="Technical Skills" sub="Five skill areas. Every tool listed is one I actually use." />

      <div className="grid gap-5 md:grid-cols-6">
        {experiments.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.07} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
            <article className="hud group panel relative h-full overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/70">
              <div className="scan-line opacity-0 group-hover:opacity-100" aria-hidden="true" />
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

              <div className="relative flex items-center justify-between">
                <p className="retro text-xl text-accent">{e.code}</p>
                <p className="retro flex items-center gap-2 text-base text-mute">
                  STATUS
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
                  <span className="text-term">ACTIVE</span>
                </p>
              </div>
              <h3 className="st-title relative mt-3 text-2xl sm:text-3xl" style={{ textShadow: "0 0 18px rgba(var(--glow),.4)" }}>
                {e.name}
              </h3>
              <div aria-hidden="true" className="relative my-4 flex items-center gap-1">
                {Array.from({ length: 22 }, (_, k) => (
                  <span key={k} className="h-1 flex-1 bg-accent/25 group-hover:bg-accent/60" style={{ transition: `background .3s ${k * 25}ms` }} />
                ))}
              </div>
              <p className="retro relative mb-2 text-base text-mute">TOOLS ({e.skills.length})</p>
              <ul className="relative flex flex-wrap gap-2">
                {e.skills.map((s) => (
                  <li key={s} className="border border-line bg-black/50 px-2.5 py-1 font-mono text-xs text-fg transition group-hover:border-accent/50">
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
