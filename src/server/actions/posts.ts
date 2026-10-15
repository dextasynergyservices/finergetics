"use server";

import { eq } from "drizzle-orm";
import { postCategoryInputSchema, postInputSchema } from "@/lib/schemas/post";
import { recordAuditLog } from "@/server/audit/audit";
import { requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { postCategories, posts } from "@/server/db/schema";
import { revalidateContent } from "./revalidate";

export async function createPostAction(rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = postInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [post] = await db
    .insert(posts)
    .values({
      slug: validated.data.slug,
      title: validated.data.title,
      excerpt: validated.data.excerpt,
      body: validated.data.body,
      cover: validated.data.cover,
      categoryId: validated.data.categoryId || null,
      authorId: validated.data.authorId || null,
      readingMinutes: validated.data.readingMinutes,
      publishedAt:
        validated.data.status === "published"
          ? validated.data.publishedAt || new Date()
          : null,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      status: validated.data.status,
    })
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "post.create",
    entity: "posts",
    entityId: post?.id,
    summary: { title: validated.data.title, slug: validated.data.slug },
  });

  await revalidateContent(["posts", "pages"]);

  return { success: true, post };
}

export async function updatePostAction(id: string, rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = postInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [post] = await db
    .update(posts)
    .set({
      slug: validated.data.slug,
      title: validated.data.title,
      excerpt: validated.data.excerpt,
      body: validated.data.body,
      cover: validated.data.cover,
      categoryId: validated.data.categoryId || null,
      authorId: validated.data.authorId || null,
      readingMinutes: validated.data.readingMinutes,
      publishedAt:
        validated.data.status === "published"
          ? validated.data.publishedAt || new Date()
          : null,
      seoTitle: validated.data.seoTitle,
      seoDescription: validated.data.seoDescription,
      status: validated.data.status,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "post.update",
    entity: "posts",
    entityId: id,
    summary: { title: validated.data.title, status: validated.data.status },
  });

  await revalidateContent(["posts", "pages"]);

  return { success: true, post };
}

export async function deletePostAction(id: string) {
  const { user } = await requireRole("editor");

  const [deleted] = await db.delete(posts).where(eq(posts.id, id)).returning();

  if (deleted) {
    await recordAuditLog({
      userId: user.id,
      action: "post.delete",
      entity: "posts",
      entityId: id,
      summary: { title: deleted.title },
    });
  }

  await revalidateContent(["posts", "pages"]);

  return { success: true };
}

export async function createPostCategoryAction(rawInput: unknown) {
  const { user } = await requireRole("editor");

  const validated = postCategoryInputSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error:
        "Validation failed: " +
        validated.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [category] = await db
    .insert(postCategories)
    .values({
      slug: validated.data.slug,
      name: validated.data.name,
    })
    .returning();

  await recordAuditLog({
    userId: user.id,
    action: "category.create",
    entity: "post_categories",
    entityId: category?.id,
    summary: { name: validated.data.name },
  });

  await revalidateContent(["post_categories", "posts"]);

  return { success: true, category };
}

export async function deletePostCategoryAction(id: string) {
  const { user } = await requireRole("editor");

  const [deleted] = await db
    .delete(postCategories)
    .where(eq(postCategories.id, id))
    .returning();

  if (deleted) {
    await recordAuditLog({
      userId: user.id,
      action: "category.delete",
      entity: "post_categories",
      entityId: id,
      summary: { name: deleted.name },
    });
  }

  await revalidateContent(["post_categories", "posts"]);

  return { success: true };
}
