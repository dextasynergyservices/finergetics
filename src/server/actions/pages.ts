"use server";

import { eq } from "drizzle-orm";
import { pageInputSchema } from "@/lib/schemas/page";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { pages } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

export async function updatePageAction(key: string, rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = pageInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [page] = await db
    .update(pages)
    .set({
      title: validated.data.title,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      ogImage: validated.data.ogImage,
      sections: validated.data.sections,
      status: validated.data.status,
      updatedAt: new Date(),
    })
    .where(eq(pages.key, key))
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "page.update",
    entity: "pages",
    entityId: key,
    summary: {
      title: validated.data.title,
      sectionsCount: validated.data.sections.length,
    },
  });

  await revalidateContent(["pages"]);

  return { success: true, page };
}
