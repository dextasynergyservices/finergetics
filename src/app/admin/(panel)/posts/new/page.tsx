export const instant = false;

import { PostForm } from "@/components/admin/modules/post-form";
import { requireRole } from "@/server/auth/guard";
import {
  getAdminPostCategories,
  getAdminTeamMembers,
} from "@/server/queries/admin";

export default async function AdminNewPostPage() {
  await requireRole("editor");
  const [categories, team] = await Promise.all([
    getAdminPostCategories(),
    getAdminTeamMembers(),
  ]);

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));
  const authorOptions = team.map((t) => ({
    id: t.id,
    name: `${t.name} (${t.role})`,
  }));

  return <PostForm categories={categoryOptions} authors={authorOptions} />;
}
