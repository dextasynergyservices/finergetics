import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { teamMembers } from "@/server/db/schema";

export async function getPublishedTeamMembers() {
  "use cache";
  cacheTag("team");
  cacheLife("days");

  try {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.status, "published"))
      .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.createdAt));
  } catch (error) {
    console.warn(
      "getPublishedTeamMembers: DB unreachable during build/render, returning empty list:",
      error,
    );
    return [];
  }
}

export async function getTeamMemberBySlug(slug: string) {
  "use cache";
  cacheTag("team", `team:${slug}`);
  cacheLife("days");

  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.slug, slug), eq(teamMembers.status, "published")),
      )
      .limit(1);

    return rows[0] || null;
  } catch (error) {
    console.warn(
      `getTeamMemberBySlug(${slug}): DB unreachable during build/render, returning null:`,
      error,
    );
    return null;
  }
}
