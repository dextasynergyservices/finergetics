"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";

export type ContentTag =
  | "services"
  | "pages"
  | "team"
  | "case_studies"
  | "posts"
  | "post_categories"
  | "settings"
  | (string & {});

/**
 * Revalidates single or multiple cache tags in Next.js 16 Cache Components
 */
export async function revalidateContent(tags: ContentTag | ContentTag[]) {
  const tagList = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagList) {
    if (tag) {
      updateTag(tag);
      revalidateTag(tag, { expire: 0 });
    }
  }

  // Admin pages read the DB directly (no cache tags), but the client router
  // and Cache Components keep previously visited admin routes alive. Purge
  // them so lists/editors show the saved data without a manual refresh.
  revalidatePath("/admin", "layout");

  return { success: true, revalidatedTags: tagList, timestamp: Date.now() };
}

import { requireAdmin } from "@/server/auth/guard";

/**
 * Convenience helper to invalidate all public content caches (Admin only)
 */
export async function revalidateAllContent() {
  await requireAdmin();
  const allTags: ContentTag[] = [
    "services",
    "pages",
    "team",
    "case_studies",
    "posts",
    "post_categories",
    "settings",
  ];

  return revalidateContent(allTags);
}
