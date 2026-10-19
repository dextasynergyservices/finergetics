import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CtaButton } from "@/components/site/cta-button";
import type { HeroSection } from "@/lib/schemas/sections";

interface HeroSectionComponentProps {
  section: HeroSection;
}

export function HeroSectionComponent({ section }: HeroSectionComponentProps) {
  const { data } = section;

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Optional Corporate Background Image */}
      {data.backgroundImage?.publicId && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src={data.backgroundImage.publicId}
            alt={data.backgroundImage.alt || "Finergetics Corporate Advisory"}
            fill
            priority
            className="object-cover object-right lg:object-center select-none opacity-85 sm:opacity-90 transition-opacity"
            sizes="100vw"
          />
          {/* Multi-layer protective directional gradient ensuring clear image visibility while protecting typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 via-45% to-white/35 lg:to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/80 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="max-w-4xl space-y-6">
          <Reveal delay={0.04}>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl uppercase tracking-tight text-navy-950 leading-[1.12]">
              {data.headline}{" "}
              {data.highlightedText && (
                <span className="font-ui font-extrabold italic normal-case text-royal-600 block sm:inline-block sm:whitespace-nowrap">
                  {data.highlightedText}
                </span>
              )}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-body">
              {data.subheadline}
            </p>
          </Reveal>

          <Stagger className="flex flex-wrap items-center gap-4 pt-4">
            {data.ctaPrimaryText && data.ctaPrimaryLink && (
              <StaggerItem>
                <CtaButton
                  href={data.ctaPrimaryLink}
                  size="lg"
                  variant="primary"
                >
                  {data.ctaPrimaryText}
                </CtaButton>
              </StaggerItem>
            )}

            {data.ctaSecondaryText && data.ctaSecondaryLink && (
              <StaggerItem>
                <CtaButton
                  href={data.ctaSecondaryLink}
                  size="lg"
                  variant="outline"
                >
                  {data.ctaSecondaryText}
                </CtaButton>
              </StaggerItem>
            )}
          </Stagger>
        </div>

        {data.image?.publicId && (
          <Reveal delay={0.24} className="mt-16 sm:mt-24">
            <div className="relative rounded-3xl overflow-hidden border border-silver-400/25 shadow-xl aspect-[16/9] sm:aspect-[21/9]">
              <Image
                src={data.image.publicId}
                alt={data.image.alt || "Finergetics Energy Advisory"}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
