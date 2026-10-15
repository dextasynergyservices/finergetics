import { Award, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { SectionHeading } from "@/components/site/section-heading";
import type { WhyUsSection } from "@/lib/schemas/sections";

interface WhyUsSectionComponentProps {
  section: WhyUsSection;
}

const PILLAR_ICONS = [Award, Globe2, ShieldCheck, Sparkles];

export function WhyUsSectionComponent({ section }: WhyUsSectionComponentProps) {
  const { data } = section;

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-sky-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        <SectionHeading
          eyebrow={data.eyebrow || "• WHY CHOOSE US"}
          title={data.title}
          highlight={data.highlight}
          description={data.description}
        />

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {data.pillars.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];

            return (
              <StaggerItem key={pillar.title}>
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-silver-400/25 shadow-sm h-full flex flex-col justify-between hover:border-royal-600/40 transition-colors group">
                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-royal-50 border border-royal-600/20 text-royal-600 flex items-center justify-center group-hover:bg-royal-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-display text-2xl uppercase tracking-tight text-navy-950 group-hover:text-royal-600 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-body">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-silver-400/15 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Pillar 0{idx + 1}</span>
                    <span className="text-royal-600 font-bold">•</span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
