export const instant = false;

import { CaseStudyForm } from "@/components/admin/modules/case-study-form";
import { requireRole } from "@/server/auth/guard";
import { getAdminServices } from "@/server/queries/admin";

export default async function AdminNewCaseStudyPage() {
  await requireRole("editor");
  const services = await getAdminServices();

  const availableServices = services.map((s) => ({
    id: s.id,
    title: s.title,
  }));

  return <CaseStudyForm availableServices={availableServices} />;
}
