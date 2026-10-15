import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { caseStudies, services } from "@/server/db/schema";

export async function getPublishedCaseStudies(options?: {
  featuredOnly?: boolean;
  limit?: number;
}) {
  "use cache";
  cacheTag("case_studies");
  cacheLife("days");

  const conditions = [eq(caseStudies.status, "published")];
  if (options?.featuredOnly) {
    conditions.push(eq(caseStudies.featured, true));
  }

  const query = db
    .select({
      id: caseStudies.id,
      slug: caseStudies.slug,
      title: caseStudies.title,
      clientName: caseStudies.clientName,
      industry: caseStudies.industry,
      summary: caseStudies.summary,
      metrics: caseStudies.metrics,
      cover: caseStudies.cover,
      featured: caseStudies.featured,
      publishedAt: caseStudies.publishedAt,
      serviceTitle: services.title,
      serviceSlug: services.slug,
    })
    .from(caseStudies)
    .leftJoin(services, eq(caseStudies.serviceId, services.id))
    .where(and(...conditions))
    .orderBy(desc(caseStudies.publishedAt), desc(caseStudies.createdAt));

  if (options?.limit) {
    return query.limit(options.limit);
  }

  return query;
}

export async function getCaseStudyBySlug(slug: string) {
  "use cache";
  cacheTag("case_studies", `case_study:${slug}`);
  cacheLife("days");

  const rows = await db
    .select({
      id: caseStudies.id,
      slug: caseStudies.slug,
      title: caseStudies.title,
      clientName: caseStudies.clientName,
      industry: caseStudies.industry,
      summary: caseStudies.summary,
      challenge: caseStudies.challenge,
      approach: caseStudies.approach,
      outcome: caseStudies.outcome,
      metrics: caseStudies.metrics,
      cover: caseStudies.cover,
      featured: caseStudies.featured,
      publishedAt: caseStudies.publishedAt,
      seoTitle: caseStudies.seoTitle,
      seoDescription: caseStudies.seoDescription,
      serviceId: caseStudies.serviceId,
      serviceTitle: services.title,
      serviceSlug: services.slug,
    })
    .from(caseStudies)
    .leftJoin(services, eq(caseStudies.serviceId, services.id))
    .where(and(eq(caseStudies.slug, slug), eq(caseStudies.status, "published")))
    .limit(1);

  return rows[0] || null;
}
