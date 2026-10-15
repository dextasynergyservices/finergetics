import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { teamMembers } from "@/server/db/schema";

export async function getPublishedTeamMembers() {
  "use cache";
  cacheTag("team");
  cacheLife("days");

  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.status, "published"))
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.createdAt));
}

export async function getTeamMemberBySlug(slug: string) {
  "use cache";
  cacheTag("team", `team:${slug}`);
  cacheLife("days");

  const rows = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.slug, slug), eq(teamMembers.status, "published")))
    .limit(1);

  return rows[0] || null;
}
