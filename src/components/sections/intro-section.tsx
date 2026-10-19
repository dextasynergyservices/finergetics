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
    <section className="py-20 sm:py-28 lg:py-36 bg-navy-950 text-white relative overflow-hidden border-b border-royal-900/40">
      {/* Precision Geometric Grid & Node Architectural Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="what-we-do-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#cde2f7"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
            <circle cx="0" cy="0" r="1.25" fill="#7dd3fc" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#what-we-do-grid)" />
      </svg>

      {/* Atmospheric brand blue glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-royal-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-royal-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12 relative z-10">
        <SectionHeading
          eyebrow={data.eyebrow || "• WHAT WE DO"}
          title={data.title}
          highlight={data.highlight}
          tone="dark"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-100 font-body leading-relaxed">
                {data.narrative}
              </p>
            </Reveal>
          </div>

          {data.bullets && data.bullets.length > 0 && (
            <div className="lg:col-span-5 bg-white/[0.08] backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-200 mb-6">
                Core Engagement Capabilities
              </p>

              <Stagger className="space-y-4">
                {data.bullets.map((bullet) => (
                  <StaggerItem key={bullet}>
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-300/30 text-sky-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-white leading-snug">
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
