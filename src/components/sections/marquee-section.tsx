import { Marquee } from "@/components/motion/marquee";
import type { MarqueeSection } from "@/lib/schemas/sections";

interface MarqueeSectionComponentProps {
  section: MarqueeSection;
}

export function MarqueeSectionComponent({
  section,
}: MarqueeSectionComponentProps) {
  const { data } = section;

  return (
    <section className="py-8 bg-sky-50/70 border-y border-silver-400/20 overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-3">
        {data.label && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {data.label}
          </p>
        )}
      </div>

      <Marquee speed={data.speed || 35}>
        {data.items.map((item) => (
          <span
            key={item}
            className="flex items-center gap-4 text-xs sm:text-sm font-bold tracking-wider uppercase text-navy-950 px-6 sm:px-8 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-royal-600 shrink-0" />
            <span>{item}</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
