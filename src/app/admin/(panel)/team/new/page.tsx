export const instant = false;

import { TeamForm } from "@/components/admin/modules/team-form";
import { requireRole } from "@/server/auth/guard";

export default async function AdminNewTeamMemberPage() {
  await requireRole("editor");
  return <TeamForm />;
}
