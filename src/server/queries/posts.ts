import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { postCategories, posts, teamMembers } from "@/server/db/schema";

export async function getPublishedPostCategories() {
  "use cache";
  cacheTag("post_categories");
  cacheLife("days");

  try {
    return await db.select().from(postCategories).orderBy(postCategories.name);
  } catch (error) {
    console.warn(
      "getPublishedPostCategories: DB unreachable during build/render, returning empty list:",
      error,
    );
    return [];
  }
}

export async function getPublishedPosts(options?: {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}) {
  "use cache";
  cacheTag("posts");
  cacheLife("days");

  try {
    const conditions = [eq(posts.status, "published")];

    if (options?.categorySlug) {
      conditions.push(eq(postCategories.slug, options.categorySlug));
    }

    const query = db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        cover: posts.cover,
        readingMinutes: posts.readingMinutes,
        publishedAt: posts.publishedAt,
        categoryName: postCategories.name,
        categorySlug: postCategories.slug,
        authorName: teamMembers.name,
        authorSlug: teamMembers.slug,
        authorRole: teamMembers.role,
      })
      .from(posts)
      .leftJoin(postCategories, eq(posts.categoryId, postCategories.id))
      .leftJoin(teamMembers, eq(posts.authorId, teamMembers.id))
      .where(and(...conditions))
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt));

    if (options?.limit) {
      query.limit(options.limit);
    }
    if (options?.offset) {
      query.offset(options.offset);
    }

    return await query;
  } catch (error) {
    console.warn(
      "getPublishedPosts: DB unreachable during build/render, returning empty list:",
      error,
    );
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheTag("posts", `post:${slug}`);
  cacheLife("days");

  try {
    const rows = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        body: posts.body,
        cover: posts.cover,
        readingMinutes: posts.readingMinutes,
        publishedAt: posts.publishedAt,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        categoryName: postCategories.name,
        categorySlug: postCategories.slug,
        authorName: teamMembers.name,
        authorSlug: teamMembers.slug,
        authorRole: teamMembers.role,
        authorPhoto: teamMembers.photo,
      })
      .from(posts)
      .leftJoin(postCategories, eq(posts.categoryId, postCategories.id))
      .leftJoin(teamMembers, eq(posts.authorId, teamMembers.id))
      .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
      .limit(1);

    return rows[0] || null;
  } catch (error) {
    console.warn(
      `getPostBySlug(${slug}): DB unreachable during build/render, returning build fallback:`,
      error,
    );
    return {
      id: "fallback-post-1",
      slug,
      title: "Advisory Perspective",
      excerpt: "Executive advisory insights and commercial perspectives.",
      body: null,
      cover: null,
      readingMinutes: 5,
      publishedAt: new Date(),
      seoTitle: "Advisory Perspective — Finergetics",
      seoDescription:
        "Executive advisory insights and commercial perspectives.",
      categoryName: "Energy Advisory",
      categorySlug: "energy-advisory",
      authorName: "Rotimi Lawuyi",
      authorSlug: "rotimi-lawuyi",
      authorRole: "Principal Consultant",
      authorPhoto: null,
    };
  }
}
