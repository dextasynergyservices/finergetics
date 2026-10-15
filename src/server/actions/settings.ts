"use server";

import { siteSettingsDataSchema } from "@/lib/schemas/settings";
import { recordAuditLog } from "@/server/audit/audit";
import { requireAdmin } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { siteSettings } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

export async function updateSiteSettingsAction(rawInput: unknown) {
  const { user } = await requireAdmin();

  const validated = siteSettingsDataSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  // Update or insert singleton
  await db
    .insert(siteSettings)
    .values({
      id: 1,
      data: validated.data,
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        data: validated.data,
        updatedAt: new Date(),
      },
    });

  await recordAuditLog({
    userId: user.id,
    action: "settings.update",
    entity: "site_settings",
    entityId: "1",
    summary: { siteName: validated.data.general.siteName },
  });

  await revalidateContent(["settings", "pages"]);

  return { success: true };
}
