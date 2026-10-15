import { CtaButton } from "@/components/site/cta-button";
import type { CtaSection } from "@/lib/schemas/sections";

interface CtaSectionComponentProps {
  section: CtaSection;
}

export function CtaSectionComponent({ section }: CtaSectionComponentProps) {
  const { data } = section;

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="rounded-3xl bg-navy-950 text-white p-8 sm:p-12 md:p-20 border border-white/10 text-center space-y-6 shadow-xl relative overflow-hidden">
          {data.eyebrow && (
            <span className="text-xs font-bold tracking-widest uppercase text-sky-100 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-100 animate-pulse" />
              <span>{data.eyebrow}</span>
            </span>
          )}

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight max-w-3xl mx-auto leading-tight text-white">
            {data.title}
          </h2>

          <p className="text-silver-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-body">
            {data.lead}
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            {data.buttonText && data.buttonLink && (
              <CtaButton href={data.buttonLink} size="lg" variant="primary">
                {data.buttonText}
              </CtaButton>
            )}

            {data.secondaryText && data.secondaryLink && (
              <CtaButton href={data.secondaryLink} size="lg" variant="white">
                {data.secondaryText}
              </CtaButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
