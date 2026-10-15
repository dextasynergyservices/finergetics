import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { services } from "@/server/db/schema";

export async function getPublishedServices() {
  "use cache";
  cacheTag("services");
  cacheLife("days");

  return db
    .select()
    .from(services)
    .where(eq(services.status, "published"))
    .orderBy(asc(services.sortOrder), asc(services.createdAt));
}

export async function getServiceBySlug(slug: string) {
  "use cache";
  cacheTag("services", `service:${slug}`);
  cacheLife("days");

  const rows = await db
    .select()
    .from(services)
    .where(and(eq(services.slug, slug), eq(services.status, "published")))
    .limit(1);

  return rows[0] || null;
}
