export const instant = false;

import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/modules/post-form";
import type { PostInput } from "@/lib/schemas/post";
import { requireRole } from "@/server/auth/guard";
import {
  getAdminPostById,
  getAdminPostCategories,
  getAdminTeamMembers,
} from "@/server/queries/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPostPage(props: PageProps) {
  await requireRole("editor");
  const { id } = await props.params;

  const [post, categories, team] = await Promise.all([
    getAdminPostById(id),
    getAdminPostCategories(),
    getAdminTeamMembers(),
  ]);

  if (!post) {
    notFound();
  }

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));
  const authorOptions = team.map((t) => ({
    id: t.id,
    name: `${t.name} (${t.role})`,
  }));

  const initialData: PostInput & { id: string } = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body as Record<string, unknown>,
    cover: post.cover,
    categoryId: post.categoryId,
    authorId: post.authorId,
    readingMinutes: post.readingMinutes || 5,
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
    status: post.status,
  };

  return (
    <PostForm
      initialData={initialData}
      categories={categoryOptions}
      authors={authorOptions}
      isEdit
    />
  );
}
