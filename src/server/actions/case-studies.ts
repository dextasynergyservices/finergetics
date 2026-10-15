"use server";

import { eq } from "drizzle-orm";
import { caseStudyInputSchema } from "@/lib/schemas/case-study";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { caseStudies } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

export async function createCaseStudyAction(rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = caseStudyInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [cs] = await db
    .insert(caseStudies)
    .values({
      slug: validated.data.slug,
      title: validated.data.title,
      clientName: validated.data.clientName,
      industry: validated.data.industry,
      serviceId: validated.data.serviceId || null,
      summary: validated.data.summary,
      challenge: validated.data.challenge,
      approach: validated.data.approach,
      outcome: validated.data.outcome,
      metrics: validated.data.metrics,
      cover: validated.data.cover,
      featured: validated.data.featured,
      publishedAt:
        validated.data.status === "published"
          ? validated.data.publishedAt || new Date()
          : null,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      status: validated.data.status,
    })
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "case_study.create",
    entity: "case_studies",
    entityId: cs?.id,
    summary: { title: validated.data.title, slug: validated.data.slug },
  });

  await revalidateContent(["case_studies", "pages"]);

  return { success: true, caseStudy: cs };
}

export async function updateCaseStudyAction(id: string, rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = caseStudyInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [cs] = await db
    .update(caseStudies)
    .set({
      slug: validated.data.slug,
      title: validated.data.title,
      clientName: validated.data.clientName,
      industry: validated.data.industry,
      serviceId: validated.data.serviceId || null,
      summary: validated.data.summary,
      challenge: validated.data.challenge,
      approach: validated.data.approach,
      outcome: validated.data.outcome,
      metrics: validated.data.metrics,
      cover: validated.data.cover,
      featured: validated.data.featured,
      publishedAt:
        validated.data.status === "published"
          ? validated.data.publishedAt || new Date()
          : null,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      status: validated.data.status,
      updatedAt: new Date(),
    })
    .where(eq(caseStudies.id, id))
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "case_study.update",
    entity: "case_studies",
    entityId: id,
    summary: { title: validated.data.title, status: validated.data.status },
  });

  await revalidateContent(["case_studies", "pages"]);

  return { success: true, caseStudy: cs };
}

export async function deleteCaseStudyAction(id: string) {
  const { user } = await requireRole("editor");

  const [deleted] = await db
    .delete(caseStudies)
    .where(eq(caseStudies.id, id))
    .returning();

  if (deleted) {
    await recordAuditLog({
      userId: user.id,
      action: "case_study.delete",
      entity: "case_studies",
      entityId: id,
      summary: { title: deleted.title },
    });
  }

  await revalidateContent(["case_studies", "pages"]);

  return { success: true };
}
