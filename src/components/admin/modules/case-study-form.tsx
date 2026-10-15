"use client";

import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoFields } from "@/components/admin/seo-fields";
import type { CaseStudyInput, MetricItem } from "@/lib/schemas/case-study";
import {
  createCaseStudyAction,
  updateCaseStudyAction,
} from "@/server/actions/case-studies";

interface AvailableService {
  id: string;
  title: string;
}

interface CaseStudyFormProps {
  initialData?: CaseStudyInput & { id?: string };
  availableServices?: AvailableService[];
  isEdit?: boolean;
}

export function CaseStudyForm({
  initialData,
  availableServices = [],
  isEdit = false,
}: CaseStudyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [narrativeTab, setNarrativeTab] = useState<
    "challenge" | "approach" | "outcome"
  >("challenge");

  const [form, setForm] = useState<CaseStudyInput>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    clientName: initialData?.clientName || "",
    industry: initialData?.industry || "",
    serviceId: initialData?.serviceId || null,
    summary: initialData?.summary || "",
    challenge: initialData?.challenge,
    approach: initialData?.approach,
    outcome: initialData?.outcome,
    metrics: initialData?.metrics || [
      { label: "Value Protected", value: "₦1.8B" },
    ],
    cover: initialData?.cover || null,
    featured: initialData?.featured || false,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    status: initialData?.status || "draft",
  });

  const [metricsList, setMetricsList] = useState<
    { id: string; label: string; value: string }[]
  >(() =>
    (initialData?.metrics && initialData.metrics.length > 0
      ? initialData.metrics
      : [{ label: "Value Protected", value: "₦1.8B" }]
    ).map((m, i) => ({
      id: `m-${i}-${Math.random().toString(36).slice(2, 7)}`,
      ...m,
    })),
  );

  const handleMetricChange = (
    id: string,
    field: keyof MetricItem,
    val: string,
  ) => {
    setMetricsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );
  };

  const addMetric = () => {
    setMetricsList((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label: "",
        value: "",
      },
    ]);
  };

  const removeMetric = (id: string) => {
    setMetricsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CaseStudyInput = {
      ...form,
      metrics: metricsList
        .filter((m) => m.label.trim() && m.value.trim())
        .map(({ label, value }) => ({ label, value })),
    };

    try {
      const res =
        isEdit && initialData?.id
          ? await updateCaseStudyAction(initialData.id, payload)
          : await createCaseStudyAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Case study updated!" : "Case study created!");
        router.push("/admin/case-studies");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save case study");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error saving case study",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/case-studies"
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 hover:bg-sky-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink-900 tracking-tight">
              {isEdit
                ? `Edit: ${form.title || "Case Study"}`
                : "Create Client Engagement"}
            </h1>
            <p className="text-xs text-slate-500">
              Document problem context, methodology, quantifiable impact
              metrics, and client background.
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
          <span>{isEdit ? "Update Case Study" : "Publish Case Study"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Core Info */}
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Engagement Fundamentals
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cs-title"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Engagement Title *
                </label>
                <input
                  id="cs-title"
                  type="text"
                  required
                  placeholder="e.g. Major Upstream Operator Financial Restructuring"
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
                  htmlFor="cs-slug"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  URL Slug *
                </label>
                <input
                  id="cs-slug"
                  type="text"
                  required
                  placeholder="upstream-restructuring"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs font-mono text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="cs-client"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Client Identifier / Name
                </label>
                <input
                  id="cs-client"
                  type="text"
                  placeholder="Confidential Energy Producer"
                  value={form.clientName || ""}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="cs-industry"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Industry / Sector
                </label>
                <input
                  id="cs-industry"
                  type="text"
                  placeholder="Oil & Gas, Power, Financial Services"
                  value={form.industry || ""}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cs-service"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Linked Advisory Practice
              </label>
              <select
                id="cs-service"
                value={form.serviceId || ""}
                onChange={(e) =>
                  setForm({ ...form, serviceId: e.target.value || null })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
              >
                <option value="">None (Independent Engagement)</option>
                {availableServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cs-summary"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Executive Overview Excerpt *
              </label>
              <textarea
                id="cs-summary"
                rows={3}
                required
                placeholder="High-level description of client challenge and overall value delivered..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 leading-relaxed"
              />
            </div>
          </div>

          {/* Quantitative Impact Metrics */}
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quantitative Impact Metrics
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Numerical KPI proof points featured in prominent stat blocks.
                </p>
              </div>
              <button
                type="button"
                onClick={addMetric}
                className="inline-flex items-center gap-1 text-xs font-bold text-royal-600 hover:text-royal-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="space-y-2">
              {metricsList.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Metric Label (e.g. Value Protected)"
                    value={m.label}
                    onChange={(e) =>
                      handleMetricChange(m.id, "label", e.target.value)
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                  />
                  <input
                    type="text"
                    placeholder="KPI Value (e.g. $42M / 35%)"
                    value={m.value}
                    onChange={(e) =>
                      handleMetricChange(m.id, "value", e.target.value)
                    }
                    className="w-36 px-3.5 py-2 rounded-xl border border-silver-400/30 text-xs font-bold text-royal-700 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                  />
                  {metricsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMetric(m.id)}
                      className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Tabs (Challenge, Approach, Outcome) */}
          <div className="bg-white rounded-3xl border border-silver-400/25 overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-silver-400/15 bg-sky-50/50 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNarrativeTab("challenge")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  narrativeTab === "challenge"
                    ? "bg-royal-600 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                1. The Challenge
              </button>
              <button
                type="button"
                onClick={() => setNarrativeTab("approach")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  narrativeTab === "approach"
                    ? "bg-royal-600 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                2. Our Advisory Approach
              </button>
              <button
                type="button"
                onClick={() => setNarrativeTab("outcome")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  narrativeTab === "outcome"
                    ? "bg-royal-600 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                3. Outcome & Impact
              </button>
            </div>

            <div className="p-2">
              {narrativeTab === "challenge" && (
                <RichTextEditor
                  label="Client Problem & Operational Challenge"
                  value={form.challenge}
                  onChange={(doc) => setForm({ ...form, challenge: doc })}
                />
              )}
              {narrativeTab === "approach" && (
                <RichTextEditor
                  label="Diagnostic, Field Review & Advisory Approach"
                  value={form.approach}
                  onChange={(doc) => setForm({ ...form, approach: doc })}
                />
              )}
              {narrativeTab === "outcome" && (
                <RichTextEditor
                  label="Tangible Results, Cost Recovery & Governance Outcomes"
                  value={form.outcome}
                  onChange={(doc) => setForm({ ...form, outcome: doc })}
                />
              )}
            </div>
          </div>

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

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-6 space-y-4 shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Publication Settings
            </span>

            <div>
              <label
                htmlFor="cs-status"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Publication Status
              </label>
              <select
                id="cs-status"
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
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-silver-400/20">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="rounded border-silver-400/40 text-royal-600 focus:ring-royal-600/30"
                />
                <span className="text-xs font-bold text-ink-900">
                  Feature prominently on Home page
                </span>
              </label>
            </div>
          </div>

          <ImagePicker
            label="Engagement Cover Visual"
            helperText="16:9 widescreen case study cover image"
            value={form.cover}
            onChange={(cover) => setForm({ ...form, cover: cover ?? null })}
          />
        </div>
      </div>
    </form>
  );
}
