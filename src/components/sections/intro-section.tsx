import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { SectionHeading } from "@/components/site/section-heading";
import type { IntroSection } from "@/lib/schemas/sections";

interface IntroSectionComponentProps {
  section: IntroSection;
}

export function IntroSectionComponent({ section }: IntroSectionComponentProps) {
  const { data } = section;

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white border-b border-silver-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        <SectionHeading
          eyebrow={data.eyebrow || "• WHAT WE DO"}
          title={data.title}
          highlight={data.highlight}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 font-body leading-relaxed">
                {data.narrative}
              </p>
            </Reveal>
          </div>

          {data.bullets && data.bullets.length > 0 && (
            <div className="lg:col-span-5 bg-sky-50/60 rounded-3xl p-6 sm:p-8 border border-silver-400/20">
              <p className="text-xs font-bold uppercase tracking-wider text-royal-700 mb-6">
                Core Engagement Capabilities
              </p>

              <Stagger className="space-y-4">
                {data.bullets.map((bullet) => (
                  <StaggerItem key={bullet}>
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-lg bg-white border border-silver-400/20 text-royal-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-navy-950 leading-snug">
                        {bullet}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
