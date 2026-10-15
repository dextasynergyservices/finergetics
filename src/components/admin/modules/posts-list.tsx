"use client";

import { Clock, Edit3, Newspaper, Plus, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge } from "@/components/admin/status-badge";
import { TableActionMenu } from "@/components/admin/table-actions";
import {
  createPostCategoryAction,
  deletePostAction,
  deletePostCategoryAction,
} from "@/server/actions/posts";

export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: string | null;
  readingMinutes: number | null;
  status: "draft" | "published" | "archived";
  createdAt: Date;
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
}

interface PostsListProps {
  initialPosts: PostListItem[];
  initialCategories: CategoryItem[];
}

export function PostsList({ initialPosts, initialCategories }: PostsListProps) {
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts);
  const [categories, setCategories] =
    useState<CategoryItem[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  const [deleteTarget, setDeleteTarget] = useState<PostListItem | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] =
    useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New category modal state
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Pagination states
  const [postsPage, setPostsPage] = useState(1);
  const postsPageSize = 10;
  const totalPostsPages = Math.ceil(posts.length / postsPageSize) || 1;
  const paginatedPosts = posts.slice(
    (postsPage - 1) * postsPageSize,
    postsPage * postsPageSize,
  );

  const [categoriesPage, setCategoriesPage] = useState(1);
  const categoriesPageSize = 12;
  const totalCategoriesPages =
    Math.ceil(categories.length / categoriesPageSize) || 1;
  const paginatedCategories = categories.slice(
    (categoriesPage - 1) * categoriesPageSize,
    categoriesPage * categoriesPageSize,
  );

  const handleDeletePost = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePostAction(deleteTarget.id);
      if (res.success) {
        setPosts(posts.filter((p) => p.id !== deleteTarget.id));
        toast.success(`Deleted post "${deleteTarget.title}"`);
      } else {
        toast.error("Failed to delete post");
      }
    } catch {
      toast.error("Error deleting post");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmittingCat(true);
    const slug = newCatName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    try {
      const res = await createPostCategoryAction({
        name: newCatName.trim(),
        slug,
      });
      if (res.success && res.category) {
        setCategories([...categories, res.category]);
        toast.success(`Category "${newCatName}" created!`);
        setNewCatName("");
        setIsNewCategoryOpen(false);
      } else {
        toast.error(res.error || "Failed to create category");
      }
    } catch {
      toast.error("Error creating category");
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    try {
      const res = await deletePostCategoryAction(deleteCategoryTarget.id);
      if (res.success) {
        setCategories(
          categories.filter((c) => c.id !== deleteCategoryTarget.id),
        );
        toast.success(`Category "${deleteCategoryTarget.name}" removed`);
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Error deleting category");
    } finally {
      setDeleteCategoryTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Advisory Insights & Editorial Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author industry viewpoints, executive insights, technical
            whitepapers, and category taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "posts" ? (
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Write Article</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsNewCategoryOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-silver-400/20 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "posts"
              ? "bg-royal-600 text-white"
              : "bg-white text-slate-600 hover:bg-sky-50 border border-silver-400/25"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Articles ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-royal-600 text-white"
              : "bg-white text-slate-600 hover:bg-sky-50 border border-silver-400/25"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Taxonomies ({categories.length})</span>
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" &&
        (posts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-ink-900">
              No editorial articles yet
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &ldquo;Write Article&rdquo; above to produce thought
              leadership content.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {paginatedPosts.map((post) => {
                const cat = categories.find((c) => c.id === post.categoryId);
                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-silver-400/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-silver-400/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-royal-50 text-royal-600 flex items-center justify-center shrink-0">
                        <Newspaper className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-ink-900">
                            {post.title}
                          </h2>
                          {cat && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-royal-50 text-royal-700 border border-royal-100">
                              {cat.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readingMinutes || 5} min read</span>
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-xs">{post.slug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver-400/15">
                      <StatusBadge status={post.status} />

                      <TableActionMenu
                        items={[
                          {
                            label: "Edit Article",
                            icon: Edit3,
                            href: `/admin/posts/${post.id}`,
                          },
                          {
                            label: "Delete Article",
                            icon: Trash2,
                            destructive: true,
                            onClick: () => setDeleteTarget(post),
                          },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={postsPage}
              totalPages={totalPostsPages}
              totalItems={posts.length}
              pageSize={postsPageSize}
              itemName="articles"
              onPageChange={(page) => setPostsPage(page)}
            />
          </div>
        ))}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Topic Categories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {paginatedCategories.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-sky-50/50 border border-silver-400/20 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-bold text-ink-900">{c.name}</p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {c.slug}
                  </p>
                </div>
                <TableActionMenu
                  items={[
                    {
                      label: "Delete Taxonomy",
                      icon: Trash2,
                      destructive: true,
                      onClick: () => setDeleteCategoryTarget(c),
                    },
                  ]}
                />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={categoriesPage}
            totalPages={totalCategoriesPages}
            totalItems={categories.length}
            pageSize={categoriesPageSize}
            itemName="taxonomies"
            onPageChange={(page) => setCategoriesPage(page)}
          />
        </div>
      )}

      {/* Add Category Modal */}
      {isNewCategoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewCategoryOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsNewCategoryOpen(false);
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-silver-400/25 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h2 className="text-sm font-bold text-ink-900">
              Add Topic Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label
                  htmlFor="cat-name-input"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Category Name *
                </label>
                <input
                  id="cat-name-input"
                  type="text"
                  required
                  placeholder="e.g. Risk Governance"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl border border-silver-400/25 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCat}
                  className="px-5 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Article"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Article"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDeletePost}
      />

      <ConfirmDialog
        open={Boolean(deleteCategoryTarget)}
        onOpenChange={(open) => !open && setDeleteCategoryTarget(null)}
        title="Remove Category"
        description={`Are you sure you want to delete category "${deleteCategoryTarget?.name}"?`}
        confirmLabel="Delete Category"
        variant="destructive"
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
