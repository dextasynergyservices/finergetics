"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/admin/image-picker";
import { SeoFields } from "@/components/admin/seo-fields";
import type { ImageRef } from "@/lib/schemas/common";
import type { PageInput, PageKey } from "@/lib/schemas/page";
import type { PageSection } from "@/lib/schemas/sections";
import { updatePageAction } from "@/server/actions/pages";

interface PageEditorProps {
  pageKey: PageKey;
  initialData: PageInput;
}

const SECTION_INFO: Record<
  string,
  { label: string; badge: string; description: string }
> = {
  hero: {
    label: "Hero Header",
    badge: "Main Banner",
    description:
      "The primary headline, introduction narrative, and main action buttons.",
  },
  intro: {
    label: "Company Overview",
    badge: "Firm Overview",
    description:
      "Firm introduction, institutional thesis, and core mission statement.",
  },
  services: {
    label: "Core Advisory Disciplines",
    badge: "Services Intro",
    description:
      "Header text and summary introducing the 4 core advisory areas.",
  },
  process: {
    label: "How We Work (4-Step Engagement Process)",
    badge: "Methodology",
    description:
      "The structured 4-step diagnostic and governance engagement roadmap.",
  },
  why_us: {
    label: "Why Choose Finergetics",
    badge: "Value Pillars",
    description:
      "The three core institutional pillars explaining our track record and rigor.",
  },
  team: {
    label: "Principal Consultants & Leadership",
    badge: "Team Intro",
    description:
      "Header text introducing the principal consultants and advisors.",
  },
  faq: {
    label: "Frequently Asked Questions",
    badge: "FAQ Accordion",
    description:
      "Direct answers to common questions asked by prospective clients.",
  },
  cta: {
    label: "Closing Consultation Banner",
    badge: "Call to Action",
    description:
      "Bottom banner inviting prospective clients to book an advisory discussion.",
  },
  marquee: {
    label: "Who We Serve (Client Sectors Ticker)",
    badge: "Client Sectors",
    description:
      "Horizontal animated ticker banner displaying the key sectors and organizations you serve.",
  },
};

export function PageEditor({ pageKey, initialData }: PageEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<PageInput>(initialData);

  const moveSection = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= form.sections.length) return;

    const updated = [...form.sections];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setForm({ ...form, sections: updated });
  };

  const toggleSectionEnabled = (index: number) => {
    const updated = [...form.sections];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setForm({ ...form, sections: updated });
  };

  const updateSectionData = (index: number, field: string, val: unknown) => {
    const updated = [...form.sections];
    const curr = updated[index];
    if (!curr) return;
    updated[index] = {
      ...curr,
      data: {
        ...(curr.data as Record<string, unknown>),
        [field]: val,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const updateNestedArrayItem = (
    sectionIdx: number,
    arrayKey: string,
    itemIdx: number,
    field: string,
    val: unknown,
  ) => {
    const updated = [...form.sections];
    const curr = updated[sectionIdx];
    if (!curr) return;
    const currentData = (curr.data as Record<string, unknown>) || {};
    const list = Array.isArray(currentData[arrayKey])
      ? [...(currentData[arrayKey] as Record<string, unknown>[])]
      : [];
    if (!list[itemIdx]) return;
    list[itemIdx] = {
      ...list[itemIdx],
      [field]: val,
    };
    updated[sectionIdx] = {
      ...curr,
      data: {
        ...currentData,
        [arrayKey]: list,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const addFaqItem = (sectionIdx: number) => {
    const updated = [...form.sections];
    const curr = updated[sectionIdx];
    if (!curr) return;
    const currentData = (curr.data as Record<string, unknown>) || {};
    const items = Array.isArray(currentData.items)
      ? [...(currentData.items as Record<string, unknown>[])]
      : [];
    items.push({
      question: "New Frequently Asked Question",
      answer: "Provide the detailed answer here.",
    });
    updated[sectionIdx] = {
      ...curr,
      data: {
        ...currentData,
        items,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const removeFaqItem = (sectionIdx: number, itemIdx: number) => {
    const updated = [...form.sections];
    const curr = updated[sectionIdx];
    if (!curr) return;
    const currentData = (curr.data as Record<string, unknown>) || {};
    const items = Array.isArray(currentData.items)
      ? (currentData.items as Record<string, unknown>[]).filter(
          (_, i) => i !== itemIdx,
        )
      : [];
    updated[sectionIdx] = {
      ...curr,
      data: {
        ...currentData,
        items,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const updateMarqueeItem = (
    sectionIdx: number,
    itemIdx: number,
    val: string,
  ) => {
    const updated = [...form.sections];
    const curr = updated[sectionIdx];
    if (!curr) return;
    const currentData = (curr.data as Record<string, unknown>) || {};
    const items = Array.isArray(currentData.items)
      ? [...(currentData.items as string[])]
      : [];
    items[itemIdx] = val;
    updated[sectionIdx] = {
      ...curr,
      data: {
        ...currentData,
        items,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const addMarqueeItem = (sectionIdx: number) => {
    const updated = [...form.sections];
    const curr = updated[sectionIdx];
    if (!curr) return;
    const currentData = (curr.data as Record<string, unknown>) || {};
    const items = Array.isArray(currentData.items)
      ? [...(currentData.items as string[])]
      : [];
    items.push("New Client Sector / Group");
    updated[sectionIdx] = {
      ...curr,
      data: {
        ...currentData,
        items,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const removeMarqueeItem = (sectionIdx: number, itemIdx: number) => {
    const updated = [...form.sections];
    const curr = updated[sectionIdx];
    if (!curr) return;
    const currentData = (curr.data as Record<string, unknown>) || {};
    const items = Array.isArray(currentData.items)
      ? (currentData.items as string[]).filter((_, i) => i !== itemIdx)
      : [];
    updated[sectionIdx] = {
      ...curr,
      data: {
        ...currentData,
        items,
      },
    } as PageSection;
    setForm({ ...form, sections: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await updatePageAction(pageKey, form);
      if (res.success) {
        toast.success(`Page "${form.title}" saved successfully!`);
      } else {
        toast.error(res.error || "Failed to save page");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving page");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 hover:bg-sky-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink-900 tracking-tight">
              Edit Page: {form.title}
            </h1>
            <p className="text-xs text-slate-500">
              Customize text content, reorder sections, and control what is
              visible on the public website.
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
          <span>Save</span>
        </button>
      </div>

      {/* Page Title & Publication Status */}
      <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Page Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="page-title"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Page Name
            </label>
            <input
              id="page-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
            />
          </div>

          <div>
            <label
              htmlFor="page-status"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Visibility Status
            </label>
            <select
              id="page-status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "draft" | "published" | "archived",
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
            >
              <option value="published">Published (Visible to Visitors)</option>
              <option value="draft">Draft (Hidden from Visitors)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sections Architecture & Reorder List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Page Sections &amp; Content
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Use the up and down arrows to change the order. Click any section
              to edit its copy and headlines.
            </p>
          </div>
          <span className="text-xs font-bold text-royal-600">
            {form.sections.length} Sections
          </span>
        </div>

        {form.sections.map((section, idx) => {
          const isExpanded = expandedSectionId === section.id;
          const secData = (section.data as Record<string, unknown>) || {};
          const meta = SECTION_INFO[section.type] || {
            label: `Section: ${section.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
            badge: "Content Block",
            description: "Custom content section for this page layout.",
          };

          return (
            <div
              key={section.id}
              className={`rounded-2xl border transition-all ${
                section.enabled
                  ? "bg-white border-silver-400/25 shadow-xs"
                  : "bg-slate-50/70 border-silver-400/20 opacity-70"
              }`}
            >
              {/* Section Summary Header */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, "up")}
                      className="p-1 rounded hover:bg-sky-50 text-slate-400 hover:text-ink-900 disabled:opacity-20 cursor-pointer"
                      title="Move Up on Page"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.sections.length - 1}
                      onClick={() => moveSection(idx, "down")}
                      className="p-1 rounded hover:bg-sky-50 text-slate-400 hover:text-ink-900 disabled:opacity-20 cursor-pointer"
                      title="Move Down on Page"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-royal-700 font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink-900">
                        {meta.label}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-royal-700 px-1.5 py-0.2 rounded bg-royal-50 border border-royal-200/50">
                        {meta.badge}
                      </span>
                      {!section.enabled && (
                        <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5 py-0.2 rounded bg-slate-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md mt-0.5">
                      {String(
                        secData.headline ||
                          secData.title ||
                          secData.eyebrow ||
                          meta.description,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSectionEnabled(idx)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      section.enabled
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-slate-400 hover:bg-slate-200"
                    }`}
                    title={
                      section.enabled
                        ? "Hide section from website"
                        : "Show section on website"
                    }
                  >
                    {section.enabled ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSectionId(isExpanded ? null : section.id)
                    }
                    className="p-2 rounded-xl text-slate-600 hover:bg-sky-50 transition-colors cursor-pointer"
                    title="Edit content"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Per-Type Fields */}
              {isExpanded && (
                <div className="p-5 border-t border-silver-400/15 bg-sky-50/20 space-y-5">
                  {/* HERO SECTION */}
                  {section.type === "hero" && (
                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Category Tag / Eyebrow
                        </span>
                        <input
                          type="text"
                          value={String(secData.eyebrow || "")}
                          onChange={(e) =>
                            updateSectionData(idx, "eyebrow", e.target.value)
                          }
                          placeholder="• FINANCIAL & COMMERCIAL ADVISORY"
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Main Banner Headline *
                          </span>
                          <input
                            type="text"
                            required
                            value={String(secData.headline || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "headline", e.target.value)
                            }
                            placeholder="e.g. PROTECT ASSET VALUE,"
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white font-semibold"
                          />
                          <p className="text-[11px] text-slate-500 mt-1">
                            Dark headline text in the hero banner.
                          </p>
                        </div>

                        <div>
                          <span className="block text-xs font-bold text-royal-700 mb-1 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-royal-600 inline-block" />
                            Highlighted Blue Text (Accent Line)
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlightedText || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlightedText",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. AND INCREASE VALUE"
                            className="w-full px-3 py-2 rounded-xl border border-royal-300 text-xs text-royal-700 font-bold focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-royal-50/40"
                          />
                          <p className="text-[11px] text-slate-500 mt-1">
                            Blue highlighted text rendered next to the main
                            headline.
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Introductory Narrative / Subheadline *
                        </span>
                        <textarea
                          rows={3}
                          required
                          value={String(secData.subheadline || "")}
                          onChange={(e) =>
                            updateSectionData(
                              idx,
                              "subheadline",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30 bg-white leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-silver-400/15">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Primary Button Text
                          </span>
                          <input
                            type="text"
                            value={String(secData.ctaPrimaryText || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "ctaPrimaryText",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Primary Button Destination Link
                          </span>
                          <input
                            type="text"
                            value={String(secData.ctaPrimaryLink || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "ctaPrimaryLink",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Secondary Button Text
                          </span>
                          <input
                            type="text"
                            value={String(secData.ctaSecondaryText || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "ctaSecondaryText",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Our Core Services"
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Secondary Button Link
                          </span>
                          <input
                            type="text"
                            value={String(secData.ctaSecondaryLink || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "ctaSecondaryLink",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. /services"
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-silver-400/15">
                        <ImagePicker
                          label="Hero Background Image"
                          helperText="Corporate background photo (PNG, JPG, WebP) displayed across the hero header with subtle corporate contrast overlay"
                          value={
                            secData.backgroundImage as
                              | ImageRef
                              | null
                              | undefined
                          }
                          onChange={(img) =>
                            updateSectionData(
                              idx,
                              "backgroundImage",
                              img ?? null,
                            )
                          }
                          folder="finergetics/heroes"
                        />
                      </div>
                    </div>
                  )}

                  {/* WHO WE SERVE / MARQUEE TICKER SECTION */}
                  {section.type === "marquee" && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-sky-50/70 border border-silver-400/20 flex items-start gap-3">
                        <Info className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-600">
                          <p className="font-semibold text-ink-900">
                            Horizontal Scrolling Ticker
                          </p>
                          <p className="mt-0.5 leading-relaxed">
                            This banner animates horizontally across the
                            homepage (directly beneath the main Hero banner)
                            showcasing the institutions, operators, and industry
                            groups Finergetics serves.
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Ticker Badge / Category Tag
                        </span>
                        <input
                          type="text"
                          value={String(secData.label || "")}
                          onChange={(e) =>
                            updateSectionData(idx, "label", e.target.value)
                          }
                          placeholder="WHO WE SERVE"
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white font-semibold"
                        />
                      </div>

                      <div className="pt-2 border-t border-silver-400/15 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Client Sectors &amp; Audiences
                          </span>
                          <button
                            type="button"
                            onClick={() => addMarqueeItem(idx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal-50 hover:bg-royal-100 text-royal-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Sector</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {Array.isArray(secData.items) &&
                            (secData.items as string[]).map((item, itemIdx) => (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: Marquee sector list items
                                key={`marquee-${itemIdx}`}
                                className="flex items-center gap-2"
                              >
                                <span className="w-6 text-[11px] font-bold text-slate-400 text-right">
                                  {itemIdx + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) =>
                                    updateMarqueeItem(
                                      idx,
                                      itemIdx,
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeMarqueeItem(idx, itemIdx)
                                  }
                                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Sector"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INTRO / FIRM OVERVIEW SECTION */}
                  {section.type === "intro" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Eyebrow Tag
                          </span>
                          <input
                            type="text"
                            value={String(secData.eyebrow || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "eyebrow", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Heading First Line
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Accent Word / Highlight
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlight || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Narrative Copy
                        </span>
                        <textarea
                          rows={3}
                          value={String(secData.narrative || "")}
                          onChange={(e) =>
                            updateSectionData(idx, "narrative", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* SERVICES SECTION */}
                  {section.type === "services" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Eyebrow
                          </span>
                          <input
                            type="text"
                            value={String(secData.eyebrow || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "eyebrow", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Title
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Accent Word / Highlight
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlight || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Section Description
                        </span>
                        <textarea
                          rows={2}
                          value={String(secData.description || "")}
                          onChange={(e) =>
                            updateSectionData(
                              idx,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>

                      <div className="p-3.5 rounded-xl bg-sky-50/70 border border-silver-400/20 flex items-start gap-3">
                        <Info className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-600">
                          <p className="font-semibold text-ink-900">
                            Service Cards are automatically synced
                          </p>
                          <p className="mt-0.5 leading-relaxed">
                            The individual service cards displayed below this
                            header come directly from your active Services
                            collection. You can edit each service's deliverables
                            and methodology in{" "}
                            <Link
                              href="/admin/services"
                              className="text-royal-600 font-bold hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Services & Disciplines</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HOW WE WORK / PROCESS SECTION */}
                  {section.type === "process" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Eyebrow
                          </span>
                          <input
                            type="text"
                            value={String(secData.eyebrow || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "eyebrow", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Heading First Line
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Accent Word / Highlight
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlight || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Section Description
                        </span>
                        <textarea
                          rows={2}
                          value={String(secData.description || "")}
                          onChange={(e) =>
                            updateSectionData(
                              idx,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>

                      {/* Process Steps */}
                      <div className="pt-3 border-t border-silver-400/15 space-y-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Process Steps (How We Work)
                        </span>

                        {Array.isArray(secData.steps) &&
                          (secData.steps as Array<Record<string, unknown>>).map(
                            (step, stepIdx) => (
                              <div
                                key={`step-${step.number || stepIdx}`}
                                className="p-3.5 rounded-xl bg-white border border-silver-400/20 space-y-2.5"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-royal-600 text-white font-bold text-xs flex items-center justify-center">
                                    {String(step.number || stepIdx + 1)}
                                  </span>
                                  <span className="text-xs font-bold text-ink-900">
                                    Step {stepIdx + 1}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <div>
                                    <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                      Step Title
                                    </span>
                                    <input
                                      type="text"
                                      value={String(step.title || "")}
                                      onChange={(e) =>
                                        updateNestedArrayItem(
                                          idx,
                                          "steps",
                                          stepIdx,
                                          "title",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900"
                                    />
                                  </div>
                                  <div>
                                    <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                      Subtitle / Focus
                                    </span>
                                    <input
                                      type="text"
                                      value={String(step.subtitle || "")}
                                      onChange={(e) =>
                                        updateNestedArrayItem(
                                          idx,
                                          "steps",
                                          stepIdx,
                                          "subtitle",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                    Description
                                  </span>
                                  <textarea
                                    rows={2}
                                    value={String(step.description || "")}
                                    onChange={(e) =>
                                      updateNestedArrayItem(
                                        idx,
                                        "steps",
                                        stepIdx,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900"
                                  />
                                </div>

                                <div>
                                  <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                    Key Client Takeaway
                                  </span>
                                  <input
                                    type="text"
                                    value={String(step.takeaway || "")}
                                    onChange={(e) =>
                                      updateNestedArrayItem(
                                        idx,
                                        "steps",
                                        stepIdx,
                                        "takeaway",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900"
                                  />
                                </div>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  )}

                  {/* WHY CHOOSE US / 3 PILLARS SECTION */}
                  {section.type === "why_us" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Eyebrow
                          </span>
                          <input
                            type="text"
                            value={String(secData.eyebrow || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "eyebrow", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Heading First Line
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Accent Word / Highlight
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlight || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Section Description
                        </span>
                        <textarea
                          rows={2}
                          value={String(secData.description || "")}
                          onChange={(e) =>
                            updateSectionData(
                              idx,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>

                      {/* 3 Pillars */}
                      <div className="pt-3 border-t border-silver-400/15 space-y-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Three Value Pillars
                        </span>

                        {Array.isArray(secData.pillars) &&
                          (
                            secData.pillars as Array<Record<string, unknown>>
                          ).map((pillar, pIdx) => (
                            <div
                              // biome-ignore lint/suspicious/noArrayIndexKey: Fixed pillar list
                              key={`pillar-${pIdx + 1}`}
                              className="p-3.5 rounded-xl bg-white border border-silver-400/20 space-y-2"
                            >
                              <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                  Pillar {pIdx + 1} Title
                                </span>
                                <input
                                  type="text"
                                  value={String(pillar.title || "")}
                                  onChange={(e) =>
                                    updateNestedArrayItem(
                                      idx,
                                      "pillars",
                                      pIdx,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900 font-semibold"
                                />
                              </div>

                              <div>
                                <span className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                                  Pillar Description
                                </span>
                                <textarea
                                  rows={2}
                                  value={String(pillar.description || "")}
                                  onChange={(e) =>
                                    updateNestedArrayItem(
                                      idx,
                                      "pillars",
                                      pIdx,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* PRINCIPAL CONSULTANTS & TEAM SECTION */}
                  {section.type === "team" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Eyebrow
                          </span>
                          <input
                            type="text"
                            value={String(secData.eyebrow || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "eyebrow", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Heading First Line
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Accent Word / Highlight
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlight || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Section Description
                        </span>
                        <textarea
                          rows={2}
                          value={String(secData.description || "")}
                          onChange={(e) =>
                            updateSectionData(
                              idx,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>

                      <div className="p-3.5 rounded-xl bg-sky-50/70 border border-silver-400/20 flex items-start gap-3">
                        <Info className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-600">
                          <p className="font-semibold text-ink-900">
                            Consultant Profiles are automatically synced
                          </p>
                          <p className="mt-0.5 leading-relaxed">
                            The consultant headshots, credentials, and bios
                            displayed on the live site are managed in{" "}
                            <Link
                              href="/admin/team"
                              className="text-royal-600 font-bold hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Principal Consultants & Team</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FREQUENTLY ASKED QUESTIONS SECTION */}
                  {section.type === "faq" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Eyebrow
                          </span>
                          <input
                            type="text"
                            value={String(secData.eyebrow || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "eyebrow", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Heading First Line
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Accent Word / Highlight
                          </span>
                          <input
                            type="text"
                            value={String(secData.highlight || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Section Description
                        </span>
                        <textarea
                          rows={2}
                          value={String(secData.description || "")}
                          onChange={(e) =>
                            updateSectionData(
                              idx,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>

                      {/* FAQ Items */}
                      <div className="pt-3 border-t border-silver-400/15 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Questions &amp; Answers
                          </span>
                          <button
                            type="button"
                            onClick={() => addFaqItem(idx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal-50 hover:bg-royal-100 text-royal-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Question</span>
                          </button>
                        </div>

                        {Array.isArray(secData.items) &&
                          (secData.items as Array<Record<string, unknown>>).map(
                            (item, itemIdx) => (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: Dynamic FAQ item list
                                key={`faq-${itemIdx + 1}`}
                                className="p-3.5 rounded-xl bg-white border border-silver-400/20 space-y-2 relative group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-royal-700">
                                    Question {itemIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeFaqItem(idx, itemIdx)}
                                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete Question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div>
                                  <input
                                    type="text"
                                    value={String(item.question || "")}
                                    placeholder="What is your question?"
                                    onChange={(e) =>
                                      updateNestedArrayItem(
                                        idx,
                                        "items",
                                        itemIdx,
                                        "question",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900 font-semibold"
                                  />
                                </div>

                                <div>
                                  <textarea
                                    rows={2}
                                    value={String(item.answer || "")}
                                    placeholder="Provide the clear, direct answer..."
                                    onChange={(e) =>
                                      updateNestedArrayItem(
                                        idx,
                                        "items",
                                        itemIdx,
                                        "answer",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-silver-400/30 text-xs text-ink-900 leading-relaxed"
                                  />
                                </div>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  )}

                  {/* CALL TO ACTION (CTA) SECTION */}
                  {section.type === "cta" && (
                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Eyebrow Tag
                        </span>
                        <input
                          type="text"
                          value={String(secData.eyebrow || "")}
                          onChange={(e) =>
                            updateSectionData(idx, "eyebrow", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                        />
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Headline Title *
                        </span>
                        <input
                          type="text"
                          required
                          value={String(
                            secData.headline || secData.title || "",
                          )}
                          onChange={(e) => {
                            updateSectionData(idx, "headline", e.target.value);
                            updateSectionData(idx, "title", e.target.value);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Supporting Narrative / Lead Text
                        </span>
                        <textarea
                          rows={2}
                          value={String(
                            secData.lead || secData.subheadline || "",
                          )}
                          onChange={(e) => {
                            updateSectionData(idx, "lead", e.target.value);
                            updateSectionData(
                              idx,
                              "subheadline",
                              e.target.value,
                            );
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-silver-400/15">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Primary Button Text
                          </span>
                          <input
                            type="text"
                            value={String(secData.buttonText || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "buttonText",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Primary Button Destination Link
                          </span>
                          <input
                            type="text"
                            value={String(secData.buttonLink || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "buttonLink",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Secondary Button Text (Optional)
                          </span>
                          <input
                            type="text"
                            value={String(
                              secData.secondaryText ||
                                secData.ctaSecondaryText ||
                                "",
                            )}
                            onChange={(e) => {
                              updateSectionData(
                                idx,
                                "secondaryText",
                                e.target.value,
                              );
                              updateSectionData(
                                idx,
                                "ctaSecondaryText",
                                e.target.value,
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Secondary Button Link (Optional)
                          </span>
                          <input
                            type="text"
                            value={String(
                              secData.secondaryLink ||
                                secData.ctaSecondaryLink ||
                                "",
                            )}
                            onChange={(e) => {
                              updateSectionData(
                                idx,
                                "secondaryLink",
                                e.target.value,
                              );
                              updateSectionData(
                                idx,
                                "ctaSecondaryLink",
                                e.target.value,
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FALLBACK FOR ANY OTHER CUSTOM SECTION TYPE */}
                  {![
                    "hero",
                    "marquee",
                    "intro",
                    "services",
                    "process",
                    "why_us",
                    "team",
                    "faq",
                    "cta",
                  ].includes(section.type) && (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-sky-50/70 rounded-xl border border-silver-400/20 text-xs text-slate-600 flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-ink-900">
                            Content block connected to your live site
                          </p>
                          <p className="mt-0.5 leading-relaxed">
                            You can reorder this section on the page using the
                            up and down arrows on the left, or temporarily hide
                            it from visitors using the eye icon on the right.
                          </p>
                        </div>
                      </div>

                      {/* Generic field inputs if data contains title/description */}
                      {typeof secData.title === "string" && (
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Title
                          </span>
                          <input
                            type="text"
                            value={String(secData.title || "")}
                            onChange={(e) =>
                              updateSectionData(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      )}

                      {typeof secData.description === "string" && (
                        <div>
                          <span className="block text-xs font-bold text-slate-700 mb-1">
                            Section Description
                          </span>
                          <textarea
                            rows={2}
                            value={String(secData.description || "")}
                            onChange={(e) =>
                              updateSectionData(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEO Metadata Fields */}
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
    </form>
  );
}
