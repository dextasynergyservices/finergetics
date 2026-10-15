"use client";

import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { TeamMemberInput } from "@/lib/schemas/team";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
} from "@/server/actions/team";

interface TeamFormProps {
  initialData?: TeamMemberInput & { id?: string };
  isEdit?: boolean;
}

export function TeamForm({ initialData, isEdit = false }: TeamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<TeamMemberInput>({
    slug: initialData?.slug || "",
    name: initialData?.name || "",
    role: initialData?.role || "",
    credentials: initialData?.credentials || "",
    highlights: initialData?.highlights || [""],
    bio: initialData?.bio,
    photo: initialData?.photo || null,
    linkedinUrl: initialData?.linkedinUrl || "",
    sortOrder: initialData?.sortOrder ?? 0,
    status: initialData?.status || "draft",
  });

  const [highlightsList, setHighlightsList] = useState<
    { id: string; text: string }[]
  >(() =>
    (initialData?.highlights && initialData.highlights.length > 0
      ? initialData.highlights
      : [""]
    ).map((text, i) => ({
      id: `hl-${i}-${Math.random().toString(36).slice(2, 7)}`,
      text,
    })),
  );

  const handleHighlightChange = (id: string, val: string) => {
    setHighlightsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: val } : item)),
    );
  };

  const addHighlight = () => {
    setHighlightsList((prev) => [
      ...prev,
      {
        id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text: "",
      },
    ]);
  };

  const removeHighlight = (id: string) => {
    setHighlightsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: TeamMemberInput = {
      ...form,
      highlights: highlightsList
        .map((h) => h.text)
        .filter((h) => h.trim().length > 0),
    };

    try {
      const res =
        isEdit && initialData?.id
          ? await updateTeamMemberAction(initialData.id, payload)
          : await createTeamMemberAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Team member updated!" : "Team member created!");
        router.push("/admin/team");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save team member");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving profile");
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
            href="/admin/team"
            className="p-2 rounded-xl text-slate-500 hover:text-ink-900 hover:bg-sky-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink-900 tracking-tight">
              {isEdit
                ? `Edit: ${form.name || "Consultant"}`
                : "Add Consultant Profile"}
            </h1>
            <p className="text-xs text-slate-500">
              Configure credentials, bio narrative, photo, and publication
              status.
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
          <span>{isEdit ? "Update Profile" : "Save Consultant"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Personal Information & Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="team-name"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="team-name"
                  type="text"
                  required
                  placeholder="e.g. Rotimi Lawuyi"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = !isEdit
                      ? name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                      : form.slug;
                    setForm({ ...form, name, slug: autoSlug });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="team-slug"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  URL Slug *
                </label>
                <input
                  id="team-slug"
                  type="text"
                  required
                  placeholder="rotimi-lawuyi"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs font-mono text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="team-role"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Practice Role / Title *
                </label>
                <input
                  id="team-role"
                  type="text"
                  required
                  placeholder="Lead Consultant"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>

              <div>
                <label
                  htmlFor="team-credentials"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Accreditation / Degrees
                </label>
                <input
                  id="team-credentials"
                  type="text"
                  placeholder="FCA, FCIB"
                  value={form.credentials || ""}
                  onChange={(e) =>
                    setForm({ ...form, credentials: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="team-linkedin"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                LinkedIn Profile URL
              </label>
              <input
                id="team-linkedin"
                type="url"
                placeholder="https://linkedin.com/in/rotimi-lawuyi"
                value={form.linkedinUrl || ""}
                onChange={(e) =>
                  setForm({ ...form, linkedinUrl: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Career Highlights & Key Accreditations
              </span>
              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-1 text-xs font-bold text-royal-600 hover:text-royal-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2">
              {highlightsList.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="30+ years in banking & Oil & Gas Finance"
                    value={item.text}
                    onChange={(e) =>
                      handleHighlightChange(item.id, e.target.value)
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
                  />
                  {highlightsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bio Narrative (RichTextEditor) */}
          <RichTextEditor
            label="Consultant Biography"
            value={form.bio}
            onChange={(doc) => setForm({ ...form, bio: doc })}
          />
        </div>

        {/* Right Column: Status & Media */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-6 space-y-4 shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Publishing Status
            </span>

            <div>
              <label
                htmlFor="team-status"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Publication State
              </label>
              <select
                id="team-status"
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
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Live)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="team-order"
                className="block text-[11px] font-bold text-slate-600 mb-1"
              >
                Sort Priority Number
              </label>
              <input
                id="team-order"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>

          <ImagePicker
            label="Consultant Portrait"
            helperText="Square or 3:4 portrait photo"
            value={form.photo}
            onChange={(photo) => setForm({ ...form, photo: photo ?? null })}
          />
        </div>
      </div>
    </form>
  );
}
