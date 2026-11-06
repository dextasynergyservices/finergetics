export const instant = false;

import { FreshOnNavigate } from "@/components/admin/fresh-on-navigate";
import { ServiceForm } from "@/components/admin/modules/service-form";
import { requireRole } from "@/server/auth/guard";

export default async function AdminNewServicePage() {
  await requireRole("editor");
  return (
    <FreshOnNavigate>
      <ServiceForm />
    </FreshOnNavigate>
  );
}
