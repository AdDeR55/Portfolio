"use client";

import { useState } from "react";
import Image from "next/image";
import { education, links, profile } from "@/config/site";
import { Section, SectionHeading, Reveal } from "@/components/ui/Section";
import { ClassifiedProfile } from "@/components/ClassifiedProfile";

const BIO =
  "I'm a developer who enjoys turning complex ideas into practical digital products. From AI-powered applications to interactive web experiences, I love experimenting with technologies and building things that solve real problems.";

const Redacted = ({ w = "w-24" }: { w?: string }) => (
  <span className={`inline-block h-[1.05em] ${w} translate-y-[3px] bg-[#0a0a0a]`} aria-label="redacted" role="img" />
);

export function AboutSection() {
  const [failed, setFailed] = useState(false);
  const get = (k: string) => profile.rows.find(([x]) => x === k)?.[1] ?? "";
  const rows: [string, React.ReactNode][] = [
    ["Name", get("Name")],
    ["Designation", get("Designation")],
    ["Organization", get("University")],
    ["Department", "Computer Science Engineering"],
    ["Graduation", education.graduation],
    ["CGPA", `${education.cgpa.replace(/ /g, "")}`],
    ["Home address", <Redacted key="a" w="w-40" />],
    ["Known associates", <Redacted key="b" w="w-32" />],
  ];

  return (
    <Section id="about">
      <SectionHeading id="about" code="PROFILE" title="About Me" sub="A quick profile of who I am and what I do. Some details are redacted, just for fun." />

      <Reveal>
        <div className="paper relative mx-auto max-w-4xl -rotate-[0.6deg] p-6 sm:p-10">
          {/* paper clip + stamp */}
          <div aria-hidden="true" className="absolute -top-3 left-10 h-14 w-5 rounded-full border-[3px] border-[#8a8a8a]" />
          <div
            aria-hidden="true"
            className="retro pointer-events-none absolute top-6 right-6 rotate-12 border-[5px] border-[#b5121b]/80 px-4 py-1 text-4xl tracking-widest text-[#b5121b]/80 sm:text-5xl"
          >
            CLASSIFIED
          </div>

          <p className="retro text-lg tracking-widest text-[#6b0000]">DEVELOPER PROFILE</p>
          <p className="font-display text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">Identification Record</p>
          <div className="my-4 h-[3px] bg-[#2a1d14]" />

          <div className="grid gap-8 md:grid-cols-[210px_1fr]">
            {/* ID badge */}
            <div>
              <div className="mx-auto w-[190px] rotate-2 border-2 border-[#2a1d14] bg-[#f4ead4] p-3 shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
                <div className="mb-2 h-3 rounded-sm bg-[#b5121b]" />
                <div className="relative mx-auto h-[150px] w-[150px] overflow-hidden border-2 border-[#2a1d14] bg-[#cdbfa3] sepia-[.6] grayscale-[.4]">
                  {failed ? (
                    <span className="grid h-full w-full place-items-center font-display text-5xl font-extrabold text-[#2a1d14]">MJ</span>
                  ) : (
                    <Image
                      src={`https://github.com/${links.githubUser}.png?size=300`}
                      alt="Meet Jaiswal"
                      width={150}
                      height={150}
                      unoptimized
                      onError={() => setFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="retro mt-2 text-center text-2xl leading-none">JAISWAL, M.</p>
                <p className="retro text-center text-base text-[#6b0000]">SOFTWARE DEVELOPER</p>
                <div aria-hidden="true" className="mt-2 flex h-6 items-stretch gap-[2px]">
                  {Array.from({ length: 34 }, (_, i) => (
                    <span key={i} className="bg-[#2a1d14]" style={{ width: (i * 7) % 3 === 0 ? 3 : 1.5 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* fields */}
            <dl>
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] items-baseline gap-3 border-b border-dashed border-[#2a1d14]/35 py-2.5 sm:grid-cols-[150px_1fr]">
                  <dt className="retro text-xl text-[#6b0000]">{k}:</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 border-t-2 border-[#2a1d14] pt-6">
            <p className="retro mb-2 text-xl text-[#6b0000]">SUMMARY</p>
            <p className="max-w-3xl text-lg leading-relaxed">{BIO}</p>
          </div>

          <div className="mt-8">
            <ClassifiedProfile />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
