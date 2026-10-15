export const instant = false;

import { notFound } from "next/navigation";
import { CaseStudyForm } from "@/components/admin/modules/case-study-form";
import type { CaseStudyInput, MetricItem } from "@/lib/schemas/case-study";
import { requireRole } from "@/server/auth/guard";
import {
  getAdminCaseStudyById,
  getAdminServices,
} from "@/server/queries/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCaseStudyPage(props: PageProps) {
  await requireRole("editor");
  const { id } = await props.params;
  const [cs, services] = await Promise.all([
    getAdminCaseStudyById(id),
    getAdminServices(),
  ]);

  if (!cs) {
    notFound();
  }

  const availableServices = services.map((s) => ({
    id: s.id,
    title: s.title,
  }));

  const initialData: CaseStudyInput & { id: string } = {
    id: cs.id,
    slug: cs.slug,
    title: cs.title,
    clientName: cs.clientName || "",
    industry: cs.industry || "",
    serviceId: cs.serviceId,
    summary: cs.summary,
    challenge: cs.challenge as Record<string, unknown> | undefined,
    approach: cs.approach as Record<string, unknown> | undefined,
    outcome: cs.outcome as Record<string, unknown> | undefined,
    metrics: (cs.metrics as MetricItem[]) || [],
    cover: cs.cover,
    featured: cs.featured,
    seoTitle: cs.seoTitle || "",
    seoDescription: cs.seoDescription || "",
    status: cs.status,
  };

  return (
    <CaseStudyForm
      initialData={initialData}
      availableServices={availableServices}
      isEdit
    />
  );
}
