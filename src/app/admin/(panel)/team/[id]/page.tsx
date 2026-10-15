export const instant = false;

import { notFound } from "next/navigation";
import { TeamForm } from "@/components/admin/modules/team-form";
import type { TeamMemberInput } from "@/lib/schemas/team";
import { requireRole } from "@/server/auth/guard";
import { getAdminTeamMemberById } from "@/server/queries/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditTeamMemberPage(props: PageProps) {
  await requireRole("editor");
  const { id } = await props.params;
  const member = await getAdminTeamMemberById(id);

  if (!member) {
    notFound();
  }

  const initialData: TeamMemberInput & { id: string } = {
    id: member.id,
    slug: member.slug,
    name: member.name,
    role: member.role,
    credentials: member.credentials || "",
    highlights: (member.highlights as string[]) || [],
    bio: member.bio as Record<string, unknown> | undefined,
    photo: member.photo,
    linkedinUrl: member.linkedinUrl || "",
    sortOrder: member.sortOrder,
    status: member.status,
  };

  return <TeamForm initialData={initialData} isEdit />;
}
