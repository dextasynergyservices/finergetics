export const instant = false;

import { MediaManager } from "@/components/admin/modules/media-manager";
import { requireRole } from "@/server/auth/guard";
import { getAdminMediaAssets } from "@/server/queries/admin";

export default async function AdminMediaPage() {
  await requireRole("editor");
  const assets = await getAdminMediaAssets();

  return <MediaManager initialAssets={assets} />;
}
