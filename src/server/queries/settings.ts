import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { siteSettingsDataSchema } from "@/lib/schemas/settings";
import { db } from "@/server/db";
import { siteSettings } from "@/server/db/schema";

export async function getSiteSettings() {
  "use cache";
  cacheTag("settings");
  cacheLife("days");

  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1);

    if (!rows[0]?.data) {
      return siteSettingsDataSchema.parse({
        general: {},
        contact: {},
        social: {},
        navigation: {},
        security: {},
      });
    }

    return siteSettingsDataSchema.parse(rows[0].data);
  } catch (error) {
    console.warn(
      "getSiteSettings: DB unreachable during build/render, returning default settings:",
      error,
    );
    return siteSettingsDataSchema.parse({
      general: {},
      contact: {},
      social: {},
      navigation: {},
      security: {},
    });
  }
}
