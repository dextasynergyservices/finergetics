export const instant = false;

import {
  type PageListItem,
  PagesList,
} from "@/components/admin/modules/pages-list";
import { requireRole } from "@/server/auth/guard";
import { getAdminPages } from "@/server/queries/admin";

export default async function AdminPagesOverviewPage() {
  await requireRole("editor");
  const pages = await getAdminPages();

  return <PagesList initialPages={pages as PageListItem[]} />;
}
