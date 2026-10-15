export const instant = false;

import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/modules/service-form";
import type { ServiceCardTone, ServiceInput } from "@/lib/schemas/service";
import { requireRole } from "@/server/auth/guard";
import { getAdminServiceById } from "@/server/queries/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditServicePage(props: PageProps) {
  await requireRole("editor");
  const { id } = await props.params;
  const service = await getAdminServiceById(id);

  if (!service) {
    notFound();
  }

  const initialData: ServiceInput & { id: string } = {
    id: service.id,
    slug: service.slug,
    title: service.title,
    tagline: service.tagline || "",
    summary: service.summary,
    body: service.body as Record<string, unknown> | undefined,
    icon: service.icon || "ShieldCheck",
    cardTone: (service.cardTone as ServiceCardTone) || "royal",
    image: service.image,
    sortOrder: service.sortOrder,
    seoTitle: service.seoTitle || "",
    seoDescription: service.seoDescription || "",
    status: service.status,
  };

  return <ServiceForm initialData={initialData} isEdit />;
}
