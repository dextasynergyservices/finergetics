"use server";

import { revalidateTag, updateTag } from "next/cache";

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

  return { success: true, revalidatedTags: tagList, timestamp: Date.now() };
}

/**
 * Convenience helper to invalidate all public content caches
 */
export async function revalidateAllContent() {
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
