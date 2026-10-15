export const instant = false;

import {
  type ServiceListItem,
  ServicesList,
} from "@/components/admin/modules/services-list";
import { requireRole } from "@/server/auth/guard";
import { getAdminServices } from "@/server/queries/admin";

export default async function AdminServicesPage() {
  await requireRole("editor");
  const services = await getAdminServices();

  return <ServicesList initialServices={services as ServiceListItem[]} />;
}
