import { ServiceCard } from "@/components/site/cards/service-card";
import { SectionHeading } from "@/components/site/section-heading";
import type { ServicesSection } from "@/lib/schemas/sections";

export interface ServiceItemData {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  summary: string;
  cardTone?: string | null;
  sortOrder?: number;
}

interface ServicesSectionComponentProps {
  section: ServicesSection;
  services: ServiceItemData[];
}

export function ServicesSectionComponent({
  section,
  services,
}: ServicesSectionComponentProps) {
  const { data } = section;

  // Filter or order services if serviceIds specified in section data
  let displayServices = [...services];
  if (data.serviceIds && data.serviceIds.length > 0) {
    const idSet = new Set(data.serviceIds);
    displayServices = displayServices.filter((s) => idSet.has(s.id));
  }

  // Tones sequence if cardTone not explicitly set
  const defaultTones: Array<"royal" | "charcoal" | "navy" | "slate"> = [
    "royal",
    "charcoal",
    "navy",
    "slate",
  ];

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-sky-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        <SectionHeading
          eyebrow={data.eyebrow || "• OUR CORE SERVICES"}
          title={data.title}
          highlight={data.highlight}
          description={data.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {displayServices.map((service, idx) => {
            const tone =
              (service.cardTone as
                | "royal"
                | "charcoal"
                | "navy"
                | "slate"
                | undefined) || defaultTones[idx % defaultTones.length];

            return (
              <ServiceCard
                key={service.slug}
                index={idx}
                slug={service.slug}
                title={service.title}
                tagline={service.tagline || undefined}
                summary={service.summary}
                tone={tone}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
