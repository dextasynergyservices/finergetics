import { SectionHeading } from "@/components/site/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqSection } from "@/lib/schemas/sections";

interface FaqSectionComponentProps {
  section: FaqSection;
}

export function FaqSectionComponent({ section }: FaqSectionComponentProps) {
  const { data } = section;

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-sky-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        <SectionHeading
          eyebrow={data.eyebrow || "• FREQUENTLY ASKED QUESTIONS"}
          title={data.title}
          highlight={data.highlight}
          description={data.description}
        />

        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-silver-400/25 max-w-4xl mx-auto shadow-sm">
          <Accordion className="w-full">
            {data.items.map((item, idx) => (
              <AccordionItem key={item.question} value={`item-${idx}`}>
                <AccordionTrigger className="text-left font-display text-lg sm:text-xl uppercase text-navy-950 hover:text-royal-600 transition-colors py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm sm:text-base leading-relaxed pb-6 font-body">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
