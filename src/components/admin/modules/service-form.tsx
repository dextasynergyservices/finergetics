"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoFields } from "@/components/admin/seo-fields";
import type { ServiceCardTone, ServiceInput } from "@/lib/schemas/service";
import {
  createServiceAction,
  updateServiceAction,
} from "@/server/actions/services";

interface ServiceFormProps {
  initialData?: ServiceInput & { id?: string };
  isEdit?: boolean;
}

export function ServiceForm({ initialData, isEdit = false }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ServiceInput>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    tagline: initialData?.tagline || "",
    summary: initialData?.summary || "",
    body: initialData?.body,
    icon: initialData?.icon || "ShieldCheck",
    cardTone: (initialData?.cardTone as ServiceCardTone) || "royal",
    image: initialData?.image || null,
    sortOrder: initialData?.sortOrder ?? 0,
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
          ? await updateServiceAction(initialData.id, form)
          : await createServiceAction(form);

      if (res.success) {
        toast.success(isEdit ? "Service updated!" : "Service created!");
        router.push("/admin/services");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save service");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 hover:bg-sky-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink-900 tracking-tight">
              {isEdit
                ? `Edit: ${form.title || "Service"}`
                : "Create Service Offering"}
            </h1>
            <p className="text-xs text-slate-500">
              Manage core consulting service, narrative body, tone, and SEO
              parameters.
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
          <span>{isEdit ? "Update Service" : "Publish Service"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Service Fundamentals
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="service-title"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Service Title *
                </label>
                <input
                  id="service-title"
                  type="text"
                  required
                  placeholder="e.g. Financial Control & Advisory"
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

              <div>
                <label
                  htmlFor="service-slug"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  URL Slug *
                </label>
                <input
                  id="service-slug"
                  type="text"
                  required
                  placeholder="financial-control"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs font-mono text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="service-tagline"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Subheading / Tagline
              </label>
              <input
                id="service-tagline"
                type="text"
                placeholder="e.g. Independent Reviews & Recommendations"
                value={form.tagline || ""}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="service-summary"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Card Summary Excerpt * (10 – 500 chars)
              </label>
              <textarea
                id="service-summary"
                rows={3}
                required
                placeholder="Succinct explanation shown on home and services grid cards..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 leading-relaxed"
              />
            </div>
          </div>

          {/* Deep Content Body (RichTextEditor) */}
          <RichTextEditor
            label="Service Detail Narrative & Methodology"
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

        {/* Right Column: Settings, Tone, Media */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-6 space-y-4 shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Display & Tone Attributes
            </span>

            <div>
              <label
                htmlFor="service-card-tone"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Card Tone Color
              </label>
              <select
                id="service-card-tone"
                value={form.cardTone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cardTone: e.target.value as ServiceCardTone,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
              >
                <option value="royal">Royal Blue</option>
                <option value="charcoal">Charcoal Slate</option>
                <option value="navy">Deep Navy</option>
                <option value="slate">Light Slate</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="service-status"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Publication Status
              </label>
              <select
                id="service-status"
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
                <option value="draft">Draft (Unpublished)</option>
                <option value="published">Published (Live)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="service-order"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Sort Priority Order
              </label>
              <input
                id="service-order"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>

          <ImagePicker
            label="Service Feature Visual"
            helperText="High-res visual shown on detail header"
            value={form.image}
            onChange={(image) => setForm({ ...form, image: image ?? null })}
          />
        </div>
      </div>
    </form>
  );
}
