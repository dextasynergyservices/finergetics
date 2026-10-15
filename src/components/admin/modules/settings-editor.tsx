"use client";

import { Globe, Loader2, Mail, Menu, Save, Share2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SiteSettingsData } from "@/lib/schemas/settings";
import { updateSiteSettingsAction } from "@/server/actions/settings";

interface SettingsEditorProps {
  initialSettings: SiteSettingsData;
}

export function SettingsEditor({ initialSettings }: SettingsEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "social" | "navigation" | "security"
  >("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<SiteSettingsData>(initialSettings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateSiteSettingsAction(form);
      if (res.success) {
        toast.success("Site settings updated successfully!");
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "general", label: "General & Branding", icon: Globe },
    { id: "contact", label: "Contact & Hours", icon: Mail },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "navigation", label: "Navigation Items", icon: Menu },
    { id: "security", label: "Security & Anti-Bot", icon: Shield },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Site Configuration & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global business info, branding text, navigation structure, and
            default SEO values.
          </p>
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
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-silver-400/20 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-royal-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-sky-50 border border-silver-400/25"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* General & Branding Tab */}
      {activeTab === "general" && (
        <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            Brand Identity & Global Text
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-site-name"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Company / Site Name
              </label>
              <input
                id="settings-site-name"
                type="text"
                value={form.general.siteName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    general: { ...form.general, siteName: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="settings-tagline"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Tagline Badge
              </label>
              <input
                id="settings-tagline"
                type="text"
                value={form.general.tagline}
                onChange={(e) =>
                  setForm({
                    ...form,
                    general: { ...form.general, tagline: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-brand-line"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Primary Brand Value Line
            </label>
            <input
              id="settings-brand-line"
              type="text"
              value={form.general.brandLine}
              onChange={(e) =>
                setForm({
                  ...form,
                  general: { ...form.general, brandLine: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
            />
          </div>

          <div>
            <label
              htmlFor="settings-mission"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Mission Statement
            </label>
            <textarea
              id="settings-mission"
              rows={3}
              value={form.general.missionStatement}
              onChange={(e) =>
                setForm({
                  ...form,
                  general: {
                    ...form.general,
                    missionStatement: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-silver-400/20">
            <div>
              <label
                htmlFor="settings-seo-title"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Default Meta SEO Title
              </label>
              <input
                id="settings-seo-title"
                type="text"
                value={form.general.defaultSeoTitle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    general: {
                      ...form.general,
                      defaultSeoTitle: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="settings-seo-desc"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Default Meta SEO Description
              </label>
              <textarea
                id="settings-seo-desc"
                rows={2}
                value={form.general.defaultSeoDescription}
                onChange={(e) =>
                  setForm({
                    ...form,
                    general: {
                      ...form.general,
                      defaultSeoDescription: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact & Hours Tab */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            Contact Information & Physical Presence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-email"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Primary Inquiry Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={form.contact.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, email: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="settings-hours"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Operating Business Hours
              </label>
              <input
                id="settings-hours"
                type="text"
                value={form.contact.businessHours}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, businessHours: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="settings-phone1"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Telephone Line 1
              </label>
              <input
                id="settings-phone1"
                type="text"
                value={form.contact.phone1}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, phone1: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="settings-phone2"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Telephone Line 2
              </label>
              <input
                id="settings-phone2"
                type="text"
                value={form.contact.phone2}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, phone2: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-address"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Office Address
            </label>
            <input
              id="settings-address"
              type="text"
              value={form.contact.address || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact: { ...form.contact, address: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
            />
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === "social" && (
        <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            Social & Professional Channels
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="settings-linkedin"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                LinkedIn Profile / Company Page URL
              </label>
              <input
                id="settings-linkedin"
                type="url"
                placeholder="https://linkedin.com/company/finergetics"
                value={form.social.linkedin || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social: { ...form.social, linkedin: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="settings-twitter"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                X / Twitter URL
              </label>
              <input
                id="settings-twitter"
                type="url"
                placeholder="https://x.com/finergetics"
                value={form.social.twitter || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social: { ...form.social, twitter: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tab */}
      {activeTab === "navigation" && (
        <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            Navigation Link Structure
          </h2>
          <p className="text-xs text-slate-500">
            Header navigation items configured with brochure route mappings:
          </p>
          <div className="space-y-3">
            {form.navigation.header.map((item, idx) => (
              <div
                key={`${item.label}-${item.href}`}
                className="p-3.5 rounded-2xl bg-sky-50/50 border border-silver-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-royal-100 text-royal-700 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-ink-900">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-1 rounded-lg border border-silver-400/20">
                  {item.href}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
            Bot Mitigation & reCAPTCHA Threshold
          </h2>
          <div>
            <label
              htmlFor="settings-recaptcha"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Minimum reCAPTCHA v3 Score (0 – 100)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Current setting:{" "}
              <strong>{form.security.recaptchaThreshold / 100}</strong>.
              Submissions with scores lower than this will trigger silent bot
              honeypot quarantine.
            </p>
            <input
              id="settings-recaptcha"
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.security.recaptchaThreshold}
              onChange={(e) =>
                setForm({
                  ...form,
                  security: { recaptchaThreshold: Number(e.target.value) },
                })
              }
              className="w-full accent-royal-600"
            />
          </div>
        </div>
      )}
    </form>
  );
}
