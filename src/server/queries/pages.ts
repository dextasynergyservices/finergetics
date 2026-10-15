import "server-only";
import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { pages } from "@/server/db/schema";

export async function getPageByKey(key: string) {
  "use cache";
  cacheTag("pages", `page:${key}`);
  cacheLife("days");

  const rows = await db
    .select()
    .from(pages)
    .where(and(eq(pages.key, key), eq(pages.status, "published")))
    .limit(1);

  return rows[0] || null;
}
