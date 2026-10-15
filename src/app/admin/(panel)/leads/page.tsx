export const instant = false;

import {
  type LeadItem,
  LeadsInbox,
} from "@/components/admin/modules/leads-inbox";
import { requireAdmin } from "@/server/auth/guard";
import { getAdminLeads } from "@/server/queries/admin";

export default async function AdminLeadsPage() {
  await requireAdmin();
  const rawLeads = await getAdminLeads();

  return <LeadsInbox initialLeads={rawLeads as LeadItem[]} />;
}
