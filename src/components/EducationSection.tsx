"use client";

import { ExternalLink } from "lucide-react";
import { certifications, education } from "@/config/site";
import { Section, SectionHeading, Reveal } from "@/components/ui/Section";

export function EducationSection() {
  return (
    <Section id="education">
      <SectionHeading id="education" code="EDUCATION" title="Education" sub="My degree, academic standing, and certifications." />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="paper relative h-full -rotate-[0.8deg] p-6 pl-12 sm:p-9 sm:pl-16">
            {/* punch-card holes */}
            <div aria-hidden="true" className="absolute inset-y-0 left-3 flex flex-col justify-around sm:left-5">
              {Array.from({ length: 6 }, (_, i) => <span key={i} className="block h-4 w-4 rounded-full bg-[#080808] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />)}
            </div>
            <p className="retro text-lg tracking-widest text-[#6b0000]">ACADEMIC RECORD</p>
            <div className="my-3 h-[3px] bg-[#2a1d14]" />
            <h3 className="font-display text-3xl leading-tight font-black uppercase sm:text-4xl">{education.school}</h3>
            <p className="mt-1 text-lg font-semibold">{education.degree}</p>
            <p className="text-sm text-[#2a1d14]/80">{education.place}</p>
            <dl className="mt-7 grid grid-cols-2 gap-4">
              <div className="border-2 border-[#2a1d14] p-3">
                <dt className="retro text-lg text-[#6b0000]">GRADUATION</dt>
                <dd className="retro text-5xl leading-none">{education.graduation}</dd>
              </div>
              <div className="border-2 border-[#2a1d14] p-3">
                <dt className="retro text-lg text-[#6b0000]">CGPA</dt>
                <dd className="retro text-5xl leading-none">{education.cgpa.replace(/ /g, "")}</dd>
              </div>
            </dl>
            <p aria-hidden="true" className="retro absolute right-5 bottom-5 rotate-[-10deg] border-4 border-[#b5121b]/70 px-3 text-3xl tracking-widest text-[#b5121b]/70">ENROLLED</p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.07}>
              <article className="hud panel group p-5 transition hover:border-accent/60 sm:p-6">
                <p className="retro text-lg text-accent">CERTIFICATE {String(i + 1).padStart(2, "0")} · {c.issuer.toUpperCase()}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-fg sm:text-2xl">{c.name}</h3>
                <p className="mt-2 text-sm text-mute">{c.detail}</p>
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="retro mt-3 inline-flex items-center gap-1.5 text-lg text-accent hover:underline">
                    View certificate <ExternalLink size={13} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
