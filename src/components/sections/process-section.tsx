import { type StepItem, StickyStack } from "@/components/motion/sticky-stack";
import { SectionHeading } from "@/components/site/section-heading";
import type { ProcessSection } from "@/lib/schemas/sections";

interface ProcessSectionComponentProps {
  section: ProcessSection;
}

export function ProcessSectionComponent({
  section,
}: ProcessSectionComponentProps) {
  const { data } = section;

  const steps: StepItem[] = data.steps.map((s) => ({
    number: s.number,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    deliverables: s.deliverables,
    takeaway: s.takeaway,
    tone: s.tone || "royal",
  }));

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white border-y border-silver-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        <SectionHeading
          eyebrow={data.eyebrow || "• ADVISORY METHODOLOGY"}
          title={data.title}
          highlight={data.highlight}
          description={data.description}
        />

        <StickyStack steps={steps} />
      </div>
    </section>
  );
}
