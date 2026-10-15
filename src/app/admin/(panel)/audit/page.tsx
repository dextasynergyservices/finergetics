export const instant = false;

import {
  type AuditLogItem,
  AuditViewer,
} from "@/components/admin/modules/audit-viewer";
import { requireAdmin } from "@/server/auth/guard";
import { getAdminAuditLogs } from "@/server/queries/admin";

export default async function AdminAuditPage() {
  await requireAdmin();
  const rawLogs = await getAdminAuditLogs(100);

  return <AuditViewer initialLogs={rawLogs as AuditLogItem[]} />;
}
