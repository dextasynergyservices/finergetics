export const instant = false;

import {
  TeamList,
  type TeamMemberItem,
} from "@/components/admin/modules/team-list";
import { requireRole } from "@/server/auth/guard";
import { getAdminTeamMembers } from "@/server/queries/admin";

export default async function AdminTeamPage() {
  await requireRole("editor");
  const members = await getAdminTeamMembers();

  return <TeamList initialMembers={members as TeamMemberItem[]} />;
}
