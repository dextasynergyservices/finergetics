import type {
  CtaSection,
  FaqSection,
  HeroSection,
  IntroSection,
  MarqueeSection,
  PageSection,
  ProcessSection,
  ServicesSection,
  TeamSection,
  WhyUsSection,
} from "@/lib/schemas/sections";
import { CtaSectionComponent } from "./cta-section";
import { FaqSectionComponent } from "./faq-section";
import { HeroSectionComponent } from "./hero-section";
import { IntroSectionComponent } from "./intro-section";
import { MarqueeSectionComponent } from "./marquee-section";
import { ProcessSectionComponent } from "./process-section";
import {
  type ServiceItemData,
  ServicesSectionComponent,
} from "./services-section";
import { type TeamMemberData, TeamSectionComponent } from "./team-section";
import { WhyUsSectionComponent } from "./why-us-section";

interface SectionRendererProps {
  sections: PageSection[];
  services?: ServiceItemData[];
  team?: TeamMemberData[];
}

export function SectionRenderer({
  sections,
  services = [],
  team = [],
}: SectionRendererProps) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null;

        switch (section.type) {
          case "hero":
            return (
              <HeroSectionComponent
                key={section.id}
                section={section as HeroSection}
              />
            );
          case "marquee":
            return (
              <MarqueeSectionComponent
                key={section.id}
                section={section as MarqueeSection}
              />
            );
          case "intro":
            return (
              <IntroSectionComponent
                key={section.id}
                section={section as IntroSection}
              />
            );
          case "services":
            return (
              <ServicesSectionComponent
                key={section.id}
                section={section as ServicesSection}
                services={services}
              />
            );
          case "process":
            return (
              <ProcessSectionComponent
                key={section.id}
                section={section as ProcessSection}
              />
            );
          case "why_us":
            return (
              <WhyUsSectionComponent
                key={section.id}
                section={section as WhyUsSection}
              />
            );
          case "team":
            return (
              <TeamSectionComponent
                key={section.id}
                section={section as TeamSection}
                team={team}
              />
            );
          case "faq":
            return (
              <FaqSectionComponent
                key={section.id}
                section={section as FaqSection}
              />
            );
          case "cta":
            return (
              <CtaSectionComponent
                key={section.id}
                section={section as CtaSection}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
