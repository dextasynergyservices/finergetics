export const instant = false;

import {
  CaseStudiesList,
  type CaseStudyListItem,
} from "@/components/admin/modules/case-studies-list";
import { requireRole } from "@/server/auth/guard";
import { getAdminCaseStudies } from "@/server/queries/admin";

export default async function AdminCaseStudiesPage() {
  await requireRole("editor");
  const caseStudies = await getAdminCaseStudies();

  return (
    <CaseStudiesList initialCaseStudies={caseStudies as CaseStudyListItem[]} />
  );
}
