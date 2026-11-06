"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { formatZodIssues } from "@/lib/schemas/common";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { cloudinary } from "@/server/cloudinary";
import { db } from "@/server/db/client";
import { mediaAssets } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

const registerMediaSchema = z.object({
  publicId: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().optional(),
  format: z.string().optional(),
  alt: z.string().optional(),
  folder: z.string().optional(),
});

export async function registerMediaAssetAction(rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = registerMediaSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error: `Validation failed: ${formatZodIssues(validated.error.issues)}`,
    };
  }

  const [asset] = await db
    .insert(mediaAssets)
    .values({
      publicId: validated.data.publicId,
      width: validated.data.width,
      height: validated.data.height,
      bytes: validated.data.bytes,
      format: validated.data.format,
      alt: validated.data.alt,
      folder: validated.data.folder,
      uploadedBy: user.email,
    })
    .onConflictDoUpdate({
      target: mediaAssets.publicId,
      set: {
        width: validated.data.width,
        height: validated.data.height,
        alt: validated.data.alt,
        updatedAt: new Date(),
      },
    })
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "media.register",
    entity: "media_assets",
    entityId: asset?.id,
    summary: { publicId: validated.data.publicId },
  });

  await revalidateContent([
    "pages",
    "services",
    "team",
    "posts",
    "case_studies",
  ]);

  return { success: true, asset };
}

export async function deleteMediaAssetAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const { user } = await requireRole("editor");

  if (!z.string().uuid().safeParse(id).success) {
    return { success: false, error: "Invalid media ID" };
  }

  const [deleted] = await db
    .delete(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .returning();

  if (!deleted) {
    return {
      success: false,
      error: "This photo no longer exists. Refresh the page.",
    };
  }

  // Remove the file from Cloudinary too, so deleted photos don't linger on the CDN.
  // Best-effort: the DB record is already gone, so a CDN hiccup must not block the admin.
  try {
    await cloudinary.uploader.destroy(deleted.publicId, { invalidate: true });
  } catch (err) {
    console.error("[Media] Cloudinary destroy failed:", deleted.publicId, err);
  }

  await recordAuditLog({
    userId: user.id,
    action: "media.delete",
    entity: "media_assets",
    entityId: id,
    summary: { publicId: deleted.publicId },
  });

  await revalidateContent([
    "pages",
    "services",
    "team",
    "posts",
    "case_studies",
  ]);

  return { success: true };
}
