"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoFields } from "@/components/admin/seo-fields";
import type { PostInput } from "@/lib/schemas/post";
import { createPostAction, updatePostAction } from "@/server/actions/posts";

interface SelectOption {
  id: string;
  name: string;
}

interface PostFormProps {
  initialData?: PostInput & { id?: string };
  categories?: SelectOption[];
  authors?: SelectOption[];
  isEdit?: boolean;
}

export function PostForm({
  initialData,
  categories = [],
  authors = [],
  isEdit = false,
}: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<PostInput>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    body: initialData?.body || {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    cover: initialData?.cover || null,
    categoryId: initialData?.categoryId || null,
    authorId: initialData?.authorId || null,
    readingMinutes: initialData?.readingMinutes ?? 5,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    status: initialData?.status || "draft",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res =
        isEdit && initialData?.id
          ? await updatePostAction(initialData.id, form)
          : await createPostAction(form);

      if (res.success) {
        toast.success(isEdit ? "Article updated!" : "Article published!");
        router.push("/admin/posts");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save article");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 hover:bg-sky-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink-900 tracking-tight">
              {isEdit
                ? `Edit: ${form.title || "Article"}`
                : "Compose Thought Leadership"}
            </h1>
            <p className="text-xs text-slate-500">
              Draft or publish advisory insights, assign expert author, and
              optimize for search indexing.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEdit ? "Update Article" : "Save Article"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Article Header info */}
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Article Content & Abstract
            </h2>

            <div>
              <label
                htmlFor="post-title"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Headline / Title *
              </label>
              <input
                id="post-title"
                type="text"
                required
                placeholder="e.g. Navigating Transition Risks in West African Energy Markets"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const autoSlug = !isEdit
                    ? title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                    : form.slug;
                  setForm({ ...form, title, slug: autoSlug });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="post-slug"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  URL Slug *
                </label>
                <input
                  id="post-slug"
                  type="text"
                  required
                  placeholder="navigating-transition-risks"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs font-mono text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="post-reading-time"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Estimated Read Time (minutes)
                </label>
                <input
                  id="post-reading-time"
                  type="number"
                  min="1"
                  value={form.readingMinutes || 5}
                  onChange={(e) =>
                    setForm({ ...form, readingMinutes: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="post-excerpt"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Executive Abstract / Excerpt * (10 – 500 chars)
              </label>
              <textarea
                id="post-excerpt"
                rows={3}
                required
                placeholder="Succinct overview featured on article cards and social previews..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 leading-relaxed"
              />
            </div>
          </div>

          {/* Full Rich Article Body (RichTextEditor) */}
          <RichTextEditor
            label="Editorial Content Body"
            value={form.body}
            onChange={(doc) => setForm({ ...form, body: doc })}
          />

          {/* SEO Metadata */}
          <SeoFields
            title={form.seoTitle}
            description={form.seoDescription}
            onChange={(seo) =>
              setForm({
                ...form,
                seoTitle: seo.title,
                seoDescription: seo.description,
              })
            }
          />
        </div>

        {/* Right Column: Taxonomies, Author, Cover */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-6 space-y-4 shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Publishing & Metadata
            </span>

            <div>
              <label
                htmlFor="post-category"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Topic Taxonomy
              </label>
              <select
                id="post-category"
                value={form.categoryId || ""}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value || null })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-author"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Contributing Author
              </label>
              <select
                id="post-author"
                value={form.authorId || ""}
                onChange={(e) =>
                  setForm({ ...form, authorId: e.target.value || null })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
              >
                <option value="">Finergetics Editorial Team</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-status"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Publication Status
              </label>
              <select
                id="post-status"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as
                      | "draft"
                      | "published"
                      | "archived",
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
              >
                <option value="draft">Draft (Work in Progress)</option>
                <option value="published">Published (Live to World)</option>
                <option value="archived">Archived (Unlisted)</option>
              </select>
            </div>
          </div>

          <ImagePicker
            label="Featured Cover Image"
            helperText="16:9 widescreen editorial hero image"
            value={form.cover}
            onChange={(cover) => setForm({ ...form, cover: cover ?? null })}
          />
        </div>
      </div>
    </form>
  );
}
