"use client";

import { MotionConfig } from "framer-motion";
import { useActiveSection } from "@/lib/hooks";
import { IntroSequence } from "@/components/IntroSequence";
import { HawkinsNavbar } from "@/components/HawkinsNavbar";
import { UpsideDownToggle } from "@/components/UpsideDownToggle";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectInvestigations } from "@/components/ProjectInvestigations";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { GitHubTerminal } from "@/components/GitHubTerminal";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { EasterEggs } from "@/components/EasterEggs";
import { VHSOverlay } from "@/components/effects/VHSOverlay";
import { LightsCursor } from "@/components/effects/LightsCursor";
import { PortalTransition } from "@/components/effects/PortalTransition";
import { VecnaClock } from "@/components/effects/VecnaClock";

export function PortfolioApp() {
  const { id } = useActiveSection();
  return (
    <MotionConfig reducedMotion="user">
      <IntroSequence />
      <VHSOverlay />
      <LightsCursor />
      <PortalTransition />
      <VecnaClock />
      <HawkinsNavbar active={id} />
      <UpsideDownToggle />
      <EasterEggs />
      <main className="relative z-10">
        <HeroSection />
        <div className="fog">
          <AboutSection />
          <SkillsSection />
          <ProjectInvestigations />
          <ExperienceTimeline />
          <GitHubTerminal />
          <EducationSection />
          <ContactSection />
        </div>
      </main>
      <div className="relative z-10"><Footer /></div>
    </MotionConfig>
  );
}
