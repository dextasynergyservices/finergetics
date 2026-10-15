export const instant = false;

import {
  type CategoryItem,
  type PostListItem,
  PostsList,
} from "@/components/admin/modules/posts-list";
import { requireRole } from "@/server/auth/guard";
import { getAdminPostCategories, getAdminPosts } from "@/server/queries/admin";

export default async function AdminPostsPage() {
  await requireRole("editor");
  const [posts, categories] = await Promise.all([
    getAdminPosts(),
    getAdminPostCategories(),
  ]);

  return (
    <PostsList
      initialPosts={posts as PostListItem[]}
      initialCategories={categories as CategoryItem[]}
    />
  );
}
