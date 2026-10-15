import { TeamCard } from "@/components/site/cards/team-card";
import { SectionHeading } from "@/components/site/section-heading";
import type { TeamSection } from "@/lib/schemas/sections";

export interface TeamMemberData {
  id: string;
  slug: string;
  name: string;
  role: string;
  credentials?: string | null;
  highlights?: string[] | null;
  linkedinUrl?: string | null;
}

interface TeamSectionComponentProps {
  section: TeamSection;
  team: TeamMemberData[];
}

export function TeamSectionComponent({
  section,
  team,
}: TeamSectionComponentProps) {
  const { data } = section;

  // Filter or order team members if memberIds specified
  let displayMembers = [...team];
  if (data.memberIds && data.memberIds.length > 0) {
    const idSet = new Set(data.memberIds);
    displayMembers = displayMembers.filter((m) => idSet.has(m.id));
  }

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white border-b border-silver-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        <SectionHeading
          eyebrow={data.eyebrow || "• PRINCIPAL CONSULTANTS"}
          title={data.title}
          highlight={data.highlight}
          description={data.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayMembers.map((member) => (
            <TeamCard
              key={member.slug}
              slug={member.slug}
              name={member.name}
              roleTitle={member.role}
              credentials={member.credentials || undefined}
              highlights={member.highlights || undefined}
              linkedinUrl={member.linkedinUrl || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
